# DESIGN.md — medhaja.me

**Concept: systems that hold up.**
The site should feel like the docs and marketing site of a well-run infrastructure product. It is precise and calm, and every detail looks deliberate. The page is a dark, editorial surface with a faint engineering grid. Large serif headlines set the tone. Monospace marks such as run IDs, timestamps and node labels add texture. One warm, luminous accent appears only where something is *live*, such as a running node, the current role or a primary action.

Tokens below are mirrored 1:1 in `styles/theme.css` (Tailwind v4 `@theme`, the v4 equivalent of `tailwind.config`).

---

## 1. Palette

Dark neutrals with a hint of warmth (not blue-black), plus one accent.

| Token | Hex | Use |
|---|---|---|
| `ink-950` (bg) | `#0A0A0B` | Page background |
| `ink-900` (surface) | `#111113` | Cards, tables, browser frame |
| `ink-850` (raised) | `#17171A` | Hover surfaces, expanded cards, code chips |
| `line` | `rgb(255 255 255 / 0.07)` | Grid lines, card borders, table rules |
| `line-strong` | `rgb(255 255 255 / 0.14)` | Hover borders, dividers that must read |
| `fg` | `#EDEDEF` | Headlines, body text |
| `fg-muted` | `#A3A3AB` | Secondary body, descriptions |
| `fg-subtle` | `#83838C` | Mono labels, captions, meta |
| `signal` (accent) | `#FFB547` | Live state: running pulse, current role, primary CTA, focus ring |
| `signal-dim` | `rgb(255 181 71 / 0.14)` | Accent washes: approval halo, selected rows |

**Contrast (WCAG 2.x, measured):**
- `fg` on bg is 16.9:1.
- `fg-muted` is 7.9:1 on bg and 7.1:1 on raised.
- `fg-subtle` is 5.3:1 on bg and 4.8:1 on raised, so it is AA even at small sizes.
- `signal` on bg is 11.3:1.
- `ink-950` text on a `signal` button is 11.3:1.

**Rules**
- No gradients as decoration. The only gradient allowed is a soft radial `signal-dim` glow behind a live element.
- Amber is reserved for "this is active or this is the action". If more than one or two amber things show in a viewport, one of them is wrong.
- State colours in diagrams come from **luminance, not hue**. Completed elements are `fg` at 60%, pending ones are `line-strong`, and live ones are `signal`. No red/green status palette. Failure is shown with a dashed stroke, not a colour.

## 2. Typography

| Role | Family | Why |
|---|---|---|
| Display | **Instrument Serif** (400, plus italic) | Editorial and high-contrast. It sets the site apart from the usual all-sans developer portfolio and stays calm at large sizes. |
| Body / UI | **Geist Sans** (400 / 500 / 600) | A neutral, engineered sans in the Linear/Vercel family. Excellent at small sizes. |
| Technical | **Geist Mono** (400 / 500) | Labels, numbers, run IDs, table figures. Same metrics family as Geist Sans, so mixed lines align. |

All three are self-hosted via `next/font` (no layout shift, no third-party request).
Numbers in tables and stat tiles use `font-variant-numeric: tabular-nums`.

**Type scale** (fluid `clamp`, 390px → 1440px)

| Token | Size | Line height | Tracking | Family / use |
|---|---|---|---|---|
| `display-xl` | 56 → 112px | 0.95 | -0.02em | Serif. Hero headline only |
| `display-lg` | 44 → 80px | 1.0 | -0.02em | Serif. Section titles, case-study H1 |
| `display-md` | 32 → 48px | 1.05 | -0.015em | Serif. "Isocline" title, CTA headline |
| `heading` | 20 → 24px | 1.25 | -0.01em | Sans 500. Card titles, decision titles |
| `lead` | 18 → 21px | 1.5 | -0.005em | Sans 400. Intro paragraphs (max 60ch) |
| `body` | 16px | 1.6 | 0 | Sans 400. Prose (max 68ch) |
| `small` | 14px | 1.5 | 0 | Sans. Card body, table cells |
| `label` | 12px | 1.4 | 0.08em, UPPERCASE | Mono 500. Eyebrows, meta, tags |
| `stat` | 40 → 64px | 1.0 | -0.03em | Mono 400, tabular. Stat tiles |

