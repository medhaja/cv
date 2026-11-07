# Isocline, layer by layer: evidence

Concept sheet. Nothing here is a physical object or a measured dimension; each architectural component
of Isocline becomes one part so the exploded stack shows how the tiers sit on each other.
Intended use: an illustration on the portfolio's Isocline section and case study, rendered at ~1200 px wide,
plus the standalone viewer page with SVG / PNG / PDF downloads.

| Feature group | Evidence | Source | How it is drawn |
| --- | --- | --- | --- |
| Tier order: Clients, API, State, Execution, Effects | Supplied | `content/site.ts` caseStudy architecture tiers | Five stacked levels, exploded along +Z, Clients on top |
| Web UI, SDK / CLI / HTTP | Supplied | same, Clients tier | Two slabs; the Web UI carries a three-node canvas as raised studs |
| FastAPI (compiler, contracts, preflight) | Supplied | same, API tier | One wide slab |
| PostgreSQL + pgvector (authoritative) | Supplied | same, State tier, `key: true` | A cylinder (database), filled amber as the key part |
| Redis (disposable) | Supplied | same, State tier | A small slab beside the database |
| Celery workers, Beat | Supplied | same, Execution tier | Three identical worker blocks merged into one part; one block for Beat |
| Model providers, Tools / MCP, Python sandbox | Supplied | same, Effects tier | Three slabs; the sandbox is drawn as an open-topped container |
| Sizes, gaps, proportions | Illustrative | none | Invented to read clearly; the sheet is labeled as a concept |

## Rebuild and proof

```sh
node tools/teardown/scripts/build-viewer.cjs drawing.json dist/index.html
node tools/teardown/scripts/check-viewer.cjs dist/index.html check/
node render-svg.cjs            # static SVG for the website
```
