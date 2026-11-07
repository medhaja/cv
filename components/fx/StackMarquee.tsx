import { MarqueePause } from "./MarqueePause";

/**
 * Tools that appear in the résumé, Isocline or the project write-ups.
 * Logos (Simple Icons, CC0) live in one cached sprite, /img/stack-logos.svg, referenced with <use>,
 * so their path data stays out of the HTML and the hydration payload.
 */
const STACK = [
  ["python", "Python"],
  ["langchain", "LangChain"],
  ["langgraph", "LangGraph"],
  ["fastapi", "FastAPI"],
  ["postgresql", "PostgreSQL"],
  ["docker", "Docker"],
  ["kubernetes", "Kubernetes"],
  ["google-cloud", "Google Cloud"],
  ["mlflow", "MLflow"],
  ["tensorflow", "TensorFlow"],
  ["anthropic", "Anthropic"],
  ["gemini", "Gemini"],
  ["ollama", "Ollama"],
  ["openrouter", "OpenRouter"],
  ["nextjs", "Next.js"],
  ["react", "React"],
] as const;

const SPRITE = "/img/stack-logos.svg";

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="marquee-track" aria-hidden={hidden || undefined} translate="no">
      {STACK.map(([id, label]) => (
        <li key={id} className="stack-logo">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <use href={`${SPRITE}#${id}`} />
          </svg>
          {label}
        </li>
      ))}
    </ul>
  );
}

export function StackMarquee() {
  return (
    <section aria-label="Tools I build with" className="relative border-y border-line bg-ink-950/60 py-8 md:py-10">
      <div id="stack-marquee" className="marquee">
        <Track />
        <Track hidden />
      </div>
      <div className="absolute inset-y-0 right-3 flex items-center md:right-6">
        <MarqueePause targetId="stack-marquee" />
      </div>
    </section>
  );
}