Headings never exceed 14 words per line. Serif headlines are left-aligned, never centred.

## 3. Spacing, radius, grid

**Spacing.** A 4px base, used through Tailwind's default `--spacing: 0.25rem`. The rhythm steps are 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160.
- **Section structure (revised Nov 2026).** Each section opens with a full-width `line` rule that carries one row: the mono coordinate (`§02 /work`) on the left and the section label on the right (on desktop, in the content column). The heading row follows **32px** below on desktop and **24px** on mobile. Sections are separated by bottom padding of 160px on desktop and 96px on mobile. Gaps between section heads and content are 48 / 64px. A section can carry a second label on the same row ("Work / Featured product").
- Card padding is 24px on mobile and 32px on desktop.

**Radius.** Engineered and nearly square.
- `radius-xs` is 2px, for tags and code chips.
- `radius-sm` is 4px, for buttons and inputs.
- `radius-md` is 8px, for cards, tables and the browser frame.
- The only circles are status dots and graph nodes.

**Grid**
- 12 columns, max content width 1280px, gutter 24px, outer margin 20px (mobile) to 40px (desktop).
- **Visible grid as texture.** Two faint vertical `line` rules frame the content area (in the outer half-gutter) for the full page height. *(Revised in Stage 1: inner column rules at 3 / 9 cut through body text and doubled card borders.)* Section boundaries get a full-width horizontal `line` with a small mono coordinate at the left, for example `§02 · /work`.
- Layout is asymmetric. Labels and section numbers sit in columns 1–3, content in 4–12 (Linear and Stripe docs pattern). On mobile everything stacks to one column with the label above.

**Borders over shadows.** Elevation is a 1px `line` border plus a background step (`ink-900` → `ink-850`). No drop shadows, except the browser-frame screenshot, which gets a single long, soft `0 40px 80px -40px rgb(0 0 0 / 0.6)`.

## 4. Components (visual rules)

- **Buttons.** Primary is a solid `signal` fill with `ink-950` text, sans 500, 44px tall, `radius-sm`. Secondary is transparent with a `line-strong` border and `fg` text. Text links get a 1px underline at `fg-subtle` that animates to `fg` on hover. External links end in a mono `↗`.
- **Tags.** Mono `label` style with a 1px `line` border and `radius-xs`. Example: `2024 · LLM EVALUATION`.
- **Stat tiles.** A large mono number, a mono label below, and a source line in `fg-subtle` (for example `src: release-3.3.0.txt`). Only the four real numbers: 53 templates, 233 tests passed, 10/10 durability scenarios, 6+ model providers.
- **Tables.** No zebra stripes. Rows are separated by `line` rules. Numbers are right-aligned mono and tabular. The caption (source line) sits under the table in mono `fg-subtle`.
- **Focus.** A 2px `signal` outline with a 2px offset on every interactive element. It is never removed.

## 5. Motion rules

The principle is that motion explains state and never decorates. Everything moves like a well-damped system, with no bounce and no overshoot.

| Token | Value | Use |
|---|---|---|
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals, page transitions |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Camera moves, diagram flow |
| `dur-fast` | 150ms | Hover colour and border |
| `dur-base` | 300ms | Expand/collapse, nav highlight |
| `dur-reveal` | 800ms | Scroll reveals |
| `stagger` | 80ms | Sibling reveals |

