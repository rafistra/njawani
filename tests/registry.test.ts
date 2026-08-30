import { describe, expect, it } from "vitest";

import { createRegistry, type RawContentEntry } from "../src/lib/content/registry";

function knowledgeEntry(id: string, overrides: Record<string, unknown> = {}): RawContentEntry {
  return {
    collection: "topics",
    id,
    data: {
      type: "topic",
      title: id,
      short_definition: `Definisi ${id}`,
      status: "draft",
      sources: ["sumber-1"],
      ...overrides,
    },
  };
}

function sourceEntry(id: string): RawContentEntry {
  return { collection: "sources", id, data: { type: "source", title: `Sumber ${id}` } };
}

describe("createRegistry", () => {
  it("menormalkan field frontmatter menjadi ContentObject dengan default yang benar", () => {
    const registry = createRegistry([
      knowledgeEntry("tepa-slira", {
        aliases: ["tepa selira"],
        themes: ["etika"],
        relations: [{ type: "related_to", target: "unggah-ungguh" }],
      }),
      knowledgeEntry("unggah-ungguh", { status: "published", regions: ["yogyakarta"] }),
      sourceEntry("sumber-1"),
    ]);

    const entry = registry.getEntry("tepa-slira");
    expect(entry).toBeDefined();
    expect(entry?.slug).toBe("tepa-slira");
    expect(entry?.aliases).toEqual(["tepa selira"]);
    expect(entry?.status).toBe("draft");
    expect(entry?.reviewed).toBeUndefined();
    expect(entry?.demo).toBe(false);
    expect(entry?.searchTerms).toEqual([]);
    expect(entry?.relations).toEqual([{ type: "related_to", target: "unggah-ungguh" }]);
    expect(entry?.extra).toEqual({});

    const source = registry.getSource("sumber-1");
    expect(source?.title).toBe("Sumber sumber-1");
    expect(source?.author).toBeUndefined();
  });

  it("getByType, getByRegion, dan getPublished memfilter dengan benar", () => {
    const registry = createRegistry([
      knowledgeEntry("topik-a", { status: "published" }),
      knowledgeEntry("topik-b", { status: "draft" }),
      { collection: "terms", id: "istilah-c", data: { type: "term", title: "Istilah C", short_definition: "x", status: "published", regions: ["banyumas"] } },
      sourceEntry("sumber-1"),
    ]);

    expect(registry.getByType("topic").map((entry) => entry.id)).toEqual(["topik-a", "topik-b"]);
    expect(registry.getByRegion("banyumas").map((entry) => entry.id)).toEqual(["istilah-c"]);
    expect(registry.getPublished().map((entry) => entry.id)).toEqual(["topik-a", "istilah-c"]);
  });

  it("melempar error untuk duplicate global ID lintas koleksi", () => {
    expect(() =>
      createRegistry([
        knowledgeEntry("ganda"),
        { collection: "terms", id: "ganda", data: { type: "term", title: "Ganda", short_definition: "x" } },
      ]),
    ).toThrow(/\[registry\] Duplicate global ID 'ganda'/);
  });

  it("melempar error untuk tipe atau status yang tidak dikenal", () => {
    expect(() => createRegistry([knowledgeEntry("rusak", { type: "makhluk" })])).toThrow(/tipe 'makhluk' tidak dikenal/);
    expect(() => createRegistry([knowledgeEntry("rusak", { status: "hilang" })])).toThrow(/status 'hilang' tidak dikenal/);
  });

  it("menormalkan section untuk tipe collection dan menolak section tak dikenal", () => {
    const registry = createRegistry([
      {
        collection: "collections",
        id: "arane-kembang",
        data: {
          type: "collection",
          title: "Arane Kembang",
          short_definition: "Daftar nama bunga.",
          section: "tetawuhan",
          status: "review",
          reviewed: "2026-08-31",
          sources: ["sumber-1"],
        },
      },
      sourceEntry("sumber-1"),
    ]);

    const entry = registry.getEntry("arane-kembang");
    expect(entry?.section).toBe("tetawuhan");
    expect(entry?.type).toBe("collection");
    expect(entry?.reviewed).toBe("2026-08-31");

    expect(() =>
      createRegistry([
        {
          collection: "collections",
          id: "rusak",
          data: { type: "collection", title: "Rusak", short_definition: "x", section: "dongeng" },
        },
      ]),
    ).toThrow(/section 'dongeng' tidak dikenal/);
  });
});
