/**
 * Patches Infographic1.json so each bar row is independently sized
 * by its own 0–100 value.  All coloured segments within a bar scale
 * proportionally (their relative widths are preserved).
 *
 * Precomp layer order (pairs: mask, content):
 *   layers[0]+[1] = Bar 4  →  bar4
 *   layers[2]+[3] = Bar 3  →  bar3
 *   layers[4]+[5] = Bar 2  →  bar2
 *   layers[6]+[7] = Bar 1  →  bar1
 *
 * @param data  Cloned Lottie JSON (mutated in place)
 * @param bar1  Height growth   (0–100)
 * @param bar2  Data freshness  (0–100)
 * @param bar3  Height scale    (0–100)
 * @param bar4  Pulse / activity(0–100)
 */
export function patchBlockHeightLottie(
  data: Record<string, unknown>,
  bar1: number,
  bar2: number,
  bar3: number,
  bar4: number
): void {
  const assets = data.assets as Array<{
    layers: Array<Record<string, unknown>>;
  }>;
  const layers = assets[0].layers;

  /* ── 1. Set every mask's trim-end to 100 % ─────────────────────────── */

  const setTrimEnd = (layer: Record<string, unknown>, value: number) => {
    const shapes = (layer as any).shapes as Array<{ it: unknown[] }>;
    const it = shapes?.[0]?.it;
    if (!Array.isArray(it)) return;
    const trim = it.find(
      (item) => (item as Record<string, unknown>).ty === "tm"
    );
    if (trim && typeof trim === "object") {
      (trim as any).e = { a: 0, k: value, ix: 2 };
    }
  };

  setTrimEnd(layers[0], 100); // Bar 4 mask
  setTrimEnd(layers[2], 100); // Bar 3 mask
  setTrimEnd(layers[4], 100); // Bar 2 mask
  setTrimEnd(layers[6], 100); // Bar 1 mask

  /* ── 2. Scale segments per bar row ─────────────────────────────────── */

  const barEntries: Array<[number, number]> = [
    [1, bar4], // Bar 4 content layer
    [3, bar3], // Bar 3 content layer
    [5, bar2], // Bar 2 content layer
    [7, bar1], // Bar 1 content layer
  ];

  for (const [idx, value] of barEntries) {
    const layer = layers[idx] as any;
    const items = layer.shapes[0].it as Array<Record<string, unknown>>;
    const scale = value / 100;

    interface Seg {
      sub: Record<string, unknown>[];
      halfW: number;
      cx: number;
      cy: number;
    }
    const segs: Seg[] = [];

    for (const item of items) {
      if ((item as any).ty !== "gr") continue;
      const sub = (item as any).it as Record<string, unknown>[];
      const sh = sub.find((s: any) => s.ty === "sh") as any;
      const tr = sub.find((s: any) => s.ty === "tr") as any;
      if (!sh || !tr) continue;

      segs.push({
        sub,
        halfW: Math.abs(sh.ks.k.v[0][0]),
        cx: tr.p.k[0] as number,
        cy: tr.p.k[1] as number,
      });
    }

    segs.sort((a, b) => a.cx - b.cx);

    let x = segs[0].cx - segs[0].halfW; // anchor at original left edge

    for (const s of segs) {
      const newHalf = s.halfW * scale;

      const sh = s.sub.find((i: any) => i.ty === "sh") as any;
      const tr = s.sub.find((i: any) => i.ty === "tr") as any;

      const h = Math.abs(sh.ks.k.v[0][1]);
      sh.ks.k.v = [
        [newHalf, h],
        [-newHalf, h],
        [-newHalf, -h],
        [newHalf, -h],
      ];

      tr.p.k = [x + newHalf, s.cy];

      x += newHalf * 2;
    }
  }

  /* ── 3. Freeze precomp at frame 0 ──────────────────────────────────── */

  const mainLayers = data.layers as Array<Record<string, unknown>>;
  mainLayers[0].tm = { a: 0, k: 0, ix: 2 };
}
