/**
 * Kalender lunar Jawa: wulan, taun (nomor Saka), nama taun, dan windu.
 *
 * Struktur (id-Wikipedia "Kalender Jawa", kurup Asapon):
 * - 12 wulan bergantian 30/29 hari; taun biasa 354 hari.
 * - Taun basa (Besar menjadi 30 hari → 355) adalah posisi ke-2, ke-5,
 *   ke-8 tiap windu: Éhé, Dal, Jimakir.
 * - Satu windu = 8 taun = 2.835 hari (354×8 + 3) — invariant yang dites.
 * - 1 Sura Alip = Selasa Pon; pola ini berulang persis tiap windu.
 *
 * Berlaku dalam kurup Asapon (≈ 1936–2053 M); lihat anchors.ts.
 */
import { KURUP_ALIP_TAHUN, LUNAR_ANCHOR_JDN, LUNAR_ANCHOR_TAUN } from "./anchors";
import { mod } from "./jdn";

export const WULAN_NAMES = [
  "Sura",
  "Sapar",
  "Mulud",
  "Bakda Mulud",
  "Jumadilawal",
  "Jumadilakir",
  "Rejeb",
  "Ruwah",
  "Pasa",
  "Sawal",
  "Selo",
  "Besar",
] as const;

const WULAN_IDS = [
  "sura",
  "sapar",
  "mulud",
  "bakda-mulud",
  "jumadilawal",
  "jumadilakir",
  "rejeb",
  "ruwah",
  "pasa",
  "sawal",
  "selo",
  "besar",
] as const;

const WULAN_LENGTH_BIASA = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29] as const;

export const ARANING_TAUN = ["Alip", "Éhé", "Jimawal", "Jé", "Dal", "Bé", "Wawu", "Jimakir"] as const;

const POSISI_TAUN_BASA = new Set([1, 4, 7]); // Éhé, Dal, Jimakir

export interface Wulan {
  id: (typeof WULAN_IDS)[number];
  nama: (typeof WULAN_NAMES)[number];
  urutan: number; // 1..12
  /** Tanggal dalam wulan, 1..29/30. */
  dina: number;
}

export interface TaunJawa {
  angka: number;
  nama: (typeof ARANING_TAUN)[number];
  /** Posisi taun dalam windu, 1..8 (1 = Alip). */
  urutanDalamWindu: number;
}

function indeksAraning(taun: number): number {
  return mod(taun - KURUP_ALIP_TAHUN, 8);
}

function isTaunBasa(taun: number): boolean {
  return POSISI_TAUN_BASA.has(indeksAraning(taun));
}

function panjangTaun(taun: number): number {
  return isTaunBasa(taun) ? 355 : 354;
}

export function getWulanTaunJawa(jdn: number): { wulan: Wulan; taun: TaunJawa } {
  // Sisa = offset 0-based dari 1 Sura taun terkait.
  let taun = LUNAR_ANCHOR_TAUN;
  let sisa = jdn - LUNAR_ANCHOR_JDN;
  if (sisa >= 0) {
    for (;;) {
      const panjang = panjangTaun(taun);
      if (sisa < panjang) break;
      sisa -= panjang;
      taun += 1;
    }
  } else {
    while (sisa < 0) {
      taun -= 1;
      sisa += panjangTaun(taun);
    }
  }

  const panjangWulan = isTaunBasa(taun)
    ? WULAN_LENGTH_BIASA.map((hari, i) => (i === 11 ? hari + 1 : hari))
    : [...WULAN_LENGTH_BIASA];
  let indeksWulan = 0;
  while (sisa >= panjangWulan[indeksWulan]) {
    sisa -= panjangWulan[indeksWulan];
    indeksWulan += 1;
  }

  return {
    wulan: {
      id: WULAN_IDS[indeksWulan],
      nama: WULAN_NAMES[indeksWulan],
      urutan: indeksWulan + 1,
      dina: sisa + 1,
    },
    taun: {
      angka: taun,
      nama: ARANING_TAUN[indeksAraning(taun)],
      urutanDalamWindu: indeksAraning(taun) + 1,
    },
  };
}
