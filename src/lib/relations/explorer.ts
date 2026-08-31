/**
 * Neighborhood builder untuk Knowledge Explorer (design.md §58): satu entri
 * pusat + tetangga 1-hop (peringkat getRelatedContent) + tetangga 2-hop sebagai
 * bahan re-center. Hasilnya payload JSON kecil untuk island — bukan seluruh
 * graph (AGENTS.md §50, §74). Hanya entri published & non-demo yang disertakan
 * (AGENTS.md §65, §93), sehingga tidak ada node tanpa halaman publik.
 */
import { getRelationType } from "../../data/relation-types/relation-types";
import { TYPE_LABELS } from "../content/labels";
import type { ContentRegistry } from "../content/registry";
import { resolveEntryRoute } from "../content/routes";
import type { ContentObject } from "../content/types";
import { getRelations, type RelationGraph } from "./engine";
import { getRelatedContent } from "./related";

export interface ExplorerNode {
  id: string;
  title: string;
  /** Label tipe Indonesia ("Istilah") untuk konteks UI (AGENTS.md §91). */
  typeLabel: string;
  /** URL kanonik; null untuk tipe tanpa halaman publik. */
  href: string | null;
  aksara?: string;
}

export interface ExplorerEdge {
  source: string;
  target: string;
  /** Label relation Indonesia dari registry ("Bagian dari"). */
  label: string;
  /** Label untuk arah sebaliknya ("Mencakup") — UI memilih sesuai sudut pandang pusat. */
  inverseLabel: string;
}

export interface ExplorerGraph {
  centerId: string;
  nodes: ExplorerNode[];
  edges: ExplorerEdge[];
}

export interface ExplorerOptions {
  /** Tetangga langsung yang disertakan (design.md §58: 5–8). */
  maxFirstHop?: number;
  /** Tetangga tingkat dua per tetangga langsung — bahan re-center. */
  maxSecondHop?: number;
  /** Batas keras jumlah node payload (AGENTS.md §74). */
  maxNodes?: number;
}

const DEFAULT_OPTIONS: Required<ExplorerOptions> = {
  maxFirstHop: 8,
  maxSecondHop: 5,
  maxNodes: 48,
};

/**
 * Tetangga langsung (relation resolved, termasuk inverse) yang boleh tampil:
 * published, non-demo, dan bukan dirinya sendiri — urutan engine.
 */
function directNeighborIds(graph: RelationGraph, registry: ContentRegistry, id: string): string[] {
  const ids: string[] = [];
  for (const relation of getRelations(graph, id)) {
    if (relation.target === id) continue;
    const entry = registry.getEntry(relation.target);
    if (!entry || entry.status !== "published" || entry.demo) continue;
    ids.push(relation.target);
  }
  return ids;
}

/**
 * Urutan tetangga terkurasi: peringkat getRelatedContent lebih dulu, sisanya
 * mengikuti urutan relation engine — deterministik untuk payload dan test.
 */
function rankNeighbors(
  graph: RelationGraph,
  registry: ContentRegistry,
  id: string,
  limit: number,
): string[] {
  const direct = directNeighborIds(graph, registry, id);
  if (direct.length === 0 || limit <= 0) return [];
  const ranked = new Set(
    getRelatedContent(graph, registry, id, direct.length)
      .map((item) => item.entry.id)
      .filter((candidateId) => direct.includes(candidateId)),
  );
  const ordered: string[] = [];
  for (const candidateId of [...ranked, ...direct]) {
    if (ordered.length >= limit) break;
    if (!ordered.includes(candidateId)) ordered.push(candidateId);
  }
  return ordered;
}

export function buildExplorerNeighborhood(
  graph: RelationGraph,
  registry: ContentRegistry,
  centerId: string,
  options: ExplorerOptions = {},
): ExplorerGraph | null {
  const center = registry.getEntry(centerId);
  if (!center || center.status !== "published" || center.demo) return null;

  const { maxFirstHop, maxSecondHop, maxNodes } = { ...DEFAULT_OPTIONS, ...options };

  const toNode = (entry: ContentObject): ExplorerNode => ({
    id: entry.id,
    title: entry.title,
    typeLabel: TYPE_LABELS[entry.type],
    href: resolveEntryRoute(entry),
    ...(entry.aksara ? { aksara: entry.aksara } : {}),
  });

  const nodes = new Map<string, ExplorerNode>();
  nodes.set(center.id, toNode(center));

  const firstHopIds = rankNeighbors(graph, registry, center.id, maxFirstHop);
  for (const id of firstHopIds) {
    const entry = registry.getEntry(id);
    if (entry) nodes.set(id, toNode(entry));
  }

  for (const id of firstHopIds) {
    for (const secondId of rankNeighbors(graph, registry, id, maxSecondHop)) {
      if (nodes.size >= maxNodes) break;
      if (nodes.has(secondId)) continue;
      const entry = registry.getEntry(secondId);
      if (entry) nodes.set(secondId, toNode(entry));
    }
    if (nodes.size >= maxNodes) break;
  }

  // Semua relation antar node yang terserialisasi; pasangan dua arah hasil
  // inverse (AGENTS.md §24) ditampilkan sekali — satu relation, satu edge.
  const edges: ExplorerEdge[] = [];
  const seen = new Set<string>();
  for (const id of nodes.keys()) {
    for (const relation of getRelations(graph, id)) {
      if (!nodes.has(relation.target)) continue;
      const def = getRelationType(relation.type);
      if (!def) continue;
      const forward = `${id}\u0000${relation.target}\u0000${relation.type}`;
      const backward = `${relation.target}\u0000${id}\u0000${def.inverse}`;
      if (seen.has(forward) || seen.has(backward)) continue;
      seen.add(forward);
      edges.push({ source: id, target: relation.target, label: def.label, inverseLabel: def.inverseLabel });
    }
  }

  const sortedIds = [...nodes.keys()].sort((a, b) => a.localeCompare(b, "id"));
  edges.sort((a, b) => a.source.localeCompare(b.source, "id") || a.target.localeCompare(b.target, "id"));

  const nodeList: ExplorerNode[] = [];
  for (const id of sortedIds) {
    const node = nodes.get(id);
    if (node) nodeList.push(node);
  }

  return { centerId: center.id, nodes: nodeList, edges };
}
