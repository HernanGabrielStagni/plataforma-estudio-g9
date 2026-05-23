import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";

export default function Quiz9() {
  return (
    <div
      className="min-h-[calc(100vh-120px)] flex items-center justify-center -mx-6 md:-mx-10 -my-8 px-4"
      style={{
        background:
          "linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 40%, #1a3d2b 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-dorado/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-dorado/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-verde-medio/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative max-w-lg w-full"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-dorado/20 shadow-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-dorado to-dorado-claro rounded-full flex items-center justify-center shadow-gold">
              <Award className="w-10 h-10 text-verde-oscuro" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-playfair text-3xl md:text-4xl font-bold text-dorado mb-4"
          >
            Evaluación · Lección 9
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/90 font-lato text-lg mb-3"
          >
            ¿Estás listo para evaluar lo aprendido en la Lección 9?
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/60 font-lato text-sm mb-8 leading-relaxed"
          >
            El quiz cubrirá los temas de{" "}
            <em>Constelaciones Organizacionales</em>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <a
              href="https://quiz-9-const-espacio-semillas.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-dorado to-dorado-claro text-verde-oscuro font-playfair font-bold text-lg md:text-xl px-10 py-4 rounded-xl shadow-gold hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <span>IR AL QUIZ-9</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-white/40 font-lato text-xs italic"
          >
            Completá el quiz solo después de haber repasado todo el material.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
