import { ArrowRight, Phone } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { CLINIC } from "../data/clinic";
import { Reveal } from "./ui";

/** Full-width gradient CTA band */
export default function FinalCTA() {
  const { open } = useBooking();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-bright to-sky py-20 md:py-28" aria-label="Book an appointment">
      <div aria-hidden className="animate-blob absolute -top-32 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="animate-blob absolute -right-24 -bottom-32 h-96 w-96 rounded-full bg-sky/40 blur-3xl [animation-delay:-12s]" />
      <div aria-hidden className="dot-grid absolute inset-0 opacity-40 mix-blend-overlay" />

      <Reveal className="wrap relative text-center">
        <h2 className="mx-auto max-w-3xl text-h2 font-extrabold text-white">
          Ready to see life in full clarity?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
          Same-week appointments · 0% LASIK financing · free rescheduling. Your future in focus
          starts with one click.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => open()}
            className="group inline-flex min-h-14 cursor-pointer items-center gap-2 rounded-full bg-cta px-8 text-base font-bold text-slate-900 shadow-xl shadow-slate-900/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400"
          >
            Book Appointment Online
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </button>
          <a
            href={CLINIC.phoneHref}
            className="inline-flex min-h-14 items-center gap-2 rounded-full border-2 border-white/40 px-8 text-base font-bold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <Phone className="h-5 w-5" aria-hidden />
            {CLINIC.phone} — we answer in under 30 seconds
          </a>
        </div>
      </Reveal>
    </section>
  );
}
