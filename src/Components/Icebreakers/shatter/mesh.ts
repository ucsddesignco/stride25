import type { Vec2, Triangle, Group, Params } from './types';

// Generate a jittered grid with optional overscan so shards extend beyond the view
export const generatePoints = (cols: number, rows: number, overscan: number = 0.15): Vec2[] => {
  const pts: Vec2[] = [];
  const cellW = (1 + 2 * overscan) / cols;
  const cellH = (1 + 2 * overscan) / rows;
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const u = i * cellW - overscan; // range [-overscan, 1+overscan]
      const v = j * cellH - overscan; // range [-overscan, 1+overscan]
      const jitter = 0.5;
      const ju = (Math.random() - 0.5) * cellW * jitter;
      const jv = (Math.random() - 0.5) * cellH * jitter;
      pts.push({ x: u + ju, y: v + jv });
    }
  }
  return pts;
};

export const buildMesh = (
  cols: number,
  rows: number,
  layerCount: number,
  params: Params
): { triangles: Triangle[]; groups: Group[] } => {
  // Slight overscan to avoid visible gaps at the edges after cropping
  const pts = generatePoints(cols, rows, 0.18);
  const idx = (i: number, j: number) => j * (cols + 1) + i;

  const triangles: Triangle[] = [];
  const groupsBuilt: Group[] = [];
  let globalGroupId = 0;

  for (let layer = 0; layer < layerCount; layer++) {
    const groups: { id: number; cells: { i: number; j: number }[] }[] = [];
    let gid = 0;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let sx = Math.random() < 0.6 ? 2 : 1;
        let sy = Math.random() < 0.6 ? 2 : 1;
        if (i + sx > cols) sx = 1;
        if (j + sy > rows) sy = 1;
        const cells: { i: number; j: number }[] = [];
        for (let y = 0; y < sy; y++) {
          for (let x = 0; x < sx; x++) {
            cells.push({ i: i + x, j: j + y });
          }
        }
        groups.push({ id: gid++, cells });
        i += sx - 1;
      }
    }

    const groupVerts: { id: number; verts: Vec2[]; uv: Vec2[] }[] = groups.map((g) => ({ id: g.id, verts: [], uv: [] }));

    for (const g of groups) {
      for (const c of g.cells) {
        const p00 = pts[idx(c.i, c.j)];
        const p10 = pts[idx(c.i + 1, c.j)];
        const p01 = pts[idx(c.i, c.j + 1)];
        const p11 = pts[idx(c.i + 1, c.j + 1)];
        const diag = Math.random() > 0.5;
        const triDefs = diag
          ? [
              { a: p00, b: p10, c: p11, au: p00, bu: p10, cu: p11 },
              { a: p00, b: p11, c: p01, au: p00, bu: p11, cu: p01 },
            ]
          : [
              { a: p00, b: p10, c: p01, au: p00, bu: p10, cu: p01 },
              { a: p10, b: p11, c: p01, au: p10, bu: p11, cu: p01 },
            ];
        for (const t of triDefs) {
          groupVerts[g.id].verts.push(
            { x: (t.a.x - 0.5) * 2, y: (0.5 - t.a.y) * 2 },
            { x: (t.b.x - 0.5) * 2, y: (0.5 - t.b.y) * 2 },
            { x: (t.c.x - 0.5) * 2, y: (0.5 - t.c.y) * 2 }
          );
          groupVerts[g.id].uv.push(t.a, t.b, t.c);
          triangles.push({
            a: { x: 0, y: 0 },
            b: { x: 0, y: 0 },
            c: { x: 0, y: 0 },
            au: t.au,
            bu: t.bu,
            cu: t.cu,
            groupId: globalGroupId + g.id,
          });
        }
      }
    }

    for (const gv of groupVerts) {
      if (gv.verts.length === 0) continue;
      let cx = 0, cy = 0;
      for (const v of gv.verts) { cx += v.x; cy += v.y; }
      cx /= gv.verts.length; cy /= gv.verts.length;
      let ux = 0, uy = 0;
      for (const u of gv.uv) { ux += u.x; uy += u.y; }
      ux /= gv.uv.length; uy /= gv.uv.length;
      const mass = Math.max(0.001, gv.verts.length / 3 * 0.002);

      const colorShift = 0.5;
      const roughness = 0.3;
      const reflectivity = 0.4;
      const materialType = 0.5;

      const depth = (layer * params.layerSpacing) - (layerCount - 1) * params.layerSpacing / 2;
      const initialBrightness = layer === 0 ? 1.0 : 0.3;

      groupsBuilt.push({
        id: globalGroupId + gv.id,
        pos: { x: cx, y: cy },
        vel: { x: 0, y: 0 },
        ang: 0,
        angVel: 0,
        mass,
        uvCentroid: { x: ux, y: uy },
        colorShift,
        roughness,
        reflectivity,
        materialType,
        layerId: layer,
        depth,
        isActive: true,
        isShattered: false,
        originalPos: { x: cx, y: cy },
        age: 0,
        brightness: initialBrightness
      });
    }

    let cursor = triangles.length - (groups.reduce((acc, g) => acc + g.cells.length * 2, 0));
    for (const g of groups) {
      const grp = groupsBuilt.find((gg) => gg.id === globalGroupId + g.id)!;
      for (const c of g.cells) {
        const p00 = pts[idx(c.i, c.j)];
        const p10 = pts[idx(c.i + 1, c.j)];
        const p01 = pts[idx(c.i, c.j + 1)];
        const p11 = pts[idx(c.i + 1, c.j + 1)];
        const diag = Math.random() > 0.5;
        const triSets = diag ? [[p00, p10, p11], [p00, p11, p01]] : [[p00, p10, p01], [p10, p11, p01]];
        for (const tv of triSets) {
          const toClip = (p: Vec2): Vec2 => ({ x: (p.x - 0.5) * 2, y: (0.5 - p.y) * 2 });
          const va = toClip(tv[0]);
          const vb = toClip(tv[1]);
          const vc = toClip(tv[2]);
          triangles[cursor].a = { x: va.x - grp.pos.x, y: va.y - grp.pos.y };
          triangles[cursor].b = { x: vb.x - grp.pos.x, y: vb.y - grp.pos.y };
          triangles[cursor].c = { x: vc.x - grp.pos.x, y: vc.y - grp.pos.y };
          cursor++;
        }
      }
    }

    globalGroupId += groups.length;
  }

  return { triangles, groups: groupsBuilt };
};


