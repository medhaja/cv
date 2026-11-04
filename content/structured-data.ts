import { seo, site } from "./site";

const PERSON_ID = `${site.url}/#person`;

/** Person (home). Facts only from the site content; no email or phone. */
export const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: site.name,
  jobTitle: site.jobTitle,
  worksFor: { "@type": "Organization", name: site.employer },
  url: `${site.url}/`,
  sameAs: [site.links.github, site.links.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: site.alma },
  knowsAbout: [...site.knowsAbout],
};

/**
 * Isocline (case study). Typed as SoftwareApplication + SoftwareSourceCode so
 * `codeRepository` is a valid property alongside `applicationCategory`.
 */
export const isoclineLd = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "SoftwareSourceCode"],
  name: "Isocline",
  description: seo.isocline.jsonLdDescription,
  url: `${site.url}/isocline/`,
  applicationCategory: "DeveloperApplication",
  license: "https://www.apache.org/licenses/LICENSE-2.0",
  codeRepository: site.links.isoclineRepo,
  image: `${site.url}${seo.ogImages.isocline.url}`,
  author: { "@type": "Person", "@id": PERSON_ID, name: site.name, url: `${site.url}/` },
};
