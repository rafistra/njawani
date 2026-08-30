/**
 * Transliterator island (PRD §23): React hanya menangani interaksi —
 * input, opsi, hasil, copy, error. Semua logika ada di
 * src/lib/transliteration (AGENTS.md §53).
 */
import { useMemo, useState } from "react";

import { transliterate } from "../../lib/transliteration";

export default function Transliterator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => transliterate(input), [input]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="transliterator">
      <div className="pane">
        <label htmlFor="transliterator-input">Tulis dalam huruf Latin</label>
        <textarea
          id="transliterator-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Contoh: basa jawa"
          rows={4}
          spellCheck={false}
        />
        <p className="hint">
          Vokal: <kbd>a</kbd> <kbd>i</kbd> <kbd>u</kbd> <kbd>e</kbd> (é){" "}
          <kbd>ê</kbd> (pepet) <kbd>o</kbd>. Gunakan aksen ê/è untuk e pepet.
        </p>
      </div>

      <div className="pane output-pane">
        <div className="output-header">
          <label htmlFor="transliterator-output">Aksara Jawa</label>
          <button type="button" onClick={copy} disabled={!output}>
            {copied ? "Tersalin ✓" : "Salin"}
          </button>
        </div>
        <p id="transliterator-output" className="output" lang="jv" aria-live="polite">
          {output || <span className="placeholder">Aksara akan muncul di sini…</span>}
        </p>
      </div>
    </div>
  );
}
