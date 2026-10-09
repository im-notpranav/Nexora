import "@fontsource-variable/manrope";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { platformThemeCss } from "@/lib/platform-theme";

export const metadata: Metadata = {
  title: { default: "Nexora", template: "%s · Nexora" },
  description: "Describe an app in plain words and get a working, deployed app you own.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style id="platform-theme">{platformThemeCss}</style>
      </head>
      <body className="theme-root antialiased">{children}</body>
    </html>
  );
}
