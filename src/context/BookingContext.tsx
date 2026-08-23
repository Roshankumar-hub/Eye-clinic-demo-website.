import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { VisitReason } from "../data/clinic";

/** Preselection passed when opening the booking wizard from anywhere */
export interface BookingPreset {
  serviceId?: string;
  doctorId?: string;
  reason?: VisitReason;
}

interface BookingContextValue {
  isOpen: boolean;
  preset: BookingPreset | null;
  open: (preset?: BookingPreset) => void;
  close: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState<BookingPreset | null>(null);

  const open = useCallback((p?: BookingPreset) => {
    setPreset(p ?? null);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, preset, open, close }), [isOpen, preset, open, close]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
