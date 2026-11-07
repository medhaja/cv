import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GridLines } from "@/components/GridLines";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Analytics } from "@/components/analytics/Analytics";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { Spotlight } from "@/components/fx/Spotlight";
import { seo, site } from "@/content/site";
import "./globals.css";

// Self-hosted (OFL, see assets/fonts/InstrumentSerif-OFL.txt): no Google request at build or runtime.
const serif = localFont({
  src: [
    { path: "../assets/fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: seo.home.title,
  description: seo.home.description,
  icons: {
    icon: [{ url: "/img/favicon.svg", type: "image/svg+xml" }],
    apple: "/img/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="relative min-h-dvh">
        <div id="top" />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <GridLines />
        <MotionProvider>
          <div className="relative z-10">
            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer />
          </div>
        </MotionProvider>
        {/* Production only; scripts load after the page is interactive. */}
        <Analytics />
        <ConsentBanner />
        <Spotlight />
        <div aria-hidden="true" className="grain" />
      </body>
    </html>
  );
}
