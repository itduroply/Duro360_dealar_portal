// True when the viewer asked the OS for reduced motion. Read on each call,
// so a change in the OS setting applies on the next render.
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}
