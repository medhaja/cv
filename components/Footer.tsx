import { site } from "@/content/site";
import { Container } from "./ui";
import { CookieSettingsButton } from "./analytics/ConsentBanner";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col gap-4 font-mono text-small text-fg-subtle md:flex-row md:items-center md:justify-between">
        <span>{site.copyright}</span>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a className="link" href={site.links.github} rel="noopener">
              GitHub
            </a>
          </li>
          <li>
            <a className="link" href={site.links.linkedin} rel="noopener">
              LinkedIn
            </a>
          </li>
          <CookieSettingsButton />
          <li>
            <a className="link" href="#top">
              Back to top
            </a>
          </li>
        </ul>
      </Container>
      <Container className="mt-6">
        <p className="max-w-[72ch] text-[0.8125rem] text-fg-subtle">{site.privacyNote}</p>
      </Container>
    </footer>
  );
}
