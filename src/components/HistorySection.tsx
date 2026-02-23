import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

interface Quote {
  paragraphs: string[];
  author: string;
  previewLength?: number; // chars threshold for "read more"
  previewText?: string;
}

const quotes: Quote[] = [
  {
    paragraphs: [
      "Когда умирал мой любимый дедушка, мне было 5. Чистое детское сознание не сомневалось в том, что дедушки не будет, я была уверена, что дедушка будет всегда. Единственное, что меня волновало, так это куда же он переместится? Где он будет после смерти? В этом не было горя, а был интерес и любопытство, и много спокойствия.",
    ],
    author: "Даша Бурова",
  },
  {
    paragraphs: [
      "ККУ — это не то, что со мной случилось недавно. Это результат долгих лет пристального всматривания в тему. Около 20 лет я говорила с людьми о смерти, с разными людьми. Всегда поначалу они неохотно отвечали на мои вопросы, но позже расслаблялись и пускались в рассуждения о том, как могут выглядеть их похороны, о любимой музыке, которую стоило бы включить на их прощании, о том, кого обязательно нужно позвать, а кого, пожалуйста, будьте добры, не пускайте. Всегда вместе с этой беседой был выдох, что-то тяжелое растворялось..",
      "Несколько лет назад я стала приглашать поговорить о своей смерти людей за деньги. Назвала это разговором о Смерти «Memento Mori». Каждый прошедший через этот процесс всегда оживал, что-то прояснял для себя и будто бы открывал спрятанные где-то силы, энергию.",
      "Сегодня мои представления о том, что ресурсного и ценного можно предложить людям вокруг умирания помимо того, что уже существует — расширились и превратились в экосистему услуг от разговора до создания посмертного контента, книг-завещаний, садов памяти или же цифровых аватаров. Во многом это произошло благодаря нашему объединению с Еленой Соловьевой.",
    ],
    author: "Даша Бурова",
    previewLength: 200,
  },
  {
    paragraphs: [
      "Впервые со смертью я встретилась, наверное, когда родилась. Я думаю, что мы рождаемся и умираем каждое мгновение.",
      "Потом не стало моей Бабушки, когда мне был год. Она приехала быть со мной, дождалась, когда я пошла, и ушла. Этот рассказ я слышала всю свою жизнь, я помню свою Бабушку по ощущениям. Я очень переживала, что она умерла, потому что приехала со мной сидеть. Сейчас я ей очень благодарна и отпустила эти суждения.",
      "В моей жизни я провожала много близких людей, и в трагических обстоятельствах и когда люди были готовы. Моя Бабушка, которая ушла, когда мне было 32 года, подготовила меня к своему уходу, рассказала в точности, как все должно произойти и подготовила посмертное.",
      "Для меня важно, как уйду я.",
    ],
    author: "Елена Соловьева",
    previewLength: 120,
    previewText:
      "Впервые со смертью я встретилась, наверное, когда родилась. Я думаю, что мы рождаемся и умираем каждое мгновение.",
  },
  {
    paragraphs: [
      "У Даши есть программа «Лосось», впервые я услышала рассуждения Даши на тему смерти именно там. Потом я прошла сессию. Мгновенно все встало на свои места – кто для меня дорог и важен, чем я хочу заниматься, как жить.",
      "И моим удивлением было то, что я могу выбрать, как хочу уйти. Конечно не факт, что случится именно так, и всё-таки, моя жизнь, моя стратегия выстраивается именно с этим пониманием. Кто будет держать меня за руку, в каком месте это случится, с какими мыслями, кого и что я буду видеть, обнимать и слышать, что чувствовать, что говорить, а возможно и петь..)",
      "Что я оставлю после себя. Что я хочу передать и кому. Так я присоединилась к Даше с пониманием, что могу внести в это взаимодействие с КИТАМИ.",
    ],
    author: "Елена Соловьева",
    previewLength: 200,
    previewText:
      "У Даши есть программа «Лосось», впервые я услышала рассуждения Даши на тему смерти именно там. Потом я прошла сессию. Мгновенно все встало на свои места – кто для меня дорог и важен, чем я хочу заниматься, как жить.",
  },
];

function getPreviewText(paragraphs: string[], maxChars: number): string {
  let total = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    if (total + paragraphs[i].length > maxChars && i > 0) break;
    total += paragraphs[i].length;
    if (total >= maxChars) {
      // cut at sentence boundary
      const text = paragraphs.slice(0, i + 1).join(" ");
      const sentenceEnd = text.lastIndexOf(".", maxChars);
      if (sentenceEnd > maxChars * 0.5) return text.slice(0, sentenceEnd + 1);
      return text.slice(0, maxChars) + "…";
    }
  }
  return paragraphs.join(" ");
}

const fullTextVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.35, ease: "easeInOut" },
      opacity: { duration: 0.15, ease: "easeOut" },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.45, ease: "easeInOut" },
      opacity: { duration: 0.25, delay: 0.2, ease: "easeOut" },
    },
  },
};

const QuoteCard = ({ quote, index }: { quote: Quote; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const fullText = quote.paragraphs.join(" ");
  const needsExpand = quote.previewLength && fullText.length > quote.previewLength;
  const preview = needsExpand
    ? quote.previewText ?? getPreviewText(quote.paragraphs, quote.previewLength!)
    : null;

  return (
    <motion.blockquote
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="border-l-2 border-ocean-light/40 pl-6 md:pl-10"
    >
      {!needsExpand ? (
        <p className="text-serif text-lg leading-relaxed text-foreground/80 md:text-xl">
          «{fullText}»
        </p>
      ) : (
        <>
          <AnimatePresence initial={false} mode="sync">
            {!expanded ? (
              <motion.p
                key="preview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="text-serif text-lg leading-relaxed text-foreground/80 md:text-xl"
              >
                «{preview}
              </motion.p>
            ) : (
              <motion.div
                key="full"
                variants={fullTextVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="space-y-4 overflow-hidden"
              >
                {quote.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-serif text-lg leading-relaxed text-foreground/80 md:text-xl"
                  >
                    {i === 0 ? "«" : ""}
                    {p}
                    {i === quote.paragraphs.length - 1 ? "»" : ""}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm font-medium tracking-wider text-ocean-mid transition-colors hover:text-ocean-deep"
          >
            {expanded ? "Свернуть ↑" : "Читать дальше →"}
          </button>
        </>
      )}
      <footer className="mt-4 text-sm font-medium tracking-wider text-muted-foreground">
        — {quote.author}
      </footer>
    </motion.blockquote>
  );
};

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
            <QuoteCard key={i} quote={quote} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
