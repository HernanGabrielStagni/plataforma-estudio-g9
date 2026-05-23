import { asset } from "../lib/assets";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "../components/UIComponents";
import { X, ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";

const infografias = [
  {
    id: 1,
    src: asset("/media/Bases_de_Constelaciones_Organizacionales.png"),
    titulo: "Bases de Constelaciones Organizacionales",
    subtitulo: "Fundamentos teóricos y campo de conocimiento",
    descripcion:
      "Esta infografía presenta los pilares conceptuales que distinguen a las constelaciones organizacionales de las familiares. Muestra esquemáticamente cómo el campo de conocimiento opera en entornos laborales: los representantes perciben información del sistema sin conocerlo previamente, actuando como canales de 'percepción suplente' que revelan la arquitectura invisible de la organización.",
    puntosClave: [
      "La organización transfiere valor añadido; la familia transmite la vida",
      "La jerarquía se basa en la capacidad, no en el vínculo emocional",
      "La supervivencia del sistema depende de las finanzas, que tienen prioridad",
      "El campo de conocimiento permite percibir sin información previa",
    ],
  },
  {
    id: 2,
    src: asset("/media/El_Alma_de_las_Organizaciones.png"),
    titulo: "El Alma de las Organizaciones",
    subtitulo: "Las tres facetas de la conciencia colectiva",
    descripcion:
      "Representación visual de las tres facetas de la conciencia que regulan los sistemas organizacionales. La infografía muestra cómo la pertenencia, el equilibrio y el orden operan como fuerzas invisibles que determinan el comportamiento de cada miembro del sistema, generando lealtades, conflictos y patrones repetidos que solo se comprenden desde una mirada sistémica.",
    puntosClave: [
      "Pertenencia: el miedo a la exclusión se siente como culpa o inocencia",
      "Equilibrio: la conciencia regula la compensación entre dar y tomar",
      "Orden: quien llega antes tiene prioridad jerárquica en el sistema",
      "Las tres facetas operan de forma simultánea e interdependiente",
    ],
  },
  {
    id: 3,
    src: asset("/media/Guía_de_Constelaciones_Organizacionales.png"),
    titulo: "Guía de Constelaciones Organizacionales",
    subtitulo: "Tipos de constelación y frases sanadoras",
    descripcion:
      "Esta infografía sintetiza los cuatro tipos de constelación organizacional y las frases sanadoras asociadas a cada dinámica. Funciona como una guía de referencia rápida para el facilitador: desde la constelación regular hasta la oculta, pasando por criterios de aplicación, movimientos de resolución y principios éticos del trabajo sistémico en organizaciones.",
    puntosClave: [
      "Regular: formato clásico con representantes en grupo abierto",
      "Consulta: el cliente externo funciona como asesor estratégico",
      "Varios niveles: protege al empleado sin exponer el conflicto",
      "Oculta: solo el cliente conoce los roles de los representantes",
    ],
  },
];

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.4;

function ImageViewer({ img, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const containerRef = useRef(null);

  const resetView = useCallback(() => {
    setZoom(1);
    setPos({ x: 0, y: 0 });
  }, []);

  const clampZoom = (z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => clampZoom(z + delta));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const onMouseMove = (e) => {
    if (!dragging || !dragStart.current) return;
    setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const onMouseUp = () => setDragging(false);

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      setDragging(true);
      dragStart.current = { x: e.touches[0].clientX - pos.x, y: e.touches[0].clientY - pos.y };
    }
  };

  const onTouchMove = (e) => {
    if (!dragging || !dragStart.current || e.touches.length !== 1) return;
    setPos({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/92 flex flex-col backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Barra superior */}
      <div
        className="flex items-center justify-between px-5 py-3 bg-black/60 border-b border-white/10 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-white font-playfair font-bold text-base leading-tight">{img.titulo}</p>
          <p className="text-white/50 font-lato text-xs mt-0.5">{img.subtitulo}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom out */}
          <button
            onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/15"
            title="Alejar"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {/* Porcentaje */}
          <span className="text-white/70 font-lato text-xs w-12 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          {/* Zoom in */}
          <button
            onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/15"
            title="Acercar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {/* Reset */}
          <button
            onClick={resetView}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/15"
            title="Restablecer vista"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {/* Fullscreen hint */}
          <div className="hidden sm:flex items-center gap-1.5 text-white/35 font-lato text-[11px] ml-2">
            <Maximize2 className="w-3 h-3" />
            <span>Rueda = zoom · Arrastrar = mover</span>
          </div>
          {/* Cerrar */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-red-500/70 flex items-center justify-center text-white transition-colors border border-white/20 ml-2"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Área de imagen */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => setDragging(false)}
      >
        <div
          style={{
            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${zoom})`,
            transformOrigin: "center center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transition: dragging ? "none" : "transform 0.15s ease-out",
            userSelect: "none",
            maxWidth: "90vw",
            maxHeight: "80vh",
          }}
        >
          <img
            src={img.src}
            alt={img.titulo}
            draggable={false}
            style={{ display: "block", maxWidth: "85vw", maxHeight: "78vh", objectFit: "contain" }}
            className="rounded-lg shadow-2xl"
          />
        </div>

        {/* Indicador de hint (sólo cuando zoom = 1) */}
        {zoom <= 1.05 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 text-white/70 text-xs font-lato px-4 py-2 rounded-full border border-white/15 pointer-events-none"
          >
            <span>🔍</span>
            <span>Usá la rueda del mouse o los botones para acercar</span>
          </motion.div>
        )}
      </div>

      {/* Barra de zoom rápido inferior */}
      <div
        className="flex items-center justify-center gap-3 py-3 bg-black/50 border-t border-white/10 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {[0.75, 1, 1.5, 2, 3].map((z) => (
          <button
            key={z}
            onClick={() => { setZoom(z); setPos({ x: 0, y: 0 }); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold font-lato transition-all border ${
              Math.abs(zoom - z) < 0.05
                ? "bg-dorado text-verde-oscuro border-dorado"
                : "bg-white/10 text-white/70 border-white/15 hover:bg-white/20"
            }`}
          >
            {z === 1 ? "100%" : z === 0.75 ? "75%" : `${z * 100}%`}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function Infografias() {
  const [modalImg, setModalImg] = useState(null);

  return (
    <div className="space-y-10 max-w-4xl">
      <SectionHeader
        emoji="🖼️"
        title="Infografías"
        subtitle="Síntesis visual de los conceptos clave con explicación detallada"
      />

      <p className="text-[#1a3d2b]/70 font-lato text-[15px] leading-relaxed -mt-4">
        Cada infografía condensa visualmente un concepto central de la lección.
        Podés ampliarlas haciendo clic sobre la imagen para ver todos los
        detalles.
      </p>

      <div className="space-y-10">
        {infografias.map((inf, i) => (
          <motion.div
            key={inf.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-white rounded-2xl border border-crema shadow-card overflow-hidden"
          >
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d6a4f] px-6 py-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#90caf9] text-xs font-bold uppercase tracking-widest font-lato">
                  Infografía · {i + 1} de {infografias.length}
                </span>
              </div>
              <h3 className="text-white font-playfair text-xl font-black m-0 !text-white !shadow-none">
                {inf.titulo}
              </h3>
              <p className="text-white/60 font-lato text-xs mt-0.5">
                {inf.subtitulo}
              </p>
            </div>

            {/* Layout: imagen + descripción lado a lado en desktop */}
            <div className="flex flex-col lg:flex-row">
              {/* Imagen */}
              <div
                className="relative lg:w-2/5 flex-shrink-0 bg-verde-oscuro/5 group cursor-zoom-in"
                onClick={() => setModalImg(inf)}
              >
                <img
                  src={inf.src}
                  alt={inf.titulo}
                  className="w-full h-full object-cover lg:max-h-[420px] transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                    <ZoomIn className="w-6 h-6 text-[#1a3d2b]" />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="flex-1 p-6 space-y-5">
                <div>
                  <h4 className="font-playfair font-bold text-[#1a3d2b] text-lg mb-2">
                    ¿Qué muestra esta infografía?
                  </h4>
                  <p className="text-[#1a3d2b]/75 font-lato text-[15px] leading-relaxed">
                    {inf.descripcion}
                  </p>
                </div>

                <div className="bg-[#eaf4ef] rounded-xl p-4 border border-[#2d6a4f]/15">
                  <h4 className="font-lato font-bold text-[#1a3d2b] text-xs uppercase tracking-wider mb-3">
                    Puntos clave a observar
                  </h4>
                  <ul className="space-y-2">
                    {inf.puntosClave.map((punto, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-[#2d6a4f] mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-[#1a3d2b]/80 font-lato text-[13px] leading-snug">
                          {punto}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setModalImg(inf)}
                  className="text-sm text-[#2d6a4f] font-bold font-lato flex items-center gap-1.5 hover:text-dorado transition-colors"
                >
                  <ZoomIn className="w-4 h-4" /> Ver en tamaño completo
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visor con zoom y arrastre */}
      <AnimatePresence>
        {modalImg && (
          <ImageViewer img={modalImg} onClose={() => setModalImg(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
