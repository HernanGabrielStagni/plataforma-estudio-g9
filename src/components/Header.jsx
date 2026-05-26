import { motion } from "framer-motion";
import { asset } from "../lib/assets";
import { Menu, X } from "lucide-react";

export default function Header({ visitedSections, totalSections = 7, sidebarOpen, onMenuToggle, currentSectionLabel = '' }) {
  const progress = (visitedSections.length / totalSections) * 100;

  return (
    <>
      {/* ── MÓVIL: barra fija pequeña con logo + hamburguesa ── */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden header-premium shadow-xl">
        <div className="flex items-center h-[56px] px-3 gap-2">
          {/* Logo — izquierda */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="logo-glow-ring rounded-full flex-shrink-0">
              <img
                src={asset("/logo.png")}
                alt="Espacio Semillas"
                className="h-9 w-9 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Sección actual — centro */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1">
            <span className="text-[#ffea00] font-allura text-lg font-medium tracking-wide header-brand-glow leading-tight">
              Espacio Semillas
            </span>
            {currentSectionLabel && (
              <span className="text-white/80 font-lato text-[10px] uppercase tracking-[0.18em] leading-tight truncate w-full text-center">
                {currentSectionLabel}
              </span>
            )}
          </div>

          {/* Hamburguesa — derecha */}
          <button
            onClick={onMenuToggle}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/20 transition-colors flex-shrink-0"
            aria-label="Abrir menú"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── DESKTOP: header completo fijo (sin cambios) ── */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 header-premium shadow-2xl">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo + Nombre */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="logo-glow-ring rounded-full flex-shrink-0">
              <img
                src={asset("/logo.png")}
                alt="Espacio Semillas"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[#ffea00] font-allura text-4xl font-medium tracking-wide header-brand-glow">
                Espacio Semillas
              </span>
              <span className="text-[#c9a84c]/80 font-lato text-sm uppercase tracking-[0.2em] mt-0.5">
                Constelaciones Familiares
              </span>
              <span className="text-[#c9a84c]/80 font-lato text-sm uppercase tracking-[0.2em] mt-0.5">
                DISEÑADO POR: Hernán Gabriel Stagni
              </span>
            </div>
          </div>

          {/* Título centrado */}
          <div className="text-center flex-1 px-4">
            <h1
              className="text-white font-playfair text-2xl lg:text-3xl font-black tracking-tight header-title-glow"
              style={{ WebkitFontSmoothing: "antialiased", textRendering: "optimizeLegibility" }}
            >
              Lección 9{" "}
              <span className="text-dorado mx-1 opacity-90">·</span>{" "}
              Constelaciones Organizacionales
            </h1>
          </div>

          {/* Progreso */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="text-dorado-claro text-xs font-lato">
              {visitedSections.length}/{totalSections} secciones
            </span>
            <div className="w-36 h-2.5 bg-verde-medio/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full progress-bar-animated rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
