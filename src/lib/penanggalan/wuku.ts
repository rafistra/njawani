/**
 * Siklus wuku (pawukon) — 30 pekan × 7 hari = 210 hari, bernomor ulang
 * tiap putaran (siklus tak bernomor, tidak terikat taun). Setiap wuku
 * dimulai hari Ahad; nama versi Jawa mengikuti jv-Wikipedia "Wuku"
 * (beda ejaan dari versi Bali: Wukir/Ukir, Kurantil/Kulantir, dst.).
 */
import { WUKU_EPOCH_JDN } from "./anchors";
import { mod } from "./jdn";

export const WUKU_NAMES = [
  "Sinta",
  "Landep",
  "Wukir",
  "Kurantil",
  "Tolu",
  "Gumbreg",
  "Wariga",
  "Warigadadi",
  "Julungwangi",
  "Sungsang",
  "Galungan",
  "Kuningan",
  "Langkir",
  "Mandasiya",
  "Julungpujut",
  "Pahang",
  "Kuruwelut",
  "Marakeh",
  "Tambir",
  "Medangkungan",
  "Maktal",
  "Wuye",
  "Manahil",
  "Prangbakat",
  "Bala",
  "Wugu",
  "Wayang",
  "Kulawu",
  "Dukut",
  "Watugunung",
] as const;

const WUKU_IDS = [
  "sinta",
  "landep",
  "wukir",
  "kurantil",
  "tolu",
  "gumbreg",
  "wariga",
  "warigadadi",
  "julungwangi",
  "sungsang",
  "galungan",
  "kuningan",
  "langkir",
  "mandasiya",
  "julungpujut",
  "pahang",
  "kuruwelut",
  "marakeh",
  "tambir",
  "medangkungan",
  "maktal",
  "wuye",
  "manahil",
  "prangbakat",
  "bala",
  "wugu",
  "wayang",
  "kulawu",
  "dukut",
  "watugunung",
] as const;

export const WUKU_CYCLE_DAYS = 210;

export interface Wuku {
  id: (typeof WUKU_IDS)[number];
  nama: (typeof WUKU_NAMES)[number];
  urutan: number; // 1..30
  /** Posisi hari di dalam wuku, 1..7 (1 = Ahad). */
  dinaWuku: number;
}

export function getWuku(jdn: number): Wuku {
  const posisi = mod(jdn - WUKU_EPOCH_JDN, WUKU_CYCLE_DAYS);
  const indeks = Math.floor(posisi / 7);
  return {
    id: WUKU_IDS[indeks],
    nama: WUKU_NAMES[indeks],
    urutan: indeks + 1,
    dinaWuku: (posisi % 7) + 1,
  };
}
