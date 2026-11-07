// Isocline architecture as an exploded concept stack. Units: arbitrary model mm.
self.DrawingModels ??= {};
self.DrawingModels['isocline-stack'] = (parameters, options) => {
  const G = TechnicalGeometry;
  const gap = parameters.gap;
  if (!Number.isFinite(gap) || gap < 0 || gap > 30) throw Error('Tier gap must be 0–30');

  const T = 7;            // slab thickness
  const LEVEL = T + 1;    // assembled tier pitch (≈ a tenth of a thickness between tiers)
  const parts = [];
  const slab = (id, name, tier, x0, y0, x1, y1, h = T) => {
    const p = G.part(id, name);
    const z = (4 - tier) * LEVEL;          // tier 0 (Clients) on top
    G.box(p, [x0, y0, z], [x1, y1, z + h], {radius: 2.5});
    p.explosion = [0, 0, (4 - tier) * (gap + 18)];
    parts.push(p);
    return {p, z};
  };

  // Clients
  const ui = slab('web-ui', 'Web UI (Next.js builder)', 0, -60, -30, 8, 30);
  {
    // Three canvas nodes as raised studs, joined by edge lines on the top face.
    const top = ui.z + T;
    const nodes = [[-46, -12], [-26, 10], [-6, -12]];
    for (const [x, y] of nodes) {
      const s = G.piece();
      G.box(s, [x - 6, y - 5, top - 0.2], [x + 6, y + 5, top + 2.2], {radius: 1.5});
      G.merge(ui.p, s);
    }
    G.line(ui.p, [-40, -12, top + 0.05], [-32, 10, top + 0.05], 'detail');
    G.line(ui.p, [-20, 10, top + 0.05], [-12, -12, top + 0.05], 'detail');
  }
  slab('sdk-cli', 'SDK / CLI / HTTP', 0, 14, -30, 60, 30);

  // API
  slab('fastapi', 'FastAPI (compiler, contracts)', 1, -60, -30, 60, 30);

  // State
  {
    const pg = G.part('postgres', 'PostgreSQL + pgvector');
    const z = 2 * LEVEL;
    G.lathe(pg, [[0, 0], [0, 24], [T + 6, 24], [T + 6, 0]], {axis: 'z', at: [-26, 0, z]});
    G.circle(pg, [-26, 0, z + (T + 6) / 2], 24.02, [0, 0, 1], {role: 'detail'});
    pg.explosion = [0, 0, 2 * (gap + 18)];
    parts.push(pg);
  }
  slab('redis', 'Redis (queue, live events)', 2, 14, -22, 60, 22);

  // Execution
  {
    const w = G.part('workers', 'Celery workers');
    const z = 1 * LEVEL;
    for (const x of [-58, -36, -14]) {
      const s = G.piece();
      G.box(s, [x, -30, z], [x + 18, 30, z + T], {radius: 2});
      G.merge(w, s);
    }
    w.explosion = [0, 0, 1 * (gap + 18)];
    parts.push(w);
  }
  slab('beat', 'Beat (sweeper, waits, schedules)', 3, 14, -30, 60, 30);

  // Effects
  slab('models', 'Model providers', 4, -60, -30, -22, 30);
  slab('tools', 'Tools / MCP servers', 4, -18, -30, 20, 30);
  {
    // Python sandbox: an open-topped container (walls around a floor).
    const sb = G.part('sandbox', 'Python sandbox');
    const z = 0;
    const ring = (w, h, r, zz) => G.roundedRing(w, h, r, {angles: G.ringAngles(36, 60, 3), z: zz});
    const cx = 42, cy = 0;
    const shift = pts => pts.map(([x, y, zz]) => [x + cx, y + cy, zz]);
    G.loft(sb, [
      shift(ring(36, 60, 3, z)),
      shift(ring(36, 60, 3, z + T + 3)),
      shift(ring(30, 54, 1.5, z + T + 3)),
      shift(ring(30, 54, 1.5, z + 2)),
    ], {cyclic: false, lines: 'ends'});
    sb.explosion = [0, 0, 0];
    parts.push(sb);
  }

  return TechnicalProjection.render(parts, {...options, camera: {azimuth: -118, elevation: 28, roll: 0}});
};
