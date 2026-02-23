import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { submitForm } from "@/lib/forms-api";

const InterviewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [form, setForm] = useState({ name: "", contact: "", guest: "", website: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const result = await submitForm("interview_guest", {
      source: "interview_guest",
      name: form.name,
      contact: form.contact,
      guest: form.guest,
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
    <section className="section-padding bg-ocean-fog">
      <div ref={ref} className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Интервью
          </p>
          <h2 className="mb-8 text-3xl font-light text-foreground md:text-5xl">
            Живые разговоры о Смерти
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="space-y-6 text-center">
            <p className="text-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
              На протяжении 25 лет мы исследуем тему смерти. Один из важнейших
              аспектов этой работы — трансформация наших отношений со смертью
              на уровне культуры.
            </p>
            <p className="text-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
              Большой миссией проекта мы видим просветительскую функцию. Серия
              интервью «Живые разговоры о Смерти» — это разговоры с
              людьми-китами, чей жизненный опыт и отношение к Смерти могут
              открыть что-то важное для каждого из нас.
            </p>
            <p className="text-serif text-base leading-relaxed text-muted-foreground">
              Это некоммерческая часть проекта, которая создается благодаря
              поддержке наших китов.
            </p>
          </div>

          <div className="text-center">
            <a
              href="https://messenger.online.sberbank.ru/sl/DHsqbMfi5WilaQCBW"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-foreground px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-foreground hover:text-background"
            >
              Поддержать проект
            </a>
          </div>

          {/* Форма «Предложить гостя» */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 rounded-sm border border-border bg-background p-8"
          >
            <h3 className="text-serif mb-6 text-center text-xl font-light text-foreground">
              Предложить гостя
            </h3>

            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-serif text-xl text-foreground">
                  Спасибо за предложение
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Мы обязательно рассмотрим вашу рекомендацию
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Ваше имя"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Email или телефон"
                  required
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                  className="w-full border-b border-border bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none transition-colors"
                />
                <textarea
                  placeholder="Кого предлагаете и почему"
                  rows={4}
                  required
                  value={form.guest}
                  onChange={(e) => setForm({ ...form, guest: e.target.value })}
                  className="w-full resize-none border-b border-border bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none transition-colors"
                />
                {submitError ? (
                  <p className="text-sm text-red-600">{submitError}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full border border-foreground bg-transparent py-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-all hover:bg-foreground hover:text-background"
                >
                  {isSubmitting
                    ? "Отправка..."
                    : submitError
                      ? "Повторить отправку"
                      : "Отправить предложение"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default InterviewsSection;
