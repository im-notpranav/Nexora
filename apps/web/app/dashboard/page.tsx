import { AppShell, Button, EmptyState, PageHeader } from "@nexora/blocks";
import { FolderKanban, Palette, Plus, Settings, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { NexoraMark } from "@/components/nexora-mark";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveTheme } from "@nexora/design-tokens";
import { PLATFORM_PALETTE, PLATFORM_STYLE } from "@/lib/platform-theme";

export const metadata: Metadata = { title: "Your projects" };

const NAV = resolveTheme(PLATFORM_STYLE, PLATFORM_PALETTE).layout.nav;

export default async function DashboardPage() {
  // Always render per request: this page depends on who is signed in.
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  if (!data.user) redirect("/sign-in?next=/dashboard");

  return (
    <AppShell
      nav={NAV}
      appName="Nexora"
      mark={<NexoraMark />}
      items={[
        { label: "Projects", href: "/dashboard", icon: <FolderKanban size={18} />, active: true },
        { label: "Style gallery", href: "/gallery", icon: <Palette size={18} /> },
        { label: "Settings", href: "/dashboard", icon: <Settings size={18} /> },
      ]}
      actions={
        <form action="/auth/sign-out" method="post">
          <Button type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      }
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <PageHeader
          title="Your projects"
          description={`Signed in as ${data.user.email ?? "you"}`}
          actions={
            <Button disabled title="Coming soon">
              <Plus size={16} aria-hidden="true" /> New project
            </Button>
          }
        />
        <section className="surface-card p-card">
          <EmptyState
            icon={<Sparkles size={22} />}
            title="No projects yet"
            description="Soon you'll describe your app idea here, and we'll turn it into a plan you can approve. For now, explore the styles your app can use."
            action={
              <a
                href="/gallery"
                className="inline-flex h-control items-center rounded-control bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary-hover"
              >
                Open the style gallery
              </a>
            }
          />
        </section>
      </div>
    </AppShell>
  );
}
