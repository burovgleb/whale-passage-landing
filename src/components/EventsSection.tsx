import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="section-padding bg-background">
      <div ref={ref} className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Мероприятия
          </p>
          <h2 className="mb-8 text-3xl font-light text-foreground md:text-5xl">
            Живые разговоры о смерти
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <p className="text-serif text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
            Мы считаем важным собираться время от времени в камерной обстановке и говорить о смерти.
            Для того, чтобы разговор точно состоялся, приглашаем тех, кто каким-то образом исследует
            в своей деятельности тему смерти — эти люди создают другой контекст и открывают порою
            неожиданные грани того, что обычно принято обходить стороной.
          </p>

          <div className="mt-12 rounded-sm border border-border bg-ocean-fog p-8 text-center">
            <p className="text-serif text-lg text-foreground">
              Следующая встреча состоится весной
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Мы уже готовим её. Если вы хотите присоединиться — воспользуйтесь формой обратной связи ниже.
            </p>
          </div>

          <p className="text-serif mt-8 text-center text-base leading-relaxed text-muted-foreground">
            Помимо оффлайн-мероприятий мы готовим серию интервью «Живые разговоры о Смерти»
            с людьми-китами, чей жизненный опыт и отношение к Смерти могут открыть что-то важное
            для каждого из нас.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://messenger.online.sberbank.ru/sl/DHsqbMfi5WilaQCBW"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-foreground px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-foreground hover:text-background"
            >
              Поддержать проект
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
