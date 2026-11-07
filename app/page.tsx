import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StackMarquee } from "@/components/fx/StackMarquee";
import { Work } from "@/components/home/Work";
import { Experience } from "@/components/home/Experience";
import { Capabilities } from "@/components/home/Capabilities";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { seo, site } from "@/content/site";
import { PageTransition } from "@/components/motion/PageTransition";
import { JsonLd } from "@/components/JsonLd";
import { personLd } from "@/content/structured-data";

export const metadata: Metadata = {
  title: seo.home.title,
  description: seo.home.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: site.name,
    title: seo.home.title,
    description: seo.home.ogDescription,
    url: "/",
    images: [seo.ogImages.home],
  },
  twitter: { card: "summary_large_image", title: seo.home.title, description: seo.home.ogDescription, images: [seo.ogImages.home] },
};

export default function Home() {
  return (
    <>
    <JsonLd data={personLd} />
    <PageTransition>
      <Hero />
      <StackMarquee />
      <Work />
      <Experience />
      <Capabilities />
      <About />
      <Contact />
    </PageTransition>
    </>
  );
}
