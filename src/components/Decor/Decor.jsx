// Artwork for the woodland theme (src/theme/themes.js, `decor: true`).
// Plain inline SVGs, decorative only: hidden from screen readers and never
// in the way of clicks.

const WAVE_W = 250;
const WAVE_H = 420;

// Line paths for SilkWaves, worked out once. Two bundles of thin curves:
// an S-shaped ribbon from the left edge to the right edge, and a lower one
// curling down to the bottom. Lines near the middle of each bundle are
// darker, so each bundle reads as a soft ribbon.
const WAVE_LINES = [
  ...Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    const y0 = 60 + t * 120;
    const y3 = 210 + t * 120;
    return {
      d: `M-10 ${y0} C ${140 - t * 40} ${y0 - 70 + t * 30}, ${60 + t * 50} ${y3 + 60 - t * 40}, ${WAVE_W + 10} ${y3}`,
      width: i % 5 === 0 ? 0.8 : 0.5,
      opacity: 0.16 + 0.36 * Math.sin(Math.PI * t),
    };
  }),
  ...Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    const y0 = 200 + t * 150;
    const x3 = 40 + t * 200;
    return {
      d: `M-10 ${y0} C ${90 - t * 30} ${y0 - 40}, ${x3 - 80} ${WAVE_H - 90 + t * 30}, ${x3} ${WAVE_H + 10}`,
      width: 0.5,
      opacity: 0.13 + 0.3 * Math.sin(Math.PI * t),
    };
  }),
];

/**
 * Flowing silk-like lines over a soft peach glow, for the bottom of the
 * sidebar.
 */
export function SilkWaves({ className = '' }) {
  return (
    <svg
      viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
      preserveAspectRatio="xMinYMax slice"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="silk-glow" cx="0" cy="1" r="1">
          <stop offset="0" stopColor="#f9c9c7" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#fbdcda" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fdeceb" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={WAVE_W} height={WAVE_H} fill="url(#silk-glow)" />
      <g fill="none" stroke="#e5524f" strokeLinecap="round">
        {WAVE_LINES.map((line) => (
          <path key={line.d} d={line.d} strokeWidth={line.width} opacity={line.opacity} />
        ))}
      </g>
    </svg>
  );
}
