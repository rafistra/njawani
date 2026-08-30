/**
 * Siklus pasaran — pekan lima hari khas penanggalan Jawa.
 * Urutan baku: Legi, Pahing, Pon, Wage, Kliwon.
 * Peruntungan/karakter weton BUKAN bagian modul ini — itu ranah
 * kepercayaan populer di content layer (AGENTS.md §97).
 */
import { PASARAN_OFFSET } from "./anchors";
import { mod } from "./jdn";
import type { Dina } from "./dina";

export const PASARAN_NAMES = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"] as const;
const PASARAN_IDS = ["legi", "pahing", "pon", "wage", "kliwon"] as const;

export interface Pasaran {
  id: (typeof PASARAN_IDS)[number];
  nama: (typeof PASARAN_NAMES)[number];
  urutan: number; // 1..5
}

export function getPasaran(jdn: number): Pasaran {
  const indeks = mod(jdn - PASARAN_OFFSET, 5);
  return { id: PASARAN_IDS[indeks], nama: PASARAN_NAMES[indeks], urutan: indeks + 1 };
}

/** Nama weton: pasangan dina × pasaran (siklus 35 hari), mis. "Kemis Legi". */
export function getWeton(dina: Dina, pasaran: Pasaran): { nama: string } {
  return { nama: `${dina.nama} ${pasaran.nama}` };
}
