import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const aboutNameEntries = [
  {
    image: "/images/about-title-elena-solovieva.jpg",
    alt: "Елена Соловьева",
    author: "Елена Соловьева",
    text: "«Когда Киты Уходят» – это аллюзия на одноименную повесть Юрия Рытхэу и советский фильм, снятый по этой повести. Одновременно с этим это наше глубокое почтение к образу кита в культуре и к настоящим китам, к счастью, живущим с нами в одно время. Распространенный у разных народов миф о связи с предками, с природой, о естественном цикле рождения и умирания. Он рассказывает о важности чтить эту связь, этот порядок. И в таких мифах часто фигурируют киты. Когда то в детстве я слышала эту добрую повесть Юрия Рэтхэу о любви, жизни и смерти. После я встречала это название у юного тонкого художника из Якутии Георгия Находкина , он создал уникальную серию работ «Когда киты Уходят»",
  },
  {
    image: "/images/about-title-dasha-burova.jpg",
    alt: "Даша Бурова",
    author: "Даша Бурова",
    text: "«Киты для меня – воплощение особого сознания. Это по-настоящему великие существа, знаю это через личный опыт, побывав с ними в одной воде зимой в Арктике. Желание быть с ними рядом перевесило страх за собственную жизнь, и я шагнула за борт. Тогда умерла прежняя версия меня, и родилась какая-то новая я, обогащенная китовым присутствием. Умирая, киты кормят собой океан, создавая условия для жизни. И мне интересно, можем ли мы, подобно китам, одаривать мир своим уходом? Возможно, для этого что-то придется изменить при жизни.. Когда Киты Уходят — это самая красивая метафора о смерти».",
  },
];

const AboutTitleSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="section-padding bg-background">
      <div ref={ref} className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            О названии
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-10 md:space-y-14"
        >
          {aboutNameEntries.map((entry, index) => (
            <article
              key={entry.author}
              className="rounded-sm border border-border/70 bg-card/40 p-4 md:p-6"
            >
              <div
                className={`grid items-start gap-6 md:grid-cols-12 md:gap-8 ${
                  index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <figure className="mx-auto w-full max-w-xs md:col-span-4 md:max-w-none">
                  <div className="overflow-hidden rounded-sm">
                    <img
                      src={entry.image}
                      alt={entry.alt}
                      className="aspect-[4/5] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </figure>

                <div className="md:col-span-8">
                  <p className="text-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
                    {entry.text}
                  </p>
                  <p className="mt-6 text-right text-sm uppercase tracking-[0.15em] text-foreground">
                    {entry.author}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutTitleSection;
