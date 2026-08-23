import { INSURANCE } from "../data/clinic";

/** Infinite marquee of insurance / trust partners — pauses on hover */
export default function TrustMarquee() {
  const items = [...INSURANCE, ...INSURANCE];
  return (
    <section aria-label="Insurance and partners" className="marquee border-y border-line bg-surface py-6">
      <p className="wrap mb-4 text-center text-xs font-semibold tracking-[0.22em] text-muted uppercase">
        In-network with all major vision plans
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <ul className="animate-marquee flex w-max items-center gap-14 px-7">
          {items.map((name, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= INSURANCE.length}
              className="flex items-center gap-3 whitespace-nowrap text-lg font-bold tracking-tight text-muted/70 transition-all duration-300 hover:scale-105 hover:text-primary"
            >
              <span className="h-2 w-2 rounded-full bg-primary/30" aria-hidden />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
