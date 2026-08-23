import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import {
  Activity, Baby, CalendarDays, Check, ChevronLeft, ChevronRight, Contact, Droplet, Eye, FileText,
  Flame, Gauge, Lock, Mail, MapPin, MessageCircle, Navigation,
  ScanEye, Siren, Smartphone, Sparkles, Star, Stethoscope, Wind, X, Zap,
} from "lucide-react";
import type { BookingPreset } from "../context/BookingContext";
import { useBooking } from "../context/BookingContext";
import {
  CLINIC, DOCTORS, INSURANCE, SERVICES, SLOT_COUNT, VISIT_REASONS,
  emergencySlots, isSlotBooked, slotLabel, type Service, type VisitReason,
} from "../data/clinic";
import { EASE, useFocusTrap, useMediaQuery, useScrollLock } from "../lib/hooks";
import { cn } from "../utils/cn";

/* ------------------------------ helpers ------------------------------ */

export const SERVICE_ICONS: Record<string, typeof Eye> = {
  exam: ScanEye, contacts: Contact, lasik: Zap, cataract: Eye, glaucoma: Gauge,
  pediatric: Baby, diabetic: Droplet, "dry-eye": Wind, emergency: Siren,
};

const REASON_ICONS: Record<VisitReason, typeof FileText> = {
  prescription: FileText, medical: Stethoscope, surgery: Activity,
};

const STEP_LABELS = ["Service", "Doctor", "Time", "Details", "Done"];

interface FormState {
  name: string;
  phone: string;
  email: string;
  patientType: "new" | "returning";
  insurance: string;
  forOther: boolean;
  otherName: string;
  reminders: { sms: boolean; email: boolean; whatsapp: boolean };
  notes: string;
}

const EMPTY_FORM: FormState = {
  name: "", phone: "", email: "", patientType: "new", insurance: INSURANCE[0],
  forOther: false, otherName: "", reminders: { sms: true, email: true, whatsapp: false }, notes: "",
};

