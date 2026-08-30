/**
 * Penanggalan Jawa — modul domain murni (AGENTS.md §49, §53).
 *
 * Menghitung dina, pasaran, weton, wuku, wulan, dan taun Jawa secara
 * deterministik dari tanggal Masehi. Tanpa import Astro/DOM, tanpa jam
 * sistem, tanpa kepercayaan populer (primbon): atribut peruntungan
 * hanya hidup di content layer (AGENTS.md §97).
 *
 * Keputusan "hari ini" (zona waktu) ada di layer UI: penelepon
 * menyuplai {year, month, day} eksplisit, modul tidak membaca jam.
 *
 * Aritmetika tabulasi; bisa selisih ±1 hari dari penanggalan praktik
 * (kraton/rukyaat) pada tahun tertentu — lihat anchors.ts.
 */

import { toJdn, type TanggalMasehi } from "./jdn";
import { getDina, type Dina } from "./dina";
import { getPasaran, getWeton, type Pasaran } from "./pasaran";
import { getWuku, type Wuku } from "./wuku";
import { getWulanTaunJawa, type TaunJawa, type Wulan } from "./tahun";
import { formatTanggalMasehi } from "./format";

export { toJdn, fromJdn } from "./jdn";
export { getDina, DINA_NAMES } from "./dina";
export { getPasaran, getWeton, PASARAN_NAMES } from "./pasaran";
export { getWuku, WUKU_NAMES, WUKU_CYCLE_DAYS } from "./wuku";
export { getWulanTaunJawa, ARANING_TAUN, WULAN_NAMES } from "./tahun";
export { formatTanggalMasehi } from "./format";
export type { TanggalMasehi } from "./jdn";
export type { Dina } from "./dina";
export type { Pasaran } from "./pasaran";
export type { Wuku } from "./wuku";
export type { Wulan, TaunJawa } from "./tahun";

export interface HariJawa {
  tanggal: TanggalMasehi;
  jdn: number;
  dina: Dina;
  pasaran: Pasaran;
  /** Nama weton, mis. "Kemis Legi". */
  weton: { nama: string };
  wuku: Wuku;
  wulan: Wulan;
  taun: TaunJawa;
}

export function getHariJawa(tanggal: TanggalMasehi): HariJawa {
  const jdn = toJdn(tanggal);
  const dina = getDina(jdn);
  const pasaran = getPasaran(jdn);
  const { wulan, taun } = getWulanTaunJawa(jdn);
  return {
    tanggal,
    jdn,
    dina,
    pasaran,
    weton: getWeton(dina, pasaran),
    wuku: getWuku(jdn),
    wulan,
    taun,
  };
}
