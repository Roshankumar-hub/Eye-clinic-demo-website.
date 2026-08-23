import { motion, useScroll, useSpring } from "framer-motion";

/** 3px teal→sky→amber gradient bar pinned to the very top of the page */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-primary via-sky to-cta"
      style={{ scaleX }}
    />
  );
}
