/**
 * Grid bulan Masehi untuk tampilan kalender — murni, tanpa DOM/jam.
 *
 * Pekan selalu dimulai hari Ahad mengikuti siklus pawukon: setiap wuku
 * berawal Ahad (dinaWuku 1), sehingga baris kalender = satu wuku penuh
 * kecuali di ujung bulan. Sel di luar bulan bernilai null.
 */
import { fromJdn, toJdn, type TanggalMasehi } from "./jdn";
import { getHariJawa, type HariJawa } from "./hari";

export interface SelKalender {
  tanggal: TanggalMasehi;
  hari: HariJawa;
  /** Hari pertama sebuah wuku (dinaWuku 1) — tempat label wuku ditampilkan. */
  awalWuku: boolean;
}

export interface BulanKalender {
  /** Tahun Masehi. */
  tahun: number;
  /** Bulan Masehi, 1..12. */
  bulan: number;
  /** Pekan Ahad–Setu (kolom 0 = Ahad … 6 = Setu); null = sel kosong. */
  pekan: (SelKalender | null)[][];
}

function pekanKosong(): (SelKalender | null)[] {
  return [null, null, null, null, null, null, null];
}

/** Bulan berikutnya/sesudahnya dengan rollover Des→Jan — navigasi antar-bulan di UI. */
export function geserBulan(
  tahun: number,
  bulan: number,
  delta: number,
): { tahun: number; bulan: number } {
  if (!Number.isInteger(tahun) || !Number.isInteger(bulan) || bulan < 1 || bulan > 12) {
    throw new Error(`Bulan kalender tidak valid: tahun=${tahun}, bulan=${bulan}`);
  }
  if (!Number.isInteger(delta)) {
    throw new Error(`Delta bulan tidak valid: delta=${delta}`);
  }
  const total = tahun * 12 + (bulan - 1) + delta;
  return { tahun: Math.floor(total / 12), bulan: (total % 12) + 1 };
}

/** Jumlah hari dalam bulan Masehi (28–31), dari selisih JDN ke bulan berikutnya —
    aman untuk Desember (tahun berganti) dan Februari kabisat. */
export function panjangBulan(tahun: number, bulan: number): number {
  if (!Number.isInteger(tahun) || !Number.isInteger(bulan) || bulan < 1 || bulan > 12) {
    throw new Error(`Bulan kalender tidak valid: tahun=${tahun}, bulan=${bulan}`);
  }
  const jdnAwal = toJdn({ year: tahun, month: bulan, day: 1 });
  const berikut = geserBulan(tahun, bulan, 1);
  return toJdn({ year: berikut.tahun, month: berikut.bulan, day: 1 }) - jdnAwal;
}

export function buildBulanKalender(tahun: number, bulan: number): BulanKalender {
  if (!Number.isInteger(tahun) || !Number.isInteger(bulan) || bulan < 1 || bulan > 12) {
    throw new Error(`Bulan kalender tidak valid: tahun=${tahun}, bulan=${bulan}`);
  }

  const jdnAwal = toJdn({ year: tahun, month: bulan, day: 1 });
  const jumlahHari = panjangBulan(tahun, bulan);

  const pekan: (SelKalender | null)[][] = [];
  let pekanKini = pekanKosong();

  for (let i = 0; i < jumlahHari; i++) {
    const hari = getHariJawa(fromJdn(jdnAwal + i));
    // Kolom tata Ahad-dulu: Senen(1)→1 … Setu(6)→6, Ahad(7)→0.
    pekanKini[hari.dina.urutan % 7] = {
      tanggal: hari.tanggal,
      hari,
      awalWuku: hari.wuku.dinaWuku === 1,
    };
    if (hari.dina.id === "setu") {
      pekan.push(pekanKini);
      pekanKini = pekanKosong();
    }
  }
  if (pekanKini.some((sel) => sel !== null)) {
    pekan.push(pekanKini);
  }

  return { tahun, bulan, pekan };
}
