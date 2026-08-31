/**
 * Knowledge Explorer island (PRD §24, design.md §58): satu node pusat +
 * tetangga dengan force layout deterministik. Klik tetangga = re-center,
 * node pusat = link ke halaman kanonik. Tanpa JS, markup hasil SSR tetap
 * menampilkan graph dan daftar link sebagai fallback (AGENTS.md §8).
 * Layout dan data ada di src/lib (AGENTS.md §49) — island hanya merender.
 */
import { useMemo, useState } from "react";

import { computeForceLayout } from "../../lib/graph/force-layout";
import type { ExplorerEdge, ExplorerGraph, ExplorerNode } from "../../lib/relations/explorer";
import "./KnowledgeGraph.css";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 480;
const CENTER_RADIUS = 56;
const NEIGHBOR_RADIUS = 46;

interface Props {
  graph: ExplorerGraph;
}

const percent = (value: number, total: number) => (value / total) * 100;

export default function KnowledgeGraph({ graph }: Props) {
  const [centerId, setCenterId] = useState(graph.centerId);
  const [activeId, setActiveId] = useState<string | null>(null);

  const titleOf = useMemo(() => {
    const titles = new Map(graph.nodes.map((node) => [node.id, node.title]));
    return (id: string) => titles.get(id) ?? id;
  }, [graph]);

  // Index kejadian edge per node untuk pencarian tetangga dan label relasi.
  const incidentEdges = useMemo(() => {
    const map = new Map<string, ExplorerEdge[]>();
    const add = (id: string, edge: ExplorerEdge) => {
      const list = map.get(id);
      if (list) list.push(edge);
      else map.set(id, [edge]);
    };
    for (const edge of graph.edges) {
      add(edge.source, edge);
      add(edge.target, edge);
    }
    return map;
  }, [graph]);

  const { center, neighbors, visibleEdges } = useMemo(() => {
    const centerNode = graph.nodes.find((node) => node.id === centerId) ?? graph.nodes[0];
    if (!centerNode) return { center: undefined, neighbors: [] as ExplorerNode[], visibleEdges: [] as ExplorerEdge[] };

    const incident = incidentEdges.get(centerNode.id) ?? [];
    const neighborIds = new Set<string>();
    for (const edge of incident) {
      neighborIds.add(edge.source === centerNode.id ? edge.target : edge.source);
    }
    const neighborNodes = graph.nodes
      .filter((node) => neighborIds.has(node.id))
      .sort((a, b) => a.title.localeCompare(b.title, "id"));

    const visibleIds = new Set<string>([centerNode.id, ...neighborIds]);
    const edges = graph.edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));
    return { center: centerNode, neighbors: neighborNodes, visibleEdges: edges };
  }, [graph, incidentEdges, centerId]);

  const positions = useMemo(() => {
    if (!center) return undefined;
    return computeForceLayout({
      nodes: [
        { id: center.id, radius: CENTER_RADIUS },
        ...neighbors.map((node) => ({ id: node.id, radius: NEIGHBOR_RADIUS })),
      ],
      links: visibleEdges.map((edge) => ({ source: edge.source, target: edge.target })),
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      centerId: center.id,
    });
  }, [center, neighbors, visibleEdges]);

  if (!center || !positions) return null;

  // Relasi pusat → node aktif untuk baris konteks (§45: hover memberi makna).
  const activeRelation = activeId
    ? (incidentEdges.get(center.id) ?? []).find(
        (edge) =>
          (edge.source === center.id && edge.target === activeId) ||
          (edge.target === center.id && edge.source === activeId),
      )
    : undefined;

  const relationTo = (otherId: string) =>
    (incidentEdges.get(center.id) ?? []).find(
      (edge) =>
        (edge.source === center.id && edge.target === otherId) ||
        (edge.target === center.id && edge.source === otherId),
    );

  const contextText = activeRelation && activeId
    ? `${titleOf(activeRelation.source)} → ${activeRelation.label.toLowerCase()} → ${titleOf(activeRelation.target)}`
    : `${center.title} terhubung dengan ${neighbors.length} pengetahuan lain.`;

  const centerPosition = positions.get(center.id);
  if (!centerPosition) return null;

  return (
    <figure className="kg">
      <div
        className="kg-canvas"
        role="group"
        aria-label={`Peta relasi: ${center.title} dan ${neighbors.length} pengetahuan terkait`}
      >
        <svg
          className="kg-edges"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {visibleEdges.map((edge) => {
            const from = positions.get(edge.source);
            const to = positions.get(edge.target);
            if (!from || !to) return null;
            const direct = edge.source === center.id || edge.target === center.id;
            return (
              <line
                key={`${edge.source}:${edge.target}:${edge.label}`}
                className={direct ? "kg-edge kg-edge-direct" : "kg-edge"}
                x1={percent(from.x, CANVAS_WIDTH)}
                y1={percent(from.y, CANVAS_HEIGHT)}
                x2={percent(to.x, CANVAS_WIDTH)}
                y2={percent(to.y, CANVAS_HEIGHT)}
              />
            );
          })}
        </svg>

        {center.href ? (
          <a
            className="kg-node kg-node-center"
            style={{ left: `${percent(centerPosition.x, CANVAS_WIDTH)}%`, top: `${percent(centerPosition.y, CANVAS_HEIGHT)}%` }}
            href={center.href}
            title={`${center.typeLabel}: ${center.title}`}
          >
            {center.title}
          </a>
        ) : (
          <div
            className="kg-node kg-node-center"
            style={{ left: `${percent(centerPosition.x, CANVAS_WIDTH)}%`, top: `${percent(centerPosition.y, CANVAS_HEIGHT)}%` }}
            title={`${center.typeLabel}: ${center.title}`}
          >
            {center.title}
          </div>
        )}

        {neighbors.map((node) => {
          const position = positions.get(node.id);
          if (!position) return null;
          const style = {
            left: `${percent(position.x, CANVAS_WIDTH)}%`,
            top: `${percent(position.y, CANVAS_HEIGHT)}%`,
          };
          return (
            <button
              key={node.id}
              type="button"
              className="kg-node kg-node-neighbor"
              style={style}
              onClick={() => setCenterId(node.id)}
              onMouseEnter={() => setActiveId(node.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(node.id)}
              onBlur={() => setActiveId(null)}
              title={`${node.typeLabel} — klik untuk menjadikan pusat jelajah`}
            >
              {node.title}
            </button>
          );
        })}
      </div>

      <figcaption>
        <p className="kg-context" aria-live="polite">
          {contextText}
        </p>
      </figcaption>

      <ul className="kg-list" aria-label={`Pengetahuan terkait ${center.title}`}>
        {neighbors.map((node) => {
          const relation = relationTo(node.id);
          // Label dibaca dari sudut pandang pusat: relasi keluar memakai label,
          // relasi masuk memakai label inverse-nya.
          const directionLabel = relation
            ? relation.source === center.id
              ? relation.label
              : relation.inverseLabel
            : node.typeLabel;
          return (
            <li key={node.id}>
              <span className="kg-list-label">{directionLabel}</span>
              {node.href ? <a href={node.href}>{node.title}</a> : <span>{node.title}</span>}
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
