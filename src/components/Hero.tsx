import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Clock, Phone, ShieldCheck, Users, Zap } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { CLINIC } from "../data/clinic";
import { EASE } from "../lib/hooks";
import { Avatar, Button } from "./ui";

const HEADLINE = ["See", "Life", "in", "Full", "Clarity."];

const TRUST = [
  { icon: Clock, label: "15+ Years of Care" },
  { icon: Users, label: "25,000+ Exams" },
  { icon: ShieldCheck, label: "All Insurance Accepted" },
  { icon: Zap, label: "Same-Day Emergencies" },
];

export default function Hero() {
  const { open } = useBooking();
  const reduce = useReducedMotion();

  /* Subtle 0.3x parallax for the background blobs + image */
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 800], [0, 180]);
  const blobY2 = useTransform(scrollY, [0, 800], [0, -120]);
  const imgY = useTransform(scrollY, [0, 800], [0, 90]);

  return (
    <section
      id="home"
      className="grain dot-grid relative overflow-hidden bg-bg pt-28 md:pt-44"
      aria-label="Introduction"
    >
      {/* Morphing gradient blobs */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: blobY }}
        className="animate-blob absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-sky/20 blur-3xl md:h-[44rem] md:w-[44rem]"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: blobY2 }}
        className="animate-blob absolute top-1/3 -right-48 h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-3xl [animation-delay:-8s]"
      />
      {/* Soft radial glow behind content */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(60%_50%_at_50%_0%,rgba(56,189,248,0.08),transparent_70%)]"
      />

      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        {/* ------------------------------ copy ------------------------------ */}
        <div className="max-w-2xl lg:col-span-7">
          {/* Rating pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
            className="glass inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink shadow-card"
          >
            <span className="flex text-cta" aria-hidden>
              {"★★★★★"}
            </span>
            4.9 · 480+ Google Reviews
          </motion.div>

          {/* Headline — word-by-word blur reveal */}
          <h1 className="mt-6 text-h1 font-extrabold text-ink">
            {HEADLINE.map((word, i) => (
              <span key={i} className="inline-block overflow-visible">
                <motion.span
                  className={i === 4 ? "inline-block bg-gradient-to-r from-primary via-primary-bright to-sky bg-clip-text text-transparent" : "inline-block"}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48, filter: "blur(8px)" }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: EASE }}
                >
                  {word}
                </motion.span>
                {i < HEADLINE.length - 1 && <span> </span>}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mt-6 max-w-xl text-lg text-muted sm:text-xl"
          >
            Comprehensive exams, expert LASIK, and a designer eyewear boutique — delivered by
            doctors who treat you like family. Book your visit online in under 30 seconds, no
            phone calls needed.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button
              variant="cta"
              size="lg"
              magnetic
              icon={<ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />}
              onClick={() => open()}
            >
              Book Appointment Online
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<Phone className="h-5 w-5" aria-hidden />}
              onClick={() => (window.location.href = CLINIC.phoneHref)}
            >
              {CLINIC.phone}
            </Button>
          </motion.div>

          {/* Trust row */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:items-center"
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-[15px] font-medium text-muted">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ----------------------------- visual ----------------------------- */}
        <div className="relative lg:col-span-5">
          {/* Teal glow behind the portrait */}
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[4rem] bg-[radial-gradient(70%_70%_at_50%_50%,var(--cv-hero-glow),transparent_75%)]"
          />

          {/* Hero image — slides in from the right with a clip-path reveal */}
          <motion.div
            style={reduce ? undefined : { y: imgY }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 64, clipPath: "inset(0 0 0 100% round 3rem)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, clipPath: "inset(0 0 0 0% round 3rem)" }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2.5rem] border border-line shadow-float">
              <img
                src="/images/hero.jpg"
                alt="Smiling patient with modern eyeglasses at ClearVision Eye Care"
                width={880}
                height={1100}
                fetchPriority="high"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            {/* Floating glass card — next available slot */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
              className="absolute -left-3 top-8 sm:-left-8"
            >
              <div className="glass animate-float flex items-center gap-3 rounded-2xl border border-line p-4 shadow-float">
                <span className="relative flex h-3 w-3" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">Next available</p>
                  <p className="text-sm font-medium text-muted">Today, 2:30 PM</p>
                </div>
              </div>
            </motion.div>

            {/* Floating glass card — happy patients */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease: EASE }}
              className="absolute -right-2 bottom-10 sm:-right-6"
            >
              <div className="glass animate-float flex items-center gap-3 rounded-2xl border border-line p-4 shadow-float [animation-delay:-2s]">
                <span className="flex -space-x-2.5" aria-hidden>
                  <Avatar initials="MT" grad="from-amber-400 to-orange-500" className="h-9 w-9 text-xs ring-2 ring-bg" />
                  <Avatar initials="RK" grad="from-teal-400 to-blue-500" className="h-9 w-9 text-xs ring-2 ring-bg" />
                  <Avatar initials="JL" grad="from-indigo-400 to-blue-700" className="h-9 w-9 text-xs ring-2 ring-bg" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">480+ happy patients</p>
                  <p className="text-sm font-medium text-muted">this month alone</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <motion.a
        href="#services"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="relative z-10 mx-auto mt-16 flex h-14 w-14 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-primary hover:text-primary"
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex"
        >
          <ChevronDown className="h-5 w-5" aria-hidden />
        </motion.span>
      </motion.a>
    </section>
  );
}
