import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { CLINIC, TESTIMONIALS } from "../data/clinic";
import { EASE, useMediaQuery } from "../lib/hooks";
import { cn } from "../utils/cn";
import { Avatar, Reveal } from "./ui";

export default function Testimonials() {
  /* Hooks must run unconditionally — never nest media queries in a ternary */
  const isXl = useMediaQuery("(min-width: 1280px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const perView = isXl ? 3 : isMd ? 2 : 1;
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const maxIndex = Math.max(0, TESTIMONIALS.length - perView);

  /* Clamp index when viewport changes */
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  /* Auto-play, pauses on hover / focus */
  useEffect(() => {
    if (paused || reduce || perView >= TESTIMONIALS.length) return;
    const t = window.setInterval(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), 5000);
    return () => window.clearInterval(t);
  }, [paused, reduce, maxIndex, perView]);

  const slides = useMemo(() => TESTIMONIALS, []);

  return (
    <section id="reviews" className="section-pad bg-surface" aria-label="Patient reviews">
      <div className="wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[320px_1fr]">
          {/* Google rating card */}
          <Reveal className="mx-auto w-full max-w-sm lg:mx-0">
            <div className="rounded-3xl border border-line bg-card p-8 text-center shadow-card">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md">
                {/* Google "G" */}
                <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <p className="mt-5 font-display text-5xl font-extrabold text-ink">{CLINIC.rating}</p>
              <p className="mt-2 flex justify-center gap-0.5 text-xl text-cta" aria-label="5 star rating">
                <Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </p>
              <p className="mt-2 text-sm text-muted">
                Based on <strong className="text-ink">{CLINIC.reviewCount} verified Google reviews</strong>
              </p>
              <a
                href="#reviews"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full border-2 border-line px-5 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Read all reviews
              </a>
            </div>
          </Reveal>

          {/* Carousel */}
          <div
            className="min-w-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="overflow-hidden">
              <motion.ul
                className="flex"
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) setIndex((i) => Math.min(maxIndex, i + 1));
                  else if (info.offset.x > 60) setIndex((i) => Math.max(0, i - 1));
                }}
                animate={{ x: `${-index * (100 / perView)}%` }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {slides.map((t) => (
                  <li
                    key={t.name}
                    className="shrink-0 px-3"
                    style={{ width: `${100 / perView}%` }}
                    aria-roledescription="slide"
                  >
                    <blockquote className="flex h-full flex-col rounded-3xl border border-line bg-card p-7 shadow-card transition-shadow duration-500 hover:shadow-hover">
                      <p className="flex gap-0.5 text-sm text-cta" aria-label="5 star rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                        ))}
                      </p>
                      <p className="mt-4 flex-1 leading-relaxed text-muted">“{t.text}”</p>
                      <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                        <Avatar initials={t.initials} grad={t.grad} className="h-11 w-11 text-sm" />
                        <div>
                          <p className="text-sm font-bold text-ink">{t.name}</p>
                          <p className="text-xs text-muted">{t.meta}</p>
                        </div>
                        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                          <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verified
                        </span>
                      </footer>
                    </blockquote>
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* Controls */}
            <div className="mt-7 flex items-center justify-between">
              <div className="flex gap-2" role="tablist" aria-label="Testimonial slides">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={index === i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-2.5 cursor-pointer rounded-full transition-all duration-300",
                      index === i ? "w-8 bg-primary" : "w-2.5 bg-line hover:bg-muted"
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={index === 0}
                  aria-label="Previous testimonials"
                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
                  disabled={index === maxIndex}
                  aria-label="Next testimonials"
                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
