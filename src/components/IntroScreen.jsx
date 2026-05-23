import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { asset } from "../lib/assets";

export default function IntroScreen({ onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => {
          console.error("Error playing video:", e);
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-0"
    >
      <video
        ref={videoRef}
        src={asset("/intro.mp4")}
        playsInline
        onEnded={onComplete}
        className="absolute inset-0 w-full h-full object-contain bg-black"
      />

      {!isPlaying && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm z-10 transition-opacity p-6">
          <img
            src={asset("/logo.png")}
            alt="Espacio Semillas"
            className="w-32 h-32 md:w-48 md:h-48 object-contain mb-6 drop-shadow-2xl brightness-110"
          />
          <p className="font-playfair text-dorado text-2xl md:text-3xl text-center font-bold tracking-wide drop-shadow-md mb-10">
            Lección 9 · Constelaciones Organizacionales
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-sm">
            <button
              onClick={handlePlay}
              className="w-full bg-gradient-to-r from-dorado to-[#d4b96a] text-[#122b1e] font-lato text-base font-bold tracking-widest py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all uppercase flex justify-center items-center gap-2"
            >
              <span className="text-xl">▶</span> Reproducir Intro
            </button>

            <button
              onClick={onComplete}
              className="w-full bg-transparent border border-dorado/50 text-dorado/80 hover:text-dorado font-lato text-base font-bold tracking-widest py-3 px-8 rounded-full hover:bg-dorado/10 transition-all uppercase text-center"
            >
              Omitir
            </button>
          </div>
        </div>
      )}

      {isPlaying && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          onClick={onComplete}
          className="absolute bottom-8 right-8 text-dorado/70 hover:text-dorado bg-black/40 hover:bg-black/80 px-4 py-2 rounded-full font-lato text-xs font-bold tracking-widest backdrop-blur-sm transition-all border border-dorado/30 z-20"
        >
          OMITIR INTRO &rarr;
        </motion.button>
      )}
    </motion.div>
  );
}
