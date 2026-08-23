import { Baby, CreditCard, Feather, ScanLine } from "lucide-react";
import { Counter, Reveal, SectionHeading } from "./ui";

const FEATURES = [
  {
    icon: ScanLine,
    title: "Modern 3D Imaging",
    desc: "OCT and ultra-widefield retinal scans that catch glaucoma, diabetic changes and macular issues up to 5 years earlier than traditional exams.",
  },
  {
    icon: Feather,
    title: "Painless, Touchless Exams",
    desc: "Air-puff-free pressure checks, gentle instrumentation and calm rooms. If exams make you nervous, we'll take it slow — it's built into our schedule.",
  },
  {
    icon: CreditCard,
    title: "Transparent Upfront Pricing",
    desc: "You'll see your exact out-of-pocket cost — after insurance — printed before any treatment starts. No surprise facility fees. Ever.",
  },
  {
    icon: Baby,
    title: "Kid & Family Friendly",
    desc: "Play-based exams for ages 3+, parent in the room, and a pediatric team kids actually ask to come back and see. Three generations trust us.",
  },
];

const STATS = [
  { value: 12000, suffix: "+", label: "Patients cared for", decimals: 0 },
  { value: 15, suffix: "", label: "Years of excellence", decimals: 0 },
  { value: 4.9, suffix: "★", label: "Average rating", decimals: 1 },
  { value: 98, suffix: "%", label: "Would recommend us", decimals: 0 },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="section-pad bg-surface" aria-label="Why choose us">
      <div className="wrap">
        <SectionHeading
          eyebrow="Why ClearVision"
          title="Eye care that finally puts you first"
          sub="Four promises we make to every single patient — from first hello to 20/20."
        />

        <div className="grid gap-5 sm:grid-cols-2 3xl:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08} className="h-full">
              <div className="group h-full rounded-3xl border border-line bg-card p-7 shadow-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-hover">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                  <f.icon className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{f.title}</h3>
                <p className="mt-2.5 leading-relaxed text-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Stats band */}
      <div className="wrap mt-16 md:mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary-bright to-sky px-6 py-14 text-white shadow-hover md:px-14">
            <div aria-hidden className="animate-blob absolute -top-24 -left-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div aria-hidden className="animate-blob absolute -right-20 -bottom-24 h-72 w-72 rounded-full bg-sky/30 blur-2xl [animation-delay:-10s]" />
            <dl className="relative grid grid-cols-2 gap-x-6 gap-y-10 text-center lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dd className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                    <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-2 text-sm font-medium text-white/80">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
