import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ocean-deep">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/40 via-transparent to-ocean-deep/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-4 text-5xl font-light tracking-wide text-primary-foreground md:text-7xl lg:text-8xl"
        >
          Когда Киты Уходят
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mb-12 max-w-md text-lg font-light tracking-widest text-ocean-mist/80 uppercase"
        >
          Проект о смерти и жизни
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          onClick={toggleSound}
          className="sound-badge cursor-pointer transition-all hover:bg-ocean-mid/60"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span className="text-sans text-xs tracking-wider">
            {isMuted ? "Включите звук для погружения" : "Звук включён"}
          </span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="h-12 w-[1px] animate-pulse bg-gradient-to-b from-transparent to-ocean-light/50" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
