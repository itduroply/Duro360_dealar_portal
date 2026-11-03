import { useState } from 'react';
import ChartTooltip from './ChartTooltip.jsx';
import { AXIS_TEXT, GRID_COLOR, LABEL_TEXT, formatTick, niceTicks, roundedTopBar, useElementWidth } from './chartTheme.js';

const PAD = { top: 20, right: 8, bottom: 28, left: 44 };

// `animate` grows the columns up from the axis on first render, one month
// after another (used on the Dealer dashboard).
export default function ColumnChart({ labels, series, format = formatTick, height = 260, animate = false }) {
  const [ref, width] = useElementWidth();
  const [hover, setHover] = useState(null);

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.values)));
  const max = ticks[ticks.length - 1];
  const band = labels.length ? plotW / labels.length : 0;
  const barW = Math.max(4, Math.min(24, (band * 0.6 - (series.length - 1) * 2) / series.length));
  const groupW = barW * series.length + (series.length - 1) * 2;
  const y = (v) => PAD.top + plotH - (v / max) * plotH;
  const showCapLabels = series.length === 1 && band >= 34;

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Column chart">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={GRID_COLOR} strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={AXIS_TEXT}>
                {formatTick(t)}
              </text>
            </g>
          ))}
          {labels.map((label, i) => {
            const gx = PAD.left + band * i + (band - groupW) / 2;
            const isHover = hover === i;
            return (
              <g key={label}>
                {series.map((s, si) => {
                  const v = s.values[i];
                  const top = y(v);
                  return (
                    <path
                      key={s.name}
                      d={roundedTopBar(gx + si * (barW + 2), top, barW, PAD.top + plotH - top)}
                      fill={s.color}
                      opacity={hover === null || isHover ? 1 : 0.55}
                      className={animate ? 'animate-grow-y transition-opacity' : undefined}
                      style={animate ? { transformBox: 'fill-box', transformOrigin: 'bottom', animationDelay: `${i * 70 + si * 35}ms` } : undefined}
                    />
                  );
                })}
                {showCapLabels && (
                  <text x={gx + barW / 2} y={y(series[0].values[i]) - 6} textAnchor="middle" fontSize="11" fill={LABEL_TEXT}>
                    {formatTick(series[0].values[i])}
                  </text>
                )}
                <text x={PAD.left + band * i + band / 2} y={height - 8} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>
                  {label}
                </text>
                {/* Hit target: the whole band, bigger than the columns. */}
                <rect
                  x={PAD.left + band * i}
                  y={PAD.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                />
              </g>
            );
          })}
          <line x1={PAD.left} x2={width - PAD.right} y1={PAD.top + plotH} y2={PAD.top + plotH} stroke="#e4e7ec" />
        </svg>
      )}
      {hover !== null && (
        <ChartTooltip
          x={PAD.left + band * hover + band / 2}
          y={PAD.top}
          containerWidth={width}
          title={labels[hover]}
          rows={series.map((s) => ({ name: s.name, color: s.color, value: format(s.values[hover]) }))}
        />
      )}
    </div>
  );
}
