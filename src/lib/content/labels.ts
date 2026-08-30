/**
 * Label domain bahasa Indonesia untuk tipe konten (AGENTS.md §91).
 * Dipakai eyebrow, breadcrumb, dan filter UI.
 */
import type { CollectionSection, EntryType } from "./types";

export const TYPE_LABELS: Record<EntryType, string> = {
  topic: "Konsep",
  term: "Istilah",
  tradition: "Tradisi",
  person: "Tokoh",
  work: "Karya",
  artifact: "Objek & Seni",
  collection: "Rupa-rupa",
  region: "Daerah",
  module: "Modul",
  exploration: "Eksplorasi",
  article: "Cerita",
  source: "Sumber",
};

/** Label kelompok Rupa-rupa Kawruh (struktur A–D) untuk halaman induk dan Context Rail. */
export const SECTION_LABELS: Record<CollectionSection, string> = {
  tetawuhan: "Tetawuhan",
  kewan: "Kewan",
  manungsa: "Manungsa",
  "kawruh-liya-liya": "Kawruh Liya-Liya",
};

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"] as const;

/**
 * "2026-08-31" → "31 Agu 2026" — tanggal pemeriksaan editorial ditampilkan
 * lengkap dengan format Indonesia.
 */
export function formatReviewDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const month = MONTHS_ID[Number(match[2]) - 1];
  return month ? `${Number(match[3])} ${month} ${match[1]}` : isoDate;
}

export function capitalize(text: string): string {
  return text.length > 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/** Konteks singkat Topic Link: "Istilah · Bahasa" (design.md §33). */
export function entryContext(entry: { type: EntryType; themes: string[] }): string {
  const typeLabel = TYPE_LABELS[entry.type];
  const theme = entry.themes[0];
  return theme ? `${typeLabel} · ${capitalize(theme)}` : typeLabel;
}
