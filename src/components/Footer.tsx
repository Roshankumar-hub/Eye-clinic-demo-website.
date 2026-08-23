import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Phone, ShieldCheck, Siren } from "lucide-react";

/* Brand icons (lucide removed brand glyphs) */
const SOCIALS = [
  {
    label: "Facebook",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path
          d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
          fill="currentColor"
        />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#020617" />
      </svg>
    ),
  },
];
import { useBooking } from "../context/BookingContext";
import { CLINIC, HOURS, SERVICES } from "../data/clinic";
import { EASE, useFocusTrap, useScrollLock } from "../lib/hooks";
import { useRef } from "react";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Our Doctors", href: "#doctors" },
  { label: "Eyewear Boutique", href: "#eyewear" },
  { label: "Results", href: "#results" },
  { label: "Reviews", href: "#reviews" },
  { label: "Vision Self-Check", href: "#vision-test" },
  { label: "Contact", href: "#contact" },
];

const LEGAL: Record<string, { title: string; body: string }> = {
  privacy: {
    title: "Privacy Policy",
    body: "Your health information is protected under HIPAA. We collect only what's needed to provide care, never sell your data, and you can request a copy or deletion of your records at any time by emailing our office. Marketing communications are opt-in and include one-click unsubscribe.",
  },
  terms: {
    title: "Terms of Use",
    body: "This website is provided for information only and does not constitute medical advice. Booking confirmations are provisional until verified by our front desk — we'll always contact you before making changes. Pricing shown is 'from' pricing; your exact out-of-pocket cost is confirmed before any treatment begins.",
  },
  accessibility: {
    title: "Accessibility Statement",
    body: "ClearVision Eye Care is committed to WCAG 2.1 AA. This site supports keyboard navigation, screen readers, reduced-motion preferences, and text scaling. Our clinic is wheelchair accessible with large-print materials and companion seating in every exam room. Need an accommodation? Call us and we'll arrange it.",
  },
};

export default function Footer() {
  const { open } = useBooking();
  const [legal, setLegal] = useState<keyof typeof LEGAL | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useScrollLock(legal !== null);
  useFocusTrap(legal !== null, modalRef, () => setLegal(null));

  return (
    <footer className="bg-slate-950 text-slate-300" aria-label="Footer">
      {/* Emergency strip */}
      <div className="border-b border-danger/30 bg-gradient-to-r from-danger/20 via-danger/10 to-danger/20">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-4 text-center sm:flex-row sm:text-left">
          <p className="flex items-center gap-2.5 text-sm font-bold text-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/20 text-danger">
              <Siren className="h-4.5 w-4.5" aria-hidden />
            </span>
            Eye emergency? Pain, sudden vision loss, flashes or floaters — call our 24/7 line:
          </p>
          <a
            href={CLINIC.emergencyHref}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-danger px-6 text-sm font-extrabold text-white shadow-lg shadow-danger/30 transition-all hover:-translate-y-0.5 hover:bg-red-500"
          >
            <Phone className="h-4 w-4" aria-hidden /> {CLINIC.emergencyPhone}
          </a>
        </div>
      </div>

      {/* Main columns */}
      <div className="wrap grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <a href="#home" className="flex items-center gap-2.5">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky text-white">
              <Eye className="h-6 w-6" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-extrabold text-white">ClearVision</span>
              <span className="block text-[11px] font-semibold tracking-[0.28em] text-sky uppercase">Eye Care</span>
            </span>
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
            Modern, gentle, tech-forward eye care for the whole family — from first eye exam to
            life-changing LASIK, all under one bright roof.
          </p>
          <div className="mt-6 flex gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#contact"
                aria-label={`ClearVision on ${s.label}`}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-all hover:-translate-y-0.5 hover:border-sky hover:text-sky"
              >
                {s.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer quick links">
          <h3 className="font-display text-base font-extrabold text-white">Quick Links</h3>
          <ul className="mt-5 space-y-1">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-9 items-center text-sm text-slate-400 transition-colors hover:text-sky">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Services — book directly */}
        <nav aria-label="Footer services">
          <h3 className="font-display text-base font-extrabold text-white">Popular Services</h3>
          <ul className="mt-5 space-y-1">
            {SERVICES.filter((s) => !s.emergency).slice(0, 6).map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => open({ serviceId: s.id })}
                  className="inline-flex min-h-9 cursor-pointer items-center text-left text-sm text-slate-400 transition-colors hover:text-sky"
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hours */}
        <div>
          <h3 className="font-display text-base font-extrabold text-white">Opening Hours</h3>
          <dl className="mt-5 space-y-1.5 text-sm">
            {HOURS.map((h) => (
              <div key={h.day} className="flex justify-between gap-4">
                <dt className="text-slate-400">{h.day}</dt>
                <dd className="font-medium text-slate-300">{h.open ? `${h.open} – ${h.close}` : "Closed"}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 shrink-0 text-sky" aria-hidden />
            HIPAA-compliant · Board-certified doctors
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-slate-500 sm:flex-row">
          <p>© 2025 ClearVision Eye Care · All rights reserved</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {(["privacy", "terms", "accessibility"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setLegal(k)}
                className="min-h-9 cursor-pointer font-semibold transition-colors hover:text-sky"
              >
                {LEGAL[k].title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legal modal */}
      <AnimatePresence>
        {legal && (
          <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6">
            <motion.div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLegal(null)}
            />
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label={LEGAL[legal].title}
              initial={{ opacity: 0, y: 48, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.97 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative w-full max-w-lg rounded-t-3xl bg-bg p-7 pb-9 shadow-2xl sm:rounded-3xl"
            >
              <h2 className="font-display text-2xl font-extrabold text-ink">{LEGAL[legal].title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{LEGAL[legal].body}</p>
              <button
                type="button"
                onClick={() => setLegal(null)}
                className="mt-6 inline-flex min-h-12 cursor-pointer items-center rounded-full bg-primary px-7 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-bright"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
