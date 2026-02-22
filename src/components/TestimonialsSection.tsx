import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    text: "Появилось уважение и почтение к смерти. Ощущение что в груди стало больше воздуха и желание творить, создавать, узнавать.",
    author: "Анна Иванова",
  },
  {
    text: "Ясность с тем что убегаю от смерти, вместо того чтобы жить жизнь, очень отрезвляет, я стала каждый день выбирать жизнь и смотреть, а как это?",
    author: "Ирина Кравцова",
  },
  {
    text: "Отпала половина ненужных вещей, которые добавляли напряжения. Точно появилось понимание, что смерть — это ещё и возможность, и можно что-то классное сделать своим уходом.",
    author: "Андрей Малой",
  },
  {
    text: "Эта сессия, в большей степени, развернула моё отношение к жизни!",
    author: "Екатерина Худова",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="section-padding bg-ocean-fog">
      <div ref={ref} className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Отзывы
          </p>
          <h2 className="text-3xl font-light text-foreground md:text-5xl">
            О сессии Memento Mori
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-sm border border-border bg-card p-8"
            >
              <p className="text-serif text-lg leading-relaxed text-foreground/80">
                «{t.text}»
              </p>
              <p className="mt-6 text-xs font-medium tracking-wider text-muted-foreground">
                — {t.author}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
