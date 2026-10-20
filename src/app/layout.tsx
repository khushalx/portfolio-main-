import type { Metadata, Viewport } from "next";
import "@fontsource/archivo-black";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { ScrollProgress } from "@/components/motion";

const origin = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  metadataBase: new URL(origin || "http://localhost:3000"),
  title: { default: "Khushal Dangar — Software / AI / Finance", template: "%s — Khushal Dangar" },
  description: "Khushal Dangar builds software, explores artificial intelligence, and researches businesses and financial markets.",
  applicationName: "Khushal Dangar Portfolio",
  authors: [{ name: "Khushal Dangar" }],
  ...(origin ? { alternates: { canonical: "/" } } : {}),
  openGraph: { title: "Khushal Dangar — Software / AI / Finance", description: "Software / AI / Finance. I build software, explore ideas, and turn projects into products.", type: "website", locale: "en_US", siteName: "Khushal Dangar" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#050505", colorScheme: "dark" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><ScrollProgress />{children}</body></html>;
}
