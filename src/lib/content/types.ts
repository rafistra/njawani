/**
 * Domain types konten Njawani — sumber istilah domain (AGENTS.md §90).
 * Tipe mengikuti koleksi PRD §13; status mengikuti alur editorial PRD §25.
 */

/** Semua tipe konten; masing-masing punya koleksi folder di src/content (PRD §13). */
export const ENTRY_TYPES = [
  "topic",
  "term",
  "tradition",
  "region",
  "person",
  "work",
  "artifact",
  "article",
  "module",
  "exploration",
  "source",
] as const;

export type EntryType = (typeof ENTRY_TYPES)[number];

/** Tipe dengan halaman kanonik di bawah /kawruh/ (PRD §17.2). */
export const KNOWLEDGE_TYPES = [
  "topic",
  "term",
  "tradition",
  "person",
  "work",
  "artifact",
] as const;

export type KnowledgeType = (typeof KNOWLEDGE_TYPES)[number];

/** Alur status editorial (PRD §25): Draft → Review → Verified → Published → Needs Review. */
export const CONTENT_STATUSES = [
  "draft",
  "review",
  "verified",
  "published",
  "needs_review",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

/** Relation seperti ditulis editor di frontmatter — selalu satu arah (AGENTS.md §24). */
export interface AuthoredRelation {
  type: string;
  target: string;
  note?: string;
}

/** Relation hasil resolusi engine; `derived: true` berarti dihasilkan sistem, bukan ditulis editor. */
export interface ResolvedRelation {
  source: string;
  type: string;
  target: string;
  note?: string;
  derived: boolean;
}

/** Knowledge object hasil normalisasi registry (PRD §15.1) — UI tidak membaca Markdown langsung. */
export interface ContentObject {
  id: string;
  type: EntryType;
  /** Nama koleksi asal, mis. "topics" — untuk diagnostik, bukan untuk URL. */
  collection: string;
  title: string;
  /** Slug URL publik; default = id (PRD §15.3: ID dan slug adalah dua konsep berbeda). */
  slug: string;
  /** Bentuk Aksara Jawa dari judul, bila relevan dan benar (design.md §18). */
  aksara?: string;
  shortDefinition?: string;
  aliases: string[];
  searchTerms: string[];
  themes: string[];
  /** Referensi ID entri bertipe region. */
  regionIds: string[];
  relations: AuthoredRelation[];
  /** Referensi ID object sumber (koleksi sources). */
  sourceIds: string[];
  status: ContentStatus;
  /** Entri demo/fixture untuk pengujian pipeline — tidak pernah dipublikasikan (AGENTS.md §93). */
  demo: boolean;
  /** Field spesifik type yang tidak dinormalisasi eksplisit (mis. reading_time, period). */
  extra: Record<string, unknown>;
}

/** Object sumber pustaka — reusable, tidak punya halaman publik (PRD §17, AGENTS.md §66). */
export interface SourceObject {
  id: string;
  type: "source";
  title: string;
  author?: string;
  year?: string;
  publisher?: string;
  url?: string;
  note?: string;
}
