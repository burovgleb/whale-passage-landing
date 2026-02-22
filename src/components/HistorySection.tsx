import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "Когда умирал мой любимый дедушка, мне было 5. Чистое детское сознание не сомневалось в том, что дедушки не будет, я была уверена, что дедушка будет всегда. Единственное, что меня волновало, так это куда же он переместится? Где он будет после смерти? В этом не было горя, а был интерес и любопытство, и много спокойствия.",
    author: "Даша Бурова",
  },
  {
    text: "Впервые со смертью я встретилась, наверное, когда родилась. Я думаю, что мы рождаемся и умираем каждое мгновение. Для меня важно, как уйду я.",
    author: "Елена Соловьева",
  },
  {
    text: "Киты для меня – воплощение особого сознания. Это по-настоящему великие существа. Желание быть с ними рядом перевесило страх за собственную жизнь, и я шагнула за борт. Тогда умерла прежняя версия меня, и родилась какая-то новая я, обогащенная китовым присутствием.",
    author: "Даша Бурова",
  },
  {
    text: "У Даши есть программа «Лосось», впервые я услышала рассуждения Даши на тему смерти именно там. Потом я прошла сессию. Мгновенно все встало на свои места – кто для меня дорог и важен, чем я хочу заниматься, как жить. И моим удивлением было то, что я могу выбрать, как хочу уйти.",
    author: "Елена Соловьева",
  },
];

const HistorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="section-padding bg-ocean-fog">
      <div ref={ref} className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            История
          </p>
          <h2 className="text-3xl font-light text-foreground md:text-5xl">
            ККУ | Когда Киты Уходят
          </h2>
        </motion.div>

        <div className="space-y-12">
          {quotes.map((quote, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="border-l-2 border-ocean-light/40 pl-6 md:pl-10"
            >
              <p className="text-serif text-lg leading-relaxed text-foreground/80 md:text-xl">
                «{quote.text}»
              </p>
              <footer className="mt-4 text-sm font-medium tracking-wider text-muted-foreground">
                — {quote.author}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
