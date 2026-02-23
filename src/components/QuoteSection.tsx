import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import whaleBg from "@/assets/whale-bg.jpg";

const QuoteSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${whaleBg})` }}
      />
      <div className="absolute inset-0 bg-ocean-deep/60" />

      <motion.blockquote
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 px-6 text-center"
      >
        <p className="text-serif text-4xl font-light italic text-primary-foreground md:text-6xl lg:text-7xl">
          «Ты будешь моим китом?»
        </p>

        <motion.a
          href="#first-contact"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-36 inline-block border border-primary-foreground/70 px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary-foreground hover:text-ocean-deep"
        >
          Ответить «Да»
        </motion.a>
      </motion.blockquote>
    </section>
  );
};

export default QuoteSection;
