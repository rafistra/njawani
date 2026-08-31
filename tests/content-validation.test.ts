/**
 * Validasi seluruh konten nyata di src/content: schema + semantik.
 * Jalur CI — referensi rusak terdeteksi bahkan sebelum ada halaman konsumen.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

import { COLLECTION_NAMES, SCHEMAS_BY_COLLECTION } from "../src/lib/validation/schemas";
import { formatIssues } from "../src/lib/validation/errors";
import { validateRawContent } from "../src/lib/validation/validate";
import type { RawContentEntry } from "../src/lib/content/registry";

const contentRoot = fileURLToPath(new URL("../src/content", import.meta.url));

function collectEntries(): RawContentEntry[] {
  const entries: RawContentEntry[] = [];
  for (const collection of readdirSync(contentRoot)) {
    const collectionPath = join(contentRoot, collection);
    for (const file of readdirSync(collectionPath)) {
      if (!file.endsWith(".md")) continue;
      const { data } = matter(readFileSync(join(collectionPath, file), "utf-8"));
      entries.push({
        collection,
        id: typeof data.id === "string" ? data.id : `(tanpa-id) ${collection}/${file}`,
        data,
      });
    }
  }
  return entries;
}

describe("konten nyata di src/content", () => {
  const entries = collectEntries();

  it("semua folder konten dikenali sebagai koleksi valid", () => {
    const folders = readdirSync(contentRoot).filter((name) => !name.startsWith("."));
    for (const folder of folders) {
      expect(COLLECTION_NAMES).toContain(folder);
    }
  });

  it("schema dan validasi semantik lolos tanpa error", () => {
    const issues = validateRawContent(entries);
    const errors = issues.filter((issue) => issue.severity === "error");
    expect(errors, `Konten invalid:\n${formatIssues(errors)}`).toEqual([]);
  });

  it("slendro dan pelog tersedia sebagai istilah terbit", () => {
    const entriesById = new Map(entries.map((entry) => [entry.id, entry]));

    for (const id of ["slendro", "pelog"]) {
      expect(entriesById.get(id)).toMatchObject({
        collection: "terms",
        data: { type: "term", status: "published" },
      });
    }
  });

  it("klaster macapat dan Serat Wedhatama tersedia sebagai konten terbit", () => {
    const entriesById = new Map(entries.map((entry) => [entry.id, entry]));

    expect(entriesById.get("macapat")).toMatchObject({
      collection: "topics",
      data: { type: "topic", status: "published" },
    });
    expect(entriesById.get("serat-wedhatama")).toMatchObject({
      collection: "works",
      data: { type: "work", status: "published" },
    });
    expect(entriesById.get("mangkunegara-iv")).toMatchObject({
      collection: "persons",
      data: { type: "person", status: "published" },
    });
  });
});

describe("schemas per koleksi", () => {
  it("menolak ID yang bukan kebab-case", () => {
    const result = SCHEMAS_BY_COLLECTION.topics.safeParse({
      id: "Bukan Kebab!",
      type: "topic",
      title: "X",
      short_definition: "x",
    });
    expect(result.success).toBe(false);
  });
});
