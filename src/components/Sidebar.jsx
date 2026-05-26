import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Home,
  PlayCircle,
  Presentation,
  Image,
  FileText,
  BookOpen,
  CheckSquare,
  Settings,
  LogOut,
  User,
} from "lucide-react";

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
  {
    label: null,
    items: [
      { id: "configuracion", label: "Configuración", icon: Settings, noVisit: true },
    ],
  },
];

const sections = groups.flatMap((g) => g.items);
export { sections };

const PLAN_LABELS = { vip: 'VIP ✦', pro: 'Pro', trial: 'Trial' };
const PLAN_STYLES = {
  vip:   'bg-gradient-to-r from-[#c9a84c] to-[#f0d070] text-[#1a3d2b] shadow-[0_2px_8px_rgba(201,168,76,0.5)]',
  pro:   'bg-gradient-to-r from-[#2d8a5f] to-[#3aad7a] text-white shadow-[0_2px_8px_rgba(45,138,95,0.4)]',
  trial: 'bg-[#1a3d2b]/50 text-white/70',
};

function UserFooter({ userEmail, plan }) {
  const handleLogout = () => {
    if (typeof window.cerrarSesion === 'function') window.cerrarSesion();
  };
  const nombre = userEmail ? userEmail.split('@')[0] : '';
  return (
    <div className="mx-3 mb-4 mt-2 rounded-2xl overflow-hidden border border-white/15 shadow-lg"
         style={{ background: 'linear-gradient(135deg, rgba(26,61,43,0.7) 0%, rgba(20,50,35,0.9) 100%)', backdropFilter: 'blur(8px)' }}>
      {/* Info usuario */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-[#c9a84c]/50"
             style={{ background: 'rgba(201,168,76,0.15)' }}>
          <User className="w-4 h-4 text-[#c9a84c]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-lato font-bold text-[13px] truncate leading-tight">{nombre}</p>
          <p className="text-white/45 font-lato text-[10px] truncate leading-none mt-0.5">{userEmail}</p>
        </div>
        {plan && (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0 tracking-wide ${PLAN_STYLES[plan] || PLAN_STYLES.trial}`}>
            {PLAN_LABELS[plan] || plan}
          </span>
        )}
      </div>

      {/* Separador */}
      <div className="mx-4 h-px bg-white/10 mb-3" />

      {/* Botón cerrar sesión */}
      <div className="px-3 pb-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-lato font-bold text-xs tracking-wide transition-all duration-200 border border-red-400/40 text-red-300 hover:text-white hover:bg-red-500 hover:border-red-500 hover:shadow-[0_4px_14px_rgba(239,68,68,0.4)]"
          style={{ background: 'rgba(239,68,68,0.12)' }}
        >
          <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({
  currentSection,
  onSectionChange,
  visitedSections,
  onToggleVisited,
  userEmail = '',
  plan = null,
  isOpen = false,
  onToggle = () => {},
}) {
  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    onToggle(false);
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
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-[112px] bottom-0 w-[280px] bg-[#8fb49b] border-r-2 border-[#c9a84c]/10 overflow-y-auto">
        <NavContent />
        <div className="mt-auto">
          <UserFooter userEmail={userEmail} plan={plan} />
        </div>
      </aside>

      {/* Sidebar móvil — se abre desde el header */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"
              onClick={() => onToggle(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-[56px] bottom-0 w-[300px] bg-[#8fb49b] z-40 md:hidden overflow-y-auto shadow-2xl flex flex-col"
            >
              <NavContent />
              <div className="mt-auto">
                <UserFooter userEmail={userEmail} plan={plan} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
