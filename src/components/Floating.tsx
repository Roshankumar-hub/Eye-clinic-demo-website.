import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, CalendarDays, MessageCircle, Phone } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { CLINIC } from "../data/clinic";
import { EASE, useScrolledPast } from "../lib/hooks";

/* -------------------------- WhatsApp button -------------------------- */
export function WhatsAppButton() {
  return (
    <motion.a
      href={CLINIC.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 18 }}
      className="group fixed right-5 bottom-6 z-40 hidden md:flex"
    >
      {/* Tooltip */}
      <span className="glass pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-xl border border-line px-4 py-2 text-sm font-semibold whitespace-nowrap text-ink opacity-0 shadow-float transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        Chat with us — replies in minutes
      </span>
      <span className="animate-pulse-soft flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-xl shadow-whatsapp/40 transition-transform duration-300 group-hover:scale-110">
        <MessageCircle className="h-7 w-7" aria-hidden />
      </span>
    </motion.a>
  );
}

/* ------------------------ Mobile sticky CTA bar ----------------------- */
export function MobileCTABar() {
  const visible = useScrolledPast(300);
  const { open } = useBooking();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96 }}
          animate={{ y: 0 }}
          exit={{ y: 96 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="glass fixed inset-x-0 bottom-0 z-40 border-t border-line pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <div className="flex gap-2.5 p-3">
            <a
              href={CLINIC.phoneHref}
              className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-white shadow-lg shadow-primary/30 active:scale-[0.98]"
            >
              <Phone className="h-5 w-5" aria-hidden /> Call Now
            </a>
            <button
              type="button"
              onClick={() => open()}
              className="flex min-h-14 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-cta text-base font-bold text-slate-900 shadow-lg shadow-amber-500/30 active:scale-[0.98]"
            >
              <CalendarDays className="h-5 w-5" aria-hidden /> Book Online
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------- Back to top ----------------------------- */
export function BackToTop() {
  const visible = useScrolledPast(60);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: EASE }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-5 bottom-24 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line glass text-ink shadow-float transition-all hover:-translate-y-1 hover:border-primary hover:text-primary md:bottom-24"
        >
          <ArrowUp className="h-5 w-5" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
