import { useState } from 'react';
import ChartTooltip from './ChartTooltip.jsx';
import { AXIS_TEXT, GRID_COLOR, LABEL_TEXT, SURFACE, formatTick, niceTicks, useElementWidth } from './chartTheme.js';

const PAD = { top: 20, right: 56, bottom: 28, left: 44 };

export default function LineChart({ labels, series, format = formatTick, height = 260 }) {
  const [ref, width] = useElementWidth();
  const [hover, setHover] = useState(null);

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.values)));
  const max = ticks[ticks.length - 1];
  const step = labels.length > 1 ? plotW / (labels.length - 1) : 0;
  const x = (i) => PAD.left + step * i;
  const y = (v) => PAD.top + plotH - (v / max) * plotH;
  const last = labels.length - 1;
  const labelEvery = Math.ceil(labels.length / Math.max(1, Math.floor(plotW / 56)));

  // End labels, dropped when they would collide.
  const endLabels = [];
  series.forEach((s) => {
    const ly = y(s.values[last]);
    if (endLabels.every((l) => Math.abs(l.y - ly) > 14)) endLabels.push({ y: ly, text: formatTick(s.values[last]) });
  });

  function handleMove(e) {
    const box = e.currentTarget.getBoundingClientRect();
    const i = Math.round((e.clientX - box.left - PAD.left) / (step || 1));
    setHover(Math.max(0, Math.min(last, i)));
  }

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Line chart"
          onPointerMove={handleMove}
          onPointerLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={GRID_COLOR} strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={AXIS_TEXT}>
                {formatTick(t)}
              </text>
            </g>
          ))}
          {labels.map((label, i) =>
            // Every Nth label, plus the last one unless it would sit on top of the one before.
            i % labelEvery === 0 || (i === last && last % labelEvery >= labelEvery / 2) ? (
              <text key={label} x={x(i)} y={height - 8} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>
                {label}
              </text>
            ) : null
          )}

          {series.length === 1 && (
            <path
              d={`M${x(0)},${y(0)} ${series[0].values.map((v, i) => `L${x(i)},${y(v)}`).join(' ')} L${x(last)},${y(0)} Z`}
              fill={series[0].color}
              opacity="0.1"
            />
          )}
          {series.map((s) => (
            <polyline
              key={s.name}
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}

          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} stroke="#d0d5dd" strokeWidth="1" />
          )}
          {series.map((s) => {
            const i = hover ?? last;
            return <circle key={s.name} cx={x(i)} cy={y(s.values[i])} r="4" fill={s.color} stroke={SURFACE} strokeWidth="2" />;
          })}
          {hover === null &&
            endLabels.map((l) => (
              <text key={l.y} x={x(last) + 10} y={l.y} dy="0.32em" fontSize="11" fontWeight="600" fill={LABEL_TEXT}>
                {l.text}
              </text>
            ))}
        </svg>
      )}
      {hover !== null && (
        <ChartTooltip
          x={x(hover)}
          y={PAD.top}
          containerWidth={width}
          title={labels[hover]}
          rows={series.map((s) => ({ name: s.name, color: s.color, value: format(s.values[hover]) }))}
        />
      )}
    </div>
  );
}
