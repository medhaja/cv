import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GridLines } from "@/components/GridLines";
import { seo, site } from "@/content/site";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
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
        <div className="relative z-10">
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
