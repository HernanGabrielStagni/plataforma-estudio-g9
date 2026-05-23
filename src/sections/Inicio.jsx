import { motion } from "framer-motion";
import { SectionHeader } from "../components/UIComponents";
import { PlayCircle, Presentation, Image, FileText, BookOpen, CheckSquare, Music } from "lucide-react";
import { asset } from "../lib/assets";

const modulos = [
  {
    icon: PlayCircle,
    color: "from-[#1a3d2b] to-[#2d6a4f]",
    badge: "3 videos",
    titulo: "Video Clases",
    descripcion:
      "Tres clases grabadas que desarrollan los temas centrales de la Lección 9: las fuerzas ocultas en las organizaciones, el dominio de las constelaciones y la práctica de la constelación organizacional.",
  },
  {
    icon: Presentation,
    color: "from-[#7a5c00] to-[#c9a84c]",
    badge: "3 presentaciones",
    titulo: "Presentaciones",
    descripcion:
      "Presentaciones visuales en PowerPoint sobre la arquitectura invisible organizacional, las herramientas de facilitación sistémica y la práctica de las constelaciones en entornos organizacionales.",
  },
  {
    icon: Image,
    color: "from-[#2d4a6a] to-[#4a7fa5]",
    badge: "3 infografías",
    titulo: "Infografías",
    descripcion:
      "Recursos gráficos que sintetizan visualmente las bases de las constelaciones organizacionales, el alma de las organizaciones y la guía de aplicación práctica.",
  },
  {
    icon: FileText,
    color: "from-[#5a2d2d] to-[#9a4a4a]",
    badge: "PDFs + Audio",
    titulo: "Documentos",
    descripcion:
      "Material de lectura: capítulo 9 del curso, la guía de estudio maestra de constelaciones organizacionales y un audio complementario sobre la sanación de empresas.",
  },
];

const objetivos = [
  "Comprender la diferencia fundamental entre constelaciones familiares y organizacionales.",
  "Identificar las tres facetas de la conciencia colectiva: pertenencia, equilibrio y orden.",
  "Reconocer los distintos tipos de constelación organizacional y sus aplicaciones.",
  "Aplicar el campo de conocimiento como herramienta de percepción suplente.",
  "Integrar frases sanadoras en el trabajo con sistemas organizacionales.",
];

export default function Inicio() {
  return (
    <div className="space-y-10 max-w-4xl">
      <SectionHeader
        emoji="🏢"
        title="Lección 9 · Bienvenida"
        subtitle="Constelaciones Organizacionales"
      />

      {/* Descripción intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-[#f5f0e8] to-[#eaf0ec] rounded-2xl p-7 border border-dorado/20 shadow-card"
      >
        <p className="text-[#1a3d2b] font-lato text-[17px] leading-relaxed mb-4">
          En esta lección trascendemos el sistema familiar para adentrarnos en el
          mundo de las organizaciones. A través de las Constelaciones
          Organizacionales aprenderás a leer las fuerzas invisibles que gobiernan
          empresas, equipos e instituciones, y a facilitar movimientos de sanación
          en estos sistemas.
        </p>
        <p className="font-playfair italic text-[#2d6a4f] text-[16px] border-l-4 border-dorado pl-4">
          "Yo tomo mi responsabilidad y dejo contigo la tuya."
        </p>
      </motion.div>

      {/* Audio complementario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white rounded-2xl border border-crema shadow-card overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#2d4a8a] to-[#4a7af0] px-6 py-4 flex items-center gap-3">
          <Music className="w-5 h-5 text-white/80" />
          <div>
            <span className="text-white/60 text-xs font-lato uppercase tracking-widest">
              Audio · Introducción
            </span>
            <h3 className="text-white font-playfair text-lg font-black m-0 !text-white !shadow-none">
              Sanar empresas con constelaciones organizacionales
            </h3>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-[#1a3d2b]/70 font-lato text-[14px] leading-relaxed mb-4">
            Una introducción narrativa al mundo de las constelaciones organizacionales.
            Escuchalo antes de comenzar para entrar en el espacio de aprendizaje.
          </p>
          <audio
            controls
            preload="metadata"
            className="w-full rounded-lg"
            style={{ accentColor: "#c9a84c" }}
          >
            <source
              src={asset("/media/Sanar_empresas_con_constelaciones_organizacionales.m4a")}
              type="audio/mp4"
            />
          </audio>
        </div>
      </motion.div>

      {/* Objetivos de la lección */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card-premium"
      >
        <h3 className="font-playfair font-bold text-xl text-verde-oscuro mb-5">
          Objetivos de Aprendizaje
        </h3>
        <ul className="space-y-3">
          {objetivos.map((obj, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-dorado/20 border border-dorado/40 flex items-center justify-center text-dorado font-bold text-xs flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-[#1a3d2b]/85 font-lato text-[15px] leading-relaxed">
                {obj}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Módulos disponibles */}
      <div>
        <h3 className="font-playfair font-bold text-2xl text-verde-oscuro mb-5 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-dorado" /> Contenidos de la Lección
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {modulos.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="bg-white rounded-xl p-5 border border-crema shadow-sm hover:shadow-card hover:border-dorado/30 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-playfair font-bold text-[#1a3d2b] text-[16px]">
                        {mod.titulo}
                      </h4>
                      <span className="text-[10px] bg-dorado/15 text-dorado font-bold px-2 py-0.5 rounded-full border border-dorado/30 uppercase tracking-wider whitespace-nowrap">
                        {mod.badge}
                      </span>
                    </div>
                    <p className="text-[#1a3d2b]/70 font-lato text-[13px] leading-relaxed">
                      {mod.descripcion}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Instrucción de navegación */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-3 p-4 bg-verde-oscuro/8 rounded-xl border border-verde-oscuro/15 text-center justify-center"
      >
        <CheckSquare className="w-5 h-5 text-dorado flex-shrink-0" />
        <p className="text-[#1a3d2b]/75 font-lato text-sm">
          Usá el menú lateral para navegar entre los módulos. Al completar cada
          sección, quedará marcada automáticamente.
        </p>
      </motion.div>
    </div>
  );
}
