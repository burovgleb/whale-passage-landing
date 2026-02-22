import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const lines = [
  "Здравствуй, ты будешь моим китом?",
  "",
  "Не отвечай сейчас.. ответишь потом.",
  "Не торопись с ответом,",
  "Ответишь зимой или летом,",
  "Когда улетят года,",
  "Что не могут быть рядом всегда.",
  "",
  "Ты будешь моим китом?",
  "Чтобы не кануть в Лету потом..",
  "Чтобы застыть в вечности",
  "Живым умом и беспечностью,",
  "Чтобы сиять озарением,",
  "Тысячей мириад,",
  "И получать поздравления,",
  "Когда твой потомок рад…",
  "",
  "Будешь моим китом?",
  "Чтобы махать хвостом",
  "И оставлять круги по воде",
  "Вопреки злодейке-судьбе.",
  "",
  "Здравствуй, ты будешь моим китом?",
  "Не отвечай сейчас, я снова спрошу потом..",
];

const PoemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-background">
      <div ref={ref} className="mx-auto max-w-2xl text-center">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className={`text-serif text-lg leading-relaxed md:text-xl ${
              line === "" ? "h-6" : ""
            } ${
              i === 0 || i === lines.length - 2
                ? "text-2xl font-medium text-foreground md:text-3xl"
                : "text-muted-foreground"
            }`}
          >
            {line || "\u00A0"}
          </motion.p>
        ))}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: lines.length * 0.08 }}
          className="mt-8 text-sm tracking-wider text-muted-foreground/60"
        >
          Даша Бурова, 2025
        </motion.p>
      </div>
    </section>
  );
};

export default PoemSection;
