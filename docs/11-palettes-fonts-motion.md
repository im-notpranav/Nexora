# 11 — Palettes, fonts and motion

Machine-readable versions: [`design/palettes.json`](../design/palettes.json), [`design/fonts.json`](../design/fonts.json).

## Palettes (14 starter palettes)

Every palette passes WCAG AA for ink on surface and for button text on primary. A logo upload creates a 15th, personal palette (doc 09).

| ID | Palette | Primary | Tint | Surface | Ink | Button text | Mood |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `sky` | Sky | #1A68CF | #9DCFEE | #F9F9FB | #0B1220 | White | Calm, modern SaaS |
| `cobalt` | Cobalt | #1F4FE0 | #AFD4F9 | #F3F6FA | #161A2E | White | Confident, corporate |
| `ocean-indigo` | Ocean indigo | #3B4CCA | #6FB4EF | #EEF1FB | #0E1435 | White | Trustworthy, tech |
| `lavender` | Lavender | #5F54B5 | #CDBEE8 | #F6F3FA | #2A2540 | White | Soft, finance and HR |
| `teal-mint` | Teal mint | #0F7F75 | #99E2D3 | #F3FAF8 | #0D2A27 | White | Fresh, health and ops |
| `forest-sage` | Forest sage | #3F7A5C | #B9CDB0 | #F5F3EC | #1E2A22 | White | Natural, wellness |
| `ember` | Ember | #C2551A | #F2B36B | #FAF7F3 | #221A16 | White | Warm, human |
| `desert-clay` | Desert clay | #9E5527 | #E8C9A5 | #F8F1E7 | #2B1F1B | White | Earthy, crafts and food |
| `blush-wine` | Blush wine | #B04A5C | #F3DEE3 | #FFF8F9 | #3A0E17 | White | Premium, beauty |
| `crimson-ink` | Crimson ink | #C8102E | #F2C6CC | #FFFFFF | #141414 | White | Bold, media |
| `graphite` | Graphite | #1A1A1A | #739FCF | #E9EBEE | #111317 | White | Neutral, sleek |
| `sunflower-pop` | Sunflower pop | #FFD43B | #FF6FA8 | #FFF6E9 | #111111 | Black | Playful, loud |
| `lime-night` | Lime night | #C6F432 | #8A93A6 | #0E0F12 | #F2F4F7 | Black | Dark, energetic |
| `plum-dark` | Plum dark | #B28CFF | #5A4A8C | #14121C | #EDE9F6 | Black | Dark, techy |

Notes:
- Sunflower pop's primary is too light to stand alone on its cream surface; use it only as a fill with a black outline (as Neo-brutalist does).
- Lime night and Plum dark are dark palettes; their light variants are derived by the resolver.
- Each palette's dark (or light) counterpart is derived in OKLCH by `packages/design-tokens`, then contrast-checked.

### Fixed status colors

| Status | Light mode | Dark mode |
| --- | --- | --- |
| Success | #15803D | #4ADE80 |
| Warning | #B45309 | #FBBF24 |
| Danger | #B91C1C | #F87171 |
| Info | #1D4ED8 | #60A5FA |

Status colors are adjusted only for contrast, never replaced by brand colors.

## Fonts

