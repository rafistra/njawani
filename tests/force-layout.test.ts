import { describe, expect, it } from "vitest";

import { computeForceLayout } from "../src/lib/graph/force-layout";

const CANVAS = { width: 800, height: 480 };

function sampleNodes() {
  return [
    { id: "pusat", radius: 56 },
    { id: "a", radius: 46 },
    { id: "b", radius: 46 },
    { id: "c", radius: 46 },
  ];
}

function sampleLinks() {
  return [
    { source: "pusat", target: "a" },
    { source: "pusat", target: "b" },
    { source: "pusat", target: "c" },
  ];
}

describe("force layout", () => {
  it("deterministik: input dan seed sama menghasilkan posisi sama", () => {
    const options = { nodes: sampleNodes(), links: sampleLinks(), ...CANVAS, centerId: "pusat", seed: 7 };
    expect(computeForceLayout(options)).toEqual(computeForceLayout(options));
  });

  it("tidak memutasi input pemanggil", () => {
    const links = sampleLinks();
    computeForceLayout({ nodes: sampleNodes(), links, ...CANVAS, centerId: "pusat", seed: 7 });
    expect(links[0].source).toBe("pusat");
    expect(links[0].target).toBe("a");
  });

  it("node pusat dipatok di tengah kanvas", () => {
    const positions = computeForceLayout({
      nodes: sampleNodes(),
      links: sampleLinks(),
      ...CANVAS,
      centerId: "pusat",
      seed: 7,
    });
    expect(positions.get("pusat")).toEqual({ x: 400, y: 240 });
  });

  it("semua node berada dalam batas kanvas dengan padding radius", () => {
    const positions = computeForceLayout({
      nodes: sampleNodes(),
      links: sampleLinks(),
      ...CANVAS,
      centerId: "pusat",
      seed: 7,
    });
    const eps = 1e-9;
    for (const [id, position] of positions) {
      const radius = id === "pusat" ? 56 : 46;
      expect(position.x).toBeGreaterThanOrEqual(radius + 8 - eps);
      expect(position.x).toBeLessThanOrEqual(CANVAS.width - radius - 8 + eps);
      expect(position.y).toBeGreaterThanOrEqual(radius + 8 - eps);
      expect(position.y).toBeLessThanOrEqual(CANVAS.height - radius - 8 + eps);
    }
  });

  it("melewatkan link yang menunjuk node di luar set tanpa error", () => {
    const positions = computeForceLayout({
      nodes: sampleNodes(),
      links: [...sampleLinks(), { source: "pusat", target: "hantu" }],
      ...CANVAS,
      centerId: "pusat",
      seed: 7,
    });
    expect(positions.size).toBe(sampleNodes().length);
    expect(positions.has("hantu")).toBe(false);
  });
});
