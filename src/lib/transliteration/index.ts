/**
 * Engine transliterasi Latin → Aksara Jawa (PRD §23, §26.5).
 * Pure TypeScript, deterministic, bebas dari UI dan framework —
 * React hanya menangani interaksi (AGENTS.md §53).
 *
 * Konvensi vokal Latin (didokumentasikan di UI):
 *   a → a    i → i    u → u
 *   e/é → taling (é)    è/ê → pepet (ê)    o → taling+tarung (o)
 * Suku kata tertutup di akhir kata: -ng → cecak, -r → layar, -h → wigyangan,
 * konsonan lain → pangkon. Klaster/penutup internal memakai pangkon yang
 * oleh shaper dirender sebagai pasangan.
 */
import { LATIN_CONSONANTS, INDEPENDENT_VOWELS, SIGNS } from "./aksara-data";

const VOWEL_SIGNS: Record<string, string> = {
  a: "",
  i: SIGNS.wulu,
  u: SIGNS.suku,
  e: SIGNS.taling,
  "é": SIGNS.taling,
  "è": SIGNS.pepet,
  ê: SIGNS.pepet,
  o: SIGNS.taling + SIGNS.tarung,
};

const isLatinWord = (text: string): boolean => /^[a-zà-ÿ]+$/.test(text);

interface Match {
  key: string;
  length: number;
}

function matchConsonant(text: string, pos: number): Match | undefined {
  const two = text.slice(pos, pos + 2);
  // Guard panjang: slice di akhir kata bisa menghasilkan 1 karakter
  // yang kebetulan cocok dengan kunci tunggal.
  if (two.length === 2 && two in LATIN_CONSONANTS) return { key: two, length: 2 };
  const one = text[pos]!;
  if (one in LATIN_CONSONANTS) return { key: one, length: 1 };
  return undefined;
}

function matchVowel(text: string, pos: number): Match | undefined {
  const one = text[pos]!;
  if (one in VOWEL_SIGNS) return { key: one, length: 1 };
  return undefined;
}

/** Akhir deretan konsonan mulai dari pos (berhenti di vokal/non-huruf). */
function consonantRunEnd(text: string, pos: number): number {
  let end = pos;
  while (end < text.length && matchConsonant(text, end)) {
    end += matchConsonant(text, end)!.length;
  }
  return end;
}

function transliterateWord(word: string): string {
  let out = "";
  let pos = 0;

  while (pos < word.length) {
    const onset = matchConsonant(word, pos);

    if (!onset) {
      const vowel = matchVowel(word, pos);
      if (vowel && pos === 0) {
        // Suku kata berawalan vokal di awal kata → aksara swara.
        out += INDEPENDENT_VOWELS[vowel.key] ?? "";
        pos += vowel.length;
        continue;
      }
      // Karakter tak dikenal dilewatkan apa adanya.
      out += word[pos]!;
      pos += 1;
      continue;
    }

    pos += onset.length;
    let glyph = LATIN_CONSONANTS[onset.key]!;

    // Medial r/y yang diikuti vokal → cakra/pengkal (kra, kya, dst.).
    const nextChar = word[pos];
    if ((nextChar === "r" || nextChar === "y") && matchVowel(word, pos + 1)) {
      glyph += nextChar === "r" ? SIGNS.cakra : SIGNS.pengkal;
      pos += 1;
    }

    const vowel = matchVowel(word, pos);
    if (vowel) {
      out += glyph + VOWEL_SIGNS[vowel.key]!;
      pos += vowel.length;
    } else {
      // Konsonan tanpa vokal (mis. awal klaster) → ditutup pangkon,
      // konsonan berikutnya akan dirender sebagai pasangan.
      out += glyph + SIGNS.pangkon;
      continue;
    }

    // Coda: konsonan setelah vokal.
    const runEnd = consonantRunEnd(word, pos);
    if (runEnd === pos) continue;

    const runUnits = [];
    let cursor = pos;
    while (cursor < runEnd) {
      const unit = matchConsonant(word, cursor)!;
      runUnits.push(unit);
      cursor += unit.length;
    }

    const isFinalCoda = runEnd === word.length;
    if (runUnits.length === 1 && isFinalCoda) {
      const unit = runUnits[0]!;
      if (unit.key === "ng") {
        out += SIGNS.cecak;
      } else if (unit.key === "r") {
        out += SIGNS.layar;
      } else if (unit.key === "h") {
        out += SIGNS.wigyangan;
      } else {
        out += LATIN_CONSONANTS[unit.key]! + SIGNS.pangkon;
      }
      pos = runEnd;
      continue;
    }

    if (runUnits.length > 1) {
      // Satuan pertama adalah penutup suku kata ini (internal) → pangkon;
      // sisanya menjadi onset suku kata berikutnya.
      const coda = runUnits[0]!;
      out += LATIN_CONSONANTS[coda.key]! + SIGNS.pangkon;
      pos += coda.length;
      continue;
    }

    // Satuan tunggal diikuti vokal → onset suku kata berikutnya; tanpa coda.
    pos = pos; // tidak berubah; loop lanjut mem-parsing onset
  }

  return out;
}

export function transliterate(input: string): string {
  const normalized = input.normalize("NFC").toLowerCase();
  const parts = normalized.split(/([^a-zà-ÿ]+)/);
  return parts
    .map((part) => (isLatinWord(part) ? transliterateWord(part) : part))
    .join("");
}
