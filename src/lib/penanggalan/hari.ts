/**
 * Agregat satu hari Jawa — gabungan seluruh siklus (dina, pasaran, wuku,
 * wulan, taun) untuk satu tanggal Masehi. Dipisah dari index.ts agar modul
 * lain (mis. bulan.ts) bisa memakainya tanpa mengimpor barrel.
 */
import { toJdn, type TanggalMasehi } from "./jdn";
import { getDina, type Dina } from "./dina";
import { getPasaran, getWeton, type Pasaran } from "./pasaran";
import { getWuku, type Wuku } from "./wuku";
import { getWulanTaunJawa, type TaunJawa, type Wulan } from "./tahun";

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
