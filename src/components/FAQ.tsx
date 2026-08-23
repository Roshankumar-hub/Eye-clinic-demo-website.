import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { FAQS } from "../data/clinic";
import { EASE } from "../lib/hooks";
import { cn } from "../utils/cn";
import { Reveal, SectionHeading } from "./ui";

/** FAQ accordion — one open at a time, smooth height animation */
export default function FAQ() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="section-pad bg-bg" aria-label="Frequently asked questions">
      <div className="wrap">
        <SectionHeading
          eyebrow="Questions, answered"
          title="Everything patients ask us"
          sub="Can't find your answer? Call us — a human picks up in under 30 seconds."
        />

        <div className="mx-auto max-w-3xl space-y-3.5">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card transition-colors duration-300",
                    isOpen ? "border-primary/40 shadow-card" : "border-line"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <MessageCircleQuestion
                        className={cn("h-5 w-5 shrink-0 transition-colors", isOpen ? "text-primary" : "text-muted")}
                        aria-hidden
                      />
                      <span className={cn("font-display text-base font-bold sm:text-lg", isOpen ? "text-primary" : "text-ink")}>
                        {f.q}
                      </span>
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={cn("shrink-0", isOpen ? "text-primary" : "text-muted")}
                      aria-hidden
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-button-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 pl-14 leading-relaxed text-muted">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
