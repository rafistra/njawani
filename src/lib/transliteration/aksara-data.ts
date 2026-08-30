/**
 * Data aksara Jawa untuk transliterasi Latin → Aksara Jawa.
 *
 * Semua codepoint diverifikasi langsung dari UnicodeData.txt (Unicode 17):
 * https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt — blok
 * U+A980..U+A9DF. Jangan menambah pemetaan tanpa memverifikasi codepoint.
 *
 * Ortografi tanda: semua sandhangan disimpan SETELAH konsonan dasarnya
 * (Unicode Standard ch. 17; r12a.github.io/scripts/java/jv.html).
 * "o" = taling + tarung; pasangan terbentuk lewat pangkon + konsonan.
 */

/** 20 aksara legena (konsonan dasar) — urutan hanacaraka. */
export const AKSARA: Record<string, string> = {
  ha: "\uA9B2",
  na: "\uA9A4",
  ca: "\uA995",
  ra: "\uA9AB",
  ka: "\uA98F",
  da: "\uA9A2",
  ta: "\uA9A0",
  sa: "\uA9B1",
  wa: "\uA9AE",
  la: "\uA9AD",
  pa: "\uA9A5",
  dha: "\uA99D",
  ja: "\uA997",
  ya: "\uA9AA",
  nya: "\uA99A",
  ma: "\uA9A9",
  ga: "\uA992",
  ba: "\uA9A7",
  tha: "\uA99B",
  nga: "\uA994",
};

/** Konsonan berpasangan dua huruf Latin. */
export const CONSONANT_DIGRAPHS = ["ng", "ny", "dh", "th"] as const;

/**
 * Pemetaan unit Latin → glyph aksara untuk engine:
 * digraph (ng, ny, dh, th) dan 16 huruf tunggal.
 */
export const LATIN_CONSONANTS: Record<string, string> = {
  ng: AKSARA.nga!,
  ny: AKSARA.nya!,
  dh: AKSARA.dha!,
  th: AKSARA.tha!,
  h: AKSARA.ha!,
  n: AKSARA.na!,
  c: AKSARA.ca!,
  r: AKSARA.ra!,
  k: AKSARA.ka!,
  d: AKSARA.da!,
  t: AKSARA.ta!,
  s: AKSARA.sa!,
  w: AKSARA.wa!,
  l: AKSARA.la!,
  p: AKSARA.pa!,
  j: AKSARA.ja!,
  y: AKSARA.ya!,
  m: AKSARA.ma!,
  g: AKSARA.ga!,
  b: AKSARA.ba!,
};

/** Sandhangan dan tanda. */
export const SIGNS = {
  tarung: "\uA9B4",
  wulu: "\uA9B6",
  suku: "\uA9B8",
  taling: "\uA9BA",
  pepet: "\uA9BC",
  pangkon: "\uA9C0",
  cakra: "\uA9BF",
  pengkal: "\uA9BE",
  cecak: "\uA981",
  layar: "\uA982",
  wigyangan: "\uA983",
  panyangga: "\uA980",
} as const;

/** Vokal mandiri (aksara swara) untuk suku kata berawalan vokal. */
export const INDEPENDENT_VOWELS: Record<string, string> = {
  a: "\uA984",
  i: "\uA986",
  u: "\uA988",
  e: "\uA98C",
  "é": "\uA98C",
  "è": "\uA98C",
  ê: "\uA98C",
  o: "\uA98E",
};

/** Aksara murda (9) — hanya untuk halaman referensi, tidak dipakai engine v1. */
export const AKSARA_MURDA: Record<string, string> = {
  "ka murda": "\uA991",
  "ga murda": "\uA993",
  "ca murda": "\uA996",
  "nya murda": "\uA998",
  "na murda": "\uA99F",
  "ta murda": "\uA9A1",
  "pa murda": "\uA9A6",
  "ba murda": "\uA9A8",
  "sa murda": "\uA9AF",
};

/** Angka Jawa 0–9. */
export const ANGKA: string[] = [
  "\uA9D0",
  "\uA9D1",
  "\uA9D2",
  "\uA9D3",
  "\uA9D4",
  "\uA9D5",
  "\uA9D6",
  "\uA9D7",
  "\uA9D8",
  "\uA9D9",
];
