import { Fragment } from "react";
import { SmartLink } from "./SmartLink";

/** Renders the content layer's tiny inline markup: **bold**, `code`, [text](href). */
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export function Rich({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**")) {
          return (
            <strong key={i} className="font-medium text-fg">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`")) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          return (
            <SmartLink key={i} href={link[2]} className="link">
              {link[1]}
            </SmartLink>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** Plain-text version (for meta tags, aria labels and the word diff). */
export function plain(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
