import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize2, X } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const CONTROLS_H = 56; // altura barra de controles en fullscreen

function FullscreenViewer({ src, puedeDescargar, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [pageDims, setPageDims] = useState(null); // dimensiones nativas de la página
  const [renderWidth, setRenderWidth] = useState(null);
  const areaRef = useRef(null);

  // Calcular el ancho de render para que la página encaje (contain) en el área disponible
  const computeRenderWidth = useCallback(() => {
    const el = areaRef.current;
    if (!el || !pageDims) return;
    const aw = el.clientWidth;
    const ah = el.clientHeight;
    const { width: pw, height: ph } = pageDims;
    const scaleW = aw / pw;
    const scaleH = ah / ph;
    setRenderWidth(Math.floor(pw * Math.min(scaleW, scaleH)));
  }, [pageDims]);

  useEffect(() => {
    computeRenderWidth();
    const ro = new ResizeObserver(computeRenderWidth);
    if (areaRef.current) ro.observe(areaRef.current);
    return () => ro.disconnect();
  }, [computeRenderWidth]);

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(numPages ?? p, p + 1));

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black" onContextMenu={(e) => e.preventDefault()}>
      {/* Área de la página — ocupa todo excepto la barra de controles */}
      <div
        ref={areaRef}
        className="flex-1 flex items-center justify-center overflow-hidden"
        style={{ minHeight: 0 }}
      >
        <Document
          file={src}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPage(1); }}
          loading={
            <div className="flex flex-col items-center gap-3 text-white/50">
              <div className="w-10 h-10 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
              <span className="font-lato text-sm">Cargando…</span>
            </div>
          }
        >
          {renderWidth && (
            <Page
              pageNumber={page}
              width={renderWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={(p) => {
                setPageDims({ width: p.originalWidth, height: p.originalHeight });
              }}
            />
          )}
          {/* Primera carga: renderizar invisible para obtener dimensiones */}
          {!pageDims && (
            <Page
              pageNumber={page}
              width={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={(p) => {
                setPageDims({ width: p.originalWidth, height: p.originalHeight });
              }}
              className="!hidden"
            />
          )}
        </Document>
      </div>

      {/* Barra de controles inferior */}
      <div
        className="flex-shrink-0 flex items-center justify-between bg-[#1a3d2b] px-4 text-white"
        style={{ height: CONTROLS_H }}
      >
        {/* Anterior */}
        <button
          onClick={prevPage}
          disabled={page <= 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition font-lato text-sm font-bold"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        {/* Página + cerrar */}
        <div className="flex items-center gap-4">
          <span className="font-lato text-sm tabular-nums font-bold">
            {page} / {numPages ?? "—"}
          </span>
          {puedeDescargar && (
            <a
              href={src}
              download
              className="flex items-center gap-1.5 text-xs bg-[#c9a84c] hover:bg-[#f0d070] text-[#1a3d2b] font-black px-3 py-2 rounded-full transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Descargar
            </a>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-red-500/70 transition font-lato text-xs"
          >
            <X className="w-4 h-4" /> Cerrar
          </button>
        </div>

        {/* Siguiente */}
        <button
          onClick={nextPage}
          disabled={page >= (numPages ?? 1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition font-lato text-sm font-bold"
        >
          Siguiente <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}

// ── MODO PRESENTACIÓN: miniatura + botón abrir fullscreen ─────────────────────
function PresentationViewer({ src, puedeDescargar }) {
  const [open, setOpen] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPreviewWidth(e.contentRect.width));
    ro.observe(el);
    setPreviewWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      {/* Vista previa en la tarjeta */}
      <div
        ref={previewRef}
        className="relative w-full bg-[#111] overflow-hidden cursor-pointer group"
        style={{ aspectRatio: "16/9" }}
        onClick={() => setOpen(true)}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Document
          file={src}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          {previewWidth && (
            <Page
              pageNumber={1}
              width={previewWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          )}
        </Document>

        {/* Overlay al hacer hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center gap-2">
            <div className="bg-[#c9a84c] text-[#1a3d2b] rounded-full p-4 shadow-2xl">
              <Maximize2 className="w-8 h-8" />
            </div>
            <span className="text-white font-lato font-bold text-sm drop-shadow-lg">
              Ver en pantalla completa
            </span>
          </div>
        </div>

        {/* Contador de páginas */}
        {numPages && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white font-lato text-xs px-2 py-1 rounded-full">
            {numPages} páginas
          </div>
        )}
      </div>

      {/* Botón explícito debajo de la miniatura */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-[#1a3d2b] hover:bg-[#2d5a43] text-[#c9a84c] font-lato font-bold text-sm py-3 transition-colors"
      >
        <Maximize2 className="w-4 h-4" /> Abrir presentación en pantalla completa
      </button>

      {open && (
        <FullscreenViewer
          src={src}
          puedeDescargar={puedeDescargar}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// ── EXPORT PRINCIPAL ──────────────────────────────────────────────────────────
export default function PDFViewer({ src, puedeDescargar = false, presentation = false }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [error, setError] = useState(false);

  if (presentation) {
    return <PresentationViewer src={src} puedeDescargar={puedeDescargar} />;
  }

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(numPages ?? p, p + 1));

  if (error) {
    return (
      <div className="text-center py-10 text-[#1a3d2b]/60 font-lato text-sm">
        No se pudo cargar el PDF. Intentá más tarde.
      </div>
    );
  }

  // ── MODO DOCUMENTO (por defecto) ───────────────────────────────────────────
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-3 bg-[#1a3d2b] text-white px-4 py-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevPage} disabled={page <= 1} className="p-1 rounded hover:bg-white/20 disabled:opacity-30 transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-lato text-sm">{page} / {numPages ?? "—"}</span>
          <button onClick={nextPage} disabled={page >= (numPages ?? 1)} className="p-1 rounded hover:bg-white/20 disabled:opacity-30 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale((s) => Math.max(0.6, s - 0.2))} className="p-1 rounded hover:bg-white/20 transition">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-lato text-xs">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(2.5, s + 0.2))} className="p-1 rounded hover:bg-white/20 transition">
            <ZoomIn className="w-4 h-4" />
          </button>
          {puedeDescargar && (
            <a href={src} download className="ml-2 flex items-center gap-1 text-xs bg-[#c9a84c] hover:bg-[#f0d070] text-[#1a3d2b] font-bold px-3 py-1 rounded-full transition-all">
              <Download className="w-3 h-3" /> Descargar
            </a>
          )}
        </div>
      </div>
      <div className="overflow-auto w-full bg-gray-100" style={{ maxHeight: "70vh" }} onContextMenu={(e) => e.preventDefault()}>
        <Document
          file={src}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPage(1); }}
          onLoadError={() => setError(true)}
          loading={<div className="py-16 text-center text-[#1a3d2b]/50 font-lato text-sm">Cargando PDF…</div>}
        >
          <Page pageNumber={page} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
        </Document>
      </div>
    </div>
  );
}
