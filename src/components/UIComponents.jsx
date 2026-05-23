import { motion } from "framer-motion";

export function Card({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`card-premium ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function HealingPhrase({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      className="healing-phrase"
    >
      <span className="text-dorado mr-2">✦</span>
      {children}
    </motion.div>
  );
}

export function SectionHeader({ title, subtitle, emoji }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      {emoji && <span className="text-4xl mb-3 block">{emoji}</span>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle mt-2">{subtitle}</p>}
      <div className="w-20 h-1 bg-gradient-to-r from-dorado to-dorado-claro rounded-full mt-4"></div>
    </motion.div>
  );
}

export function DataTable({ headers, rows, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="overflow-x-auto my-6"
    >
      <table className="table-premium">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-blanco-calido" : "bg-white"}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={
                    j === 0
                      ? "font-semibold text-verde-oscuro"
                      : "text-verde-oscuro/80"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export function IconBlock({ icon, title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card-premium flex gap-4 items-start"
    >
      <span className="text-3xl flex-shrink-0 mt-1">{icon}</span>
      <div>
        <h4
          className="font-playfair font-bold text-xl text-verde-oscuro mb-2"
          style={{ textShadow: "0px 1px 2px rgba(26,61,43,0.1)" }}
        >
          {title}
        </h4>
        <div className="text-[#122b1e] font-lato text-[15px] font-medium leading-relaxed drop-shadow-sm">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function StepsTimeline({ steps, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="relative pl-8 space-y-6 my-6"
    >
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-dorado via-verde-medio to-dorado/30"></div>
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: delay + i * 0.15 }}
          className="relative"
        >
          <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-dorado border-2 border-blanco-calido shadow-sm"></div>
          <div className="card-premium py-4">
            <span className="text-xs text-dorado font-bold font-lato uppercase tracking-wider">
              Paso {i + 1}
            </span>
            <p className="text-[#122b1e] text-[15px] font-medium mt-1 font-lato leading-relaxed drop-shadow-sm">
              {step}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
