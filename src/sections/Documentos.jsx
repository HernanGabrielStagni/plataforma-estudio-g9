import { useRef, useState } from "react";
import { asset } from "../lib/assets";
import { motion } from "framer-motion";
import { SectionHeader } from "../components/UIComponents";
import { FileText, BookOpen, Download, ExternalLink, FileCheck, Music } from "lucide-react";
import PlanOverlay from "../components/PlanOverlay";
import PDFViewer from "../components/PDFViewer";

const TRIAL_LIMIT = 4 * 60

const documentos = [
  {
    tipo: "PDF",
    icon: BookOpen,
    color: "from-[#1a3d2b] to-[#2d6a4f]",
    colorBadge: "bg-[#1a3d2b] text-white",
    titulo: "Capítulo 9 · Constelaciones Organizacionales",
    subtitulo: "Lectura base del curso",
    src: asset("/media/09-Capitulo_9-CURSO_CONSTELACIONES.pdf"),
    descripcion:
      "Lectura fundamental de la lección. Este capítulo desarrolla en profundidad la teoría de las constelaciones organizacionales: la diferencia con las familiares, el campo de conocimiento, las tres facetas de la conciencia y los tipos de constelación. Es la base teórica que sustenta todos los demás materiales de la Lección 9.",
    indicaciones: [
      "Leé este material antes o después de ver las video clases",
      "Prestá atención a las diferencias entre familia y organización",
      "Subrayá las frases sanadoras y los criterios de cada tipo de constelación",
      "Vinculá la lectura con los conceptos de las infografías",
    ],
    showPdf: true,
  },
  {
    tipo: "PDF",
    icon: FileCheck,
    color: "from-[#5a4000] to-[#9a7020]",
    colorBadge: "bg-dorado text-verde-oscuro",
    titulo: "Guía de Estudio Maestra · Unidad 9",
    subtitulo: "Actividades y reflexiones de la unidad",
    src: asset("/media/Guia_de_Estudio_Maestra_Unidad_9.pdf"),
    descripcion:
      "Guía de trabajo personal para acompañar el estudio de la Lección 9. Incluye preguntas de reflexión, actividades prácticas y ejercicios de autoindagación para integrar los conceptos vistos en los videos y presentaciones. Diseñada para aplicar la mirada sistémica a entornos organizacionales reales.",
    indicaciones: [
      "Descargá la guía y trabajala en tu propio ritmo",
      "Respondé las preguntas luego de cada video o presentación",
      "Aplicá los ejercicios a organizaciones de tu entorno cercano",
      "Podés imprimirla o completarla directamente en formato digital",
    ],
    showPdf: true,
  },
  {
    tipo: "AUDIO",
    icon: Music,
    color: "from-[#2d4a8a] to-[#4a7af0]",
    colorBadge: "bg-[#2d4a8a] text-white",
    titulo: "Sanar empresas con constelaciones organizacionales",
    subtitulo: "Audio complementario de la unidad",
    src: asset("/media/Sanar_empresas_con_constelaciones_organizacionales.m4a"),
    descripcion:
      "Audio complementario que profundiza en la aplicación práctica de las constelaciones para sanar dinámicas disfuncionales en empresas e instituciones. Ofrece una perspectiva narrativa y experiencial que enriquece los conceptos teóricos desarrollados en los videos y presentaciones.",
    indicaciones: [
      "Escuchá este audio en un momento de tranquilidad y atención plena",
      "Ideal para repasar después de haber visto las video clases",
      "Tomá nota de los casos y ejemplos que se mencionan",
      "Podés escucharlo mientras realizás actividades cotidianas",
    ],
    showPdf: false,
    isAudio: true,
  },
];

