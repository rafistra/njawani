/**
 * Content registry (PRD §15.1): semua entri dinormalisasi menjadi object
 * internal. UI tidak membaca Markdown/frontmatter secara langsung.
 */
import {
  CONTENT_STATUSES,
  ENTRY_TYPES,
  type AuthoredRelation,
  type ContentObject,
  type ContentStatus,
  type EntryType,
  type SourceObject,
} from "./types";

/** Bentuk mentah entri sebelum normalisasi — dari Astro collection atau dari test fixture. */
export interface RawContentEntry {
  collection: string;
  /** Stable ID global (PRD §15.2) — bukan slug, bukan path file. */
  id: string;
  data: Record<string, unknown>;
  body?: string;
}

export interface ContentRegistry {
  getAll(): ContentObject[];
  getEntry(id: string): ContentObject | undefined;
  getByType(type: EntryType): ContentObject[];
  getByRegion(regionId: string): ContentObject[];
  /** Hanya entri published — satu-satunya yang boleh tampil di produksi (AGENTS.md §65). */
  getPublished(): ContentObject[];
  getSources(): SourceObject[];
  getSource(id: string): SourceObject | undefined;
  hasEntry(id: string): boolean;
}

const KNOWN_KEYS = new Set([
  "id",
  "type",
  "title",
  "slug",
  "aksara",
  "short_definition",
  "aliases",
  "search_terms",
  "themes",
  "regions",
  "relations",
  "sources",
  "status",
  "demo",
  "catatan_rasa",
  "mitos_konteks",
  "steps",
]);

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizeRelations(value: unknown): AuthoredRelation[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const relation = (item ?? {}) as Record<string, unknown>;
    return {
      type: asString(relation.type) ?? "",
      target: asString(relation.target) ?? "",
      note: asString(relation.note),
    };
  });
}

function extractExtras(data: Record<string, unknown>): Record<string, unknown> {
  const extras: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!KNOWN_KEYS.has(key)) extras[key] = value;
  }
  return extras;
}

function normalizeStatus(value: unknown, id: string): ContentStatus {
  const status = asString(value) ?? "draft";
  if (!(CONTENT_STATUSES as readonly string[]).includes(status)) {
    throw new Error(
      `[registry] '${id}': status '${status}' tidak dikenal. Status valid: ${CONTENT_STATUSES.join(", ")}.`,
    );
  }
  return status as ContentStatus;
}

function normalizeMitosKonteks(value: unknown): ContentObject["mitosKonteks"] {
  if (typeof value !== "object" || value === null) return undefined;
  const data = value as Record<string, unknown>;
  const kepercayaanPopuler = asString(data.kepercayaan_populer);
  const konteks = asString(data.konteks);
  if (!kepercayaanPopuler || !konteks) return undefined;
  return { kepercayaanPopuler, konteks, catatan: asString(data.catatan) };
}

function normalizeSteps(value: unknown): ContentObject["steps"] {
  if (!Array.isArray(value)) return undefined;
  const steps = value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      title: asString(item.title) ?? "",
      text: asString(item.text),
      target: asString(item.target),
    }))
    .filter((step) => step.title.length > 0);
  return steps.length > 0 ? steps : undefined;
}

function normalizeEntry(raw: RawContentEntry): ContentObject {
  const { data } = raw;
  const type = asString(data.type);
  if (!type || !(ENTRY_TYPES as readonly string[]).includes(type)) {
    throw new Error(
      `[registry] '${raw.id}': tipe '${type ?? "(kosong)"}' tidak dikenal. Tipe valid: ${ENTRY_TYPES.join(", ")}.`,
    );
  }

  return {
    id: raw.id,
    type: type as EntryType,
    collection: raw.collection,
    title: asString(data.title) ?? raw.id,
    slug: asString(data.slug) ?? raw.id,
    aksara: asString(data.aksara),
    shortDefinition: asString(data.short_definition),
    aliases: toStringArray(data.aliases),
    searchTerms: toStringArray(data.search_terms),
    themes: toStringArray(data.themes),
    regionIds: toStringArray(data.regions),
    relations: normalizeRelations(data.relations),
    sourceIds: toStringArray(data.sources),
    status: normalizeStatus(data.status, raw.id),
    demo: data.demo === true,
    catatanRasa: asString(data.catatan_rasa),
    mitosKonteks: normalizeMitosKonteks(data.mitos_konteks),
    steps: normalizeSteps(data.steps),
    extra: extractExtras(data),
  };
}

function normalizeSource(raw: RawContentEntry): SourceObject {
  const { data } = raw;
  return {
    id: raw.id,
    type: "source",
    title: asString(data.title) ?? raw.id,
    author: asString(data.author),
    year: asString(data.year),
    publisher: asString(data.publisher),
    url: asString(data.url),
    note: asString(data.note),
  };
}

/**
 * Membangun registry dari entri mentah. Duplicate global ID langsung
 * dilempar — ID wajib unik di seluruh Njawani (PRD §15.2, AGENTS.md §27).
 */
export function createRegistry(rawEntries: RawContentEntry[]): ContentRegistry {
  const entries = new Map<string, ContentObject>();
  const sources = new Map<string, SourceObject>();

  for (const raw of rawEntries) {
    const type = asString(raw.data.type);
    if (type === "source") {
      if (sources.has(raw.id)) {
        throw new Error(`[registry] Duplicate global ID '${raw.id}' pada koleksi sources.`);
      }
      sources.set(raw.id, normalizeSource(raw));
      continue;
    }

    if (entries.has(raw.id)) {
      throw new Error(
        `[registry] Duplicate global ID '${raw.id}' — ID wajib unik di seluruh Njawani (PRD §15.2).`,
      );
    }
    entries.set(raw.id, normalizeEntry(raw));
  }

  const all = [...entries.values()];

  return {
    getAll: () => [...all],
    getEntry: (id) => entries.get(id),
    getByType: (type) => all.filter((entry) => entry.type === type),
    getByRegion: (regionId) => all.filter((entry) => entry.regionIds.includes(regionId)),
    getPublished: () => all.filter((entry) => entry.status === "published"),
    getSources: () => [...sources.values()],
    getSource: (id) => sources.get(id),
    hasEntry: (id) => entries.has(id) || sources.has(id),
  };
}
