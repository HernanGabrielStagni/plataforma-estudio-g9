import { motion } from "framer-motion";
import { SectionHeader } from "../components/UIComponents";
import { Presentation, Download, ExternalLink } from "lucide-react";

const presentaciones = [
  {
    id: 1,
    titulo: "Arquitectura Invisible Organizacional",
    subtitulo: "Bases teóricas y campo de conocimiento",
    emoji: "🏗️",
    pptUrl: "/media/Arquitectura_Invisible_Organizacional.pptx",
    coverImg: "/media/Bases_de_Constelaciones_Organizacionales.png",
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
    pptUrl: "/media/Systemic_Facilitation_Toolkit.pptx",
    coverImg: "/media/El_Alma_de_las_Organizaciones.png",
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
    pptUrl: "/media/Organizational_Constellations_Practice.pptx",
    coverImg: "/media/Guía_de_Constelaciones_Organizacionales.png",
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

export default function Presentaciones() {
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
          <div className="bg-gradient-to-r from-[#5a4000] to-[#9a7020] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            <a
              href={pres.pptUrl}
              download
              className="flex items-center gap-2 text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-full transition-all border border-white/20 whitespace-nowrap"
            >
              <Download className="w-3 h-3" /> Descargar PPT
            </a>
          </div>

          {/* Vista previa con overlay */}
          <div className="relative aspect-[16/9] w-full bg-verde-oscuro/5 overflow-hidden group">
            <img
              src={pres.coverImg}
              alt={`Presentación ${pres.titulo}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
              <a
                href={pres.pptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-dorado text-verde-oscuro font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:bg-dorado-claro transition-all"
              >
                <ExternalLink className="w-5 h-5" /> Abrir Presentación
              </a>
              <p className="text-white/70 text-xs mt-3 font-lato italic">
                Se recomienda descargar para mejor visualización
              </p>
            </div>
          </div>

          {/* Descripción + Contenidos */}
          <div className="p-6 space-y-5">
            <div>
              <h4 className="font-playfair font-bold text-[#1a3d2b] text-lg mb-2">
                Descripción
              </h4>
              <p className="text-[#1a3d2b]/75 font-lato text-[15px] leading-relaxed">
                {pres.descripcion}
              </p>
            </div>

            <div className="bg-[#fdf8ee] rounded-xl p-5 border border-dorado/20">
              <h4 className="font-lato font-bold text-[#7a5c00] text-sm uppercase tracking-wider mb-3">
                Contenidos de la presentación
              </h4>
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
        </motion.div>
      ))}
    </div>
  );
}
