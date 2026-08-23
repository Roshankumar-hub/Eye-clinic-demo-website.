import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronsLeftRight } from "lucide-react";
import { Reveal, SectionHeading } from "./ui";

const SLIDES = [
  {
    title: "LASIK Vision Correction",
    caption: "Simulated uncorrected −6.5D blur → 20/20 clarity · 3-month follow-up",
    img: "/images/vision-city.jpg",
    alt: "A crisp city street scene used to simulate vision before and after LASIK",
  },
  {
    title: "Cataract Lens Replacement",
    caption: "Clouded reading vision → sharp near vision · 2-week follow-up",
    img: "/images/vision-reading.jpg",
    alt: "An open book with sharp text used to simulate vision before and after cataract surgery",
  },
  {
    title: "Myopia Control (Kids)",
    caption: "Distance blur → crisp playground vision · 6-month follow-up",
    img: "/images/vision-family.jpg",
    alt: "A family at a sunny park used to simulate a child's vision before and after treatment",
  },
];

/* --------------------------- comparison slider ------------------------ */

function CompareSlider({
  img, alt, title, caption,
}: { img: string; alt: string; title: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const reduce = useReducedMotion();

  /* Subtle 0.3x parallax while the card travels through the viewport */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  const update = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div ref={ref} className="group">
      <div
        className="relative aspect-[4/3] touch-none overflow-hidden rounded-3xl border border-line shadow-card select-none"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          update(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && update(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        role="img"
        aria-label={alt}
      >
        {/* After (sharp) */}
        <motion.img
          src={img} alt="" aria-hidden loading="lazy" width={800} height={600} draggable={false}
          style={reduce ? undefined : { y: parallax }}
          className="absolute inset-0 h-[112%] w-full object-cover"
        />
        {/* Before (simulated blur) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={img} alt="" loading="lazy" width={800} height={600} draggable={false}
            className="h-full w-full object-cover"
            style={{ filter: "blur(10px) brightness(0.92) saturate(0.8)" }}
          />
        </div>

        {/* Labels */}
        <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-slate-950/60 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          Before <span className="font-normal text-white/70">(simulated)</span>
        </span>
        <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-primary/85 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          After ClearVision
        </span>

        {/* Divider + handle */}
        <div
          aria-hidden
          className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]"
          style={{ left: `${pos}%` }}
        />
        <button
          type="button"
          role="slider"
          aria-label={`${title} before and after comparison slider`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          }}
          style={{ left: `${pos}%` }}
          className="absolute top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg transition-transform duration-200 group-hover:scale-110"
        >
          <ChevronsLeftRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <h3 className="mt-4 text-xl font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{caption}</p>
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section id="results" className="section-pad bg-bg" aria-label="Before and after results">
      <div className="wrap">
        <SectionHeading
          eyebrow="Real results"
          title="Life before & after ClearVision"
          sub="Drag the handle to see what our patients see. Simulated vision — because the real thing has to be experienced."
        />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {SLIDES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <CompareSlider {...s} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-8 text-center text-xs text-muted/70">
            Simulated images for illustration. Individual results vary — ask us what your prescription could look like after treatment.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
