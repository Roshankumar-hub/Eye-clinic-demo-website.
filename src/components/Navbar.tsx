import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Menu, Moon, Phone, Star, Sun, X } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { CLINIC } from "../data/clinic";
import { EASE, useScrollLock } from "../lib/hooks";
import { cn } from "../utils/cn";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Our Doctors", href: "#doctors" },
  { label: "Eyewear", href: "#eyewear" },
  { label: "Results", href: "#results" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

/* ---------------------------- Theme toggle --------------------------- */

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cv-theme", next ? "dark" : "light");
    } catch {
      /* private mode — ignore */
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-card text-ink transition-colors hover:border-primary hover:text-primary",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="inline-flex"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/* ------------------------------- Navbar ------------------------------ */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "ES">("EN");
  const { open } = useBooking();
  useScrollLock(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility strip — collapses away on scroll */}
      <div
        className={cn(
          "hidden overflow-hidden bg-slate-900 text-slate-300 transition-all duration-500 md:block",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        )}
      >
        <div className="wrap flex h-9 items-center justify-between text-[13px]">
          <p className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-sky" aria-hidden />
            New patients welcome · Same-day emergency eye care
          </p>
          <div className="flex items-center gap-5">
            <a
              href={CLINIC.phoneHref}
              className="flex items-center gap-1.5 font-medium transition-colors hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {CLINIC.phone}
            </a>
            <button
              type="button"
              onClick={() => open()}
              className="cursor-pointer font-medium text-sky transition-colors hover:text-white"
            >
              Book Online
            </button>
            <div className="flex items-center gap-1" role="group" aria-label="Language">
              {(["EN", "ES"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={cn(
                    "cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-bold transition-colors",
                    lang === l ? "bg-sky text-slate-900" : "hover:text-white"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav — transparent at top, glass after 80px scroll */}
      <nav
        aria-label="Main navigation"
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "glass border-b border-line py-2.5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
            : "border-b border-transparent bg-transparent py-4 md:py-5"
        )}
      >
        <div className="wrap flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#home" className="group flex items-center gap-2.5" aria-label="ClearVision Eye Care — home">
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky text-white shadow-lg shadow-primary/30 transition-transform duration-500 group-hover:rotate-[8deg]">
              <Eye className="h-6 w-6" aria-hidden />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-cta ring-2 ring-bg" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-extrabold tracking-tight text-ink">
                ClearVision
              </span>
              <span className="block text-[11px] font-semibold tracking-[0.28em] text-primary uppercase">
                Eye Care
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 xl:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-[15px] font-medium text-muted transition-colors hover:bg-primary-soft hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <a
              href={CLINIC.phoneHref}
              className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary lg:flex"
            >
              <Phone className="h-4 w-4 text-primary" aria-hidden />
              {CLINIC.phone}
            </a>
            <button
              type="button"
              onClick={() => open()}
              className="hidden cursor-pointer rounded-full bg-cta px-6 py-2.5 text-[15px] font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta-deep sm:block"
            >
              Book Appointment
            </button>
            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-card text-ink transition-colors hover:border-primary hover:text-primary xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-[70] flex w-full flex-col bg-bg p-6 shadow-2xl sm:max-w-[420px]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-extrabold text-ink">
                  ClearVision <span className="text-primary">Eye Care</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Mobile navigation" className="mt-8 flex-1">
                <ul className="space-y-1">
                  {LINKS.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: EASE }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex min-h-14 items-center rounded-2xl px-4 font-display text-2xl font-bold text-ink transition-colors hover:bg-primary-soft hover:text-primary"
                      >
                        {l.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
                className="space-y-3 border-t border-line pt-5 pb-[env(safe-area-inset-bottom)]"
              >
                <a
                  href={CLINIC.phoneHref}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-line font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                >
                  <Phone className="h-5 w-5" aria-hidden /> Call {CLINIC.phone}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    open();
                  }}
                  className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-cta font-semibold text-slate-900 shadow-lg shadow-amber-500/25 transition-colors hover:bg-cta-deep"
                >
                  <Star className="h-5 w-5" aria-hidden /> Book Appointment Online
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
