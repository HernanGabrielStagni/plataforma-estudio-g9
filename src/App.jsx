import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Sidebar, { sections } from "./components/Sidebar";
import IntroScreen from "./components/IntroScreen";
import AuthGate from "./components/AuthGate";
import Configuracion from "./sections/Configuracion";
import { usePlan } from "./lib/usePlan";
import { recordVisit, removeVisit, getVisitedSections } from "./lib/supabase";

import Inicio from "./sections/Inicio";
import VideoClases from "./sections/VideoClases";
import Presentaciones from "./sections/Presentaciones";
import Infografias from "./sections/Infografias";
import Documentos from "./sections/Documentos";
import ResumenGeneral from "./sections/ResumenGeneral";
import Quiz9 from "./sections/Quiz9";

const sectionComponents = {
  inicio: Inicio,
  videos: VideoClases,
  presentaciones: Presentaciones,
  infografias: Infografias,
  documentos: Documentos,
  resumen: ResumenGeneral,
  quiz: Quiz9,
};

export default function App() {
  const [currentSection, setCurrentSection] = useState("inicio");
  const [visitedSections, setVisitedSections] = useState([]);
  const [showIntro, setShowIntro] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { plan, puedeDescargar } = usePlan(isAdminUser);

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType("navigation");
    let isReload = false;
    if (navigationEntries.length > 0) {
      isReload = navigationEntries[0].type === "reload";
    } else {
      isReload = performance.navigation.type === 1;
    }
    if (isReload) {
      setShowIntro(false);
    } else {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    async function loadVisited() {
      const visited = await getVisitedSections();
      setVisitedSections(visited);
    }
    loadVisited();
  }, []);

  const handleToggleVisited = useCallback(async (sectionId) => {
    if (visitedSections.includes(sectionId)) {
      await removeVisit(sectionId);
      setVisitedSections((prev) => prev.filter((s) => s !== sectionId));
    } else {
      await recordVisit(sectionId);
      setVisitedSections((prev) => [...prev, sectionId]);
    }
  }, [visitedSections]);

  const handleSectionChange = useCallback(async (sectionId) => {
    setCurrentSection(sectionId);
    await recordVisit(sectionId);
    setVisitedSections((prev) => {
      if (prev.includes(sectionId)) return prev;
      return [...prev, sectionId];
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    recordVisit("inicio");
    setVisitedSections((prev) => {
      if (prev.includes("inicio")) return prev;
      return [...prev, "inicio"];
    });
  }, []);

  const validSectionIds = sections.map((s) => s.id);
  const validVisitedSections = visitedSections.filter((s) =>
    validSectionIds.includes(s)
  );

  const CurrentSectionComponent = currentSection === "configuracion"
    ? () => <Configuracion isAdminUser={isAdminUser} userEmail={userEmail} />
    : plan
      ? () => {
          const Comp = sectionComponents[currentSection]
          return <Comp plan={plan} puedeDescargar={puedeDescargar} />
        }
      : () => null;

  return (
    <AuthGate onAuthReady={(admin, email) => { setIsAdminUser(admin); setUserEmail(email || ''); }}>
      <div className="min-h-screen bg-blanco-calido texture-overlay">
        <AnimatePresence>
          {showIntro && (
            <IntroScreen key="intro" onComplete={handleIntroComplete} />
          )}
        </AnimatePresence>

        <Header
          visitedSections={validVisitedSections}
          totalSections={sections.length}
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          currentSectionLabel={sections.find(s => s.id === currentSection)?.label || ''}
        />

        <Sidebar
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
          visitedSections={validVisitedSections}
          onToggleVisited={handleToggleVisited}
          userEmail={userEmail}
          plan={plan}
          isOpen={sidebarOpen}
          onToggle={(v) => setSidebarOpen(v)}
        />

        <main className="md:ml-[280px] pt-[112px] min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={`${currentSection === "quiz" ? "p-0" : "p-6 md:p-10"} pt-[60px] md:pt-0`}
            >
              <CurrentSectionComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </AuthGate>
  );
}
