import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './motion.js';

// Parses a KPI value such as 248, '1,234' or '12.5'. Returns null for
// anything that is not a plain number ('—', undefined, 'N/A').
function parse(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? { n: value, decimals: 0 } : null;
  if (typeof value !== 'string' || !/^-?[\d,]+(\.\d+)?$/.test(value.trim())) return null;
  const clean = value.replace(/,/g, '');
  return { n: Number(clean), decimals: clean.includes('.') ? clean.split('.')[1].length : 0 };
}

/**
 * Counts a number up from 0 to `value` over `duration` ms, keeping the same
 * en-IN formatting and decimals as the final value. `minDigits` pads with
 * leading zeros (2 -> "02"). Non-numbers are shown as they are; with reduced
 * motion the final value shows at once.
 */
export default function CountUp({ value, duration = 900, minDigits = 1 }) {
  const parsed = parse(value);
  const [shown, setShown] = useState(parsed && !prefersReducedMotion() ? 0 : parsed?.n);

  useEffect(() => {
    if (!parsed) return undefined;
    if (prefersReducedMotion()) {
      setShown(parsed.n);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3; // ease-out cubic
      setShown(parsed.n * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // Restart only when the target number changes.
  }, [parsed?.n, duration]);

  if (!parsed) return value ?? '—';
  return Number(shown).toLocaleString('en-IN', {
    minimumIntegerDigits: minDigits,
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  });
}
