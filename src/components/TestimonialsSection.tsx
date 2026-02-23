import { motion, useInView } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Testimonial = {
  author: string;
  text?: string;
  audioUrl?: string;
};

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, "0")}`;
};

const AudioMiniPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || duration <= 0) return;
    const nextValue = Number(event.target.value);
    const nextTime = (nextValue / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-sm border border-border/80 bg-background/70 p-4">
      <audio ref={audioRef} preload="metadata" src={src} />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-ocean-fog"
          aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Аудиоотзыв
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="relative mt-3">
            <div className="h-1 w-full rounded-full bg-border/80" />
            <div
              className="absolute inset-y-0 left-0 h-1 rounded-full bg-foreground/55"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 h-4 w-full -translate-y-1.5 cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground/70 [&::-webkit-slider-thumb]:shadow-none [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-foreground/70"
              aria-label="Позиция воспроизведения"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const testimonials: Testimonial[] = [
  {
    author: "Анастасия Нифонтова",
    audioUrl: "/audio/memento-mori-otzyv-anastasiya-nifontova.mp3",
  },
  {
    text: "Появилось уважение и почтение к смерти. Ощущение что в груди стало больше воздуха и желание творить, создавать, узнавать.",
    author: "Анна Иванова",
  },
  {
    text: "Ясность с тем что убегаю от смерти, вместо того чтобы жить жизнь, очень отрезвляет, я стала каждый день выбирать жизнь и смотреть, а как это?",
    author: "Ирина Кравцова",
  },
  {
    text: "Отпала половина ненужных вещей, которые добавляли напряжения. Точно появилось понимание, что смерть — это ещё и возможность, и можно что-то классное сделать своим уходом.",
    author: "Андрей Малой",
  },
  {
    text: "Эта сессия, в большей степени, развернула моё отношение к жизни!",
    author: "Екатерина Худова",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="section-padding bg-ocean-fog">
      <div ref={ref} className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Отзывы
          </p>
          <h2 className="text-3xl font-light text-foreground md:text-5xl">
            О сессии Memento Mori
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-sm border border-border bg-card p-8"
            >
              {t.audioUrl ? (
                <AudioMiniPlayer src={t.audioUrl} />
              ) : (
                <p className="text-serif text-lg leading-relaxed text-foreground/80">
                  «{t.text}»
                </p>
              )}
              <p className="mt-6 text-xs font-medium tracking-wider text-muted-foreground">
                — {t.author}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
