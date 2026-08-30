/**
 * Generator geometri peta budaya (satu perintah, dijalankan manual).
 *
 * Sumber: Natural Earth 10m land (domain publik / Unlicense),
 * https://github.com/nvkelso/natural-earth-vector — garis pantai nyata
 * untuk Jawa + Madura, diproyeksi dan disederhanakan untuk SVG statis.
 *
 * Pemakaian:
 *   curl -sL -o .tmp-ne-land.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson
 *   node scripts/generate-map-data.mjs [--inspect]
 *
 * Output: konstanta path untuk src/data/regions/map.ts.
 * Tanpa dependency — hanya modul bawaan Node (AGENTS.md §59).
 */

import { readFileSync } from "node:fs";

const SOURCE = process.env.NE_SOURCE ?? ".tmp-ne-land.geojson";

// ---- Proyeksi: plate carrée lokal, lat0 sebagai acuan skala ---------------
const LON0 = 104.95;
const LAT_TOP = -5.8;
const LAT0 = -7.4;
const PX_PER_DEG = 98.7;
const OX = 20;
const OY = 18;
const COS0 = Math.cos((LAT0 * Math.PI) / 180);

function project([lon, lat]) {
  return [(lon - LON0) * COS0 * PX_PER_DEG + OX, (LAT_TOP - lat) * PX_PER_DEG + OY];
}

// ---- Douglas–Peucker --------------------------------------------------------
function perpDist(p, a, b) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  const [cx, cy] = [a[0] + t * dx, a[1] + t * dy];
  return Math.hypot(p[0] - cx, p[1] - cy);
}

function simplify(points, tolerance) {
  if (points.length <= 4) return points;
  let maxDist = 0;
  let index = 0;
  const first = points[0];
  const last = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDist(points[i], first, last);
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }
  if (maxDist <= tolerance) return [first, last];
  const left = simplify(points.slice(0, index + 1), tolerance);
  const right = simplify(points.slice(index), tolerance);
  return [...left.slice(0, -1), ...right];
}

// ---- Muat & pilih poligon ----------------------------------------------------
const geojson = JSON.parse(readFileSync(SOURCE, "utf8"));

const BOX = { lonMin: 105.0, lonMax: 114.65, latMin: -8.95, latMax: -5.95 };
const KM2PX = PX_PER_DEG / 111.32;

function polygonRings(polygon) {
  return polygon;
}