const pad = (n: number) => n.toString().padStart(2, "0");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function gcalUrl(service: Service, date: Date, timeIdx: number): string {
  const label = slotLabel(timeIdx);
  const match = label.match(/(\d+):(\d+)\s(AM|PM)/);
  let h = 9, m = 0;
  if (match) {
    h = parseInt(match[1], 10) % 12;
    if (match[3] === "PM") h += 12;
    m = parseInt(match[2], 10);
  }
  const d = date;
  const start = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`;
  const end = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h + 1)}${pad(m)}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `ClearVision Eye Care — ${service.name}`,
    dates: `${start}/${end}`,
    location: CLINIC.address,
    details: `Visit with ${DOCTORS[0].name} team. ${CLINIC.phone}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ------------------------------- Wizard ------------------------------ */

interface WizardFlowProps {
  preset: BookingPreset | null;
  embedded?: boolean;
}

export function WizardFlow({ preset }: WizardFlowProps) {
  const reduce = useReducedMotion();

  const [step, setStep] = useState(() =>
    preset?.serviceId && preset?.doctorId ? 3 : preset?.serviceId ? 2 : 1
  );
  const [direction, setDirection] = useState(1);
  const [serviceId, setServiceId] = useState<string | null>(preset?.serviceId ?? null);
  const [dentistId, setDentistId] = useState<string | null>(preset?.doctorId ?? null);
  const [reason, setReason] = useState<VisitReason>(preset?.reason ?? "prescription");
  const [emergency, setEmergency] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [timeIdx, setTimeIdx] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"form" | "loading" | "done">("form");

  const service = SERVICES.find((s) => s.id === serviceId) ?? null;
  const dentist = DOCTORS.find((d) => d.id === dentistId) ?? null;

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1 && !serviceId) errs.step = "Please pick a service to continue.";
    if (s === 2 && !dentistId) errs.step = "Choose a doctor (or “no preference”) to continue.";
    if (s === 3 && (!date || timeIdx === null)) errs.step = "Select a date and a time to continue.";
    if (s === 4) {
      if (form.name.trim().length < 2) errs.name = "Please tell us your full name.";
      if (!/^[\d\s()+-]{7,}$/.test(form.phone.trim()))
        errs.phone = "Hmm, that phone number looks too short — e.g. (555) 010-2030.";
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
        errs.email = "Looks like that email is missing an @. Try name@example.com.";
      if (form.forOther && form.otherName.trim().length < 2)
        errs.otherName = "Please enter the patient's name.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const continueFrom = (s: number) => {
    if (!validateStep(s)) return;
    if (s === 4) {
      setPhase("loading");
      window.setTimeout(() => setPhase("done"), 700); // simulated server call
      return;
    }
    goTo(s + 1);
  };

  const reset = () => {
    setStep(1); setDirection(1);
    setServiceId(null); setDentistId(null); setReason("prescription");
    setEmergency(false); setDate(null); setTimeIdx(null);
    setForm(EMPTY_FORM); setErrors({}); setPhase("form");
  };

  const slots = useMemo(() => {
    const base = emergency ? emergencySlots() : Array.from({ length: SLOT_COUNT }, (_, i) => i);
    return base;
  }, [emergency]);

  const freeSlots = useMemo(() => {
    if (!date) return 0;
    return slots.filter((i) => !isSlotBooked(date.toDateString(), dentistId ?? "any", i)).length;
  }, [slots, date, dentistId]);

  const firstName = form.name.trim().split(" ")[0] || "friend";

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  /* Step transition variants */
  const slideVariants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => (reduce ? { opacity: 0 } : { x: d > 0 ? -48 : 48, opacity: 0 }),
  };

  /* ------------------------------ step 1 ------------------------------ */
  const step1 = (
    <div>
      <p className="mb-4 text-sm font-semibold tracking-wide text-muted uppercase">Why are you visiting?</p>
      <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Visit reason">
        {VISIT_REASONS.map((r) => {
          const Icon = REASON_ICONS[r.id];
          const active = reason === r.id;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setReason(r.id)}
              className={cn(
                "min-h-14 cursor-pointer rounded-xl border-2 p-3 text-left transition-all duration-300",
                active ? "border-primary bg-primary-soft" : "border-line hover:border-primary/50"
              )}
            >
              <span className="flex items-center gap-2 text-sm font-bold text-ink">
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted")} aria-hidden />
                {r.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted">{r.hint}</span>
            </button>
          );
        })}
      </div>

      {/* Emergency filter */}
      <button
        type="button"
        role="switch"
        aria-checked={emergency}
        onClick={() =>
          setEmergency((e) => {
            if (!e) {
              setDate(new Date()); // emergency → lock to today's slots
              setTimeIdx(null);
              if (serviceId !== "emergency") setServiceId("emergency");
            } else {
              setDate(null);
              setTimeIdx(null);
              if (serviceId === "emergency") setServiceId(null);
            }
            return !e;
          })
        }
        className="mt-5 flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-amber-300/60 bg-amber-400/10 px-4 transition-colors hover:bg-amber-400/20"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-ink">
          <Siren className="h-4 w-4 text-cta-deep" aria-hidden /> Emergency / same-day only
        </span>
        <span className={cn("relative h-6 w-11 rounded-full transition-colors", emergency ? "bg-cta" : "bg-line")} aria-hidden>
          <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", emergency ? "left-[22px]" : "left-0.5")} />
        </span>
      </button>

      <p className="mt-6 mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
        {emergency ? "Emergency services" : "Choose your service"}
      </p>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Service">
        {SERVICES.filter((s) => (emergency ? s.emergency : true)).map((s) => {
          const Icon = SERVICE_ICONS[s.icon] ?? Eye;
          const active = serviceId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setServiceId(s.id)}
              className={cn(
                "group relative cursor-pointer rounded-2xl border-2 bg-card p-4 text-left transition-all duration-300",
                active
                  ? "scale-[1.02] border-primary shadow-hover"
                  : "border-line hover:-translate-y-0.5 hover:border-primary/50"
              )}
            >
              {active && (
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
              )}
              <span className="flex items-start gap-3">
                <span className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-500 group-hover:rotate-6",
                  active ? "from-primary to-sky text-white" : "from-primary-soft to-sky/10 text-primary"
                )}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-ink">{s.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {s.duration} · {s.price}
                  </span>
                </span>
              </span>
              <span className="mt-2.5 block text-sm leading-relaxed text-muted">{s.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ------------------------------ step 2 ------------------------------ */
  const step2 = (
    <div>
      <p className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">Choose your doctor</p>
      <div className="grid gap-3" role="radiogroup" aria-label="Doctor">
        {DOCTORS.map((d) => {
          const active = dentistId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setDentistId(d.id)}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-2xl border-2 bg-card p-4 text-left transition-all duration-300",
                active ? "border-primary shadow-hover" : "border-line hover:-translate-y-0.5 hover:border-primary/50"
              )}
            >
              <img
                src={d.img} alt={`Portrait of ${d.name}`} loading="lazy" width={80} height={80}
                className={cn("h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20", active && "ring-2 ring-primary ring-offset-2")}
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2">
                  <span className="text-[15px] font-bold text-ink">{d.name}, {d.creds}</span>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary">{d.specialty}</span>
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-cta text-cta" aria-hidden />{d.rating} ({d.reviews})</span>
                  <span className={cn("flex items-center gap-1.5 font-medium", d.available ? "text-success" : "")}>
                    <span className={cn("h-2 w-2 rounded-full", d.available ? "bg-success" : "bg-muted")} aria-hidden />
                    {d.available ? "Available today" : `Next: ${d.nextAvailable}`}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted">
                  {d.languages.map((l) => `${l.flag} ${l.label}`).join(" · ")}
                </span>
              </span>
              {active && <Check className="h-6 w-6 shrink-0 text-primary" aria-hidden />}
            </button>
          );
        })}

        <button
          type="button"
          role="radio"
          aria-checked={dentistId === null}
          onClick={() => setDentistId(null)}
          className={cn(
            "flex min-h-16 cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-4 text-[15px] font-bold transition-all duration-300",
            dentistId === null ? "border-primary bg-primary-soft text-primary" : "border-line text-muted hover:border-primary/50 hover:text-primary"
          )}
        >
          <Sparkles className="h-5 w-5" aria-hidden />
          No preference — first available doctor
        </button>
      </div>
    </div>
  );

  /* ------------------------------ step 3 ------------------------------ */
  const step3 = (
    <div>
      {emergency ? (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-amber-400/10 p-3 text-sm font-semibold text-cta-deep">
          <Siren className="h-4 w-4 shrink-0" aria-hidden />
          Emergency mode — showing today's remaining slots only. We'll see you within hours.
        </p>
      ) : (
        <Calendar value={date} onSelect={(d) => { setDate(d); setTimeIdx(null); }} />
      )}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">
          {date ? fmtDate(date) : "Pick a date first"}
        </p>
        {date && freeSlots <= 4 && freeSlots > 0 && (
          <p className="flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
            <Flame className="h-3.5 w-3.5" aria-hidden /> Only {freeSlots} slots left
          </p>
        )}
      </div>
      {date ? (
        <div className="mt-3 grid grid-cols-2 gap-2 min-[390px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6" role="radiogroup" aria-label="Time slot">
          {slots.map((i) => {
            const booked = isSlotBooked(date.toDateString(), dentistId ?? "any", i);
            const active = timeIdx === i;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={booked}
                onClick={() => setTimeIdx(i)}
                className={cn(
                  "min-h-11 rounded-lg border px-2 text-sm font-semibold transition-all duration-200",
                  booked
                    ? "cursor-not-allowed border-line/60 bg-surface text-muted/50 line-through"
                    : active
                      ? "scale-[1.03] border-primary bg-primary text-white shadow-hover"
                      : "cursor-pointer border-line bg-card text-ink hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                )}
              >
                {slotLabel(i)}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-surface p-6 text-center text-sm text-muted">
          <CalendarDays className="mx-auto mb-2 h-8 w-8 text-primary/40" aria-hidden />
          Select a date to see available times. Sundays the clinic rests — so should you.
        </p>
      )}
    </div>
  );

  /* ------------------------------ step 4 ------------------------------ */
  const step4 = (
    <div className="space-y-4">
      <Field
        id="bk-name" label="Full name *" type="text" autoComplete="name"
        value={form.name} error={errors.name}
        onChange={(v) => set({ name: v })}
      />
      <Field
        id="bk-phone" label="Phone *" type="tel" autoComplete="tel" inputMode="tel"
        value={form.phone} error={errors.phone}
        onChange={(v) => set({ phone: v })}
      />
      <Field
        id="bk-email" label="Email *" type="email" autoComplete="email" inputMode="email"
        value={form.email} error={errors.email}
        onChange={(v) => set({ email: v })}
      />

      {/* Patient type */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Have you visited us before?</p>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Patient type">
          {([["new", "New patient"], ["returning", "Returning patient"]] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              role="radio"
              aria-checked={form.patientType === val}
              onClick={() => set({ patientType: val })}
              className={cn(
                "min-h-12 cursor-pointer rounded-xl border-2 text-sm font-bold transition-all",
                form.patientType === val ? "border-primary bg-primary-soft text-primary" : "border-line text-muted hover:border-primary/50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Insurance */}
      <div>
        <label htmlFor="bk-ins" className="mb-2 block text-sm font-semibold text-ink">Insurance provider</label>
        <select
          id="bk-ins"
          value={form.insurance}
          onChange={(e) => set({ insurance: e.target.value })}
          className="h-12 w-full cursor-pointer rounded-xl border border-line bg-card px-4 text-ink transition-colors focus:border-primary"
        >
          {INSURANCE.map((i) => <option key={i} value={i}>{i}</option>)}
          <option value="self">Paying myself</option>
        </select>
      </div>

      {/* Booking for someone else */}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface/60 p-4">
        <span
          className={cn("flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors", form.forOther ? "border-primary bg-primary text-white" : "border-line bg-card")}
          aria-hidden
        >
          {form.forOther && <Check className="h-4 w-4" />}
        </span>
        <input
          type="checkbox" className="sr-only" checked={form.forOther}
          onChange={(e) => set({ forOther: e.target.checked })}
        />
        <span className="text-sm font-semibold text-ink">Booking for someone else (a parent, child or spouse)?</span>
      </label>
      <AnimatePresence initial={false}>
        {form.forOther && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden"
          >
            <div className="pt-1">
              <Field id="bk-other" label="Patient's full name *" type="text"
                value={form.otherName} error={errors.otherName} onChange={(v) => set({ otherName: v })} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Reminder preference</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Reminders">
          {([["sms", "SMS", Smartphone], ["email", "Email", Mail], ["whatsapp", "WhatsApp", MessageCircle]] as const).map(([key, label, Icon]) => {
            const on = form.reminders[key];
            return (
              <button
                key={key} type="button" aria-pressed={on}
                onClick={() => set({ reminders: { ...form.reminders, [key]: !on } })}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-all",
                  on ? "border-primary bg-primary-soft text-primary" : "border-line text-muted hover:border-primary/50"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="bk-notes" className="mb-2 block text-sm font-semibold text-ink">
          Anything the doctor should know? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="bk-notes" rows={3} value={form.notes} onChange={(e) => set({ notes: e.target.value })}
          placeholder="e.g. I'm nervous about the pressure test, my last exam was 5 years ago…"
          className="w-full rounded-xl border border-line bg-card p-4 text-ink transition-colors outline-none placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/25"
        />
      </div>

      <p className="flex items-center gap-2 rounded-xl bg-success/10 p-3 text-sm font-medium text-success">
        <Lock className="h-4 w-4 shrink-0" aria-hidden />
        Your information is private and HIPAA-safe. We never share it.
      </p>
    </div>
  );

  /* ------------------------------ step 5 ------------------------------ */
  const step5 =
    phase === "loading" ? (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.span
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary/15 border-t-primary"
          aria-hidden
        />
        <p className="mt-6 font-display text-xl font-bold text-ink">Securing your slot…</p>
        <p className="mt-1 text-sm text-muted">Contacting the ClearVision calendar</p>
      </div>
    ) : phase === "done" && service ? (
      <Confirmation
        firstName={firstName} service={service} dentist={dentist} date={date} timeIdx={timeIdx}
        form={form} onBookAnother={reset}
      />
    ) : null;

  /* --------------------------- error message --------------------------- */
  const stepError = errors.step ? (
    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-danger" role="alert">
      {errors.step}
    </p>
  ) : null;

  return (
    <div className="grid h-full min-h-0 lg:grid-cols-[1fr_330px]">
      {/* Flow column */}
      <div className="flex min-h-0 flex-col">
        {/* Compact summary — mobile only */}
        <CompactSummary service={service} date={date} timeIdx={timeIdx} onEdit={goTo} />

        {/* Stepper */}
        <Stepper step={step} />

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: EASE }}
            >
              {step === 1 && step1}
              {step === 2 && step2}
              {step === 3 && step3}
              {step === 4 && step4}
              {step === 5 && step5}
              {stepError}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        {step < 5 && (
          <div className="flex items-center justify-between gap-3 border-t border-line bg-bg/80 p-4 sm:px-7">
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              disabled={step === 1}
              className={cn(
                "inline-flex min-h-12 cursor-pointer items-center gap-1.5 rounded-full px-5 text-sm font-bold transition-colors",
                step === 1 ? "cursor-not-allowed text-muted/40" : "text-muted hover:bg-surface hover:text-ink"
              )}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden /> Back
            </button>
            {step < 4 && (
              <button
                type="button"
                onClick={() => continueFrom(step)}
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-bright"
              >
                Continue <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            )}
            {step === 4 && (
              <button
                type="button"
                onClick={() => continueFrom(4)}
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-cta px-7 text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta-deep"
              >
                <Lock className="h-4 w-4" aria-hidden /> Confirm Booking
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop summary */}
      <aside
        className="hidden overflow-y-auto border-l border-line bg-surface/70 p-6 lg:block"
        aria-label="Your appointment summary"
      >
        <SummaryCard service={service} dentist={dentist} date={date} timeIdx={timeIdx} reason={reason} onEdit={goTo} />
      </aside>
    </div>
  );
}

/* ------------------------------ Calendar ------------------------------ */

function Calendar({ value, onSelect }: { value: Date | null; onSelect: (d: Date) => void }) {
  const today = new Date();
  const [month, setMonth] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [dir, setDir] = useState(1);

  const cells = useMemo(() => {
    const firstDow = new Date(month.y, month.m, 1).getDay();
    const daysInMonth = new Date(month.y, month.m + 1, 0).getDate();
    const out: (number | null)[] = [];
    for (let i = 0; i < firstDow; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(d);
    return out;
  }, [month]);

  const changeMonth = (delta: number) => {
    setDir(delta);
    const d = new Date(month.y, month.m + delta, 1);
    setMonth({ y: d.getFullYear(), m: d.getMonth() });
  };

  const canPrev = month.y > today.getFullYear() || (month.y === today.getFullYear() && month.m > today.getMonth());
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  const canNext = month.y < maxMonth.getFullYear() || (month.y === maxMonth.getFullYear() && month.m < maxMonth.getMonth());

  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-lg font-bold text-ink" aria-live="polite">
          {MONTHS[month.m]} {month.y}
        </p>
        <div className="flex gap-1.5">
          <button type="button" onClick={() => changeMonth(-1)} disabled={!canPrev} aria-label="Previous month"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={() => changeMonth(1)} disabled={!canNext} aria-label="Next month"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30">
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center" role="grid" aria-label="Calendar">
        {DOW.map((d, i) => (
          <span key={i} className="py-1 text-xs font-bold text-muted/70" aria-hidden>{d}</span>
        ))}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${month.y}-${month.m}`}
            initial={{ x: dir * 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir * -32, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="col-span-7 grid grid-cols-7 gap-1"
          >
            {cells.map((day, i) => {
              if (day === null) return <span key={`b${i}`} aria-hidden />;
              const d = new Date(month.y, month.m, day);
              const isToday = d.toDateString() === today.toDateString();
              const disabled = d < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || d.getDay() === 0;
              const selected = value?.toDateString() === d.toDateString();
              return (
                <motion.button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(d)}
                  whileTap={selected ? undefined : { scale: 0.85 }}
                  aria-label={`${MONTHS[month.m]} ${day}`}
                  aria-pressed={selected}
                  className={cn(
                    "relative mx-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    disabled ? "cursor-not-allowed text-muted/30"
                      : selected
                        ? "bg-primary text-white shadow-hover"
                        : isToday
                          ? "text-primary ring-2 ring-primary/60 hover:bg-primary-soft"
                          : "text-ink hover:bg-primary-soft"
                  )}
                >
                  {day}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-3 text-xs text-muted">Sundays closed · same-day slots shown in amber</p>
    </div>
  );
}

/* ------------------------------- Stepper ------------------------------ */

function Stepper({ step }: { step: number }) {
  const progress = ((step - 1) / (STEP_LABELS.length - 1)) * 100;
  return (
    <div className="border-b border-line px-5 pt-5 sm:px-7" aria-label={`Step ${step} of 5`}>
      <div className="relative mb-3 h-1 rounded-full bg-line">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-sky"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>
      <div className="flex justify-between pb-4">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
              <motion.span
                animate={{ scale: active ? 1.12 : 1 }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  done ? "bg-primary text-white" : active ? "bg-primary text-white shadow-lg shadow-primary/40" : "bg-line text-muted"
                )}
              >
                {done ? <Check className="h-4 w-4" aria-hidden /> : n}
              </motion.span>
              <span className={cn("text-[10px] font-bold tracking-wide uppercase sm:text-xs", active ? "text-primary" : "text-muted/70")}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------- Summary cards ----------------------------- */

function SummaryCard({
  service, dentist, date, timeIdx, reason, onEdit,
}: {
  service: Service | null;
  dentist: { name: string } | null;
  date: Date | null;
  timeIdx: number | null;
  reason: VisitReason;
  onEdit: (step: number) => void;
}) {
  const reasonLabel = VISIT_REASONS.find((r) => r.id === reason)?.label ?? reason;
  return (
    <div className="sticky top-6">
      <h3 className="font-display text-lg font-bold text-ink">Your appointment</h3>
      <dl className="mt-4 space-y-4 text-sm">
        <SummaryRow label="Service" value={service ? `${service.name} · ${service.price}` : "Not selected yet"} onEdit={() => onEdit(1)} />
        <SummaryRow label="Doctor" value={dentist ? dentist.name : "First available"} onEdit={() => onEdit(2)} />
        <SummaryRow label="Date" value={date ? fmtDate(date) : "—"} onEdit={() => onEdit(3)} />
        <SummaryRow label="Time" value={timeIdx !== null ? slotLabel(timeIdx) : "—"} onEdit={() => onEdit(3)} />
        <SummaryRow label="Reason" value={reasonLabel} onEdit={() => onEdit(1)} />
      </dl>
      <div className="mt-6 space-y-2 rounded-2xl bg-primary-soft p-4 text-xs leading-relaxed text-muted">
        <p className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden /> Free rescheduling up to 24h before</p>
        <p className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden /> No card needed — pay after your visit</p>
        <p className="flex items-start gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden /> Instant confirmation by text & email</p>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-card p-4">
        <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        <p className="text-xs leading-snug text-muted">{CLINIC.address}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</dt>
        <dd className={cn("mt-0.5 font-bold", value.includes("Not") || value === "—" ? "text-muted/60" : "text-ink")}>{value}</dd>
      </div>
      <button type="button" onClick={onEdit} aria-label={`Edit ${label.toLowerCase()}`}
        className="cursor-pointer rounded-full p-1.5 text-muted/60 transition-colors hover:bg-primary-soft hover:text-primary">
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

/** Compact sticky summary shown on small screens */
function CompactSummary({
  service, date, timeIdx, onEdit,
}: {
  service: Service | null;
  date: Date | null;
  timeIdx: number | null;
  onEdit: (step: number) => void;
}) {
  if (!service && !date) return null;
  return (
    <button
      type="button"
      onClick={() => onEdit(3)}
      className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-2 border-b border-line bg-primary-soft px-5 py-2 text-left lg:hidden"
    >
      <span className="truncate text-sm font-bold text-primary">
        {service?.name ?? "Appointment"}{date && timeIdx !== null ? ` · ${fmtDate(date)} ${slotLabel(timeIdx)}` : ""}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
    </button>
  );
}

/* --------------------------- Floating input --------------------------- */

function Field({
  id, label, type, value, onChange, error, autoComplete, inputMode,
}: {
  id: string; label: string; type: string; value: string;
  onChange: (v: string) => void; error?: string; autoComplete?: string; inputMode?: "tel" | "email";
}) {
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          placeholder=" "
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={cn(
            "peer h-14 w-full rounded-xl border-2 bg-card px-4 pt-5 pb-1 text-ink transition-all duration-200 outline-none",
            error
              ? "border-danger focus:ring-2 focus:ring-danger/25"
              : "border-line focus:border-primary focus:ring-2 focus:ring-primary/20"
          )}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted transition-all duration-200 peer-focus:top-3.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-sm font-medium text-danger" role="alert">
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ---------------------------- Confirmation ---------------------------- */

const CONFETTI_COLORS = ["#F59E0B", "#38BDF8", "#1E40AF", "#10B981", "#F43F5E", "#A78BFA"];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 80 + Math.random() * 110;
        return {
          id: i,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 40,
          rotate: Math.random() * 360,
          duration: 0.9 + Math.random() * 0.7,
        };
      }),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute h-2.5 w-1.5 rounded-sm"
          style={{ background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.5, rotate: p.rotate }}
          transition={{ duration: p.duration, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function Confirmation({
  firstName, service, dentist, date, timeIdx, form, onBookAnother,
}: {
  firstName: string;
  service: Service;
  dentist: { name: string } | null;
  date: Date | null;
  timeIdx: number | null;
  form: FormState;
  onBookAnother: () => void;
}) {
  return (
    <div className="relative">
      <Confetti />
      <div className="text-center">
        {/* Self-drawing checkmark */}
        <motion.svg viewBox="0 0 52 52" className="mx-auto h-20 w-20" aria-hidden>
          <motion.circle
            cx="26" cy="26" r="24" fill="none" stroke="#10B981" strokeWidth="2.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: EASE }}
          />
          <motion.path
            d="M15 27l7.5 7.5L38 18" fill="none" stroke="#10B981" strokeWidth="4"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.45, ease: EASE }}
          />
        </motion.svg>
        <motion.h3
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
          className="mt-4 font-display text-2xl font-extrabold text-ink"
        >
          You're all set{firstName !== "friend" ? `, ${firstName}` : ""}! 🎉
        </motion.h3>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="mt-2 text-muted">
          We've reserved your slot and sent a confirmation.
        </motion.p>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.55, ease: EASE, type: "spring" }}
          className="mt-7 rounded-2xl border border-line bg-card p-5 text-left shadow-card"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryRow label="Service" value={service.name} onEdit={() => undefined} />
            <SummaryRow label="Doctor" value={dentist ? dentist.name : "First available"} onEdit={() => undefined} />
            <SummaryRow label="Date" value={date ? fmtDate(date) : "—"} onEdit={() => undefined} />
            <SummaryRow label="Time" value={timeIdx !== null ? slotLabel(timeIdx) : "—"} onEdit={() => undefined} />
            <SummaryRow label="Duration" value={service.duration} onEdit={() => undefined} />
            <SummaryRow label="Location" value={CLINIC.address} onEdit={() => undefined} />
          </div>
        </motion.div>

        {/* Notification preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45, duration: 0.5, ease: EASE }}
          className="mt-4 rounded-2xl border border-line bg-surface p-4 text-left"
        >
          <p className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
            <Smartphone className="h-4 w-4 text-primary" aria-hidden />
            Confirmation sent to {form.phone || "your phone"}
          </p>
          <p className="mt-2 rounded-xl bg-card p-3 text-sm text-muted shadow-card">
            “Hi {firstName}! Your ClearVision appointment is confirmed for{" "}
            {date ? fmtDate(date) : ""} at {timeIdx !== null ? slotLabel(timeIdx) : ""}. See you soon — the ClearVision team 👁”
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}
          className="mt-6 grid gap-2.5 sm:grid-cols-3"
        >
          <a
            href={gcalUrl(service, date ?? new Date(), timeIdx ?? 0)}
            target="_blank" rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-bright"
          >
            <CalendarDays className="h-4 w-4" aria-hidden /> Google Calendar
          </a>
          <a
            href={CLINIC.mapsDirections} target="_blank" rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-line px-5 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            <Navigation className="h-4 w-4" aria-hidden /> Get Directions
          </a>
          <button
            type="button" onClick={onBookAnother}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-line px-5 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            Book Another
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------ Modal ------------------------------- */

export function BookingModal() {
  const { isOpen, preset, close } = useBooking();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const contentRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  useScrollLock(isOpen);
  useFocusTrap(isOpen, contentRef, close);

  const presetKey = JSON.stringify(preset ?? {});

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Dialog — bottom sheet on mobile, centered dialog on desktop */}
          <motion.div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-label="Book an appointment"
            drag={isDesktop ? false : "y"}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) close();
            }}
            initial={isDesktop ? { opacity: 0, scale: 0.94, y: 24 } : { y: "100%" }}
            animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
            exit={isDesktop ? { opacity: 0, scale: 0.96, y: 16 } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.9 }}
            className="relative flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-bg shadow-2xl sm:h-[85vh] sm:max-h-[85vh] sm:max-w-5xl sm:rounded-3xl"
          >
            {/* Grab handle (mobile) */}
            <div
              className="flex cursor-grab touch-none justify-center pt-3 pb-1 active:cursor-grabbing sm:hidden"
              onPointerDown={(e) => dragControls.start(e)}
              aria-hidden
            >
              <span className="h-1.5 w-12 rounded-full bg-line" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5 sm:px-7">
              <div>
                <h2 className="font-display text-lg font-extrabold text-ink">Book your appointment</h2>
                <p className="text-xs text-muted">Takes under 30 seconds · no payment today</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close booking"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {/* Wizard body */}
            <div className="min-h-0 flex-1">
              <WizardFlow key={presetKey} preset={preset} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------- Embedded section ------------------------ */

export function BookingSection() {
  const { open } = useBooking();
  return (
    <section id="booking" className="section-pad relative overflow-hidden bg-surface" aria-label="Online booking">
      <div aria-hidden className="dot-grid absolute inset-0 opacity-60" />
      <div aria-hidden className="absolute -top-32 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-sky/10 blur-3xl" />
      <div className="wrap relative">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold tracking-wide text-primary uppercase">
              Online scheduling
            </p>
            <h2 className="text-h2 font-extrabold text-ink">Book your visit in 30 seconds</h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Pick a service, a doctor, and a time that fits your day. Instant confirmation — no
              phone calls, no waiting rooms, no mystery bills.
            </p>
          </div>
          <button
            type="button"
            onClick={() => open()}
            className="hidden cursor-pointer items-center gap-2 rounded-full border-2 border-line px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary lg:inline-flex"
          >
            Open as popup ↗
          </button>
        </div>
        <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
          <WizardFlow preset={null} />
        </div>
      </div>
    </section>
  );
}
