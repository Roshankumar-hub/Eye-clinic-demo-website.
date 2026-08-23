import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Eye, RotateCcw, Search } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { EASE } from "../lib/hooks";
import { cn } from "../utils/cn";
import { Reveal, SectionHeading } from "./ui";

/* Approximate Snellen acuity per round size (px at ~1.2m / 4ft) */
const ROUNDS = [
  { size: 80, label: "20/200" },
  { size: 63, label: "20/160" },
  { size: 50, label: "20/125" },
  { size: 40, label: "20/100" },
  { size: 32, label: "20/80" },
  { size: 25, label: "20/63" },
  { size: 20, label: "20/50" },
  { size: 16, label: "20/40" },
  { size: 14, label: "20/32" },
  { size: 12, label: "20/25" },
];

const LETTERS = ["E", "F", "P", "T", "O", "Z", "L", "D", "C", "H"];

type Phase = "intro" | "testing" | "result";

interface RoundState {
  target: string;
  options: string[];
}

function makeRound(): RoundState {
  const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
  const target = shuffled[0];
  const pool = shuffled.slice(1, 4);
  return { target, options: [...pool, target].sort(() => Math.random() - 0.5) };
}

/** Free online vision self-check — a playful Snellen widget that funnels into booking */
export default function VisionTest() {
  const { open } = useBooking();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [rState, setRState] = useState<RoundState>(makeRound);
  const [resultRound, setResultRound] = useState<number | null>(null); // round the user failed (or completed)

  const start = () => {
    setPhase("testing");
    setRound(0);
    setRState(makeRound());
    setResultRound(null);
  };

  const answer = (choice: string) => {
    if (choice === rState.target) {
      if (round === ROUNDS.length - 1) {
        setResultRound(ROUNDS.length); // aced everything
        setPhase("result");
      } else {
        setRound((r) => r + 1);
        setRState(makeRound());
      }
    } else {
      setResultRound(round); // failed at this round → acuity is this line
      setPhase("result");
    }
  };

  const acuity = resultRound === null ? null : resultRound >= ROUNDS.length ? "20/20 or better" : ROUNDS[resultRound].label;
  const acuityHint =
    resultRound === null
      ? ""
      : resultRound >= ROUNDS.length
        ? "Crystal clear — keep it that way with an annual exam."
        : resultRound >= 6
          ? "Still pretty sharp, but an exam will confirm everything's healthy."
          : resultRound >= 4
            ? "Glasses or contacts could make daily life noticeably easier."
            : "That's a strong sign to get a professional exam soon.";

  return (
    <section id="vision-test" className="section-pad bg-bg" aria-label="Free vision self-check">
      <div className="wrap">
        <SectionHeading
          eyebrow="Free · takes 60 seconds"
          title="How's your vision, really?"
          sub="A playful self-check inspired by the classic Snellen chart. Not a diagnosis — but it will tell you if it's time for the real thing."
        />

        <Reveal className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-card shadow-card">
            <div aria-hidden className="absolute -top-20 left-1/2 h-56 w-[30rem] -translate-x-1/2 rounded-full bg-sky/10 blur-3xl" />

            <AnimatePresence mode="wait">
              {phase === "intro" && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative px-6 py-12 text-center sm:px-12"
                >
                  <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky text-white shadow-lg shadow-primary/30">
                    <Eye className="h-8 w-8" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">The ClearVision Vision Check</h3>
                  <p className="mx-auto mt-3 max-w-md text-muted">
                    Letters shrink each round — click the one you see. For best results, wear your
                    glasses or contacts and sit about 4 feet from the screen.
                  </p>
                  <ul className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-2 text-xs font-semibold text-muted">
                    <li className="rounded-full bg-surface px-3 py-1.5">🕶 Wear your correction</li>
                    <li className="rounded-full bg-surface px-3 py-1.5">📏 ~4 ft from screen</li>
                    <li className="rounded-full bg-surface px-3 py-1.5">🔊 Bright room</li>
                  </ul>
                  <button
                    type="button"
                    onClick={start}
                    className="mt-8 inline-flex min-h-14 cursor-pointer items-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-bright"
                  >
                    Start the check <ArrowRight className="h-5 w-5" aria-hidden />
                  </button>
                  <p className="mt-4 text-xs text-muted/70">Just for fun — never a substitute for a real eye exam.</p>
                </motion.div>
              )}

              {phase === "testing" && (
                <motion.div
                  key={`round-${round}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="relative px-6 py-10 text-center sm:px-12"
                >
                  <p className="text-xs font-bold tracking-widest text-muted uppercase">
                    Round {round + 1} of {ROUNDS.length}
                  </p>

                  {/* Progress */}
                  <div className="mx-auto mt-3 flex max-w-xs items-end justify-center gap-1" aria-hidden>
                    {ROUNDS.map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "flex-1 rounded-t-full transition-all duration-300",
                          i <= round ? "bg-gradient-to-t from-primary to-sky" : "bg-line",
                        )}
                        style={{ height: 6 + i * 3 }}
                      />
                    ))}
                  </div>

                  {/* The letter */}
                  <div className="mt-6 flex h-36 items-center justify-center" aria-live="polite">
                    <motion.span
                      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.35 }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="font-display font-extrabold leading-none text-ink"
                      style={{ fontSize: ROUNDS[round].size }}
                    >
                      {rState.target}
                    </motion.span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-muted">Which letter did you see?</p>
                  <div className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-2.5" role="group" aria-label="Answer options">
                    {rState.options.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => answer(l)}
                        className="min-h-14 cursor-pointer rounded-2xl border-2 border-line bg-card text-xl font-extrabold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => answer("__none__")}
                    className="mt-4 min-h-12 cursor-pointer rounded-full px-6 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-ink"
                  >
                    None of these / can't read it
                  </button>
                </motion.div>
              )}

              {phase === "result" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative px-6 py-12 text-center sm:px-12"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky text-white shadow-lg shadow-primary/30"
                  >
                    <Search className="h-8 w-8" aria-hidden />
                  </motion.span>
                  <p className="mt-5 text-xs font-bold tracking-widest text-muted uppercase">Your self-check result</p>
                  <p className="mt-2 font-display text-4xl font-extrabold text-ink">{acuity}</p>
                  <p className="mx-auto mt-3 max-w-md text-muted">{acuityHint}</p>

                  <div className="mx-auto mt-8 max-w-md rounded-2xl border border-line bg-surface/70 p-5 text-left">
                    <p className="text-sm font-bold text-ink">What happens next?</p>
                    <p className="mt-1.5 text-sm text-muted">
                      A real exam takes 45 minutes and measures 40+ things this game can't — eye
                      pressure, retina health, astigmatism, and more. Most patients are surprised by
                      what we find.
                    </p>
                    <button
                      type="button"
                      onClick={() => open({ serviceId: "exam", reason: "medical" })}
                      className="mt-4 flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-cta text-sm font-bold text-slate-900 shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 hover:bg-cta-deep"
                    >
                      Your result suggests booking a real exam <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={start}
                    className="mt-6 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-ink"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden /> Try again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
