import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, BadgeCheck, BookOpen, CalendarDays, GraduationCap, Heart, Languages, Star, X } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { DOCTORS, SUPPORT_TEAM, type Doctor, type DoctorFilter } from "../data/clinic";
import { EASE, useFocusTrap, useMediaQuery, useScrollLock } from "../lib/hooks";
import { cn } from "../utils/cn";
import { Avatar, Reveal, SectionHeading } from "./ui";

const FILTERS: { id: DoctorFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "optometrist", label: "Optometrists" },
  { id: "surgeon", label: "Surgeons" },
  { id: "pediatric", label: "Pediatric Specialists" },
];

export default function MeetTheTeam() {
  const [filter, setFilter] = useState<DoctorFilter>("all");
  const [selected, setSelected] = useState<Doctor | null>(null);
  const { open } = useBooking();

  const visible = DOCTORS.filter((d) => filter === "all" || d.filter === filter);

  return (
    <section id="doctors" className="section-pad bg-surface" aria-label="Meet our doctors">
      <div className="wrap">
        <SectionHeading
          eyebrow="Meet the team"
          title="Meet the people behind your vision"
          sub="Real humans who remember your name — and your coffee order. Four doctors, one promise: you'll leave seeing better than you arrived."
        />

        {/* Filter tabs */}
        <div className="mb-10" role="tablist" aria-label="Filter doctors by specialty">
        <Reveal className="flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "relative min-h-12 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors",
                filter === f.id ? "text-white" : "text-muted hover:text-primary"
              )}
            >
              {filter === f.id && (
                <motion.span
                  layoutId="doctor-filter-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/30"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </Reveal>
        </div>

        {/* Doctor cards */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((d) => (
              <motion.article
                layout
                key={d.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-card transition-shadow duration-500 hover:shadow-hover"
              >
                {/* Patient favorite ribbon */}
                {d.favorite && (
                  <span className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1.5 text-xs font-extrabold text-white shadow-lg shadow-amber-500/40">
                    <Star className="h-3.5 w-3.5 fill-white" aria-hidden /> Patient Favorite
                  </span>
                )}

                {/* Portrait + hover quote panel */}
                <div className="relative overflow-hidden">
                  <img
                    src={d.img}
                    alt={`Portrait of ${d.name}, ${d.specialty}`}
                    loading="lazy"
                    width={520}
                    height={650}
                    className="aspect-[4/5] w-full object-cover grayscale-[0.35] transition-all duration-700 group-hover:scale-[1.05] group-hover:grayscale-0"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-primary via-primary/95 to-sky/90 p-5 text-white transition-transform duration-500 ease-out group-hover:translate-y-0"
                    aria-hidden={false}
                  >
                    <p className="text-sm leading-relaxed font-medium italic">“{d.quote}”</p>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-ink">
                    {d.name}, {d.creds}
                  </h3>
                  <p className="mt-1 inline-flex self-start rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary uppercase">
                    {d.specialty}
                  </p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <span className="flex items-center gap-1 font-semibold text-ink">
                      <Star className="h-4 w-4 fill-cta text-cta" aria-hidden />
                      {d.rating}
                    </span>
                    <span>({d.reviews} reviews)</span>
                    <span>· {d.experience} yrs</span>
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
                    <Languages className="h-4 w-4" aria-hidden />
                    {d.languages.map((l) => `${l.flag} ${l.label}`).join(" · ")}
                  </p>
                  <p className={cn("mt-1.5 flex items-center gap-2 text-sm font-semibold", d.available ? "text-success" : "text-muted")}>
                    <span className={cn("h-2.5 w-2.5 rounded-full", d.available ? "bg-success" : "bg-muted")} aria-hidden />
                    {d.available ? "Available Today" : `Next: ${d.nextAvailable}`}
                  </p>

                  <div className="mt-5 flex gap-2 border-t border-line pt-4">
                    <button
                      type="button"
                      onClick={() => setSelected(d)}
                      className="min-h-12 flex-1 cursor-pointer rounded-full border-2 border-line text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => open({ doctorId: d.id })}
                      className="min-h-12 flex-1 cursor-pointer rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-bright"
                    >
                      Book {d.name.split(" ")[1]}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Support team */}
        <Reveal className="mt-20">
          <h3 className="mb-8 text-center font-display text-2xl font-extrabold text-ink">Our support team</h3>
          <ul className="flex flex-wrap items-start justify-center gap-x-8 gap-y-6">
            {SUPPORT_TEAM.map((m) => (
              <li key={m.name} className="group flex w-24 flex-col items-center gap-2.5 text-center">
                <Avatar
                  initials={m.initials}
                  grad={m.grad}
                  className="h-16 w-16 text-lg ring-4 ring-transparent transition-all duration-300 group-hover:scale-110 group-hover:ring-primary/20"
                />
                <span>
                  <span className="block text-sm font-bold text-ink">{m.name}</span>
                  <span className="block text-xs text-muted">{m.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Team photo */}
        <Reveal className="mt-20">
          <figure className="group relative overflow-hidden rounded-[2.5rem] shadow-float">
            <img
              src="https://images.pexels.com/photos/6129494/pexels-photo-6129494.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
              alt="The ClearVision team smiling together in the clinic"
              loading="lazy"
              width={1600}
              height={700}
              className="aspect-[16/7] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-6 pt-24 text-white sm:p-10">
              <p className="font-display text-2xl font-extrabold sm:text-3xl">One team. One goal — your comfort.</p>
              <p className="mt-1 text-sm text-white/80">22 clinicians, technicians and front-desk folks who know you by name.</p>
            </figcaption>
          </figure>
        </Reveal>
      </div>

      <AnimatePresence>
        {selected && <DoctorDrawer doctor={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

/* ---------------------------- Profile drawer -------------------------- */

const RATING_BARS = [
  { star: 5, pct: 92 },
  { star: 4, pct: 6 },
  { star: 3, pct: 2 },
  { star: 2, pct: 0 },
  { star: 1, pct: 0 },
];

function DoctorDrawer({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const ref = useRef<HTMLDivElement>(null);
  const { open } = useBooking();
  useScrollLock(true);
  useFocusTrap(true, ref, onClose);

  return (
    <div className="fixed inset-0 z-[85]">
      <motion.div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`Profile of ${doctor.name}`}
        initial={isDesktop ? { x: "100%" } : { y: "100%" }}
        animate={isDesktop ? { x: 0 } : { y: 0 }}
        exit={isDesktop ? { x: "100%" } : { y: "100%" }}
        transition={{ duration: 0.5, ease: EASE }}
        className={cn(
          "absolute overflow-y-auto bg-bg shadow-2xl",
          isDesktop
            ? "inset-y-0 right-0 w-full max-w-[540px]"
            : "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl pb-[env(safe-area-inset-bottom)]"
        )}
      >
        {/* Hero image */}
        <div className="relative">
          <img
            src={doctor.img}
            alt={`Portrait of ${doctor.name}`}
            className="h-64 w-full object-cover object-top sm:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" aria-hidden />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="absolute top-4 right-4 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full glass border border-line text-ink transition-colors hover:text-primary"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          {doctor.favorite && (
            <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-lg">
              <Star className="h-3.5 w-3.5 fill-white" aria-hidden /> Patient Favorite
            </span>
          )}
        </div>

        <div className="px-6 pb-10 sm:px-8">
          <h3 className="font-display text-3xl font-extrabold text-ink">
            {doctor.name}, {doctor.creds}
          </h3>
          <p className="mt-1 font-semibold text-primary">{doctor.specialty}</p>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-cta text-cta" aria-hidden />
              <strong className="text-ink">{doctor.rating}</strong> ({doctor.reviews} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-primary" aria-hidden />
              {doctor.experience} years experience
            </span>
            <span className="flex items-center gap-1.5">
              <Languages className="h-4 w-4 text-primary" aria-hidden />
              {doctor.languages.map((l) => l.label).join(", ")}
            </span>
            <span className={cn("flex items-center gap-1.5 font-semibold", doctor.available ? "text-success" : "")}>
              <span className={cn("h-2.5 w-2.5 rounded-full", doctor.available ? "bg-success" : "bg-muted")} aria-hidden />
              {doctor.available ? "Available Today" : `Next: ${doctor.nextAvailable}`}
            </span>
          </div>

          <p className="mt-5 leading-relaxed text-muted">{doctor.bio}</p>

          {/* Rating breakdown */}
          <div className="mt-6 rounded-2xl border border-line bg-surface/60 p-5">
            <p className="mb-3 text-sm font-bold text-ink">Rating breakdown</p>
            <div className="space-y-2">
              {RATING_BARS.map((r) => (
                <div key={r.star} className="flex items-center gap-3 text-xs text-muted">
                  <span className="w-10 shrink-0 font-semibold">{r.star}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${r.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-sky"
                    />
                  </div>
                  <span className="w-8 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mt-6">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <GraduationCap className="h-4 w-4 text-primary" aria-hidden /> Education
            </p>
            <ul className="space-y-2">
              {doctor.education.map((e) => (
                <li key={e} className="flex items-start gap-2.5 text-sm text-muted">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" aria-hidden />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          <div className="mt-6">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <BadgeCheck className="h-4 w-4 text-primary" aria-hidden /> Certifications
            </p>
            <ul className="flex flex-wrap gap-2">
              {doctor.certifications.map((c) => (
                <li key={c} className="rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-bold text-primary">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Interests */}
          <div className="mt-6">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <Heart className="h-4 w-4 text-primary" aria-hidden /> Special interests
            </p>
            <ul className="flex flex-wrap gap-2">
              {doctor.interests.map((i) => (
                <li key={i} className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-muted">
                  {i}
                </li>
              ))}
            </ul>
          </div>

          {/* Availability */}
          <div className="mt-6">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <CalendarDays className="h-4 w-4 text-primary" aria-hidden /> In the clinic
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Available days">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                const on = doctor.days.includes(day);
                return (
                  <span
                    key={day}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-bold",
                      on ? "bg-primary text-white" : "bg-surface text-muted/50"
                    )}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              open({ doctorId: doctor.id });
            }}
            className="mt-8 flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-cta text-base font-bold text-slate-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:bg-cta-deep"
          >
            Book with {doctor.name}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
