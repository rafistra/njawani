/**
 * Siklus dina — pekan tujuh hari yang mengikuti pekan internasional.
 * Nama harian mengikuti entri `dina-lan-pasaran` (Senen, bukan Soma/Radite).
 */
import { DINA_OFFSET } from "./anchors";
import { mod } from "./jdn";

export const DINA_NAMES = ["Senen", "Selasa", "Rebo", "Kemis", "Jemuah", "Setu", "Minggu"] as const;
const DINA_IDS = ["senen", "selasa", "rebo", "kemis", "jemuah", "setu", "minggu"] as const;

export interface Dina {
  id: (typeof DINA_IDS)[number];
  nama: (typeof DINA_NAMES)[number];
  urutan: number; // 1..7
}

export function getDina(jdn: number): Dina {
  const indeks = mod(jdn - DINA_OFFSET, 7);
  return { id: DINA_IDS[indeks], nama: DINA_NAMES[indeks], urutan: indeks + 1 };
}
