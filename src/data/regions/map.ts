/**
 * Data geometri peta budaya skematik (PRD §22, design.md §59).
 * Marker titik pada siluet pulau Jawa — BUKAN batas administratif:
 * batas budaya bersifat berlapis dan tidak tegas, jadi peta memakai
 * penanda wilayah, bukan poligon klaim.
 * Peta dirender sebagai SVG statis dengan <a> native — tanpa JavaScript.
 */

export interface RegionMarker {
  /** Region ID (sama dengan ID entri region). */
  id: string;
  /** Koordinat skematik pada viewBox peta. */
  x: number;
  y: number;
}

export const JAVA_VIEWBOX = { width: 1000, height: 300 };

/** Siluet pulau Jawa yang disederhanakan (skematik, bukan kartografi). */
export const JAVA_OUTLINE_PATH =
  "M 20 140 C 80 110, 160 100, 260 110 C 380 120, 480 95, 590 105 C 700 115, 800 90, 880 110 C 930 122, 962 140, 950 165 C 930 195, 850 205, 760 210 C 620 220, 480 230, 360 225 C 240 220, 120 210, 60 185 C 30 172, 10 158, 20 140 Z";

/**
 * Posisi skematik wilayah budaya Jawa (barat → timur).
 * Sumber posisi: penempatan umum wilayah budaya, bukan koordinat presisi.
 */
export const REGION_MARKERS: RegionMarker[] = [
  { id: "banyumas", x: 285, y: 158 },
  { id: "yogyakarta", x: 415, y: 165 },
  { id: "surakarta", x: 470, y: 150 },
  { id: "mataraman", x: 610, y: 160 },
  { id: "arek", x: 760, y: 148 },
  { id: "tengger", x: 740, y: 195 },
  { id: "osing", x: 920, y: 175 },
];
