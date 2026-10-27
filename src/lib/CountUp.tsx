import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Final value. Non-numeric strings are rendered as-is. */
  value: string | number;
  from?: number;
  duration?: number;
  className?: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts up to `value` the first time it scrolls into view. */
export const CountUp: React.FC<CountUpProps> = ({ value, from, duration = 1400, className = '' }) => {
  const target = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.]/g, ''));
  const numeric = Number.isFinite(target) && /^\s*[0-9.,]+\s*$/.test(String(value));
  const start = from ?? (numeric ? Math.max(0, Math.floor(target * 0.6)) : 0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState<number>(start);
  const [done, setDone] = useState(!numeric);

  useEffect(() => {
    if (!numeric) return;
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(target);
      setDone(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          setShown(Math.round(start + (target - start) * easeOut(p)));
          if (p < 1) requestAnimationFrame(tick);
          else setDone(true);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [numeric, target, start, duration]);

  return (
    <span ref={ref} className={className}>
      {numeric ? (done ? value : shown) : value}
    </span>
  );
};