**Rule:** only fonts under the SIL Open Font License (OFL), self-hosted via [Fontsource](https://fontsource.org) npm packages, because generated apps ship font files in the user's repo. Users may upload their own brand font if they hold a license for it.

| Font | Role | Look | Fits styles | Why it's current |
| --- | --- | --- | --- | --- |
| Inter / Inter Tight | UI workhorse | Neutral, readable small | 3, 4, 8, 12, 18 | Default of modern product UI |
| Geist | UI workhorse | Sharp, technical | 1, 5, 7 | Popular across SaaS; on Google Fonts since 2024 |
| Google Sans Flex | UI workhorse | Friendly, many widths/weights | 1, 4, 7 | Google's brand sans, newly OFL |
| Mona Sans | UI workhorse | Variable width | 7, 9 | GitHub's brand font, OFL |
| Zalando Sans | UI workhorse | Clean, slightly warm, variable | 5, 9 | Open-sourced 2025, on Google Fonts |
| Hanken Grotesk | UI workhorse | Soft, rounded grotesk | 6, 9 | 2026 soft-grotesk trend |
| Onest | UI workhorse | Plain, even | 8, 9 | Rising design-system pick |
| IBM Plex Sans | UI workhorse | Corporate, sturdy | 9 | Enterprise standard |
| Plus Jakarta Sans | Friendly sans | Modern, upbeat | 7, 10 | SaaS marketing staple |
| Manrope | Friendly sans | Rounded geometric | 1 | Fits pill shapes |
| Outfit | Friendly sans | Geometric, clean | 5 | Minimal dashboards |
| DM Sans | Friendly sans | Low contrast, simple | 2, 16 | Pairs with most serifs |
| Instrument Sans | Friendly sans | Precise, slightly condensed | 6 | Design-studio favorite |
| Sora | Friendly sans | Wide, techy | 14 | Mobility and fintech |
| Jost | Friendly sans | Geometric, elegant | 13 | Body partner for serif display |
| Space Grotesk | Characterful sans | Quirky, technical | 3 | Dark and data styles |
| Bricolage Grotesque | Characterful sans | Ink traps, playful contrast | 6, 11 | Widely used new display sans |
| Funnel Display + Funnel Sans | Characterful sans | Premium headlines + text partner | 6, 13 | Momentum 2025–2026 |
| Work Sans | Characterful sans | Bold, wide heavy weights | 11 | Neo-brutalist classic |
| Nunito | Characterful sans | Rounded ends | 15 | Clay and kids' apps |
| Fraunces | Serif | Soft, expressive, variable | 16 | Leads expressive-serif trend |
| Instrument Serif | Serif | Elegant, fashion-editorial | 12, 13 | Premium brands |
| Cormorant Garamond | Serif | Luxury, high contrast | 13 | Beauty and fashion |
| Source Serif 4 / Crimson Pro | Serif | Long reading | 12, 16 | Blogs, help centers |
| Anton / Bebas Neue | Display | Tall, condensed, loud | 12 | Brutalist/editorial headlines |
| Big Shoulders | Display | Condensed, sporty | 3, 12 | Sports, fitness, events |
| Archivo Black | Display | Heavy, blunt | 11 | Industrial headlines |
| Bagel Fat One | Display | Fat, retro, fun | 15 | Playful brands, kids |
| Geist Mono | Mono | Clean modern code | 8, 17 | Retro-mono trend |
| JetBrains Mono | Mono | Readable code and numbers | 8, 17 | Developer standard |
| Noto Sans Telugu / Devanagari / Tamil | Indian scripts | Matches Latin weights | All | Regional-language apps |
| Anek | Indian scripts | Modern, variable, many scripts | All | Pairs with Inter, Geist |
| Mukta / Hind | Indian scripts | Clean Devanagari UI text | All | Hindi interfaces |

**Paid fonts users ask for → free swaps**

| User asks for | Offer instead |
| --- | --- |
| Söhne, Aeonik, GT America | Inter, Geist, Hanken Grotesk |
| Editorial New, Reckless, Tiempos | Fraunces, Instrument Serif |
| Druk, PP Neue Machina | Anton, Big Shoulders |
| General Sans, Satoshi, Switzer (Fontshare) | Hanken Grotesk, Plus Jakarta Sans, Onest |

Fontshare fonts allow commercial use but [not redistribution](https://licenseorg.com/guide/fonts/fontshare), so they can't ship in a user's repo. A user may link them from Fontshare themselves.

Verify each font's license on its source page before adding it to `design/fonts.json`.

## Motion and effects

### Policy

- [React Bits](https://reactbits.dev) (165+ animated React components, updated almost daily) is our **reference for what's current**, not a dependency. Its license is [MIT + Commons Clause](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md): commercial use inside an app is allowed, but selling, sublicensing or redistributing the components themselves, alone or in a bundle, is forbidden. A platform offering them to all users may count as redistribution in a bundle.
- Until written permission from the author (David Haz) exists, **do not copy React Bits code into the platform or templates.** Build our own effects in `packages/motion`, inspired by the categories below. Record any permission in the decision log.

### Motion rules for every generated app

- Motion level setting: **Off**, **Subtle** (fades, count-ups, hover lifts), **Expressive** (animated backgrounds, cursor effects, 3D)
- `prefers-reduced-motion` always wins: static versions automatically
- Heavy effects (animated backgrounds, cursor effects, 3D) only on landing, login and empty-state pages; never behind tables or forms
- One hero effect per page, lazy-loaded when it scrolls into view
- WebGL/WebGPU effects need a static fallback image

### Effects to build in `packages/motion` (priority order)

| Priority | Effect | Inspired by | Used in |
| --- | --- | --- | --- |
| P1 | Fade/slide in on view; staggered lists | Animated Content, Fade Content | All styles, Subtle |
| P1 | Count-up numbers on KPI cards | Count Up | All dashboards |
| P1 | Headline split/blur reveal | Split Text, Blur Text | Landing and login |
| P1 | Hold-to-confirm button (destructive actions) | Hold Button | Delete actions everywhere |
| P1 | Act-with-undo button with countdown | Fuse Button | Archive/remove/send |
| P1 | Toast, status mark, loader set | Swipe Toast, Status Mark, Lattice Loader | Every app |
| P2 | Pointer spotlight on card grids | Spotlight Card, Border Glow | Styles 1, 3, 4, 8 |
| P2 | Scroll-expand media hero | Scroll Expand | Styles 10, 12, 13, 14 |
| P2 | Scroll-stacking cards | Scroll Stack | Styles 7, 10, 11 |
| P2 | Scroll-linked text reveal | Scroll Reveal, Scroll Float | Styles 6, 11–13, 16, 18 |
| P2 | Animated pill/blob nav | Pill Nav, Gooey Nav | Styles 1, 5, 11 |
| P2 | Edge-light button and traveling border | Specular Button, Star Border, Electric Border | Primary CTA in 3, 10, 13 |
| P3 | Calm gradient backgrounds | Soft Aurora, Silk, Grainient, Iridescence | Styles 2, 6, 10, 13, 16 |
| P3 | Grid and dot backgrounds | Dot Grid, Ripple Grid, Shape Grid, Pattern Waves | Styles 1, 4, 7, 8, 9 |
| P3 | Light rays and beams | Light Rays, Beams, Light Pillar | Styles 3, 5, 14 |
| P3 | Lines and waves | Floating Lines, Threads, Micro Slats, Topography | Styles 5, 9, 16, 18 |
| P3 | Techy/glitch backgrounds | Dither, Faulty Terminal, Letter Glitch | Styles 11, 12, 17 |
| P3 | Animated logo outline from the user's logo | Electric Logo | Splash/hero |
| P3 | Glass panels | Glass Surface, Fluid Glass | Styles 2, 10, 13 |
| P3 | 3D tilt and foil cards | Tilted Card, Holo Card | Profiles, member cards |

Newest React Bits additions (Sept–Oct 2026) worth tracking for ideas: the 30-component Micro set, Holo Card, Circular and Flex Carousels, Electric Logo, Crystalized Ball, Dither Veil, Tech Text, Pattern Waves, Micro Slats, Shape Waves (WebGPU), rebuilt Spotlight Card and Dock. See the [changelog](https://reactbits.dev/get-started/changelog).
