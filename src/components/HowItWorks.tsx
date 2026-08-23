import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { CalendarCheck, ClipboardList, MessagesSquare, Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "./ui";

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Book Online",
    desc: "Pick a service and a time in under 30 seconds. Instant confirmation, free rescheduling.",
  },
  {
    icon: MessagesSquare,
    title: "Free Consultation",
    desc: "Meet your doctor. Discuss your goals, fears and questions — no exam-chair pressure.",
  },
  {
    icon: ClipboardList,
    title: "Personalised Plan",
    desc: "A treatment plan in plain language, with your exact price after insurance. In writing.",
  },
  {
    icon: Sparkles,
    title: "See Clearly",
    desc: "Walk out seeing life in full clarity — and come back every year to keep it that way.",
  },
];

/** 4-step timeline whose connecting line draws itself on scroll */
export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const width = useTransform(line, [0, 1], ["0%", "100%"]);
  const height = useTransform(line, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="section-pad bg-bg" aria-label="How it works">
      <div className="wrap">
        <SectionHeading
          eyebrow="How it works"
          title="From first click to full clarity"
          sub="We removed every barrier between you and better vision — including the phone call."
        />

        <div ref={ref} className="relative">
          {/* Horizontal line (desktop) */}
          <div aria-hidden className="absolute top-9 right-[12%] left-[12%] hidden h-1 rounded-full bg-line lg:block">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-sky" style={{ width }} />
          </div>
          {/* Vertical line (mobile) */}
          <div aria-hidden className="absolute top-2 bottom-2 left-9 w-1 -translate-x-1/2 rounded-full bg-line lg:hidden">
            <motion.div className="w-full rounded-full bg-gradient-to-b from-primary to-sky" style={{ height }} />
          </div>

          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.12} className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
                  <span className="relative z-10 flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl border border-line bg-card text-primary shadow-card lg:h-[4.5rem] lg:w-[4.5rem]">
                    <s.icon className="h-8 w-8" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-primary uppercase">Step {i + 1}</p>
                    <h3 className="mt-1 text-xl font-bold text-ink">{s.title}</h3>
                    <p className="mt-2 max-w-xs leading-relaxed text-muted lg:mx-auto">{s.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
