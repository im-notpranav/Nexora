# 05 — AI orchestration on free keys

All LLM traffic goes through `packages/llm-router`. Its job: finish builds on free tiers by spreading work across the user's providers, never exceeding a known limit, and pausing instead of failing.

## Principles

1. **Expect limits.** A 429 is normal control flow.
2. **Spread across providers, not accounts.** Never encourage users to create multiple accounts on one provider to multiply quota; that breaks provider terms and gets accounts banned. Gemini limits are per Google Cloud project, not per key, so extra keys in one project add nothing.
3. **Learn limits live.** Seed from the snapshot below, then update from response headers, 429 bodies and observed behavior. Never hard-code limits in logic.
4. **Small calls.** Every prompt fits the context budget (default 12k input tokens).
5. **Cheap where possible.** Strongest models only for spec writing and hard fixes; small fast models for classification and short fixes.

## Free-tier snapshot (seed values, October 2026 — verify live)

| Provider | Model class | Free limits (approx.) | Notes |
| --- | --- | --- | --- |
| Google AI Studio (Gemini) | Flash-Lite (3.5 / 3.1) | 15 RPM, 250k TPM, 500 RPD | Bulk code writing |
| Google AI Studio (Gemini) | Flash (3.x) | 5 RPM, 250k TPM, 20 RPD | Scarce: spec and final review |
| Google AI Studio | Gemma 4 31B / 26B | 30 RPM, 16k TPM, 14,400 RPD | Small tasks |
| NVIDIA NIM (build.nvidia.com) | Nemotron Ultra/Super and other open models | ~40 RPM per model | Phone verification; context windows often limited |
| Groq | gpt-oss-120b / Llama 3.3 70B | 1,000 RPD; 8k–12k TPM | Fast small fixes; TPM is the binding limit |
| Cerebras | gpt-oss-120b, GLM 4.7, Gemma 4 31B | 5 RPM, 30k TPM, 1M tokens/day | Larger single-file generation |
| Mistral Codestral | Codestral | 30 RPM, 2,000 RPD | Code edits; phone verification |
| Mistral La Plateforme | Various | Varies per model and account | Free tier requires opting into training |
| OpenRouter | `:free` models (incl. Nemotron 3 Ultra) | 20 RPM, 50 RPD (1,000 RPD after $10 lifetime top-up) | Shared quota across free models |
| Cloudflare Workers AI | Various open models | 10,000 neurons/day | Optional |

Facts to surface to users:
- Gemini daily quotas reset at midnight US Pacific time (13:30 IST in winter, 12:30 IST in summer).
- Google's free tier may use prompts for training outside the EU/UK/Switzerland; Mistral's free tier requires opting in to training. Show this at key connection.
- Pro-class Gemini models are not on the free tier as of April 2026.

