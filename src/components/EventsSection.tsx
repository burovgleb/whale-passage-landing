import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HERO_EVENT_PREVIEW } from "@/lib/event-preview";

const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="events" className="section-padding bg-background">
      <div ref={ref} className="mx-auto max-w-4xl">
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
          <p className="text-serif mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Мы считаем важным собираться время от времени в камерной обстановке
            и говорить о смерти. Для того, чтобы разговор точно состоялся,
            приглашаем тех, кто каким-то образом исследует в своей деятельности
            тему смерти — эти люди создают другой контекст и открывают порою
            неожиданные грани того, что обычно принято обходить стороной.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {/* Первая встреча (завершена) */}
          <div className="flex flex-col rounded-sm border border-border bg-ocean-fog p-8">
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Первая встреча из цикла
            </p>
            <h3 className="text-serif mb-4 text-xl font-light text-muted-foreground md:text-2xl">
              Живые разговоры о смерти
            </h3>
            <p className="text-serif text-base leading-relaxed text-muted-foreground">
              С врачом-психиатром <strong>Натальей Бехтеревой</strong> и философом
              и культурологом <strong>Андреем Макаровым</strong>
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">
              23 февраля
            </p>
            <p className="text-sm text-muted-foreground">
              Музей-квартира академика Н.П. Бехтеревой
            </p>
            <span className="mt-6 inline-flex self-start rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Завершено
            </span>
          </div>

          {/* Вторая встреча */}
          <div className="flex flex-col rounded-sm border border-foreground bg-background p-8">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Вторая встреча из цикла
              </p>
              <h3 className="text-serif mb-4 text-xl font-light text-foreground md:text-2xl">
                Живые разговоры о смерти
              </h3>
              <p className="text-serif text-base leading-relaxed text-foreground">
                С врачом-психиатром <strong>Натальей Бехтеревой</strong> и{" "}
                <strong>Ярославом Красновым</strong>
              </p>
              <p className="mt-4 text-sm font-medium text-foreground">
                {HERO_EVENT_PREVIEW.date}
              </p>
              <p className="text-sm text-muted-foreground">
                Музей-квартира академика Н.П. Бехтеревой
              </p>
            </div>
            <a
              href="https://kky-event.timepad.ru/event/3851932/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex self-start border border-foreground px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-foreground hover:text-background"
            >
              Регистрация
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