function AudioPlayer({ src, plan }) {
  const audioRef = useRef(null)
  const [bloqueado, setBloqueado] = useState(false)

  function handleTimeUpdate() {
    if (plan !== 'trial') return
    if (audioRef.current && audioRef.current.currentTime >= TRIAL_LIMIT) {
      audioRef.current.pause()
      setBloqueado(true)
    }
  }

  function handleClose() {
    setBloqueado(false)
    if (audioRef.current) audioRef.current.currentTime = 0
  }

  return (
    <div style={{ position: 'relative' }} className="px-6 pt-5 pb-2">
      <audio
        ref={audioRef}
        controls
        preload="metadata"
        className="w-full rounded-lg"
        style={{ accentColor: "#c9a84c" }}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={src} type="audio/mp4" />
        Tu navegador no soporta el reproductor de audio.
      </audio>
      {bloqueado && (
        <div style={{ position: 'absolute', inset: 0, padding: '0 24px 8px' }}>
          <PlanOverlay tipo="audio" onClose={handleClose} />
        </div>
      )}
    </div>
  )
}

export default function Documentos({ plan = 'vip', puedeDescargar = true }) {

  return (
    <div className="space-y-10 max-w-4xl">
      <SectionHeader
        emoji="📖"
        title="Documentos"
        subtitle="Lecturas, guías de estudio y material complementario"
      />

      <p className="text-[#1a3d2b]/70 font-lato text-[15px] leading-relaxed -mt-4">
        Estos documentos complementan los videos y presentaciones. Se recomienda
        descargarlos para poder estudiarlos con mayor comodidad.
      </p>

      {!puedeDescargar && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-800 -mt-4">
          {plan === 'trial'
            ? <span>☀️ <strong>Plan Trial:</strong> podés ver los primeros 4 minutos del audio y los PDFs en el navegador. Mejorá tu plan para descargar.</span>
            : <span>🌞 <strong>Plan Pro:</strong> podés ver y escuchar todo el contenido. El plan VIP incluye descarga de archivos.</span>}
        </div>
      )}

      <div className="space-y-8">
        {documentos.map((doc, i) => {
          const Icon = doc.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white rounded-2xl border border-crema shadow-card overflow-hidden"
            >
              {/* Encabezado */}
              <div className={`bg-gradient-to-r ${doc.color} px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-white/80" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${doc.colorBadge} uppercase tracking-widest`}>
                        {doc.tipo}
                      </span>
                      <span className="text-white/60 text-xs font-lato">{doc.subtitulo}</span>
                    </div>
                    <h3 className="text-white font-playfair text-lg font-black mt-0.5 m-0 !text-white !shadow-none">
                      {doc.titulo}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {puedeDescargar && (
                    <a
                      href={doc.src}
                      download
                      className="flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-full transition-all border border-white/20"
                    >
                      <Download className="w-3 h-3" /> Descargar
                    </a>
                  )}
                  {doc.showPdf && puedeDescargar && (
                    <a
                      href={doc.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs bg-white/25 hover:bg-white/35 text-white px-3 py-2 rounded-full transition-all border border-white/30"
                    >
                      <ExternalLink className="w-3 h-3" /> Ver PDF
                    </a>
                  )}
                </div>
              </div>

              {/* Visor PDF embebido para usuarios sin descarga */}
              {doc.showPdf && !puedeDescargar && (
                <PDFViewer src={doc.src} />
              )}

              {/* Reproductor de audio con restricción */}
              {doc.isAudio && <AudioPlayer src={doc.src} plan={plan} />}

              {/* Cuerpo */}
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="font-playfair font-bold text-[#1a3d2b] text-lg mb-2">Descripción</h4>
                  <p className="text-[#1a3d2b]/75 font-lato text-[15px] leading-relaxed">{doc.descripcion}</p>
                </div>
                <div className="bg-[#f5f0e8] rounded-xl p-5 border border-dorado/15">
                  <h4 className="font-lato font-bold text-[#7a5c00] text-xs uppercase tracking-wider mb-3">
                    Cómo aprovechar este material
                  </h4>
                  <ul className="space-y-2">
                    {doc.indicaciones.map((ind, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-dorado mt-0.5 flex-shrink-0">→</span>
                        <span className="text-[#1a3d2b]/80 font-lato text-[14px] leading-snug">{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
