import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bus, Car, Check, Clock, Mail, MapPin, Navigation, Phone, Send } from "lucide-react";
import { CLINIC, HOURS } from "../data/clinic";
import { cn } from "../utils/cn";
import { Reveal, SectionHeading } from "./ui";

/** Today's row (Mon=0) highlighted in the hours table */
const todayIndex = (new Date().getDay() + 6) % 7;

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 700);
    window.setTimeout(() => {
      setStatus("idle");
      setForm({ name: "", phone: "", message: "" });
    }, 5200);
  };

  return (
    <section id="contact" className="section-pad bg-surface" aria-label="Location and contact">
      <div className="wrap">
        <SectionHeading
          eyebrow="Visit us"
          title="In the neighborhood? Come say hi"
          sub="Two minutes from Riverside Station, with free parking out front and fresh coffee in the lobby."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ----------------------------- map card ----------------------------- */}
          <Reveal>
            <div className="relative h-full min-h-[26rem] overflow-hidden rounded-3xl border border-line shadow-card">
              {/* Stylised map */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(rgba(30,64,175,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(30,64,175,0.07)_1px,transparent_1px)] bg-[size:34px_34px] dark:bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)]"
              />
              {/* River */}
              <div aria-hidden className="absolute top-0 right-10 bottom-0 w-16 -rotate-6 bg-gradient-to-b from-sky/25 to-primary/20 blur-[2px]" />
              {/* Roads */}
              <div aria-hidden className="absolute inset-x-0 top-1/3 h-1.5 -rotate-3 bg-line/80" />
              <div aria-hidden className="absolute inset-x-0 bottom-1/4 h-1.5 rotate-2 bg-line/60" />

              {/* Pulsing pin */}
              <div className="absolute top-[44%] left-[54%] -translate-x-1/2 -translate-y-1/2">
                <span className="relative flex h-16 w-16 items-center justify-center" aria-hidden>
                  <motion.span
                    className="absolute inset-0 rounded-full bg-primary/30"
                    animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.span
                    className="absolute inset-2 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                  />
                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40">
                    <MapPin className="h-5 w-5" />
                  </span>
                </span>
              </div>

              {/* Overlay card */}
              <div className="absolute inset-x-5 bottom-5">
                <div className="glass rounded-2xl border border-line p-5 shadow-float">
                  <p className="font-display text-lg font-extrabold text-ink">ClearVision Eye Care</p>
                  <p className="mt-1 text-sm text-muted">{CLINIC.address}</p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <a
                      href={CLINIC.mapsDirections}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-bright"
                    >
                      <Navigation className="h-4 w-4" aria-hidden /> Get Directions
                    </a>
                    <a
                      href={CLINIC.phoneHref}
                      className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-line px-5 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
                    >
                      <Phone className="h-4 w-4" aria-hidden /> {CLINIC.phone}
                    </a>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pt-3.5 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-primary" aria-hidden /> Free parking — 40 spaces
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bus className="h-3.5 w-3.5 text-primary" aria-hidden /> Bus 12 & 44 stop out front
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ------------------------- hours + form ------------------------- */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-6">
              {/* Hours */}
              <div className="rounded-3xl border border-line bg-card p-6 shadow-card sm:p-7">
                <h3 className="flex items-center gap-2.5 font-display text-xl font-extrabold text-ink">
                  <Clock className="h-5 w-5 text-primary" aria-hidden /> Opening hours
                </h3>
                <dl className="mt-4">
                  {HOURS.map((h, i) => {
                    const isToday = i === todayIndex;
                    return (
                      <div
                        key={h.day}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors",
                          isToday ? "bg-primary-soft font-bold text-primary" : "text-muted"
                        )}
                      >
                        <dt className="flex items-center gap-2">
                          {h.day}
                          {isToday && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold text-white uppercase">
                              Today
                            </span>
                          )}
                        </dt>
                        <dd className={cn("font-semibold", isToday ? "text-primary" : "text-ink")}>
                          {h.open ? `${h.open} – ${h.close}` : "Closed"}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-line pt-4 text-sm text-muted">
                  <a href={`mailto:${CLINIC.email}`} className="flex items-center gap-1.5 font-semibold transition-colors hover:text-primary">
                    <Mail className="h-4 w-4 text-primary" aria-hidden /> {CLINIC.email}
                  </a>
                </p>
              </div>

              {/* Contact form */}
              <form
                onSubmit={submit}
                className="flex-1 rounded-3xl border border-line bg-card p-6 shadow-card sm:p-7"
                aria-label="Contact form"
              >
                <h3 className="font-display text-xl font-extrabold text-ink">Send us a message</h3>
                <p className="mt-1 text-sm text-muted">We reply within one business hour.</p>
                <div className="mt-5 space-y-3.5">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    aria-label="Your name"
                    className="h-13 w-full rounded-xl border border-line bg-bg px-4 text-ink transition-colors outline-none placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="Phone number"
                    aria-label="Phone number"
                    className="h-13 w-full rounded-xl border border-line bg-bg px-4 text-ink transition-colors outline-none placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="How can we help?"
                    aria-label="Message"
                    className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-ink transition-colors outline-none placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    disabled={status !== "idle"}
                    className="shine inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-bright disabled:cursor-wait disabled:opacity-80"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {status === "idle" && (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                          <Send className="h-4 w-4" aria-hidden /> Send message
                        </motion.span>
                      )}
                      {status === "sending" && (
                        <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                          <motion.span
                            className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                            aria-hidden
                          />
                          Sending…
                        </motion.span>
                      )}
                      {status === "sent" && (
                        <motion.span
                          key="sent"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="h-5 w-5" aria-hidden /> Sent! We'll be in touch shortly
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
