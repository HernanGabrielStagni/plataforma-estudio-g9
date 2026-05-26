import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFViewer({ src }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [error, setError] = useState(false);

  const onLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setPage(1);
  }, []);

  if (error) {
    return (
      <div className="text-center py-10 text-[#1a3d2b]/60 font-lato text-sm">
        No se pudo cargar el PDF. Intentá más tarde.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Controles */}
      <div className="flex items-center gap-3 bg-[#1a3d2b] text-white px-4 py-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1 rounded hover:bg-white/20 disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-lato text-sm">
            {page} / {numPages ?? "—"}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(numPages ?? p, p + 1))}
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
        </div>
      </div>

      {/* Documento */}
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
