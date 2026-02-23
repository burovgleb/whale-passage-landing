import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("x5-playsinline", "true");

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Some mobile browsers (e.g. iOS low power mode) can still block autoplay.
        });
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && video.paused) {
        tryPlay();
      }
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const toggleSound = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      try {
        await audio.play();
        setIsMuted(false);
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
      return;
    }

    audio.pause();
    setIsMuted(true);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ocean-deep">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <audio ref={audioRef} loop preload="metadata">
        <source src="/audio/hero-whale-audio.mp3" type="audio/mpeg" />
      </audio>

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
