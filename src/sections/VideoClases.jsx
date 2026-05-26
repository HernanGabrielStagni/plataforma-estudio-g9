import { useRef, useState } from "react";
import { asset } from "../lib/assets";
import { motion } from "framer-motion";
import { SectionHeader } from "../components/UIComponents";
import { PlayCircle } from "lucide-react";
import PlanOverlay from "../components/PlanOverlay";

const TRIAL_LIMIT = 4 * 60 // 4 minutos en segundos

const videos = [
  {
    id: 1,
    src: asset("/media/Fuerzas_Ocultas_Laborales.mp4"),
    titulo: "Fuerzas Ocultas Laborales",
    subtitulo: "Dinámicas invisibles en el entorno organizacional",
    emoji: "🌀",
    descripcion:
      "Esta clase inaugura el abordaje de las organizaciones desde la mirada sistémica. Se exploran las fuerzas ocultas que determinan el comportamiento de equipos, empresas e instituciones: lealtades invisibles, exclusiones, órdenes no reconocidos y patrones que se repiten a través de las jerarquías.",
    conceptos: [
      "De la familia a la organización: semejanzas y diferencias fundamentales",
      "La jerarquía basada en capacidad y no en vínculo emocional",
      "Fuerzas ocultas: lealtades, exclusiones y patrones repetidos",
      "El rol de las finanzas como prioridad del sistema organizacional",
    ],
  },
  {
    id: 2,
    src: asset("/media/Dominando_Constelaciones.mp4"),
    titulo: "Dominando Constelaciones",
    subtitulo: "Técnica y metodología del trabajo organizacional",
    emoji: "🎯",
    descripcion:
      "Una inmersión práctica en la técnica de las constelaciones organizacionales. Se desarrollan los conceptos de apertura, pregunta sistémica y manejo del campo de conocimiento. El facilitador aprende a leer los movimientos de los representantes y a guiar el proceso hacia resoluciones genuinas.",
    conceptos: [
      "El campo de conocimiento: percepción suplente en acción",
      "Tipos de preguntas: apertura vs. cierre en la constelación",
      "La comunicación como canal exclusivo del facilitador",
      "Cómo leer los movimientos corporales de los representantes",
    ],
  },
  {
    id: 3,
    src: asset("/media/Constelación_Organizacional.mp4"),
    titulo: "Constelación Organizacional",
    subtitulo: "Práctica integral y casos de aplicación",
    emoji: "🏛️",
    descripcion:
      "En esta clase se integran todos los conceptos previos a través de la práctica. Se muestran los cuatro tipos de constelación organizacional en acción —regular, de consulta, de varios niveles y oculta—, junto con las frases sanadoras específicas para resolver dinámicas en sistemas organizacionales.",
    conceptos: [
      "Constelación regular, de consulta, de varios niveles y oculta",
      "Frases sanadoras: 'Tú eres el grande y yo el pequeño'",
      "Representantes: voluntariedad y neutralidad como condición",
      "Cuándo finalizar una constelación: señales de resolución",
    ],
  },
];

function VideoPlayer({ src, plan }) {
  const videoRef = useRef(null)
  const [bloqueado, setBloqueado] = useState(false)

  function handleTimeUpdate() {
    if (plan !== 'trial') return
    if (videoRef.current && videoRef.current.currentTime >= TRIAL_LIMIT) {
      videoRef.current.pause()
      setBloqueado(true)
    }
  }

  function handleClose() {
    setBloqueado(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div style={{ position: 'relative' }} className="aspect-video w-full bg-black">
      <video
        ref={videoRef}
        src={src}
        controls
        preload="metadata"
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
      />
      {bloqueado && <PlanOverlay tipo="video" onClose={handleClose} />}
    </div>
  )
}

export default function VideoClases({ plan = 'vip' }) {
  return (
    <div className="space-y-12 max-w-4xl">
      <SectionHeader
        emoji="🎬"
        title="Video Clases"
        subtitle="Tres clases que forman el núcleo teórico y práctico de la Lección 9"
      />

      {plan === 'trial' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-800 -mt-4">
          ☀️ <strong>Plan Trial:</strong> podés ver los primeros 4 minutos de cada video. Mejorá tu plan para acceso completo.
        </div>
      )}

      {videos.map((video, i) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          className="bg-white rounded-2xl border border-crema shadow-card overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#1a3d2b] to-[#2d6a4f] px-6 py-4 flex items-center gap-3">
            <span className="text-2xl">{video.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <PlayCircle className="text-dorado w-5 h-5" />
                <span className="text-dorado text-xs font-bold uppercase tracking-widest">
                  Video Clase · {video.id} de {videos.length}
                </span>
              </div>
              <h3 className="text-white font-playfair text-xl font-black mt-0.5 !text-white !shadow-none m-0">
                {video.titulo}
              </h3>
              <p className="text-white/60 font-lato text-xs mt-0.5">
                {video.subtitulo}
              </p>
            </div>
          </div>

          <VideoPlayer src={video.src} plan={plan} />

          <div className="p-6 space-y-5">
            <div>
              <h4 className="font-playfair font-bold text-[#1a3d2b] text-lg mb-2">
                Sobre esta clase
              </h4>
              <p className="text-[#1a3d2b]/75 font-lato text-[15px] leading-relaxed">
                {video.descripcion}
              </p>
            </div>

            <div className="bg-[#f5f0e8] rounded-xl p-5 border border-dorado/15">
              <h4 className="font-lato font-bold text-[#1a3d2b] text-sm uppercase tracking-wider mb-3">
                Temas desarrollados en esta clase
              </h4>
              <ul className="space-y-2">
                {video.conceptos.map((concepto, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-dorado mt-1 flex-shrink-0">◆</span>
                    <span className="text-[#1a3d2b]/80 font-lato text-[14px] leading-snug">
                      {concepto}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
