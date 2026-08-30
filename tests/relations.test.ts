import { describe, expect, it } from "vitest";

import { createRegistry, type RawContentEntry } from "../src/lib/content/registry";
import { buildRelationGraph, getRelations } from "../src/lib/relations/engine";
import { validateRegistry } from "../src/lib/validation/semantic";
import { validateRawContent } from "../src/lib/validation/validate";

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
  ];
}

describe("relation engine", () => {
  it("menghasilkan inverse relation otomatis dengan flag derived", () => {
    const registry = createRegistry(fixture());
    const graph = buildRelationGraph(registry);

    const unggahRelations = getRelations(graph, "unggah-ungguh");
    const containsEdges = unggahRelations.filter((relation) => relation.type === "contains");
    expect(containsEdges.map((relation) => relation.target).sort()).toEqual(["krama", "ngoko"]);
    expect(containsEdges.every((relation) => relation.derived)).toBe(true);

    const ngokoRelations = getRelations(graph, "ngoko");
    expect(ngokoRelations).toContainEqual({
      source: "ngoko",
      type: "part_of",
      target: "unggah-ungguh",
      derived: false,
    });
    expect(ngokoRelations).toContainEqual({
      source: "ngoko",
      type: "informal_equivalent_of",
      target: "krama",
      derived: true,
    });
  });

  it("relation symmetric menghasilkan edge dua arah", () => {
    const raw = [
      ...fixture(),
      {
        collection: "terms",
        id: "satu",
        data: {
          type: "term",
          title: "Satu",
          short_definition: "x",
          status: "published",
          sources: ["sumber-1"],
          relations: [{ type: "related_to", target: "ngoko" }],
        },
      },
    ] as RawContentEntry[];

    const graph = buildRelationGraph(createRegistry(raw));
    expect(getRelations(graph, "ngoko")).toContainEqual(
      expect.objectContaining({ type: "related_to", target: "satu", derived: true }),
    );
  });
});

describe("validasi semantik", () => {
  it("lolos untuk fixture yang sehat", () => {
    const errors = validateRegistry(createRegistry(fixture())).filter((issue) => issue.severity === "error");
    expect(errors).toEqual([]);
  });

  it("menandai relation putus dengan saran did-you-mean", () => {
    const raw = fixture();
    raw[2].data.relations = [{ type: "part_of", target: "ungah-ungguh" }];
    const issues = validateRegistry(createRegistry(raw));

    const broken = issues.find((issue) => issue.code === "broken-relation");
    expect(broken?.severity).toBe("error");
    expect(broken?.message).toContain("ungah-ungguh");
    expect(broken?.message).toContain("unggah-ungguh");
  });

  it("menolak relation type, self relation, duplikat, dan published→draft", () => {
    const base = fixture();
    const raw: RawContentEntry[] = [
      ...base,
      {
        collection: "topics",
        id: "bermasalah",
        data: {
          type: "topic",
          title: "Bermasalah",
          short_definition: "x",
          status: "published",
          sources: ["sumber-1"],
          demo: false,
          relations: [
            { type: "bukan_tipe", target: "ngoko" },
            { type: "related_to", target: "bermasalah" },
            { type: "related_to", target: "ngoko" },
            { type: "related_to", target: "ngoko" },
            { type: "related_to", target: "unggah-ungguh" },
          ],
        },
      },
      {
        collection: "topics",
        id: "draf-tujuan",
        data: { type: "topic", title: "Draf", short_definition: "x", status: "draft" },
      },
      {
        collection: "topics",
        id: "publik-ke-draf",
        data: {
          type: "topic",
          title: "Publik ke Draf",
          short_definition: "x",
          status: "published",
          sources: ["sumber-1"],
          relations: [{ type: "related_to", target: "draf-tujuan" }],
        },
      },
    ];

    const codes = validateRegistry(createRegistry(raw)).map((issue) => issue.code);
    expect(codes).toContain("unknown-relation-type");
    expect(codes).toContain("self-relation");
    expect(codes).toContain("duplicate-relation");
    expect(codes).toContain("published-to-draft");
  });

  it("memvalidasi kompatibilitas tipe relation dan region/sumber rusak", () => {
    const raw: RawContentEntry[] = [
      ...fixture(),
      {
        collection: "terms",
        id: "salah-tulis",
        data: {
          type: "term",
          title: "Salah Tulis",
          short_definition: "x",
          status: "published",
          sources: ["tidak-ada"],
          regions: ["bukan-region"],
          relations: [{ type: "written_by", target: "ngoko" }],
        },
      },
    ];

    const codes = validateRegistry(createRegistry(raw)).map((issue) => issue.code);
    expect(codes).toContain("relation-type-mismatch");
    expect(codes).toContain("broken-source");
    expect(codes).toContain("broken-region");
  });

  it("menolak entri kanonik published tanpa sumber dan cycle hierarki", () => {
    const raw: RawContentEntry[] = [
      ...fixture(),
      {
        collection: "topics",
        id: "tanpa-sumber",
        data: { type: "topic", title: "Tanpa Sumber", short_definition: "x", status: "published", sources: [] },
      },
      {
        collection: "topics",
        id: "lingkar-a",
        data: {
          type: "topic",
          title: "A",
          short_definition: "x",
          status: "published",
          sources: ["sumber-1"],
          relations: [{ type: "part_of", target: "lingkar-b" }],
        },
      },
      {
        collection: "topics",
        id: "lingkar-b",
        data: {
          type: "topic",
          title: "B",
          short_definition: "x",
          status: "published",
          sources: ["sumber-1"],
          relations: [{ type: "part_of", target: "lingkar-a" }],
        },
      },
    ];

    const codes = validateRegistry(createRegistry(raw)).map((issue) => issue.code);
    expect(codes).toContain("missing-source");
    expect(codes).toContain("hierarchy-cycle");
  });

  it("menandai route collision dan orphan sebagai error/warning", () => {
    const raw: RawContentEntry[] = [
      ...fixture(),
      {
        collection: "topics",
        id: "jalan-a",
        data: { type: "topic", title: "A", short_definition: "x", status: "published", sources: ["sumber-1"], slug: "sama" },
      },
      {
        collection: "terms",
        id: "jalan-b",
        data: { type: "term", title: "B", short_definition: "x", status: "published", sources: ["sumber-1"], slug: "sama" },
      },
      {
        collection: "topics",
        id: "sunyi",
        data: { type: "topic", title: "Sunyi", short_definition: "x", status: "published", sources: ["sumber-1"] },
      },
    ];

    const issues = validateRegistry(createRegistry(raw));
    expect(issues.find((issue) => issue.code === "route-collision")?.severity).toBe("error");
    expect(issues.find((issue) => issue.code === "orphan-entry")?.severity).toBe("warning");
  });

  it("validateRawContent menjalankan schema sebelum semantik", () => {
    const issues = validateRawContent([
      {
        collection: "topics",
        id: "invalid",
        data: { type: "topic", title: "", short_definition: "" },
      },
    ]);

    expect(issues.some((issue) => issue.code === "schema-invalid")).toBe(true);
  });
});
