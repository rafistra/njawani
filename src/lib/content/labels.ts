/**
 * Label domain bahasa Indonesia untuk tipe konten (AGENTS.md §91).
 * Dipakai eyebrow, breadcrumb, dan filter UI.
 */
import type { EntryType } from "./types";

export const TYPE_LABELS: Record<EntryType, string> = {
  topic: "Konsep",
  term: "Istilah",
  tradition: "Tradisi",
  person: "Tokoh",
  work: "Karya",
  artifact: "Objek & Seni",
  region: "Daerah",
  module: "Modul",
  exploration: "Eksplorasi",
  article: "Cerita",
  source: "Sumber",
};

export function capitalize(text: string): string {
  return text.length > 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/** Konteks singkat Topic Link: "Istilah · Bahasa" (design.md §33). */
export function entryContext(entry: { type: EntryType; themes: string[] }): string {
  const typeLabel = TYPE_LABELS[entry.type];
  const theme = entry.themes[0];
  return theme ? `${typeLabel} · ${capitalize(theme)}` : typeLabel;
}
