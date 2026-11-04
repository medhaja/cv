/**
 * Content layer: the single source of truth for all copy on medhaja.me.
 *
 * Wording is copied verbatim from the previous site (legacy/index.html and
 * legacy/isocline.html). Inline markup in strings is limited to:
 *   **bold**   `code`   [link text](href)
 * and is rendered by components/Rich.tsx.
 *
 * Do not add claims, numbers, clients or testimonials that are not backed by
 * a public source. See CONTENT_CHECKLIST.md (private) for deliberate omissions.
 */

export type Rich = string;
export type Link = { label: string; href: string; external?: boolean };

/* ------------------------------------------------------------------ */
/* Site / person                                                        */
/* ------------------------------------------------------------------ */

export const site = {
  url: "https://medhaja.me",
  name: "Medhaja H L",
  brand: "MEDHAJA",
  location: "Bengaluru, India",
  email: "medhajahlbhat@gmail.com",
  jobTitle: "GenAI Technical Lead",
  employer: "Biz-Metric India Pvt. Ltd.",
  alma: "Manipal Institute of Technology",
  knowsAbout: [
    "Generative AI",
    "Retrieval-augmented generation",
    "AI agents",
    "LLM evaluation",
    "Python",
    "FastAPI",
  ],
  links: {
    github: "https://github.com/medhaja",
    linkedin: "https://www.linkedin.com/in/medhaja",
    isoclineRepo: "https://github.com/medhaja/isocline",
    isoclineDocs: "https://github.com/medhaja/isocline/tree/main/docs",
    isoclineQuickstart: "https://github.com/medhaja/isocline/blob/main/docs/quickstart.md",
    isoclineRelease: "https://github.com/medhaja/isocline/releases/latest",
    isoclineArchitecture: "https://github.com/medhaja/isocline/blob/main/docs/architecture.md",
    /**
     * Résumé PDF. Hidden while null. Enable with "/resume/Medhaja-H-L-Resume.pdf" once a
     * PDF without a phone number and without the 70% cost figure is in public/resume/.
     */
    resume: null as string | null,
  },
  copyright: "© 2026 Medhaja H L",
  nav: [
    { label: "Work", href: "/#work" },
    { label: "Experience", href: "/#experience" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export const seo = {
  home: {
    title: "Medhaja H L · GenAI Technical Lead and AI Product Builder",
    description:
      "Medhaja H L is a GenAI Technical Lead and AI product builder in Bengaluru, India, and the creator of Isocline, an open-source platform for building and running agent workflows.",
    ogDescription:
      "I build AI products from idea to deployment. Creator of Isocline, an open-source platform for building agent workflows.",
  },
  isocline: {
    title: "Isocline case study · Medhaja H L",
    description:
      "How Medhaja H L designed and built Isocline, an open-source, self-hosted runtime and visual builder for durable agent workflows: problem, architecture, engineering decisions, limitations and evidence.",
    ogDescription:
      "An open-source control plane and durable execution runtime for agent workflows: problem, architecture, tradeoffs and evidence.",
    jsonLdDescription:
      "Open-source control plane and durable execution harness for production AI agents.",
  },
  /** Build-time OG images (app/og/*.png/route.tsx → out/og/*.png). */
  ogImages: {
    home: {
      url: "/og/home.png",
      width: 1200,
      height: 630,
      alt: "Medhaja H L. I build AI products from idea to deployment. GenAI Technical Lead, Bengaluru. Shown over an illustration of an agent workflow paused at a human-approval step.",
    },
    isocline: {
      url: "/og/isocline.png",
      width: 1200,
      height: 630,
      alt: "Isocline, a durable runtime for agent workflows, above a demo run paused at the human-approval step.",
    },
  },
} as const;

/**
 * Lead image: cropped from the owner's desktop-app capture (approved Nov 2026).
 * Run header, stats row and canvas only; no approval JSON, no inspector panel.
 */
export const runShot = {
  png: "/img/isocline/run-approval-1460.png",
  webp960: "/img/isocline/run-approval-960.webp",
  /** Native crop width: no upscaled export. */
  webpLarge: "/img/isocline/run-approval-1460.webp",
  width: 1460,
  height: 564,
  urlBar: "Isocline",
  alt: "Isocline desktop app: a research workflow where specialist agents run in parallel, merge their outputs, and wait at a human-approval step before generating a report.",
  caption: "A demo run paused at the human-approval step.",
} as const;

/** Secondary image: the dashboard (existing assets in public/img/isocline). */
export const dashboardShot = {
  png: "/img/isocline/dashboard-1600.png",
  webp960: "/img/isocline/dashboard-960.webp",
  webpLarge: "/img/isocline/dashboard-1600.webp",
  width: 1600,
  height: 792,
  urlBar: "localhost:3000/dashboard",
  title: "Isocline — demo dashboard",
  alt: "Isocline dashboard: summary tiles for runs, success rate, tokens, spend and average duration; a table of recent completed workflow runs; and a list of models in use across OpenAI, Google and Anthropic.",
} as const;

/* ------------------------------------------------------------------ */
/* Home                                                                 */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Medhaja H L · Bengaluru, India",
  headline: "I build AI products from idea to deployment.",
  intro:
    "I’m a GenAI Technical Lead and AI product builder, combining product thinking, full-stack engineering, and production GenAI systems. I’m also the creator of [Isocline](/#isocline), an open-source platform for building agent workflows.",
  availability: "Open to Staff / Lead GenAI opportunities and consulting engagements.",
  ctas: [
    { label: "Explore my work", href: "/#work" },
    { label: "Get in touch", href: "mailto:medhajahlbhat@gmail.com" },
  ],
  links: [
    { label: "GitHub", href: "https://github.com/medhaja", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/medhaja", external: true },
  ] satisfies Link[],
} as const;

export const work = {
  label: "Work",
  title: "Featured product",
};

export type Fact = { label: string; text: Rich };
export type Stat = { value: string; label: string; source: string };

export const isocline = {
  name: "Isocline",
  tags: ["Open source · Apache-2.0", "Creator & developer"],
  tagline:
    "An open-source control plane and durable execution runtime for agent workflows, with a visual builder on top.",
  facts: [
    {
      label: "The problem",
      text: "Building an agent is becoming easy; operating agent workflows reliably is not. Model calls fail and rate-limit, workers crash mid-run, approvals take days, side effects need undoing, and generated code has to run somewhere safe.",
    },
    {
      label: "Who it’s for",
      text: "Developers and teams who want to compose agent workflows visually and run them on their own infrastructure with multiple model providers or any OpenAI-compatible endpoint. A Windows desktop build and 53 ready-to-run templates also make it usable by individuals.",
    },
    {
      label: "My role",
      text: "I created Isocline and develop it: architecture, runtime, web builder, SDK and CLI, desktop packaging, and release verification.",
    },
  ] satisfies Fact[],
  /** One-line version of the case study's "Demonstrated workflow" (first sentence, verbatim). */
  demonstrated: {
    label: "Demonstrated workflow",
    text: "A research workflow runs specialist agents in parallel, merges their outputs, and pauses for human approval before generating a report.",
    note: "This is demonstrated functionality, not a customer deployment.",
  },
  capabilitiesLabel: "What it does today",
  /** `[title, rest]`: rendered as a feature grid. Title + rest joined = original sentence. */
  capabilities: [
    ["Visual builder", "with typed contracts between nodes, checked before a run starts"],
    ["Durable execution", "on PostgreSQL: parallel DAGs, crash recovery, checkpoints, rerun from any node"],
    ["Human-in-the-loop waits", "(approval, timer, callback, event) that hold no worker"],
    ["Saga-style compensation", "that undoes side effects in reverse order"],
    ["Sandboxed Python", "in disposable, network-less containers"],
    ["Multiple model providers:", "OpenAI, Anthropic, Gemini, OpenRouter, Ollama and OpenAI-compatible servers"],
    ["MCP tools, RAG on pgvector", ", webhook and schedule triggers, REST API, Python SDK and CLI"],
  ] as [string, string][],
  /**
   * Proof tiles. Only numbers that appear in the content:
   * 53 templates, 233 tests, 10/10 durability scenarios (release-3.3.0
   * verification record) and 6 provider types listed under "Multiple model providers".
   */
  stats: [
    { value: "53", label: "ready-to-run templates", source: "src: docs/verification/release-3.3.0.txt" },
    { value: "233", label: "tests passed", source: "src: docs/verification/release-3.3.0.txt" },
    { value: "10/10", label: "durability scenarios", source: "src: docs/verification/release-3.3.0.txt" },
    { value: "6+", label: "model providers", source: "OpenAI · Anthropic · Gemini · OpenRouter · Ollama · OpenAI-compatible" },
  ] satisfies Stat[],
  links: [
    { label: "Read the case study", href: "/isocline/" },
    { label: "Source on GitHub", href: "https://github.com/medhaja/isocline", external: true },
    { label: "Documentation", href: "https://github.com/medhaja/isocline/tree/main/docs", external: true },
    { label: "Windows installer", href: "https://github.com/medhaja/isocline/releases/latest", external: true },
    { label: "Tutorial video", href: "https://www.youtube.com/watch?v=S-avnlTtgcU", external: true },
  ] satisfies Link[],
};

export type SelectedProject = {
  id: string;
  title: string;
  tag: string;
  description: string;
  /** Links with a null href are hidden until the URL is supplied. */
  links: { label: string; href: string | null; external?: boolean }[];
};

/** Owner-supplied (Nov 2026). No impact claims on these cards. */
export const selectedWork = {
  label: "Selected work",
  projects: [
    {
      id: "p-interviewer",
      title: "L1 Interviewer Bot",
      tag: "Voice AI · Agent orchestration",
      description:
        "A voice-first conversational agent that screens technical candidates, using RAG to probe specific technical domains, with automated technical and communication scoring and a low-latency voice-response loop.",
      links: [{ label: "Demo video", href: "https://www.youtube.com/watch?v=EccRZileuTo", external: true }],
    },
  ] as SelectedProject[],
};

export type Project = {
  id: string;
  year: string;
  category: string;
  title: string;
  rows: { label: string; text: Rich }[];
  links: Link[];
};

export const earlierWork = {
  label: "Earlier ML work",
  title: "Smaller projects with public code",
  note: "Personal learning projects from before Isocline. They are experiments, not production systems.",
  projects: [
    {
      id: "p-genai-mlflow",
      year: "2024",
      category: "LLM evaluation",
      title: "Evaluating a RAG question-answering pipeline with MLflow",
      rows: [
        { label: "Problem", text: "Measure the answer quality of a retrieval-based QA pipeline instead of judging outputs by eye." },
        { label: "What I did", text: "Built a LangChain RetrievalQA pipeline over a PDF with a FAISS index, then scored it with `mlflow.evaluate` using LLM-judged faithfulness and relevance metrics plus latency. Packaged with Docker." },
        { label: "Stack", text: "Python · LangChain · FAISS · OpenAI · MLflow · Docker" },
        { label: "Learning", text: "Wiring LLM-as-judge metrics into experiment tracking. The evaluation set is four questions, so this is a pattern exercise, not a benchmark." },
      ],
      links: [{ label: "Source", href: "https://github.com/medhaja/GenAI-with-MLFlow", external: true }],
    },
    {
      id: "p-heart",
      year: "2024",
      category: "Tabular ML",
      title: "Heart failure prediction with XGBoost and MLflow",
      rows: [
        { label: "Problem", text: "Predict a death event from 13 clinical features in a public Kaggle dataset of heart-failure records." },
        { label: "What I did", text: "Trained an XGBoost classifier, ran a 50-trial Hyperopt search with every trial logged as a nested MLflow run, and evaluated with accuracy, ROC AUC, a confusion matrix and feature-importance plots." },
        { label: "Stack", text: "Python · XGBoost · Hyperopt · scikit-learn · MLflow" },
        { label: "Learning", text: "Using MLflow to make hyperparameter search reproducible and comparable across trials." },
      ],
      links: [{ label: "Source", href: "https://github.com/medhaja/Heart-Failure-Prediction", external: true }],
    },
    {
      id: "p-cola",
      year: "2023",
      category: "Computer vision",
      title: "In-browser image classifier with transfer learning",
      rows: [
        { label: "Problem", text: "Classify two product types from a webcam image entirely on the user’s device, without sending images to a server." },
        { label: "What I did", text: "Fine-tuned a VGG16 model, converted its weights for TensorFlow.js, and built a static page that classifies webcam captures in the browser." },
        { label: "Stack", text: "TensorFlow / Keras · VGG16 · TensorFlow.js · static hosting" },
        { label: "Result", text: "A working demo that runs on-device. The demo asks for webcam access." },
      ],
      links: [
        { label: "Live demo", href: "https://medhaja.github.io/Cococola-powerbar-classification-deployment-using-static-site/", external: true },
        { label: "Source", href: "https://github.com/medhaja/Cococola-powerbar-classification-deployment-using-static-site", external: true },
      ],
    },
  ] satisfies Project[],
};

export type Role = {
  title: string;
  org: string;
  start: { label: string; iso: string };
  end: { label: string; iso: string } | null; // null = present
  current?: boolean;
  bullets?: string[];
};

export const experience = {
  label: "Experience",
  title: "Where I’ve worked",
  /** Added at the owner's request (Jun 2021 – present, minus a gap ≈ 5y2m). */
  stat: { value: "5+", label: "years industry experience" },
  /** Owner-supplied bullets (Nov 2026). Generic client descriptions only: no client names, data or prompts. */
  roles: [
    {
      title: "GenAI Technical Lead",
      org: "Biz-Metric India Pvt. Ltd.",
      start: { label: "Feb 2026", iso: "2026-02" },
      end: null,
      current: true,
      bullets: [
        "Led development of an enterprise agentic accelerator that migrates Azure Data Factory (ADF) pipelines to PySpark, combining deterministic translation, LLM-based semantic validation and automated repair workflows, reducing manual migration effort by 90%.",
        "Lead delivery of enterprise document-processing and knowledge-retrieval applications, owning the technical architecture and guiding engineers through implementation, evaluation and deployment.",
        "Build document-processing agents and RAG pipelines, orchestrating multiple models with LangGraph and LiteLLM, including routing, failure handling and output-quality checks.",
      ],
    },
    {
      title: "Senior Software Engineer",
      org: "Infinite Computer Solutions",
      start: { label: "Oct 2024", iso: "2024-10" },
      end: { label: "Feb 2026", iso: "2026-02" },
      bullets: [
        "Deployed Mistral-7B with vLLM on Google Kubernetes Engine (GKE) for GPU-backed inference serving, and explored speculative decoding to improve serving performance.",
        "Built FastAPI services and evaluation components for enterprise AI inference and evaluation systems, integrating LLM and OpenCV components into evaluation workflows.",
        "Built a multi-agent proof of concept with AutoGen.",
      ],
    },
    {
      title: "Software Engineer, AI/ML",
      org: "SourceFuse",
      start: { label: "Apr 2023", iso: "2023-04" },
      end: { label: "Apr 2024", iso: "2024-04" },
      bullets: [
        "Built enterprise knowledge-retrieval (RAG) applications with FAISS and FastAPI, connecting document retrieval to LLM generation.",
        "Integrated multiple model backends — OpenAI, Mistral, Llama 2 and Amazon Bedrock — into these applications.",
      ],
    },
    {
      title: "Analyst",
      org: "EXL",
      start: { label: "Jun 2021", iso: "2021-06" },
      end: { label: "Dec 2022", iso: "2022-12" },
      bullets: [
        "Developed NLP question-answering solutions and PySpark data-processing workflows, and worked on Docker and Kubernetes deployments.",
      ],
    },
  ] satisfies Role[],
  /** Compact "Earlier" entries below EXL (owner-supplied, Nov 2026). */
  earlierLabel: "Earlier",
  earlier: [
    {
      org: "PyImageSearch",
      title: "Machine Learning Engineer (Freelance)",
      start: { label: "Jun 2020", iso: "2020-06" },
      end: { label: "Mar 2021", iso: "2021-03" },
      text: "Converted Python projects into cloud-based notebooks and wrote blog posts on the process.",
    },
    {
      org: "Harman International",
      title: "Machine Learning Engineer Intern",
      start: { label: "Sep 2019", iso: "2019-09" },
      end: { label: "Jun 2020", iso: "2020-06" },
      text: "Built anomaly detection on real-time 5G telematics data using autoencoders on Amazon SageMaker.",
    },
  ],
};

export type Capability = { title: string; text: string; evidence: Link[] };

export const capabilities = {
  label: "Capabilities",
  title: "What I work on",
  items: [
    {
      title: "GenAI systems",
      text: "RAG, agent workflows, tool use, structured extraction, LLM evaluation.",
      evidence: [
        { label: "Isocline", href: "/isocline/" },
        { label: "RAG evaluation with MLflow", href: "/#p-genai-mlflow" },
        { label: "RAG and agent work at Biz-Metric and SourceFuse", href: "/#experience" },
      ],
    },
    {
      title: "Application engineering",
      text: "Python, FastAPI, APIs, React, end-to-end application development.",
      evidence: [{ label: "Isocline’s FastAPI backend and Next.js builder", href: "/isocline/#architecture" }],
    },
    {
      title: "Inference and deployment",
      text: "vLLM, Docker, Kubernetes, cloud deployment.",
      evidence: [
        { label: "vLLM on GKE at Infinite Computer Solutions", href: "/#experience" },
        { label: "Isocline’s Docker Compose stack and sandbox", href: "/isocline/#architecture" },
      ],
    },
    {
      title: "Reliability",
      text: "Tracing, failure handling, evaluation pipelines, latency and cost analysis.",
      evidence: [{ label: "Isocline’s durability checks and benchmarks", href: "/isocline/#evidence" }],
    },
    {
      title: "Product and leadership",
      text: "Problem definition, prototyping, technical design, delivery, mentoring.",
      evidence: [
        { label: "Technical lead at Biz-Metric", href: "/#experience" },
        { label: "Isocline’s product scope", href: "/isocline/#ownership" },
      ],
    },
  ] satisfies Capability[],
};

export const about = {
  label: "About",
  title: "Engineer, technical lead, product builder.",
  paragraphs: [
    "I’m a GenAI Technical Lead based in Bengaluru, with a background in Computer Science and Engineering from MIT Manipal.",
    "My work combines hands-on engineering, technical leadership, and product development. I enjoy taking an ambiguous business problem, building a useful prototype, and developing it into a dependable application.",
    "Alongside my professional work, I build Isocline. I’m interested in opportunities where I can own AI products, work closely with users, and lead delivery from concept to deployment.",
  ],
};

export type Cert = {
  title: string;
  issuer: string;
  year?: string;
  link: Link & { srLabel: string };
};

export const background = {
  label: "Background",
  title: "Education & Certifications",
  education: {
    label: "Education",
    degree: "B.Tech in Computer Science and Engineering",
    school: "Manipal Institute of Technology, Manipal",
    years: "2015 – 2019",
  },
  certsLabel: "Certifications",
  certs: [
    {
      title: "AI Product Management Specialization",
      issuer: "Duke University · Coursera",
      year: "2022",
      link: { label: "Verify", srLabel: " AI Product Management certificate", href: "https://www.coursera.org/account/accomplishments/specialization/B4RBFC5AQYZH", external: true },
    },
    {
      title: "Large Language Model Operations (LLMOps) Specialization",
      issuer: "Duke University · Coursera",
      year: "2024",
      link: { label: "Verify", srLabel: " LLMOps certificate", href: "https://www.coursera.org/account/accomplishments/specialization/GDB96N8PEBRR", external: true },
    },
    {
      title: "Machine Learning Engineering for Production (MLOps) Specialization",
      issuer: "DeepLearning.AI · Coursera",
      year: "2022",
      link: { label: "Verify", srLabel: " MLOps certificate", href: "https://www.coursera.org/account/accomplishments/specialization/SBN8BQRUVT2S", external: true },
    },
    {
      title: "Sustainable Business Strategy",
      issuer: "Harvard Business School Online · Certificate Program",
      year: "2022",
      link: { label: "View certificate", srLabel: " for Sustainable Business Strategy", href: "/img/HBS.jpg" },
    },
    {
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI · Coursera",
      year: "2019",
      link: { label: "Verify", srLabel: " Deep Learning certificate", href: "https://www.coursera.org/account/accomplishments/specialization/TLDXPJL7BW46", external: true },
    },
  ] satisfies Cert[],
};

export const contact = {
  label: "Work with me",
  title: "Let’s build something useful.",
  paths: [
    {
      label: "For hiring",
      title: "Staff / Lead GenAI roles",
      text: "Interested in Staff / Lead GenAI and hands-on AI product engineering opportunities.",
    },
    {
      label: "For consulting",
      title: "GenAI applications",
      text: "I help teams prototype and build AI workflow automation, knowledge assistants, and GenAI applications.",
    },
  ],
  emailCta: "Email medhajahlbhat@gmail.com",
  meta: ["Bengaluru, India"],
};

/* ------------------------------------------------------------------ */
/* Isocline case study (/isocline/)                                     */
/* ------------------------------------------------------------------ */

export const caseStudy = {
  crumb: { label: "← Back to work", href: "/#work" },
  eyebrow: "Case study · Isocline",
  title: "A durable runtime for agent workflows, with a visual builder on top.",
  lead: "Isocline is an open-source, self-hosted control plane for agent workflows. You compose a workflow on a canvas, run it with multiple model providers or any OpenAI-compatible endpoint, and the runtime keeps it correct through crashes, restarts, slow human approvals and failed side effects.",
  meta: [
    { label: "Role", value: "Creator and developer" },
    { label: "Type", value: "Open-source product · Apache-2.0" },
    { label: "Stack", value: "FastAPI · Celery · PostgreSQL + pgvector · Redis · Next.js" },
    { label: "Releases", value: "3.3.0 first public release; Windows installer published with each release" },
  ],
  actions: [
    { label: "Source on GitHub", href: "https://github.com/medhaja/isocline", external: true },
    { label: "Quick start", href: "https://github.com/medhaja/isocline/blob/main/docs/quickstart.md", external: true },
    { label: "Documentation", href: "https://github.com/medhaja/isocline/tree/main/docs", external: true },
    { label: "Windows installer", href: "https://github.com/medhaja/isocline/releases/latest", external: true },
  ] satisfies Link[],
  shotCaption:
    "The dashboard of a local installation: recent runs with duration, tokens and estimated cost per run, and the models used across providers.",

  problem: {
    n: "01",
    id: "problem",
    title: "Problem and users",
    paragraphs: [
      "Building an agent is becoming easy. **Operating agent workflows reliably is not.** Agent workflows run for seconds to days. Model calls are slow and fail or rate-limit. Workers crash mid-run and deploys restart everything. A person may approve a step tomorrow, an external system may call back next week, and a side effect may need undoing when a later step fails. Generated code also has to run somewhere it can’t reach credentials or the network.",
      "Most visual agent builders treat every edge as “some text”, so mismatched data only surfaces deep inside a paid model call.",
    ],
    usersTitle: "Intended users",
    users: [
      "**Developers and teams** who want to build agent workflows visually or through an API, run them on their own infrastructure, and keep a full trace of every run.",
      "**Operators** self-hosting on commodity components (PostgreSQL, Redis, Celery) rather than adopting new infrastructure.",
      "**Individuals** using the Windows desktop app and 53 role-based templates (for example, study planners, interview kits, incident postmortems and research briefs).",
    ],
  },

  built: {
    n: "02",
    id: "built",
    title: "What I built",
    items: [
      "**Visual builder:** canvas with typed ports, variables, undo/redo, autosave and JSON import/export.",
      "**Node library:** inputs and outputs, agents, seven tools, condition, router, parallel, merge, loop, retry, transform, human approval, sub-workflow, timer, callback and event waits, and triggers.",
      "**Durable executor:** parallel DAG execution, heartbeats, crash recovery, checkpoints, rerun from any node, and saga compensation.",
      "**Model layer:** one provider registry for OpenAI, Anthropic, Gemini, OpenRouter, Ollama and any OpenAI-compatible server (vLLM, LM Studio, llama.cpp, LiteLLM), with fallbacks, structured JSON-schema output, and token and cost tracking. A deterministic test provider runs every workflow without an API key.",
      "**Tools and knowledge:** web search, SSRF-protected HTTP, sandboxed Python, MCP over streamable HTTP with per-server allowlists, and knowledge bases on pgvector.",
      "**Operations:** webhook, schedule, event and file triggers, a run inspector, evaluations and experiments, monitoring, role-based access and an audit log.",
      "**Developer surface:** REST API with OpenAPI, a Python SDK and a CLI.",
      "**Desktop app:** a single-process Windows build using SQLite and in-process workers, with Python steps sandboxed in a Windows AppContainer.",
    ],
  },

  /** Shown after "What I built" (not a numbered section). Owner-supplied text. */
  demonstrated: {
    title: "Demonstrated workflow",
    text: "A research workflow runs specialist agents in parallel, merges their outputs, and pauses for human approval before generating a report. The run inspector shows each node’s output, token usage, latency and estimated cost.",
    note: "This is demonstrated functionality, not a customer deployment.",
  },

  ownership: {
    n: "03",
    id: "ownership",
    title: "My ownership",
    paragraphs: [
      "I created Isocline and develop it. I’m responsible for the product scope, the architecture and design documents, the backend runtime, the web builder, the SDK and CLI, Windows desktop packaging, and release verification.",
      "I also decided what the open-source edition includes. API deployments, environment promotion and the in-builder workflow assistant are deliberately out of scope, and the repository documents that boundary.",
    ],
  },

  architecture: {
    n: "04",
    id: "architecture",
    title: "Architecture and key decisions",
    tiers: [
      {
        label: "Clients",
        nodes: [
          { title: "Web UI", sub: "Next.js builder + run inspector" },
          { title: "SDK / CLI / HTTP", sub: "personal access tokens" },
        ],
      },
      { label: "API", nodes: [{ title: "FastAPI", sub: "compiler · contracts · preflight · immutable run snapshot" }] },
      {
        label: "State",
        nodes: [
          { title: "PostgreSQL + pgvector", sub: "authoritative: runs, node runs, events, checkpoints, waits", key: true },
          { title: "Redis", sub: "disposable: queue, cache, live events" },
        ],
      },
      {
        label: "Execution",
        nodes: [
          { title: "Celery workers", sub: "durable executor" },
          { title: "Beat", sub: "sweeper · waits · schedules" },
        ],
      },
      {
        label: "Effects",
        nodes: [
          { title: "Model providers", sub: "one registry, many adapters" },
          { title: "Tools / MCP servers", sub: "SSRF-checked HTTP" },
          { title: "Python sandbox", sub: "one container per execution" },
        ],
      },
    ] as { label: string; nodes: { title: string; sub: string; key?: boolean }[] }[],
    /** Connector labels between tiers (index i sits between tier i and i+1). */
    connectors: [
      "requests",
      "runs and events persisted; run id enqueued",
      "claim → heartbeat → walk the DAG",
      "calls out to",
    ],
    caption:
      "Server architecture, redrawn from the project’s [architecture document](https://github.com/medhaja/isocline/blob/main/docs/architecture.md). Seven long-running services in Docker Compose.",
    decisionsTitle: "Decisions that shaped it",
    decisions: [
      {
        title: "PostgreSQL is the only source of truth",
        body: "Every node run, output, event, wait, checkpoint and compensation is a database row. Redis only carries queue messages and live events, so losing Redis loses nothing: a sweeper re-enqueues runs from PostgreSQL.",
        tradeoff: "Every node writes to the database before the next one is scheduled. That bookkeeping dominates short, deterministic nodes.",
      },
      {
        title: "Execution as deterministic replay over persisted outcomes",
        body: "A worker atomically claims a run, loads prior node runs and walks the DAG. Completed nodes return their stored output instead of re-executing, so expensive model calls aren’t repeated after a crash.",
        tradeoff: "Execution is at-least-once per node. A node that was running when its worker died runs again, so side-effecting tools must be idempotent or declare compensation.",
      },
      {
        title: "Waiting without occupying a worker",
        body: "Approvals, timers, callbacks and events persist a wait state and release the worker. A conditional update resumes the run, so concurrent resumes cannot fire twice.",
        tradeoff: "A node paused for a tool-call approval re-runs from its start once approved, repeating its model calls.",
      },
      {
        title: "Typed contracts between nodes, gradually",
        body: "Ports carry types such as `Text`, `JSON<schema>` and `Artifact<csv>`. Incompatible edges are rejected at compile time, before any money is spent, and outputs are validated at run time.",
        tradeoff: "Untyped graphs keep working for backward compatibility, so guarantees are only as strong as the annotations.",
      },
      {
        title: "An in-house provider abstraction",
        body: "One interface with adapters per API. Errors are normalised to kinds such as rate limit, timeout and context limit, so retry, fallback and provider-switch rules work the same for every provider. Capabilities and prices live in data, not code.",
        tradeoff: "A common message format hides some provider-specific features, and cost estimates are only as accurate as the price catalog.",
      },
      {
        title: "A fresh, network-less container per Python execution",
        body: "Generated code never runs in the API or worker. Each execution gets a disposable container with no network, a read-only root, dropped capabilities and resource limits, plus optional gVisor.",
        tradeoff: "Container start-up latency on every execution, and no `pip install` at run time.",
      },
      {
        title: "Saga compensation instead of distributed transactions",
        body: "Side-effecting HTTP steps can register an undo action. If the run fails, the undo actions run in reverse completion order, each one checked by the policy engine.",
        tradeoff: "Compensation is best effort and opt-in, and compensating actions must themselves be idempotent.",
      },
    ],
  },

  limitations: {
    n: "05",
    id: "limitations",
    title: "Known limitations",
    intro: "These are documented in the repository rather than hidden:",
    items: [
      "Per-node overhead is dominated by durable bookkeeping (about 100 ms per node on a 1-vCPU reference machine), so very wide fan-outs of trivial nodes are bookkeeping-bound.",
      "No exactly-once guarantee: execution is at-least-once per node across crashes.",
      "The sandbox’s Docker mode needs the host Docker socket, and plain Docker is not a hardened boundary against kernel exploits. gVisor or a dedicated VM is recommended for untrusted code.",
      "MCP supports streamable-HTTP servers only (no stdio, no OAuth).",
      "Default embeddings are lexical, not semantic, until an embedding model is configured.",
      "A single queue serves all runs, so resource classes are recorded but not routed.",
    ],
  },

  evidence: {
    n: "06",
    id: "evidence",
    title: "Evidence",
    verification: {
      title: "Release verification",
      intro:
        "Recorded for the 3.3.0 release commit on Ubuntu 24.04 with PostgreSQL 16, Redis 7 and Celery, using the deterministic test provider:",
      source: "Source: docs/verification/release-3.3.0.txt",
      columns: ["Check", "Result"],
      rows: [
        ["API unit, integration, product, security and template tests", "233 passed"],
        ["Durability scenarios: worker `SIGKILL` mid-node, API / worker / Redis restarts during an approval, Redis `FLUSHALL` during a timer, lost queue message, checkpoint restore, rerun from node, saga ordering", "10 / 10"],
        ["Every workflow template created and run to completion", "53 / 53"],
        ["Product smoke checks: SDK, CLI, import/export, sandbox, knowledge base, signed webhook, schedule trigger", "9 / 9"],
      ] as [string, string][],
      note: "Not verified at that release: `docker compose up` end to end, and the Python sandbox in Docker mode (that environment had no Docker). CI builds the images and runs the live checks on every push.",
    },
    benchmarks: {
      title: "Reference benchmarks",
      intro:
        "Measured on a single shared 1 vCPU (Intel Xeon 2.80 GHz, 3.9 GB RAM), with API, worker, beat, PostgreSQL and Redis on the same core, which inflates every live number.",
      source: "Source: benchmarks/README.md · reference run 2026-09-30",
      columns: ["Benchmark", "n", "P50", "P95"],
      rows: [
        ["Compile + validate, 100-node graph", "30", "4.07 ms", "4.52 ms"],
        ["Queue pickup (run created → execution started)", "30", "46.81 ms", "65.35 ms"],
        ["Per-node overhead, 50-node sequential chain", "6", "101.10 ms", "110.35 ms"],
        ["Durable continuation (approve → run completed)", "15", "396.26 ms", "443.84 ms"],
      ] as [string, string, string, string][],
    },
    linksTitle: "Links",
    links: [
      { label: "Code", text: "github.com/medhaja/isocline", href: "https://github.com/medhaja/isocline" },
      { label: "Docs", text: "Documentation, including the quick start, self-hosting and security guides", href: "https://github.com/medhaja/isocline/tree/main/docs" },
      { label: "Design", text: "Design documents: durable execution, checkpointing, sagas, sandbox, contracts, providers", href: "https://github.com/medhaja/isocline/tree/main/docs/design" },
      { label: "Verification", text: "Release 3.3.0 verification record", href: "https://github.com/medhaja/isocline/blob/main/docs/verification/release-3.3.0.txt" },
      { label: "Benchmarks", text: "Benchmark method and reference run", href: "https://github.com/medhaja/isocline/blob/main/benchmarks/README.md" },
      { label: "CI", text: "CI pipeline: tests, live durability checks, image builds, secret scan", href: "https://github.com/medhaja/isocline/blob/main/.github/workflows/ci.yml" },
      { label: "Download", text: "Latest release with the Windows installer", href: "https://github.com/medhaja/isocline/releases/latest" },
      { label: "Video", text: "Tutorial video", href: "https://www.youtube.com/watch?v=S-avnlTtgcU" },
    ],
  },

  cta: {
    label: "Work with me",
    title: "Let’s build something useful.",
    lead: "Interested in Staff / Lead GenAI roles, or in building agent workflows and GenAI applications for your team.",
    actions: [
      { label: "Email medhajahlbhat@gmail.com", href: "mailto:medhajahlbhat@gmail.com" },
      { label: "Back to work", href: "/#work" },
    ] satisfies Link[],
  },
};

export const caseStudySections = [
  caseStudy.problem,
  caseStudy.built,
  caseStudy.ownership,
  caseStudy.architecture,
  caseStudy.limitations,
  caseStudy.evidence,
].map((s) => ({ n: s.n, id: s.id, title: s.title }));
