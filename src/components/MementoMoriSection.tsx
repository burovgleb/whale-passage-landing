import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const MementoMoriSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [form, setForm] = useState({ name: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            Первый контакт
          </p>
          <h2 className="mb-8 text-3xl font-light text-foreground md:text-5xl">
            Сессия Memento Mori
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <p className="text-serif text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
            Разговор обладает недооцененной силой. Иногда просто поговорить — меняет всё.
            Поговорить о своей смерти — меняет жизнь. Это возможность выпустить напряжение,
            обнаружить что-то важное и значительное, лучше узнать себя, получить импульс к жизни
            в совершенно новом качестве.
          </p>
          <p className="text-serif mt-6 text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
            Сессия Memento Mori — это 1,5–3 часа разговора о своей смерти, непринужденного, откровенного.
            Это начало личного исследования своих отношений со смертью.
          </p>
          <p className="mt-8 text-center text-sm font-medium tracking-wider text-foreground">
            Стоимость: 50 000 ₽
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto max-w-md"
        >
          {submitted ? (
            <div className="rounded-sm border border-ocean-light/30 bg-ocean-fog p-8 text-center">
              <p className="text-serif text-xl text-foreground">Спасибо за заявку</p>
              <p className="mt-2 text-sm text-muted-foreground">Мы свяжемся с вами в ближайшее время</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="mb-6 text-center text-lg font-light tracking-wider text-foreground">
                Оставить заявку
              </h3>
              <input
                type="text"
                placeholder="Имя и фамилия"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-b border-border bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ocean-mid focus:outline-none transition-colors"
              />
              <input
                type="tel"
                placeholder="Телефон"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border-b border-border bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-ocean-mid focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="mt-6 w-full border border-foreground bg-transparent py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-foreground hover:text-background"
              >
                Отправить
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MementoMoriSection;
