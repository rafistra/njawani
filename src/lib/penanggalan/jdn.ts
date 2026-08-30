/**
 * Konversi tanggal Gregorian ↔ Julian Day Number (JDN).
 *
 * Semua siklus penanggalan Jawa (dina, pasaran, wuku, wulan, taun) dihitung
 * sebagai sisa pembagian terhadap hitungan hari JDN — satu-satunya jembatan
 * antara kalender Masehi dan Jawa. Rumus integer Fliegel–Van Flandern:
 * eksak untuk seluruh rentang Gregorian proleptik, tanpa pecahan jam.
 *
 * Modul murni: tanpa jam sistem, tanpa zona waktu (AGENTS.md §49).
 */

export interface TanggalMasehi {
  year: number;
  month: number;
  day: number;
}

export function toJdn({ year, month, day }: TanggalMasehi): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function fromJdn(jdn: number): TanggalMasehi {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

/** Sisa pembagian yang selalu non-negatif — siklus kalender tidak mengenal angka negatif. */
export function mod(value: number, n: number): number {
  return ((value % n) + n) % n;
}