- **Scroll reveals** (GSAP ScrollTrigger) fade from 0 to 1 and rise 16px. Each element plays once and is not re-triggered on scroll-up.
- **Smooth scroll** uses Lenis with `lerp 0.1`. It is disabled under reduced motion and for keyboard anchor jumps.
- **Hover** changes border and colour only. Cards do not scale. Links change their underline colour. Hovering a graph node raises its label.
- **Page transitions** (Framer Motion) are a 300ms cross-fade with an 8px rise. No wipes and no curtains.
- **Loader.** A mono `booting runtime…` line with a 3-step tick (`claim → load → ready`). It finishes in under 900ms and shows only on the first visit in a session.
- **Cursor.** On desktop pointers only, an 8px ring that lerps behind the pointer. It becomes a mono label (`open ↗`, `copy`) over actionable elements. The native cursor stays visible, so this adds to it and never replaces it.
- **`prefers-reduced-motion`.** No smooth scroll, no reveals (content is visible immediately), the 3D graph is replaced by a static SVG, the architecture diagram shows all layers lit with no travelling packet, and the loader and custom cursor are off.

## 6. The 3D workflow graph: visual language

**What it depicts.** A single Isocline run moving through a 16-node DAG:

`trigger → agent → router → ⟨parallel fan-out ×3: agent · tool · agent⟩ → merge → approval (waits) → retry → agent → output`, plus a few side nodes (`checkpoint`, `transform`, `sandbox`) at the edges for depth.

**Space.** The graph flows left to right and is laid out on three depth planes (z = −2, 0, 2) so parallax reads. It drifts slowly as a whole, about 0.6° of rotation per second, with a ±0.15 unit float on a long sine. It never spins.

**Nodes.** Instanced spheres would look generic, so each node is a small **rounded square plate** (an instanced `RoundedBox` geometry, 0.28 units) seen slightly in 3/4 view. It reads like a component in a builder canvas.
- *Pending* nodes are an `ink-850` fill with a `line-strong` edge.
- *Completed* nodes are a dark `#2a2a2e` fill with an `fg`-60% outline and no glow. *(Revised in Stage 2: a 60% `fg` fill made completed plates read as heavy grey blocks.)*
- *Running* nodes are `signal`, with a small additive bloom sprite at 0.35 opacity.
- *Awaiting approval* nodes have a `signal` edge and a hollow fill. The halo breathes at 0.5Hz. A mono tag `awaiting approval · 00:00:03` ticks next to the node, then the node turns *running*.

**Edges.** Thin 1px lines (`line-strong`, 30% opacity), drawn as gentle bezier curves rather than straight segments. They are **typed**: a tiny mono port label sits at each edge's midpoint (`Text`, `JSON<schema>`, `Artifact<csv>`), shown only on hover of a connected node to keep the scene quiet.

