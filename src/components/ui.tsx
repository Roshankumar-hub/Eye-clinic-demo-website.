import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion, useSpring } from "framer-motion";
import { EASE } from "../lib/hooks";
import { cn } from "../utils/cn";

/* ------------------------------- Reveal ----------------------------- */
/** Fades content up as it enters the viewport. Respects reduced motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Counter ----------------------------- */
/** Counts from 0 to `to` when scrolled into view. */
export function Counter({
  to,
  decimals = 0,
  suffix = "",
  duration = 2,
  className,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  const display =
    decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

/* ----------------------------- Magnetic ----------------------------- */
/** Subtly follows the cursor (12px radius) — desktop pointers only. */
export function Magnetic({
  children,
  className,
  strength = 12,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 });
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength);
    y.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Button ------------------------------ */
type ButtonVariant = "cta" | "primary" | "outline" | "ghost" | "dark" | "white";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  cta: "bg-cta text-slate-900 hover:bg-cta-deep shadow-lg shadow-amber-500/30 shine",
  primary: "bg-primary text-white hover:bg-primary-bright shadow-lg shadow-primary/30",
  outline:
    "border-2 border-line text-ink hover:border-primary hover:bg-primary-soft hover:text-primary",
  ghost: "text-primary hover:bg-primary-soft",
  dark: "bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
  white: "bg-white text-primary hover:bg-slate-100 shadow-lg shadow-slate-900/10",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-base sm:text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  magnetic = false,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  magnetic?: boolean;
}) {
  const btn = (
    <button
      type="button"
      className={cn(
        "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
  return magnetic ? <Magnetic>{btn}</Magnetic> : btn;
}

/* -------------------------- SectionHeading -------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-3xl md:mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-h2 font-extrabold text-ink">{title}</h2>
      {sub && <p className="mt-5 text-lg text-muted">{sub}</p>}
    </Reveal>
  );
}

/* ------------------------------ Avatar ------------------------------ */
/** Gradient initials avatar — used for testimonials, support team, etc. */
export function Avatar({
  initials,
  grad = "from-sky-400 to-blue-600",
  className,
}: {
  initials: string;
  grad?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display font-bold text-white",
        grad,
        className ?? "h-12 w-12 text-sm"
      )}
    >
      {initials}
    </span>
  );
}
