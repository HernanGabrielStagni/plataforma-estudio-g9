import { useState, useCallback, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// presentation=true → ajusta al ancho completo del contenedor, altura fija grande
export default function PDFViewer({ src, puedeDescargar = false, presentation = false }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(presentation ? null : 1.2);
  const [containerWidth, setContainerWidth] = useState(null);
  const [error, setError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!presentation) return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, [presentation]);

  const onLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setPage(1);
  }, []);

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(numPages ?? p, p + 1));

  if (error) {
    return (
      <div className="text-center py-10 text-[#1a3d2b]/60 font-lato text-sm">
        No se pudo cargar el PDF. Intentá más tarde.
      </div>
    );
  }

  // ── MODO PRESENTACIÓN ──────────────────────────────────────────────────────
  if (presentation) {
    return (
      <div className="flex flex-col w-full bg-[#1a1a1a]">
        {/* Área de la página — ocupa toda la altura disponible */}
        <div
          ref={containerRef}
          className="w-full flex items-center justify-center overflow-hidden"
          style={{ minHeight: "60vh", maxHeight: "75vh" }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Document
            file={src}
            onLoadSuccess={onLoadSuccess}
            onLoadError={() => setError(true)}
            loading={
              <div className="flex flex-col items-center gap-3 text-white/50 py-20">
                <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
                <span className="font-lato text-sm">Cargando presentación…</span>
              </div>
            }
          >
            {containerWidth && (
              <Page
                pageNumber={page}
                width={containerWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            )}
          </Document>
        </div>

        {/* Controles inferiores */}
        <div className="flex items-center justify-between bg-[#1a3d2b] px-4 py-2 text-white">
          {/* Navegación izquierda */}
          <button
            onClick={prevPage}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition font-lato text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          {/* Página / total */}
          <span className="font-lato text-sm tabular-nums">
            {page} / {numPages ?? "—"}
          </span>

          {/* Navegación derecha + descarga */}
          <div className="flex items-center gap-2">
            <button
              onClick={nextPage}
              disabled={page >= (numPages ?? 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition font-lato text-sm"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
            {puedeDescargar && (
              <a
                href={src}
                download
                className="flex items-center gap-1 text-xs bg-[#c9a84c] hover:bg-[#f0d070] text-[#1a3d2b] font-bold px-3 py-1.5 rounded-full transition-all"
              >
                <Download className="w-3 h-3" /> Descargar
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── MODO DOCUMENTO (por defecto) ───────────────────────────────────────────
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3 bg-[#1a3d2b] text-white px-4 py-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={page <= 1}
            className="p-1 rounded hover:bg-white/20 disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-lato text-sm">{page} / {numPages ?? "—"}</span>
          <button
            onClick={nextPage}
            disabled={page >= (numPages ?? 1)}
            className="p-1 rounded hover:bg-white/20 disabled:opacity-30 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
            className="p-1 rounded hover:bg-white/20 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-lato text-xs">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
            className="p-1 rounded hover:bg-white/20 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {puedeDescargar && (
            <a
              href={src}
              download
              className="ml-2 flex items-center gap-1 text-xs bg-[#c9a84c] hover:bg-[#f0d070] text-[#1a3d2b] font-bold px-3 py-1 rounded-full transition-all"
            >
              <Download className="w-3 h-3" /> Descargar
            </a>
          )}
        </div>
      </div>
      <div
        className="overflow-auto w-full bg-gray-100"
        style={{ maxHeight: "70vh" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Document
          file={src}
          onLoadSuccess={onLoadSuccess}
          onLoadError={() => setError(true)}
          loading={
            <div className="py-16 text-center text-[#1a3d2b]/50 font-lato text-sm">
              Cargando PDF…
            </div>
          }
        >
          <Page
            pageNumber={page}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}
