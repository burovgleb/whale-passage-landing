import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { submitForm } from "@/lib/forms-api";

const MementoMoriSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [form, setForm] = useState({ name: "", phone: "", website: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const result = await submitForm("memento_mori", {
      source: "memento_mori",
      name: form.name,
      phone: form.phone,
      pageUrl: window.location.href,
      userAgent: window.navigator.userAgent,
      submittedAt: new Date().toISOString(),
      hp: form.website,
    });

    setIsSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      return;
    }

    setSubmitError(result.message || "Не удалось отправить форму. Попробуйте снова.");
  };

  return (
    <section id="first-contact" className="section-padding bg-background">
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
          <p className="mt-10 text-center text-serif text-2xl font-light text-foreground md:text-3xl">
            Стоимость: 50 000 ₽
          </p>
          <p className="text-serif mt-6 text-center text-lg leading-relaxed text-muted-foreground md:text-xl">
            Для тех, кто был на нашем мероприятии{" "}
            <a
              href="#events"
              className="text-foreground underline decoration-foreground/35 underline-offset-4 transition-colors hover:decoration-foreground/70"
            >
              «Живые разговоры о Смерти»
            </a>
            , в течение месяца после события действует специальная цена на
            сессию — 25 000 руб.
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
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                aria-hidden="true"
                className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
              />
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
              {submitError ? (
                <p className="text-sm text-red-600">{submitError}</p>
              ) : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full border border-foreground bg-transparent py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-foreground hover:text-background"
              >
                {isSubmitting ? "Отправка..." : submitError ? "Повторить отправку" : "Отправить"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MementoMoriSection;