Sources: [cheahjs/free-llm-api-resources](https://github.com/cheahjs/free-llm-api-resources), [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits).

## Provider registry

Most providers expose an OpenAI-compatible chat endpoint (Gemini has an OpenAI compatibility layer; NVIDIA NIM, Groq, Cerebras, OpenRouter, Mistral are OpenAI-compatible). Use one adapter interface:

```ts
type ModelClass = "frontier" | "strong" | "coder" | "fast" | "tiny";

interface ModelInfo {
  provider: ProviderId;          // "gemini" | "nvidia" | "groq" | "cerebras" | "openrouter" | "mistral" | ...
  model: string;                 // provider's model id
  class: ModelClass;
  contextWindow: number;         // tokens
  maxOutput: number;
  supportsJson: boolean;         // structured output / JSON mode
  supportsTools: boolean;
  limits: { rpm?: number; tpm?: number; rpd?: number; tpd?: number; resetTz?: string };
  dataTraining: "yes" | "no" | "opt-in" | "unknown";
}

interface ProviderAdapter {
  listModels(key: DecryptedKey): Promise<ModelInfo[]>;
  chat(req: ChatRequest, key: DecryptedKey): Promise<ChatResponse>;   // throws RateLimited{retryAfter, scope}
  parseLimitHeaders(res: Response): Partial<ModelInfo["limits"]>;
}
```

## Routing

Each task declares what it needs; the router picks a model:

```ts
interface LlmTask {
  role: "spec" | "plan-diff" | "codegen" | "fix" | "summarize" | "classify" | "review";
  minClass: ModelClass;
  estimatedInputTokens: number;   // from a tokenizer estimate
  maxOutputTokens: number;
  needsJson: boolean;
  priority: "interactive" | "build";
}
```

| Role | Default class | Typical models | Notes |
| --- | --- | --- | --- |
| spec, plan-diff | frontier/strong | Nemotron Ultra, Gemini Flash | Few calls; reserve scarce daily quota for these |
| codegen | coder/strong | Gemini Flash-Lite, gpt-oss-120b, GLM, Codestral | Bulk of calls |
| fix | fast/coder | Groq, Gemma, Codestral | Small prompt: error + relevant file only |
| summarize, classify | tiny/fast | Gemma, small Llama | Repo index summaries |
| review | strong | Nemotron Ultra, Gemini Flash | Only targeted reviews, never self-grading |

Selection algorithm:
1. Filter models by class ≥ minClass, context window ≥ input + output, JSON support if needed.
2. Drop models whose bucket can't take this request now (RPM, TPM with token estimate, RPD, TPD).
3. Score remaining by: class fit, remaining daily headroom (prefer abundant quota for bulk work, save scarce quota for spec/review), observed latency, observed success rate.
4. Interactive tasks (plan review while the user waits) get priority over background build tasks.

## Rate buckets

- One bucket per (key, model) for each dimension: RPM, TPM, RPD, TPD.
- Reserve tokens before sending (estimated input + max output); reconcile with actual usage after the response.
- Persist usage in `provider_usage` so limits survive worker restarts and are shared across a user's concurrent builds.
- Daily windows reset at the provider's documented time zone (Gemini: midnight America/Los_Angeles).

## Failure handling

| Event | Action |
| --- | --- |
| 429 with retry-after < 20s | Wait if no alternative model; otherwise fail over immediately |
| 429 daily limit | Mark bucket exhausted until reset; fail over |
| 5xx / timeout | Retry once with backoff, then fail over |
| Invalid JSON output | One repair attempt on a fast model with the schema; then retry on another model |
| Context too long | Re-plan the task smaller (split file, trim context); never truncate silently |
| All suitable models exhausted | Throw `AllProvidersExhausted { resumeAt }`; worker checkpoints and pauses the build |
| Key invalid/revoked | Mark key `status=invalid`, notify user, continue with other keys |

## Keeping calls small

- **Repo index.** After each generation step, store per-file summaries and a symbol map (exports, routes, tables). Tasks retrieve only relevant files.
- **Contracts first.** Freeze DB schema and API contracts before parallel codegen, so tasks don't need each other's code.
- **Fix prompts** contain only: the failing check output, the file(s) at fault, the relevant spec excerpt, and the contract types.
- **Cache** responses by hash of (normalized prompt, model class). Regenerating an unchanged file costs nothing.

## Budget estimate shown before a build

```
estimatedTokens = sum over planned LLM tasks (input + output), from spec size
throughputPerHour = sum over user's models of min(RPM*avgTokens, TPM) * 60, capped by remaining daily quota
eta = estimatedTokens / throughputPerHour  (+ pause time if daily quota runs out)
```

Show the ETA and how much an extra free key would save. Recalculate live during the build.

## Safety

- Keys are decrypted only in the worker, only for the call, never logged.
- Prompts never contain user secrets, service-role keys or customer data from the user's database.
- Warn users that free tiers may train on prompts; don't send uploaded private documents to providers marked `dataTraining: "yes"` without explicit consent.
