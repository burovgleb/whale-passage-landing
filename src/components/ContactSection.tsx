import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="section-padding bg-ocean-deep">
      <div ref={ref} className="mx-auto max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-ocean-light/60">
            Контакт
          </p>
          <h2 className="mb-12 text-3xl font-light text-primary-foreground md:text-5xl">
            Свяжитесь с нами
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {submitted ? (
            <div className="py-8">
              <p className="text-serif text-xl text-primary-foreground">Спасибо за сообщение</p>
              <p className="mt-2 text-sm text-ocean-light/60">Мы обязательно ответим вам</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <input
                type="text"
                placeholder="Имя"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-b border-ocean-light/20 bg-transparent px-0 py-3 text-sm text-primary-foreground placeholder:text-ocean-light/40 focus:border-ocean-light/60 focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-b border-ocean-light/20 bg-transparent px-0 py-3 text-sm text-primary-foreground placeholder:text-ocean-light/40 focus:border-ocean-light/60 focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Сообщение"
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none border-b border-ocean-light/20 bg-transparent px-0 py-3 text-sm text-primary-foreground placeholder:text-ocean-light/40 focus:border-ocean-light/60 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="mt-6 w-full border border-ocean-light/30 bg-transparent py-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary-foreground/10"
              >
                Отправить
              </button>
            </form>
          )}
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 border-t border-ocean-light/10 pt-8"
        >
          <p className="text-serif text-lg text-ocean-light/40">
            ККУ | Когда Киты Уходят
          </p>
          <p className="mt-2 text-xs text-ocean-light/20">
            © 2025. Все права защищены.
          </p>
        </motion.footer>
      </div>
    </section>
  );
};

export default ContactSection;
