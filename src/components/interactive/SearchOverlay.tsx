/**
 * Quick search overlay (PRD §19.2, design.md §32): React island pertama —
 * modal/command-palette style, keyboard navigable, fokus dikelola.
 * Pagefind dimuat lazy saat overlay pertama dibuka; tanpa index (dev)
 * komponen menampilkan pesan fallback, bukan error.
 */
import { useCallback, useEffect, useRef, useState } from "react";

import "./SearchOverlay.css";

interface PagefindResultData {
  url: string;
  meta: { title?: string; jenis?: string; definisi?: string };
  excerpt?: string;
}

interface PagefindApi {
  search(query: string): Promise<{ results: { data(): Promise<PagefindResultData> }[] }>;
}

const MAX_RESULTS = 8;

export default function SearchOverlay({ basePath }: { basePath: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [status, setStatus] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const apiRef = useRef<PagefindApi | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const openOverlay = useCallback(() => {
    setOpen(true);
  }, []);

  const closeOverlay = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setStatus("");
    setActiveIndex(0);
  }, []);

  // Shortcut global: "/" atau Ctrl/Cmd+K.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if ((event.key === "/" && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Fokus: masuk ke input saat buka; kembalikan ke trigger saat tutup.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Muat Pagefind sekali saat overlay pertama dibuka.
  useEffect(() => {
    if (!open || apiRef.current) return;
    import(/* @vite-ignore */ `${basePath}pagefind/pagefind.js`)
      .then((mod: PagefindApi) => {
        apiRef.current = mod;
      })
      .catch(() => {
        setStatus("Index pencarian tersedia setelah build produksi.");
      });
  }, [open, basePath]);

  const runSearch = useCallback(async (value: string) => {
    const api = apiRef.current;
    if (!api) return;
    if (!value.trim()) {
      setResults([]);
      setStatus("");
      return;
    }
    setStatus("Mencari…");
    const response = await api.search(value);
    const data = await Promise.all(response.results.slice(0, MAX_RESULTS).map((result) => result.data()));
    setResults(data);
    setActiveIndex(0);
    setStatus(data.length === 0 ? "Belum ada topik yang cocok." : "");
  }, []);

  const onQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runSearch(value), 200);
    },
    [runSearch],
  );

  // Keyboard di dalam dialog: Escape tutup, panah navigasi, Enter buka hasil.
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeOverlay();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, results.length - 1));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        return;
      }
      if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        window.location.href = results[activeIndex].url;
      }
      if (event.key === "Tab" && dialogRef.current) {
        // Focus trap sederhana: siklus di dalam dialog.
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, a, input");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [closeOverlay, results, activeIndex],
  );

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={openOverlay}
        ref={triggerRef}
        aria-haspopup="dialog"
      >
        Cari
      </button>

      {open && (
        <div className="overlay-backdrop" onClick={closeOverlay}>
          <div
            className="overlay-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian cepat"
            ref={dialogRef}
            onKeyDown={onKeyDown}
            onClick={(event) => event.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Cari istilah, tradisi, karya sastra…"
              aria-label="Kata kunci pencarian"
              autoComplete="off"
            />

            {status && <p className="overlay-status">{status}</p>}

            {results.length > 0 && (
              <ul className="overlay-results">
                {results.map((result, index) => (
                  <li key={result.url}>
                    <a
                      href={result.url}
                      className={index === activeIndex ? "result active" : "result"}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <span className="result-title">
                        {result.meta.title ?? result.url}
                        {result.meta.jenis && <span className="result-jenis">{result.meta.jenis}</span>}
                      </span>
                      {result.meta.definisi && <span className="result-definisi">{result.meta.definisi}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <p className="overlay-hint">
              <kbd>↑</kbd> <kbd>↓</kbd> navigasi · <kbd>Enter</kbd> buka · <kbd>Esc</kbd> tutup ·{" "}
              <a href={`${basePath}cari/`} onClick={closeOverlay}>
                Pencarian lengkap
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
