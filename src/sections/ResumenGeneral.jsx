import { SectionHeader } from "../components/UIComponents";
import { motion } from "framer-motion";

const conceptosClave = [
  {
    numero: "1",
    titulo: "El Campo de Conocimiento",
    descripcion:
      "Los representantes acceden a información del sistema sin conocerlo previamente. Actúan como canales de percepción suplente, revelando la arquitectura invisible que ningún organigrama puede mostrar.",
    color: "from-verde-oscuro to-verde-medio",
    icon: "🌐",
  },
  {
    numero: "2",
    titulo: "Las Tres Leyes de la Conciencia",
    descripcion:
      "Pertenencia, equilibrio y orden regulan toda organización. Cada miembro del sistema obedece inconscientemente estas leyes: el miedo a la exclusión, la compensación entre dar y tomar, y la prioridad de quien llegó primero.",
    color: "from-dorado to-dorado-claro",
    icon: "⚖️",
  },
  {
    numero: "3",
    titulo: "Los Tipos de Constelación",
    descripcion:
      "Regular, de consulta, de varios niveles y oculta. Cada formato responde a un contexto diferente y protege distintos aspectos del sistema. El facilitador elige el tipo adecuado según las necesidades del cliente.",
    color: "from-verde-medio to-verde-claro",
    icon: "🔄",
  },
];

const tiposConciencia = [
  {
    faceta: "Pertenencia",
    descripcion: "El miedo a la exclusión se siente como culpa o inocencia según las normas del grupo. Todo miembro busca su lugar en el sistema.",
    color: "bg-[#eaf4ef] border-[#2d6a4f]/20",
    icon: "🤝",
  },
  {
    faceta: "Equilibrio",
    descripcion: "La conciencia regula la compensación entre dar y tomar. El desequilibrio genera tensión sistémica hasta que se restablece la armonía.",
    color: "bg-[#fdf8ee] border-dorado/20",
    icon: "⚖️",
  },
  {
    faceta: "Orden",
    descripcion: "Quien llegó antes tiene prioridad. Las reglas y jerarquías basadas en capacidad sostienen la supervivencia del sistema organizacional.",
    color: "bg-[#f0f4ff] border-[#2d4a8a]/15",
    icon: "📋",
  },
];

export default function ResumenGeneral() {
  return (
    <div>
      <SectionHeader
        emoji="📋"
        title="Síntesis · Lección 9"
        subtitle="Resumen de conceptos fundamentales"
      />

      <div className="mt-8">
        <h3 className="font-playfair font-bold text-2xl text-verde-oscuro mb-6 text-center">
          Los 3 Pilares de la Unidad
        </h3>

        <div className="grid gap-5 md:grid-cols-3">
          {conceptosClave.map((concepto, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              className="relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${concepto.color} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`}
              ></div>
              <div className="relative p-6 bg-white/90 rounded-xl border border-dorado/10 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${concepto.color} flex items-center justify-center text-white font-playfair font-bold text-lg shadow-sm`}
                  >
                    {concepto.numero}
                  </div>
                  <span className="text-2xl">{concepto.icon}</span>
                </div>
                <h4 className="font-playfair font-bold text-lg text-verde-oscuro mb-2">
                  {concepto.titulo}
                </h4>
                <p className="text-verde-oscuro/70 font-lato text-sm leading-relaxed">
                  {concepto.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Las tres facetas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-10"
      >
        <h3 className="font-playfair font-bold text-xl text-verde-oscuro mb-5 text-center">
          Las Tres Facetas de la Conciencia Organizacional
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {tiposConciencia.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className={`rounded-xl p-5 border ${item.color}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <h4 className="font-playfair font-bold text-verde-oscuro text-base">
                  {item.faceta}
                </h4>
              </div>
              <p className="text-[#1a3d2b]/75 font-lato text-sm leading-relaxed">
                {item.descripcion}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-10 p-6 bg-gradient-to-r from-crema to-blanco-calido rounded-xl border border-dorado/20 text-center"
      >
        <p className="font-playfair italic text-verde-oscuro text-lg leading-relaxed">
          <span className="text-dorado text-2xl">❝</span> Yo tomo mi
          responsabilidad y dejo contigo la tuya.{" "}
          <span className="text-dorado text-2xl">❞</span>
        </p>
      </motion.div>
    </div>
  );
}
