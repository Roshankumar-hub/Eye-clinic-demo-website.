import { ArrowRight, Sparkles } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { FRAMES } from "../data/clinic";
import { Reveal, SectionHeading } from "./ui";

/** Designer frames boutique — every card links into the booking wizard */
export default function EyewearBoutique() {
  const { open } = useBooking();

  return (
    <section id="eyewear" className="section-pad bg-surface" aria-label="Eyewear boutique">
      <div className="wrap">
        <SectionHeading
          eyebrow="The boutique"
          title="Eyewear you'll actually want to wear"
          sub="170+ designer frames curated by our in-house stylists — with honest advice on what suits your face, never a pushy upsell."
        />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {FRAMES.map((f, i) => (
            <Reveal key={f.id} delay={(i % 3) * 0.08}>
              <article className="group relative overflow-hidden rounded-3xl border border-line bg-card shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-hover">
                <div className="relative overflow-hidden">
                  <img
                    src={f.img}
                    alt={`${f.brand} ${f.model} frames at ClearVision's boutique`}
                    loading="lazy"
                    width={800}
                    height={520}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-extrabold text-primary backdrop-blur">
                    {f.tag}
                  </span>
                  {/* Slide-up CTA */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-slate-950/90 to-slate-950/20 p-4 pt-10 transition-transform duration-500 group-hover:translate-y-0">
                    <button
                      type="button"
                      onClick={() => open({ serviceId: "contacts" })}
                      className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-sm font-bold text-primary transition-transform hover:scale-[1.02]"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden /> Book a styling session
                    </button>
                  </div>
                </div>
                <div className="flex items-end justify-between p-5">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-primary uppercase">{f.brand}</p>
                    <h3 className="mt-0.5 text-lg font-bold text-ink">{f.model}</h3>
                  </div>
                  <p className="font-display text-xl font-extrabold text-ink">{f.price}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
          <button
            type="button"
            onClick={() => open({ serviceId: "contacts" })}
            className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-2 border-line px-6 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            Can't decide? We'll help — book a fitting
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
