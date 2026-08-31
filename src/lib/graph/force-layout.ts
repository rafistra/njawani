/**
 * Force layout deterministik untuk Knowledge Explorer (design.md §58).
 * d3-force hanya menghitung posisi — rendering tetap SVG/CSS (AGENTS.md §49).
 * Simulasi dijalankan sampai konvergen lalu berhenti, tanpa loop animasi
 * (AGENTS.md §44); posisi awal ber-jitter ber-seed agar hasil build-time
 * (SSR) dan client identik (AGENTS.md §86).
 */
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";

export interface LayoutInputNode {
  id: string;
  radius: number;
}

export interface LayoutInputLink {
  source: string;
  target: string;
}

export interface LayoutPosition {
  x: number;
  y: number;
}

export interface ForceLayoutOptions {
  nodes: LayoutInputNode[];
  links: LayoutInputLink[];
  width: number;
  height: number;
  /** Node yang dipatok di tengah kanvas (fx/fy). */
  centerId?: string;
  /** Seed PRNG — input dan seed sama menghasilkan layout sama. */
  seed?: number;
  /** Jumlah iterasi simulasi sinkron. */
  ticks?: number;
}

interface SimNode extends SimulationNodeDatum {
  id: string;
  radius: number;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
}

/** PRNG mulberry32 — kecil dan deterministik, cukup untuk penempatan awal. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Jarak minimum node dari tepi kanvas. */
const EDGE_PADDING = 8;

/** Jarak istirahat antar node yang terhubung. */
const LINK_DISTANCE = 180;

export function computeForceLayout(options: ForceLayoutOptions): Map<string, LayoutPosition> {
  const { nodes, links, width, height, centerId, seed = 1, ticks = 300 } = options;
  const random = seededRandom(seed);

  const cx = width / 2;
  const cy = height / 2;

  // Posisi awal radial dengan jitter ber-seed — simulasi hanya menyempurnakan,
  // sehingga hasil tidak bergantung pada kondisi internal d3-force.
  const simNodes: SimNode[] = nodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / nodes.length - Math.PI / 2;
    return {
      ...node,
      x: cx + width * 0.36 * Math.cos(angle) + (random() - 0.5) * 12,
      y: cy + height * 0.36 * Math.sin(angle) + (random() - 0.5) * 12,
    };
  });

  const centerNode = centerId ? simNodes.find((node) => node.id === centerId) : undefined;
  if (centerNode) {
    centerNode.fx = cx;
    centerNode.fy = cy;
  }

  // forceLink memutasi objek link (source/target menjadi node) — pakai salinan
  // agar input pemanggil tidak berubah, dan link yang menunjuk node di luar
  // set dibuang agar tidak menghasilkan NaN.
  const knownIds = new Set(simNodes.map((node) => node.id));
  const simLinks: SimLink[] = links
    .filter((link) => knownIds.has(link.source) && knownIds.has(link.target))
    .map((link) => ({ source: link.source, target: link.target }));

  const simulation = forceSimulation<SimNode>(simNodes)
    .randomSource(random)
    .force(
      "link",
      forceLink<SimNode, SimLink>(simLinks)
        .id((node) => node.id)
        .distance(LINK_DISTANCE)
        .strength(0.7),
    )
    .force("charge", forceManyBody<SimNode>().strength(-320))
    .force("collide", forceCollide<SimNode>((node) => node.radius + 10))
    .force("x", forceX<SimNode>(cx).strength(0.04))
    .force("y", forceY<SimNode>(cy).strength(0.08))
    .stop();

  for (let i = 0; i < ticks; i += 1) simulation.tick();

  const positions = new Map<string, LayoutPosition>();
  for (const node of simNodes) {
    positions.set(node.id, {
      x: clamp(node.x ?? cx, node.radius + EDGE_PADDING, width - node.radius - EDGE_PADDING),
      y: clamp(node.y ?? cy, node.radius + EDGE_PADDING, height - node.radius - EDGE_PADDING),
    });
  }
  return positions;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
