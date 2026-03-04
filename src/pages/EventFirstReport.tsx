import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { FIRST_EVENT_REPORT_IMAGES, FIRST_EVENT_REPORT_TEXT } from "@/lib/first-event-report";

const EventFirstReport = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;

  const currentImage = useMemo(() => {
    if (activeIndex === null) return null;
    return FIRST_EVENT_REPORT_IMAGES[activeIndex] ?? null;
  }, [activeIndex]);

  const goPrev = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + FIRST_EVENT_REPORT_IMAGES.length) % FIRST_EVENT_REPORT_IMAGES.length;
    });
  };

  const goNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % FIRST_EVENT_REPORT_IMAGES.length;
    });
  };

  const goBackToEvents = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <main className="min-h-screen bg-background">
      <section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={goBackToEvents}
            className="inline-flex items-center border border-border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Назад к мероприятиям
          </button>

          <header className="mt-10 max-w-4xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Как это было
            </p>
            <h1 className="text-3xl font-light text-foreground md:text-5xl">
              Первый вечер из цикла «Живые разговоры о смерти»
            </h1>
          </header>

          <article className="mt-10 max-w-4xl space-y-6">
            {FIRST_EVENT_REPORT_TEXT.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`text-serif leading-relaxed text-muted-foreground ${
                  index === 0 ? "text-xl md:text-2xl" : "text-lg md:text-xl"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </article>

          <section className="mt-14">
            <h2 className="text-2xl font-light text-foreground md:text-3xl">
              Фотогалерея
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FIRST_EVENT_REPORT_IMAGES.map((image, index) => (
                <button
                  type="button"
                  key={image.src}
                  onClick={() => setActiveIndex(index)}
                  className="group overflow-hidden rounded-sm border border-border bg-card text-left transition-colors hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Открыть фото ${index + 1}`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      <button
        type="button"
        onClick={goBackToEvents}
        aria-label="Назад к мероприятиям"
        className={`fixed bottom-4 right-4 z-50 inline-flex min-h-11 items-center gap-2 border border-border bg-background/95 px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-foreground shadow-sm backdrop-blur-sm transition-all hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <ChevronLeft size={14} />
        К мероприятиям
      </button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-[96vw] border-none bg-transparent p-0 shadow-none sm:max-w-[90vw]">
          <DialogTitle className="sr-only">Фотогалерея отчёта первой встречи</DialogTitle>
          <DialogDescription className="sr-only">
            Просмотр фотографий с первого вечера цикла «Живые разговоры о смерти».
          </DialogDescription>

          {currentImage ? (
            <div className="relative flex items-center justify-center">
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-h-[88vh] w-auto max-w-[96vw] rounded-sm object-contain"
              />

              <p className="absolute left-3 top-3 rounded-sm bg-black/60 px-2 py-1 text-xs text-white">
                {activeIndex! + 1} / {FIRST_EVENT_REPORT_IMAGES.length}
              </p>

              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Следующее фото"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default EventFirstReport;
