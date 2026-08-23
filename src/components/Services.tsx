import { ArrowRight, Clock, Eye } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { SERVICES } from "../data/clinic";
import { SERVICE_ICONS } from "./BookingWizard";
import { Reveal, SectionHeading } from "./ui";

/** Services grid — every card deep-links into the booking wizard */
export default function Services() {
  const { open } = useBooking();

  return (
    <section id="services" className="section-pad bg-bg" aria-label="Services">
      <div className="wrap">
        <SectionHeading
          eyebrow="What we do"
          title="Every service your eyes will ever need"
          sub="From your child's first exam to life-changing LASIK — one team, one location, zero referrals across town."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
          {SERVICES.filter((s) => !s.emergency).map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon] ?? Eye;
            return (
              <Reveal key={s.id} delay={(i % 4) * 0.08} className="h-full">
                <article className="group flex h-full flex-col rounded-3xl border border-line bg-card p-6 shadow-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-hover">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky text-white shadow-lg shadow-primary/25 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-h3 font-bold text-ink">{s.name}</h3>
                  <p className="mt-2.5 flex-1 leading-relaxed text-muted">{s.desc}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <p className="text-sm text-muted">
                      <span className="mr-2 inline-flex items-center gap-1 text-xs">
                        <Clock className="h-3.5 w-3.5" aria-hidden /> {s.duration}
                      </span>
                      <span className="font-bold text-primary">{s.price}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => open({ serviceId: s.id })}
                      className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-bold text-primary transition-all hover:bg-primary-soft"
                    >
                      Book this
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