function ringAreaPx(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = project(ring[i]);
    const [x2, y2] = project(ring[i + 1]);
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

const candidates = [];
for (const feature of geojson.features) {
  if (feature.geometry.type !== "MultiPolygon") continue;
  for (const polygon of feature.geometry.coordinates) {
    const outer = polygonRings(polygon)[0];
    let lonMin = Infinity;
    let lonMax = -Infinity;
    let latMin = Infinity;
    let latMax = -Infinity;
    let lonSum = 0;
    let latSum = 0;
    for (const [lon, lat] of outer) {
      lonMin = Math.min(lonMin, lon);
      lonMax = Math.max(lonMax, lon);
      latMin = Math.min(latMin, lat);
      latMax = Math.max(latMax, lat);
      lonSum += lon;
      latSum += lat;
    }
    const n = outer.length; // ring GeoJSON ditutup titik duplikat — ikut dihitung
    const centroid = [lonSum / n, latSum / n];
    const inside =
      centroid[0] > BOX.lonMin &&
      centroid[0] < BOX.lonMax &&
      centroid[1] > BOX.latMin &&
      centroid[1] < BOX.latMax;
    candidates.push({ outer, bbox: [lonMin, latMin, lonMax, latMax], centroid, inside, areaPx: ringAreaPx(outer) });
  }
}

if (process.argv.includes("--inspect")) {
  for (const c of candidates) {
    const [x, y] = project(c.centroid);
    console.log(
      `centroid=(${c.centroid[0].toFixed(2)}, ${c.centroid[1].toFixed(2)}) px=(${x.toFixed(0)}, ${y.toFixed(0)}) ` +
        `bbox=[${c.bbox.map((v) => v.toFixed(2)).join(", ")}] areaPx=${c.areaPx.toFixed(0)} pts=${c.outer.length} inside=${c.inside}`,
    );
  }
  process.exit(0);
}

// Pulau utama: area minimal ~40 px² (≈ pulau selebar ~7 km pada skala ini).
const MIN_AREA = 40;
const islands = candidates
  .filter((c) => c.inside && c.areaPx >= MIN_AREA)
  .sort((a, b) => b.areaPx - a.areaPx);

// ---- Zona wilayah budaya (perkiraan sebaran — BUKAN batas) ------------------
// Didefinisikan geografis: pusat lon/lat, radius km, rotasi (derajat, searah
// jarum jam), seed tetap agar blob deterministik.
const ZONES = [
  { id: "banyumas", lon: 109.35, lat: -7.55, rxKm: 58, ryKm: 36, rot: -12, seed: 11 },
  { id: "yogyakarta", lon: 110.22, lat: -7.85, rxKm: 48, ryKm: 34, rot: 12, seed: 22, labelLat: -7.78 },
  { id: "surakarta", lon: 110.92, lat: -7.6, rxKm: 44, ryKm: 32, rot: -18, seed: 33 },
  { id: "mataraman", lon: 111.8, lat: -7.9, rxKm: 66, ryKm: 36, rot: 38, seed: 44 },
  { id: "arek", lon: 112.5, lat: -7.3, rxKm: 52, ryKm: 30, rot: 26, seed: 55, labelLat: -7.4 },
  { id: "arek-madura", regionId: "arek", lon: 113.35, lat: -7.03, rxKm: 58, ryKm: 15, rot: -3, seed: 66 },
  { id: "tengger", lon: 112.85, lat: -8.05, rxKm: 46, ryKm: 27, rot: 22, seed: 77 },
  { id: "osing", lon: 114.15, lat: -8.4, rxKm: 46, ryKm: 30, rot: 12, seed: 88 },
];

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Blob tertutup halus: 10 titik di sekeliling elips dengan jitter deterministik. */
function blobPath({ lon, lat, rxKm, ryKm, rot, seed }) {
  const rand = mulberry32(seed);
  const cx = project([lon, lat])[0];
  const cy = project([lon, lat])[1];
  const rx = rxKm * KM2PX;
  const ry = ryKm * KM2PX;
  const theta = (rot * Math.PI) / 180;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const N = 10;
  const points = [];
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2 + (rand() - 0.5) * 0.35;
    const wobble = 1 + (rand() - 0.5) * 0.3;
    const ex = Math.cos(angle) * rx * wobble;
    const ey = Math.sin(angle) * ry * wobble;
    points.push([cx + ex * cosT - ey * sinT, cy + ex * sinT + ey * cosT]);
  }
  const fmt = (v) => v.toFixed(1);
  let d = `M ${fmt(points[0][0])} ${fmt(points[0][1])}`;
  for (let i = 0; i < N; i++) {
    const p0 = points[(i - 1 + N) % N];
    const p1 = points[i];
    const p2 = points[(i + 1) % N];
    const p3 = points[(i + 2) % N];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${fmt(c1[0])} ${fmt(c1[1])}, ${fmt(c2[0])} ${fmt(c2[1])}, ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return d + " Z";
}

// ---- Output ------------------------------------------------------------------
const TOLERANCE = 0.9;

function ringPath(ring) {
  const projected = ring.map(project);
  const simplified = simplify(projected, TOLERANCE);
  const head = simplified[0];
  const tail = simplified.slice(1, -1);
  const parts = tail.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`);
  return `M ${head[0].toFixed(1)} ${head[1].toFixed(1)} L ${parts.join(" ")} Z`;
}

const landPath = islands.map((c) => ringPath(c.outer));

// viewBox mengikuti konten + margin.
let maxX = 0;
let maxY = 0;
for (const c of islands) {
  for (const [lon, lat] of c.outer) {
    const [x, y] = project([lon, lat]);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
}
const VIEW_W = Math.ceil(maxX + 14);
const VIEW_H = Math.ceil(maxY + 20);

console.log("/**");
console.log(" * Geometri peta budaya — FILE HASIL GENERATE, jangan diedit manual.");
console.log(" * Regenerasi: lihat header scripts/generate-map-data.mjs.");
console.log(" *");
console.log(" * Garis pantai: Natural Earth 10m land (domain publik), diproyeksikan");
console.log(" * plate carrée lokal dan disederhanakan Douglas-Peucker (~0,9 px).");
console.log(" * Zona wilayah budaya = perkiraan sebaran yang dibuat editorial — BUKAN");
console.log(" * batas administratif (AGENTS.md §52).");
console.log(" */");
console.log("");
console.log("export interface RegionArea {");
console.log("  /** Region ID (sama dengan ID entri region). */");
console.log("  id: string;");
console.log("  /** Titik label nama wilayah pada viewBox. */");
console.log("  label: { x: number; y: number };");
console.log("  /** Path zona perkiraan sebaran — satu wilayah bisa punya beberapa blob. */");
console.log("  paths: string[];");
console.log("}");
console.log("");
console.log(`export const JAVA_VIEWBOX = { width: ${VIEW_W}, height: ${VIEW_H} };`);
console.log("");
console.log(`export const LAND_PATH =`);
console.log(`  "${landPath.join(" ")}";`);
console.log("");
console.log("export const REGION_AREAS: RegionArea[] = [");
const byRegion = new Map();
for (const zone of ZONES) {
  const regionId = zone.regionId ?? zone.id;
  if (!byRegion.has(regionId)) byRegion.set(regionId, { paths: [], label: zone });
  byRegion.get(regionId).paths.push(blobPath(zone));
}
for (const [regionId, area] of byRegion) {
  const labelLon = area.label.labelLon ?? area.label.lon;
  const labelLat = area.label.labelLat ?? area.label.lat;
  const [lx, ly] = project([labelLon, labelLat]);
  const paths = area.paths.map((p) => `    "${p}"`).join(",\n");
  console.log(`  {`);
  console.log(`    id: "${regionId}",`);
  console.log(`    label: { x: ${lx.toFixed(0)}, y: ${ly.toFixed(0)} },`);
  console.log(`    paths: [`);
  console.log(paths);
  console.log(`    ],`);
  console.log(`  },`);
}
console.log("];");
console.error(
  `islands: ${islands.length}, land path: ${((landPath.join(" ").length) / 1024).toFixed(1)} KB, viewBox ${VIEW_W}x${VIEW_H}`,
);
