import { describe, expect, it } from "vitest";

import { createRegistry, type RawContentEntry } from "../src/lib/content/registry";
import { buildRelationGraph } from "../src/lib/relations/engine";
import { buildExplorerNeighborhood } from "../src/lib/relations/explorer";

function fixture(): RawContentEntry[] {
  return [
    { collection: "sources", id: "sumber-1", data: { type: "source", title: "Sumber" } },
    {
      collection: "topics",
      id: "unggah-ungguh",
      data: { type: "topic", title: "Unggah-Ungguh", short_definition: "x", status: "published", sources: ["sumber-1"] },
    },
    {
      collection: "terms",
      id: "ngoko",
      data: {
        type: "term",
        title: "Ngoko",
        short_definition: "x",
        status: "published",
        sources: ["sumber-1"],
        relations: [{ type: "part_of", target: "unggah-ungguh" }],
      },
    },
    {
      collection: "terms",
      id: "krama",
      data: {
        type: "term",
        title: "Krama",
        short_definition: "x",
        status: "published",
        sources: ["sumber-1"],
        relations: [
          { type: "part_of", target: "unggah-ungguh" },
          { type: "formal_equivalent_of", target: "ngoko" },
        ],
      },
    },
    {
      collection: "terms",
      id: "krama-inggil",
      data: {
        type: "term",
        title: "Krama Inggil",
        short_definition: "x",
        status: "published",
        sources: ["sumber-1"],
        relations: [{ type: "variant_of", target: "krama" }],
      },
    },
  ];
}

function build(raw: RawContentEntry[], centerId = "unggah-ungguh") {
  const registry = createRegistry(raw);
  const graph = buildRelationGraph(registry);
  return { registry, result: buildExplorerNeighborhood(graph, registry, centerId) };
}

describe("explorer neighborhood", () => {
  it("menyertakan pusat, tetangga 1-hop, dan tetangga 2-hop", () => {
    const { result } = build(fixture());
    expect(result).not.toBeNull();
    const ids = result!.nodes.map((node) => node.id);
    expect(result!.centerId).toBe("unggah-ungguh");
    expect(ids).toContain("ngoko");
    expect(ids).toContain("krama");
    // Krama Inggil hanya terhubung ke Krama — masuk sebagai bahan re-center.
    expect(ids).toContain("krama-inggil");
  });

  it("menyaring entri draft dan demo (AGENTS.md §65, §93)", () => {
    const raw: RawContentEntry[] = [
      ...fixture(),
      {
        collection: "topics",
        id: "draf-terkait",
        data: {
          type: "topic",
          title: "Draf Terkait",
          short_definition: "x",
          status: "draft",
          relations: [{ type: "related_to", target: "unggah-ungguh" }],
        },
      },
      {
        collection: "topics",
        id: "demo-entri",
        data: {
          type: "topic",
          title: "Demo Entri",
          short_definition: "x",
          status: "published",
          demo: true,
          relations: [{ type: "related_to", target: "unggah-ungguh" }],
        },
      },
    ];
    const { result } = build(raw);
    const ids = result!.nodes.map((node) => node.id);
    expect(ids).not.toContain("draf-terkait");
    expect(ids).not.toContain("demo-entri");
    expect(
      result!.edges.some((edge) => edge.source === "demo-entri" || edge.target === "demo-entri"),
    ).toBe(false);
  });

  it("menampilkan pasangan inverse dua arah sekali dengan label registry", () => {
    const { result } = build(fixture());
    const pairEdges = result!.edges.filter(
      (edge) =>
        (edge.source === "unggah-ungguh" && edge.target === "ngoko") ||
        (edge.source === "ngoko" && edge.target === "unggah-ungguh"),
    );
    expect(pairEdges).toHaveLength(1);
    expect(["Bagian dari", "Mencakup"]).toContain(pairEdges[0].label);
    // Dua label arah tersedia agar UI bisa memilih sudut pandang pusat.
    expect(pairEdges[0].inverseLabel).toBeTruthy();
    expect(pairEdges[0].inverseLabel).not.toBe(pairEdges[0].label);
  });

  it("menghormati batas tetangga 1-hop (design.md §58: 5–8)", () => {
    const raw = [...fixture()];
    for (let i = 1; i <= 12; i += 1) {
      raw.push({
        collection: "terms",
        id: `tetangga-${i}`,
        data: {
          type: "term",
          title: `Tetangga ${i}`,
          short_definition: "x",
          status: "published",
          sources: ["sumber-1"],
          relations: [{ type: "related_to", target: "unggah-ungguh" }],
        },
      });
    }
    const { result } = build(raw);
    const incident = result!.edges.filter(
      (edge) => edge.source === "unggah-ungguh" || edge.target === "unggah-ungguh",
    );
    expect(incident).toHaveLength(8);
    // 1 pusat + 8 tetangga 1-hop; Krama membawa Krama Inggil sebagai 2-hop.
    expect(result!.nodes).toHaveLength(10);
    expect(result!.nodes.map((node) => node.id)).toContain("krama-inggil");
  });

  it("pusat tidak dikenal atau draft mengembalikan null", () => {
    const raw: RawContentEntry[] = [
      ...fixture(),
      {
        collection: "topics",
        id: "pusat-draf",
        data: { type: "topic", title: "Pusat Draf", short_definition: "x", status: "draft" },
      },
    ];
    const { registry, result } = build(raw);
    expect(result).not.toBeNull();
    expect(buildExplorerNeighborhood(buildRelationGraph(registry), registry, "tidak-ada")).toBeNull();
    expect(buildExplorerNeighborhood(buildRelationGraph(registry), registry, "pusat-draf")).toBeNull();
  });

  it("hasil plain JSON — aman dikirim sebagai props island (AGENTS.md §50)", () => {
    const { result } = build(fixture());
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    expect(result!.nodes.every((node) => node.href?.includes("/kawruh/"))).toBe(true);
  });
});
