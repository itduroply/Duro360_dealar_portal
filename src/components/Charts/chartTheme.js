import { useLayoutEffect, useRef, useState } from 'react';

import { theme } from '../../theme/themes.js';

// ---------------------------------------------------------------------------
// Chart colours, from the active portal theme (src/theme/themes.js).
// Categorical slots are used in this fixed order, never cycled: slot 1 is
// the portal brand colour. The TailAdmin order (blue, orange, aqua, yellow)
// passed the palette check (colour-blind and normal-vision separation) on
// the white chart surface; the wood order has not been checked yet. Some
// slots are below 3:1 contrast on white, so every chart also has direct
// labels or a table view -- ChartCard always offers the table.
// ---------------------------------------------------------------------------
export const SERIES_COLORS = theme.charts.series;

// Ordered one-hue ramp (brand colour, light to dark) for ordered groups such
// as ageing buckets: older debt = darker. The name is kept from when the
// ramp was always blue.
export const ORDINAL_BLUE = theme.charts.ordinal;

export const GRID_COLOR = theme.charts.grid; // gray-100: one step off the white surface
export const AXIS_TEXT = theme.charts.axisText; // gray-500
export const LABEL_TEXT = theme.charts.labelText; // gray-700: value labels on bars and lines
export const SURFACE = '#ffffff';

// Rounds the axis maximum up to a clean number and returns evenly spaced ticks.
export function niceTicks(maxValue, count = 4) {
  if (!maxValue || maxValue <= 0) return [0, 1];
  const rough = maxValue / count;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough);
  const ticks = [];
  for (let v = 0; v <= maxValue + step * 0.001; v += step) ticks.push(Number(v.toFixed(6)));
  if (ticks[ticks.length - 1] < maxValue) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

export function formatTick(v) {
  return Number(v).toLocaleString('en-IN', { maximumFractionDigits: 1 });
}

// Width of a container element, kept up to date on resize.
export function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    setWidth(ref.current.getBoundingClientRect().width); // measure now, not only on resize
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

// Bar with a 4px rounded top and a square base, as an SVG path.
export function roundedTopBar(x, y, w, h, r = 4) {
  const radius = Math.min(r, w / 2, h);
  const bottom = y + h;
  return `M${x},${bottom} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${bottom} Z`;
}
