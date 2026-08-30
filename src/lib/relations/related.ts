/**
 * Related content ranking (PRD §20.7): relevance + diversity.
 * Relation langsung diberi bobot per kelompok; tetangga tingkat dua
 * memberi skor kecil sebagai penemuan rabbit hole (PRD §20.8).
 * Bukan random recommendation.
 */
import { getRelationType } from "../../data/relation-types/relation-types";
import type { ContentRegistry } from "../content/registry";
import type { ContentObject } from "../content/types";
import { getRelations, type RelationGraph } from "./engine";

const GROUP_WEIGHTS: Record<string, number> = {
  hierarchical: 3,
  language: 3,
  spatial: 2.5,
  cultural: 2,
  "person-work": 2,
  contextual: 1.5,
};

/** Tidak semua relasi dari kelompok yang sama — diversity cap (PRD §20.7). */
const MAX_PER_GROUP = 2;

export interface RelatedItem {
  entry: ContentObject;
  score: number;
  /** Kelompok relation paling kuat yang menghubungkan — untuk label UI. */
  via: string;
}

export function getRelatedContent(
  graph: RelationGraph,
  registry: ContentRegistry,
  entryId: string,
  limit = 4,
): RelatedItem[] {
  const direct = getRelations(graph, entryId).filter((relation) => relation.target !== entryId);

  const scores = new Map<string, { score: number; via: string }>();
  const bump = (id: string, amount: number, via: string) => {
    const current = scores.get(id);
    if (!current || current.score < amount) {
      scores.set(id, { score: amount, via });
    } else {
      current.score += amount * 0.25;
    }
  };

  for (const relation of direct) {
    const def = getRelationType(relation.type);
    if (!def) continue;
    const weight = GROUP_WEIGHTS[def.group] ?? 1.5;
    // Relation yang ditulis editor sedikit lebih kuat daripada inverse hasil generate.
    const authoredBonus = relation.derived ? 0 : 0.25;
    bump(relation.target, weight + authoredBonus, def.label);
  }

  // Tingkat dua: tetangga dari tetangga — jalan masuk rabbit hole.
  for (const relation of direct) {
    const def = getRelationType(relation.type);
    if (!def) continue;
    const weight = (GROUP_WEIGHTS[def.group] ?? 1.5) * 0.3;
    for (const second of getRelations(graph, relation.target)) {
      if (second.target === entryId) continue;
      bump(second.target, weight, "Penemuan terkait");
    }
  }

  const candidates: RelatedItem[] = [];
  for (const [id, { score, via }] of scores) {
    const entry = registry.getEntry(id);
    if (!entry || entry.status !== "published" || entry.demo) continue;
    candidates.push({ entry, score, via });
  }

  candidates.sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id));

  // Terapkan diversity cap per kelompok relation.
  const perGroup = new Map<string, number>();
  const result: RelatedItem[] = [];
  for (const candidate of candidates) {
    if (result.length >= limit) break;
    const group = (perGroup.get(candidate.via) ?? 0) + 1;
    if (group > MAX_PER_GROUP) continue;
    perGroup.set(candidate.via, group);
    result.push(candidate);
  }

  // Isi sisa slot jika diversity cap membuat hasil kurang.
  if (result.length < limit) {
    for (const candidate of candidates) {
      if (result.length >= limit) break;
      if (!result.some((item) => item.entry.id === candidate.entry.id)) result.push(candidate);
    }
  }

  return result.slice(0, limit);
}
