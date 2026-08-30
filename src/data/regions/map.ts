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

/**
 * Siluet pulau Jawa yang disederhanakan (skematik, bukan kartografi):
 * badan lebih lebar di barat, pantai selatan berliku, ujung timur
 * menyempit ke arah timur-laut (khas Baluran–Banyuwangi), ditambah
 * siluet kecil Madura sebagai konteks geografis — bukan region,
 * sehingga tanpa marker.
 */
export const JAVA_OUTLINE_PATH = [
  // Pulau Jawa
  "M 56 162",
  "C 70 132, 120 112, 185 104",
  "C 230 96, 275 94, 335 99",
  "C 415 106, 465 109, 560 120",
  "C 648 128, 705 131, 780 142",
  "C 826 148, 862 149, 890 150",
  "C 924 151, 947 152, 956 155",
  "C 950 161, 938 168, 918 174",
  "C 878 186, 828 200, 795 208",
  "C 760 215, 718 220, 660 224",
  "C 610 227, 545 231, 480 232",
  "C 440 232, 412 226, 388 229",
  "C 335 236, 285 244, 228 240",
  "C 168 235, 105 214, 72 199",
  "C 60 194, 52 186, 52 176",
  "C 52 170, 54 166, 56 162",
  "Z",
  // Madura (konteks, tanpa marker)
  "M 802 98",
  "C 826 87, 868 80, 908 82",
  "C 930 83, 948 86, 956 90",
  "C 950 98, 932 103, 905 107",
  "C 870 112, 835 112, 812 108",
  "C 801 105, 796 103, 802 98",
  "Z",
].join(" ");

/**
 * Posisi skematik wilayah budaya Jawa (barat → timur).
 * Sumber posisi: penempatan umum wilayah budaya, bukan koordinat presisi.
 */
export const REGION_MARKERS: RegionMarker[] = [
  { id: "banyumas", x: 285, y: 170 },
  { id: "yogyakarta", x: 415, y: 178 },
  { id: "surakarta", x: 470, y: 158 },
  { id: "mataraman", x: 610, y: 168 },
  { id: "arek", x: 762, y: 170 },
  { id: "tengger", x: 750, y: 204 },
  { id: "osing", x: 888, y: 172 },
];
