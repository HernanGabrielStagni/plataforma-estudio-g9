import { asset } from "../lib/assets";
import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "../components/UIComponents";
import { Presentation, ChevronDown, ChevronUp } from "lucide-react";
import PDFViewer from "../components/PDFViewer";

const presentaciones = [
  {
    id: 1,
    titulo: "Arquitectura Invisible Organizacional",
    subtitulo: "Bases teóricas y campo de conocimiento",
    emoji: "🏗️",
    pdfSrc: asset("/media/Arquitectura_Invisible_Organizacional.pdf"),
    descripcion:
      "Esta presentación introduce el concepto de arquitectura invisible en las organizaciones: las estructuras, lealtades y órdenes que no aparecen en ningún organigrama pero determinan de manera decisiva el funcionamiento del sistema. Explora la transición desde las constelaciones familiares hacia el entorno organizacional.",
    contenidos: [
      "De la familia a la empresa: semejanzas estructurales y diferencias esenciales",
      "El campo de conocimiento y la percepción suplente en organizaciones",
      "Las tres facetas de la conciencia colectiva: pertenencia, equilibrio y orden",
      "La jerarquía basada en capacidad y la prioridad de las finanzas",
      "Primeros movimientos para leer un sistema organizacional",
    ],
  },
  {
    id: 2,
    titulo: "Systemic Facilitation Toolkit",
    subtitulo: "Herramientas para el facilitador sistémico",
    emoji: "🧰",
    pdfSrc: asset("/media/Systemic_Facilitation_Toolkit.pdf"),
    descripcion:
      "Guía práctica de herramientas para el facilitador de constelaciones organizacionales. Presenta técnicas de apertura, tipos de preguntas, manejo del campo y estrategias para acompañar al cliente en la identificación del problema sistémico central. Orientada a la aplicación profesional.",
    contenidos: [
      "La apertura como movimiento inicial: preguntas que invitan al sistema",
      "Tipos de intervención: frases sanadoras específicas para organizaciones",
      "Cómo mantener la neutralidad y la presencia como facilitador",
      "Señales de resolución: cuándo una constelación ha llegado a su fin",
      "Ética y límites en el trabajo con sistemas organizacionales",
    ],
  },
  {
    id: 3,
    titulo: "Organizational Constellations Practice",
    subtitulo: "Aplicación práctica y tipos de constelación",
    emoji: "🔬",
    pdfSrc: asset("/media/Organizational_Constellations_Practice.pdf"),
    descripcion:
      "Presentación centrada en la práctica de los cuatro tipos de constelación organizacional. Incluye casos de aplicación, criterios de elección del formato adecuado y guías paso a paso para cada modalidad. Es la síntesis operativa de todo el aprendizaje de la Lección 9.",
    contenidos: [
      "Constelación regular: el formato clásico en entornos grupales",
      "Constelación de consulta: el cliente externo como asesor estratégico",
      "Constelación de varios niveles: protegiendo al empleado en conflicto",
      "Constelación oculta: cuando la discreción es requisito del sistema",
      "Criterios para elegir el formato más adecuado según el caso",
    ],
  },
];

export default function Presentaciones({ plan = 'vip', puedeDescargar = true }) {
  const [expandido, setExpandido] = useState({});

  const toggleExpandido = (id) =>
    setExpandido(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-12 max-w-4xl">
      <SectionHeader
        emoji="📊"
        title="Presentaciones"
        subtitle="Material visual con análisis profundo de cada tema"
      />

      {presentaciones.map((pres, i) => (
        <motion.div
          key={pres.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          className="bg-white rounded-2xl border border-crema shadow-card overflow-hidden"
        >
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-[#5a4000] to-[#9a7020] px-6 py-4 flex items-center gap-3">
            <span className="text-2xl">{pres.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <Presentation className="text-[#f0d070] w-4 h-4" />
                <span className="text-[#f0d070] text-xs font-bold uppercase tracking-widest">
                  Presentación · {pres.id} de {presentaciones.length}
                </span>
              </div>
              <h3 className="text-white font-playfair text-xl font-black mt-0.5 m-0 !text-white !shadow-none">
                {pres.titulo}
              </h3>
              <p className="text-white/60 font-lato text-xs mt-0.5">
                {pres.subtitulo}
              </p>
            </div>
          </div>

          {/* Visor PDF embebido — con descarga según plan */}
          <PDFViewer src={pres.pdfSrc} puedeDescargar={puedeDescargar} />

          {/* Descripción siempre visible */}
          <div className="border-t border-crema px-6 pt-5 pb-2">
            <p className="text-[#1a3d2b]/75 font-lato text-[15px] leading-relaxed">
              {pres.descripcion}
            </p>
          </div>

          {/* Contenidos colapsables */}
          <div className="border-t border-crema/60">
            <button
              onClick={() => toggleExpandido(pres.id)}
              className="w-full flex items-center justify-between px-6 py-3 text-[#7a5c00] font-lato font-bold text-sm hover:bg-[#fdf8ee] transition-colors"
            >
              <span>Ver contenidos de la presentación</span>
              {expandido[pres.id]
                ? <ChevronUp className="w-4 h-4" />
                : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandido[pres.id] && (
              <div className="px-6 pb-6">
                <div className="bg-[#fdf8ee] rounded-xl p-5 border border-dorado/20">
                  <ul className="space-y-2">
                    {pres.contenidos.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-dorado mt-1 flex-shrink-0 text-sm">▸</span>
                        <span className="text-[#1a3d2b]/80 font-lato text-[14px] leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