**The run (≈ 9 s loop, then a 2 s rest).**
1. A single `signal` pulse, a short comet with a 0.12-unit tail, travels each edge in ~450ms using `ease-in-out`.
2. At the parallel node the pulse **splits into three** and the branches finish at slightly different times. The merge node waits until all three arrive, with a visible "2/3 → 3/3" tick.
3. At the approval node, the run **pauses** for ~1.8s with the breathing halo, then resumes.
4. The retry node fails once: its outline flashes `fg` with a mono tag `attempt 1 failed · retrying`, then a second attempt succeeds. This is the only failure shown. *(Implemented as a tag, not a dashed stroke, which instanced meshes can't draw per node.)* The only dashed element is the router's skipped branch.
5. When the run completes, all nodes settle to *completed*, a mono `run_7f3a… completed · 16/16 nodes` line appears in the hero corner, and the run restarts with a new run ID.

**Texture overlay (DOM, not WebGL).**
- A mono run log in the bottom-left corner, 3 lines at most and fading. Example: `12:04:31.207  node.started  router`.
- A coordinate readout in the top-right corner.
- These use real-looking formats with obviously illustrative values, and none of them claim to be metrics.

**Interaction**
- *Cursor parallax:* the camera offsets by up to ±0.3 units, damped at 0.08.
- *Hover:* the node's edge brightens and a mono label appears (`agent`, `router`, `approval`, `retry`, `merge`, …) with its type.
- *Scroll:* across the first 100vh the camera dollies back from z = 6 to z = 11, the graph's opacity eases to 35%, and it shifts right. It ends up as a calm backdrop behind the headline, which keeps its full contrast on a `ink-950` → transparent scrim.

**Implementation notes (Stage 2)**
- Labels and tags are DOM overlays positioned by projecting world points each frame. drei is not used, which keeps it out of the bundle.
- Hover is a per-frame raycast against the instanced plates, using a window pointer listener (the canvas takes no pointer events).
- Tone mapping is off (`flat`), so the palette renders exactly (`#FFB547` measures 254/181/71).
- **Graph region (revised after the 1024px review).** The graph is framed into a real layout region above the eyebrow, in columns 4–12. The region is at least 170px tall (120px on mobile, 140px on viewports under 820px tall) and grows on tall screens. The camera distance and view offset are computed from the measured region, so the graph can never sit under the copy at any width. On scroll the camera dollies back (×1.45) and the view offset relaxes toward the hero centre, so the graph settles behind the headline as it fades to 35%. The scroll fade is CSS opacity, so it applies to the SVG too.
- The headline uses all 12 columns below 1280px, so it holds two lines at 1024px.
- The static SVG uses the same fitted bounds (`BOUNDS` / `FIT` in graph-data.ts) with `preserveAspectRatio="meet"`, so it frames exactly like the camera and the crossfade is seamless.

**Performance contract**
- The canvas is loaded with `next/dynamic` (`ssr:false`) after first paint.
- Node plates are one `InstancedMesh`, edges are one merged `LineSegments`, and pulses are one instanced point set.
- DPR is `[1, 2]`. Off-screen, `frameloop="demand"` is set and IntersectionObserver pauses it.
- **Fallback.** A static SVG of the same graph mid-run is served when `prefers-reduced-motion` is set, on coarse-pointer or small (<768px) viewports, or when `navigator.hardwareConcurrency ≤ 4` or WebGL is unavailable. It shows the approval node glowing and one branch lit. The SVG is also the SSR placeholder, so there is no blank-hero flash.

## 7. Architecture diagram (case study §04)

The diagram is an SVG with five horizontal tiers: Clients, API, State, Execution and Effects. Tier labels sit in the left label column in mono. Nodes are `radius-md` rects with a `line` border. The authoritative store (PostgreSQL) gets a `signal` edge because it is the source of truth. The rest stay neutral.
- **Flow.** On entering view, a request packet travels Client → FastAPI → PostgreSQL. The `run id` hops to Redis → worker. The worker fans out to providers, tools and the sandbox, and results write back to PostgreSQL. Each hop labels itself with the existing connector text ("runs and events persisted; run id enqueued", and so on).
- Under reduced motion the full path is drawn statically.
- On mobile the tiers stack vertically and the packet travels downward.

### Implementation notes (Stage 3)
- The diagram is an SVG generated from the content layer.
  - **Wide (≥768px):** tiers are rows and hops are straight lines. Connector captions are right-aligned so they never sit under a hop line.
  - **Narrow:** nodes are stacked, and hops run along a left rail.
  - **The packet's path:** Web UI → FastAPI → PostgreSQL → Redis → Celery workers. It then fans out to the three effects, and the outcome returns to PostgreSQL along a dashed line.
  - **Step captions** reuse the case study's connector text and decision titles.
  - **Pause/play:** the button satisfies WCAG 2.2.2. The animation also pauses off-screen. Under reduced motion it shows the full path statically, with no packet.
  - **Screen readers:** a visually hidden list carries every tier, node and connector.
- **Decisions** are native `<details>` cards: number, title and a `+` that rotates to `×`. The body shows *Decision* and *Trade-off* side by side, with an amber rule on the trade-off. They work without JavaScript.
- **Evidence:** tables at ≥640px. Below that, the benchmarks become one card per row (n / P50 / P95 in mono), with the source line kept. The verification table stays a table because it has two columns.
- **Progress nav:** sticky. It highlights the section under a reading line 35% down the viewport (`aria-current`) and fills an amber progress rule.

## 8. Voice in the UI

The copy comes verbatim from the current site. UI chrome (labels, loader, log lines) is terse and lowercase in mono, like system output. It contains no exclamation marks, no buzzwords and no invented numbers.
