import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  CheckCircle,
  Circle,
  Home,
  PlayCircle,
  Presentation,
  Image,
  FileText,
  BookOpen,
  CheckSquare,
} from "lucide-react";
import { useState } from "react";

const groups = [
  {
    label: null,
    items: [
      { id: "inicio", label: "Bienvenida", icon: Home },
    ],
  },
  {
    label: "CLASES",
    items: [
      { id: "videos", label: "Video Clases", icon: PlayCircle },
    ],
  },
  {
    label: "CONTENIDOS",
    items: [
      { id: "presentaciones", label: "Presentaciones", icon: Presentation },
      { id: "infografias", label: "Infografías", icon: Image },
      { id: "documentos", label: "Documentos", icon: FileText },
    ],
  },
  {
    label: "EVALUACIÓN",
    items: [
      { id: "resumen", label: "Síntesis General", icon: BookOpen },
      { id: "quiz", label: "Examen de Unidad", icon: CheckSquare, isQuiz: true },
    ],
  },
];

const sections = groups.flatMap((g) => g.items);
export { sections };

export default function Sidebar({
  currentSection,
  onSectionChange,
  visitedSections,
  onToggleVisited,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    setIsOpen(false);
  };

  const NavContent = () => (
    <nav className="py-6 px-4">
      {/* Título */}
      <div className="mb-8 flex flex-col items-center">
        <p
          className="text-[28px] text-[#1a3d2b] font-playfair font-black text-center leading-tight"
          style={{
            textShadow: "1px 1px 0px #ffffff, 1px 2px 3px rgba(197, 179, 20, 1)",
          }}
        >
          Lección 9
        </p>
        <p className="text-[#1a3d2b]/60 font-lato text-[11px] uppercase tracking-[0.2em] mt-0.5 text-center">
          Constelaciones Organizacionales
        </p>
        <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-dorado to-transparent mt-3 opacity-70"></div>
      </div>

      <div className="space-y-6">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-[10px] font-black text-[#1a3d2b]/50 uppercase tracking-[0.2em] font-lato">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-[#1a3d2b]/15"></div>
              </div>
            )}

            <ul className="space-y-2">
              {group.items.map((section) => {
                const isActive = currentSection === section.id;
                const isVisited = visitedSections.includes(section.id);
                const Icon = section.icon;

                if (section.isQuiz) {
                  return (
                    <li key={section.id}>
                      <motion.button
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSectionClick(section.id)}
                        className={`relative w-full overflow-hidden flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-playfair font-black text-[15px] tracking-wide transition-all duration-400 border-b-4 ${
                          isActive
                            ? "bg-dorado text-verde-oscuro border-dorado-claro shadow-[0_12px_25px_rgba(26,61,43,0.4)]"
                            : "bg-gradient-to-br from-[#1a3d2b] to-[#2d5a43] text-[#c9a84c] border-[#132c1f] shadow-[0_8px_20px_rgba(19,44,31,0.4)] hover:shadow-[0_14px_30px_rgba(19,44,31,0.5)]"
                        }`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                        <span>{section.label}</span>
                        {isVisited && (
                          <CheckCircle className="w-4 h-4 opacity-70" />
                        )}
                      </motion.button>
                    </li>
                  );
                }

                return (
                  <li key={section.id}>
                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 border ${
                        isActive
                          ? "bg-white border-[#c9a84c] ring-2 ring-[#c9a84c]/25 shadow-[0_8px_20px_rgba(26,61,43,0.25)]"
                          : "bg-[#ddeae2] border-[#c9a84c]/20 hover:border-[#c9a84c]/50 hover:bg-white/80 shadow-[0_4px_12px_rgba(26,61,43,0.15)] hover:shadow-[0_8px_20px_rgba(26,61,43,0.25)]"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isActive
                            ? "bg-[#1a3d2b] text-[#c9a84c] shadow-md"
                            : "bg-[#1a3d2b]/80 text-[#c9a84c]/80"
                        }`}
                      >
                        <Icon className="w-4 h-4" strokeWidth={2} />
                      </div>

                      <span
                        className={`flex-1 text-left font-playfair font-black text-[14px] transition-all duration-300 ${
                          isActive ? "text-[#1a3d2b]" : "text-[#1a3d2b]/80"
                        }`}
                        style={{
                          textShadow: isActive ? "1px 1px 0 #fff" : "none",
                        }}
                      >
                        {section.label}
                      </span>

                      <button
                        className="flex-shrink-0 p-0.5 rounded-full hover:scale-110 transition-transform"
                        title={isVisited ? "Marcar como no visto" : "Marcar como visto"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVisited(section.id);
                        }}
                      >
                        {isVisited || isActive ? (
                          <motion.div
                            animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                            transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
                          >
                            <CheckCircle
                              className="w-5 h-5 text-[#c9a84c]"
                              strokeWidth={2.5}
                            />
                          </motion.div>
                        ) : (
                          <Circle
                            className="w-5 h-5 text-verde-oscuro/20"
                            strokeWidth={2}
                          />
                        )}
                      </button>
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Botón hamburguesa (móvil) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-[120px] left-4 z-40 md:hidden bg-verde-oscuro text-white p-2.5 rounded-full shadow-lg hover:bg-verde-medio transition-colors"
        aria-label="Abrir menú"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-[112px] bottom-0 w-[280px] bg-[#8fb49b] border-r-2 border-[#c9a84c]/10 overflow-y-auto">
        <NavContent />
        <div className="mt-auto px-6 py-6 border-t border-verde-oscuro/10 bg-black/10">
          <p className="text-[10px] text-verde-oscuro font-lato text-center leading-relaxed font-black tracking-[0.15em]">
            PLATAFORMA · GUÍA 9
            <br />
            <span className="text-[#ffea00] font-allura text-[20px] tracking-normal drop-shadow-md block mt-1">
              Espacio Semillas
            </span>
          </p>
        </div>
      </aside>

      {/* Sidebar móvil */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-[112px] bottom-0 w-[300px] bg-[#8fb49b] z-40 md:hidden overflow-y-auto shadow-2xl"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
