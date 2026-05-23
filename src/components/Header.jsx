import { motion } from "framer-motion";

export default function Header({ visitedSections, totalSections = 7 }) {
  const progress = (visitedSections.length / totalSections) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-premium shadow-2xl">
      {/* Fila principal */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo + Nombre */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="logo-glow-ring rounded-full flex-shrink-0">
            <img
              src="/logo.png"
              alt="Espacio Semillas"
              className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover"
            />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[#ffea00] font-allura text-3xl md:text-4xl font-medium tracking-wide header-brand-glow">
              Espacio Semillas
            </span>
            <span className="text-[#c9a84c]/80 font-lato text-xs md:text-sm uppercase tracking-[0.2em] mt-0.5">
              Constelaciones Familiares
            </span>
          </div>
        </div>

        {/* Título centrado */}
        <div className="text-center flex-1 px-4">
          <h1
            className="text-white font-playfair text-base md:text-2xl lg:text-3xl font-black tracking-tight header-title-glow"
            style={{
              WebkitFontSmoothing: "antialiased",
              textRendering: "optimizeLegibility",
            }}
          >
            Lección 9{" "}
            <span className="text-dorado mx-1 opacity-90">·</span>{" "}
            <span className="block sm:inline">Constelaciones Organizacionales</span>
          </h1>
        </div>

        {/* Progreso — solo desktop */}
        <div className="hidden md:flex flex-col items-end gap-1.5 flex-shrink-0">
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

      {/* Progreso — solo móvil */}
      <div className="md:hidden flex items-center justify-center gap-3 pb-3">
        <span className="text-dorado-claro text-[11px] font-lato">
          {visitedSections.length}/{totalSections}
        </span>
        <div className="w-40 h-2 bg-verde-medio/40 rounded-full overflow-hidden">
          <motion.div
            className="h-full progress-bar-animated rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </header>
  );
}
