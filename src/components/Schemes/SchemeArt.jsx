import { useId, useLayoutEffect, useRef, useState } from 'react';
import './schemeArt.css';

// Copied from employee-frontend/src/pages/Schemes/SchemeArt.jsx so a scheme
// looks the same on the Console and on the Dealer Portal. Keep the two in
// step. The Dealer copy adds SchemeBackdrop (below) for larger banners.
//
// Decorative scene on top of each scheme card. The scene is picked from the
// scheme name first (Monsoon gets a rain storm, Diwali gets diyas, ...) and
// falls back to the scheme type. Purely visual: aria-hidden, and every
// animation stops for reduced motion (schemeArt.css).

const NAME_THEMES = [
  { theme: 'rain', match: /monsoon|rain|barish|baarish|barsat|varsha|sawan|saawan/i },
  { theme: 'holi', match: /holi|rang|colou?r/i },
  { theme: 'winter', match: /winter|sardi|thand|christmas|xmas|new\s*year/i },
  { theme: 'summer', match: /summer|garmi|sun|heat/i },
  { theme: 'diwali', match: /diwali|deepawali|deepavali|dhanteras/i },
  { theme: 'festive', match: /navratri|durga|puja|pooja|festiv|utsav|dussehra|eid|onam|pongal/i },
];

const TYPE_THEMES = {
  Festive: 'festive',
  Target: 'target',
  Volume: 'volume',
  Payment: 'payment',
  Loyalty: 'loyalty',
  Onboarding: 'onboarding',
};

export function schemeTheme({ name = '', type = '' }) {
  return NAME_THEMES.find((t) => t.match.test(name))?.theme || TYPE_THEMES[type] || 'volume';
}

// Fixed pseudo-random numbers in [0, 1), so particles do not jump on re-render.
function rand(i, n, seed = 0) {
  const x = Math.sin((i + 1) * 12.9898 + (seed + 1) * 78.233 + n * 37.719) * 43758.5453;
  return x - Math.floor(x);
}
const range = (count) => Array.from({ length: count }, (_, i) => i);

/* ---------------------------------------------------------------- rain */

function Cloud({ x, y, scale, fill, className, style }) {
  return (
    // The drift animation sits on the outer group so it does not replace the
    // position set by the inner group's transform attribute.
    <g className={className} style={style}>
      <g fill={fill} transform={`translate(${x} ${y}) scale(${scale})`}>
        <ellipse cx="60" cy="38" rx="60" ry="18" />
        <circle cx="35" cy="28" r="22" />
        <circle cx="68" cy="18" r="28" />
        <circle cx="98" cy="30" r="20" />
      </g>
    </g>
  );
}

function RainScene({ id, seed }) {
  const drops = range(90).map((i) => {
    const depth = rand(i, 1, seed); // 0 far … 1 near
    return {
      left: rand(i, 2, seed) * 115,
      len: 10 + depth * 18,
      opacity: 0.25 + depth * 0.55,
      width: depth > 0.7 ? 1.5 : 1,
      dur: 0.75 - depth * 0.35,
      delay: rand(i, 3, seed) * 1.2,
    };
  });
  const splashes = range(10).map((i) => ({ left: 4 + rand(i, 4, seed) * 92, delay: rand(i, 5, seed) * 1.6, w: 8 + rand(i, 6, seed) * 10 }));

  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#26374f 0%,#3d5677 45%,#6b87a8 100%)' }} />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 104" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${id}-cf`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9d4e2" />
            <stop offset="1" stopColor="#56677f" />
          </linearGradient>
          <linearGradient id={`${id}-cb`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8796ab" />
            <stop offset="1" stopColor="#334257" />
          </linearGradient>
          <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        <g filter={`url(#${id}-soft)`}>
          <Cloud x={-30} y={-26} scale={1.5} fill={`url(#${id}-cb)`} className="sa-drift" style={{ animationDuration: '18s' }} />
          <Cloud x={190} y={-30} scale={1.7} fill={`url(#${id}-cb)`} className="sa-drift" style={{ animationDuration: '22s', animationDelay: '-6s' }} />
          <Cloud x={80} y={-22} scale={1.3} fill={`url(#${id}-cf)`} className="sa-drift" style={{ animationDuration: '14s', animationDelay: '-3s' }} />
          <Cloud x={290} y={-18} scale={1.1} fill={`url(#${id}-cf)`} className="sa-drift" style={{ animationDuration: '16s', animationDelay: '-9s' }} />
        </g>
        <path className="sa-bolt" d="M262 20 l-10 22 h9 l-8 20 l20 -28 h-10 l8 -14 Z" fill="#fef9c3" />
      </svg>
      {drops.map((d, i) => (
        <span
          key={i}
          className="sa-rain absolute -top-8 rounded-full"
          style={{
            left: `${d.left}%`,
            width: d.width,
            height: d.len,
            opacity: d.opacity,
            background: 'linear-gradient(to bottom, rgba(220,235,255,0), rgba(220,235,255,0.95))',
            animationDuration: `${d.dur}s`,
            animationDelay: `-${d.delay}s`,
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-5" style={{ background: 'linear-gradient(to top, rgba(210,225,245,0.35), rgba(210,225,245,0))' }} />
      {splashes.map((s, i) => (
        <span
          key={i}
          className="sa-splash absolute bottom-1 rounded-[50%] border border-white/70"
          style={{ left: `${s.left}%`, width: s.w, height: s.w * 0.3, animationDelay: `-${s.delay}s` }}
        />
      ))}
      <div className="sa-flash absolute inset-0 bg-white" />
    </>
  );
}

/* ------------------------------------------------------------- festive */

const BULB_COLORS = ['#fde047', '#fb7185', '#fdba74', '#86efac', '#93c5fd', '#fde047'];

function Diya({ id, x, size, delay }) {
  return (
    <svg className="absolute bottom-0" style={{ left: `${x}%`, width: size, height: size * 0.9 }} viewBox="0 0 40 36">
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#f59e0b" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-flame`} cx="0.5" cy="0.75" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#fef08a" />
          <stop offset="0.75" stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </radialGradient>
        <linearGradient id={`${id}-clay`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d97706" />
          <stop offset="1" stopColor="#7c2d12" />
        </linearGradient>
      </defs>
      <circle className="sa-glow" cx="20" cy="13" r="15" fill={`url(#${id}-glow)`} style={{ animationDelay: `${delay}s` }} />
      <path
        className="sa-flame"
        d="M20 3 C23.5 8.5 24.5 12 20 18 C15.5 12 16.5 8.5 20 3 Z"
        fill={`url(#${id}-flame)`}
        style={{ animationDelay: `${delay}s` }}
      />
      <path d="M2 21 H38 Q35 33 20 33 Q5 33 2 21 Z" fill={`url(#${id}-clay)`} />
      <ellipse cx="20" cy="21" rx="18" ry="2.6" fill="#f59e0b" />
      <path d="M8 26 Q20 30 32 26" stroke="#fbbf24" strokeWidth="0.8" fill="none" opacity="0.6" />
    </svg>
  );
}

// Gift box with ribbon and bow, for festivals in general.
function GiftBox({ id, x, size, body, ribbon, delay }) {
  return (
    <svg className="sa-float absolute bottom-1" style={{ left: `${x}%`, width: size, height: size, animationDelay: `${delay}s` }} viewBox="0 0 40 40">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={body} />
          <stop offset="0.7" stopColor={body} />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="39" rx="16" ry="1.5" fill="#000" opacity="0.25" />
      <rect x="5" y="18" width="30" height="20" rx="1.5" fill={`url(#${id}-body)`} />
      <rect x="5" y="18" width="30" height="20" rx="1.5" fill="#000" opacity="0.12" />
      <rect x="3" y="13" width="34" height="7" rx="1.5" fill={body} />
      <rect x="17.5" y="13" width="5" height="25" fill={ribbon} />
      <path d="M20 13 C14 4 7 7 10 11 C12 13.5 17 13 20 13 Z M20 13 C26 4 33 7 30 11 C28 13.5 23 13 20 13 Z" fill={ribbon} />
      <circle cx="20" cy="12.5" r="2.2" fill={ribbon} stroke="#000" strokeOpacity="0.15" strokeWidth="0.5" />
      <rect x="6" y="14" width="10" height="1.4" rx="0.7" fill="#fff" opacity="0.35" />
    </svg>
  );
}

const CONFETTI_COLORS = ['#fde047', '#fb7185', '#60a5fa', '#4ade80', '#f97316', '#c084fc'];

function FestiveScene({ id, seed, diwali = false }) {
  // Two hanging strings of lights: bulbs placed along a sagging curve.
  const strings = [
    { y0: -4, sag: 30, count: 14 },
    { y0: 6, sag: 22, count: 11 },
  ];
  const bokeh = range(14).map((i) => ({
    left: rand(i, 1, seed) * 100,
    top: 20 + rand(i, 2, seed) * 70,
    size: 10 + rand(i, 3, seed) * 26,
    color: ['#fbbf24', '#fb7185', '#f97316', '#fde68a'][i % 4],
    delay: rand(i, 4, seed) * 4,
  }));

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 80% 110%, rgba(251,146,60,0.75) 0%, rgba(194,65,12,0.25) 40%, rgba(0,0,0,0) 70%), linear-gradient(180deg,#2a0a14 0%,#5c1424 55%,#8a2a1a 100%)',
        }}
      />
      {bokeh.map((b, i) => (
        <span
          key={i}
          className="sa-bokeh absolute rounded-full"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color}aa 0%, ${b.color}33 60%, transparent 72%)`,
            filter: 'blur(1.5px)',
            animationDelay: `-${b.delay}s`,
          }}
        />
      ))}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {strings.map((s, k) => (
          <path
            key={k}
            d={`M0 ${s.y0} Q50 ${s.y0 + s.sag * 2} 100 ${s.y0}`}
            stroke="#3b1a10"
            strokeWidth="1.2"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {strings.map((s, k) =>
        range(s.count).map((i) => {
          const t = (i + 0.5 + k * 0.3) / s.count;
          const top = s.y0 + 2 * (1 - t) * t * s.sag * 2;
          const color = BULB_COLORS[(i + k * 2) % BULB_COLORS.length];
          return (
            <span
              key={`${k}-${i}`}
              className="sa-bulb absolute h-[7px] w-[5px] -translate-x-1/2 rounded-b-full rounded-t-sm"
              style={{
                left: `${t * 100}%`,
                top: `calc(${top}% + 1px)`,
                background: color,
                boxShadow: `0 0 6px 2px ${color}cc, 0 0 14px 4px ${color}55`,
                animationDelay: `${((i * 0.37 + k * 0.5) % 1.6).toFixed(2)}s`,
              }}
            />
          );
        })
      )}
      {diwali ? (
        <>
          <Diya id={`${id}-d1`} x={62} size={34} delay={0} />
          <Diya id={`${id}-d2`} x={73} size={44} delay={0.3} />
          <Diya id={`${id}-d3`} x={86} size={34} delay={0.6} />
        </>
      ) : (
        <>
          {range(18).map((i) => (
            <span
              key={i}
              className="sa-confetti absolute -top-3 rounded-[1px]"
              style={{
                left: `${rand(i, 7, seed) * 100}%`,
                width: 4 + rand(i, 8, seed) * 3,
                height: 7 + rand(i, 9, seed) * 4,
                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                animationDuration: `${2.6 + rand(i, 10, seed) * 2}s`,
                animationDelay: `-${rand(i, 11, seed) * 4}s`,
              }}
            />
          ))}
          <GiftBox id={`${id}-g1`} x={64} size={40} body="#2563eb" ribbon="#fde047" delay={0} />
          <GiftBox id={`${id}-g2`} x={74} size={54} body="#e11d48" ribbon="#fbbf24" delay={-1.3} />
          <GiftBox id={`${id}-g3`} x={86} size={38} body="#16a34a" ribbon="#fde68a" delay={-2.6} />
        </>
      )}
    </>
  );
}

/* --------------------------------------------------------------- winter */

function WinterScene({ seed }) {
  const flakes = range(55).map((i) => {
    const depth = rand(i, 1, seed);
    return {
      left: rand(i, 2, seed) * 100,
      size: 1.5 + depth * 4,
      blur: depth < 0.35 ? 1 : 0,
      opacity: 0.5 + depth * 0.5,
      dur: 7 - depth * 3.5,
      delay: rand(i, 3, seed) * 7,
    };
  });
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#0f2440 0%,#23466f 60%,#4a74a3 100%)' }} />
      <div className="absolute right-10 top-3 h-10 w-10 rounded-full bg-[#f8fafc]" style={{ boxShadow: '0 0 24px 8px rgba(226,232,240,0.45)' }} />
      <svg className="absolute inset-x-0 bottom-0 h-8 w-full" viewBox="0 0 400 32" preserveAspectRatio="none">
        <path d="M0 18 Q60 4 130 16 T260 14 T400 12 V32 H0 Z" fill="#dbe7f5" />
        <path d="M0 24 Q90 12 180 22 T400 20 V32 H0 Z" fill="#f8fafc" />
      </svg>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="sa-snow absolute -top-2 rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            filter: f.blur ? 'blur(1px)' : undefined,
            animationDuration: `${f.dur}s`,
            animationDelay: `-${f.delay}s`,
          }}
        />
      ))}
    </>
  );
}

/* --------------------------------------------------------------- summer */

function SummerScene({ id }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#fcd34d 0%,#fb923c 60%,#f97316 100%)' }} />
      <svg className="absolute -right-6 -top-10 h-44 w-44" viewBox="0 0 100 100">
        <defs>
          <radialGradient id={`${id}-sun`}>
            <stop offset="0" stopColor="#fffbeb" />
            <stop offset="0.5" stopColor="#fde047" />
            <stop offset="1" stopColor="#facc15" />
          </radialGradient>
          <radialGradient id={`${id}-halo`}>
            <stop offset="0.3" stopColor="#fef9c3" stopOpacity="0.8" />
            <stop offset="1" stopColor="#fef9c3" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="sa-spin">
          {range(16).map((i) => (
            <path key={i} d="M50 50 L48 2 L52 2 Z" fill="#fef3c7" opacity="0.55" transform={`rotate(${i * 22.5} 50 50)`} />
          ))}
        </g>
        <circle className="sa-glow" cx="50" cy="50" r="32" fill={`url(#${id}-halo)`} />
        <circle cx="50" cy="50" r="17" fill={`url(#${id}-sun)`} />
      </svg>
      <div className="sa-haze absolute inset-x-0 bottom-0 h-8" style={{ background: 'linear-gradient(to top, rgba(255,237,213,0.55), rgba(255,237,213,0))' }} />
    </>
  );
}

/* ----------------------------------------------------------------- holi */

function HoliScene({ seed }) {
  const colors = ['#ec4899', '#a855f7', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444'];
  const clouds = range(7).map((i) => ({ left: -10 + i * 16, top: 10 + rand(i, 1, seed) * 50, size: 60 + rand(i, 2, seed) * 50, color: colors[i % colors.length], delay: rand(i, 3, seed) * 3 }));
  const dust = range(30).map((i) => ({ left: rand(i, 4, seed) * 100, size: 2 + rand(i, 5, seed) * 4, color: colors[i % colors.length], delay: rand(i, 6, seed) * 4 }));
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#fff7ed 0%,#fdf2f8 100%)' }} />
      {clouds.map((c, i) => (
        <span
          key={i}
          className="sa-burst absolute rounded-full mix-blend-multiply"
          style={{ left: `${c.left}%`, top: `${c.top}%`, width: c.size, height: c.size, background: c.color, filter: 'blur(12px)', animationDelay: `-${c.delay}s` }}
        />
      ))}
      {dust.map((d, i) => (
        <span
          key={i}
          className="sa-rise absolute -bottom-2 rounded-full"
          style={{ left: `${d.left}%`, width: d.size, height: d.size, background: d.color, animationDelay: `-${d.delay}s` }}
        />
      ))}
    </>
  );
}

/* --------------------------------------------------------------- target */

function TargetScene() {
  const rings = ['#f8fafc', '#dc2626', '#f8fafc', '#dc2626', '#facc15'];
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#3f0d12 0%,#7f1d1d 60%,#b91c1c 100%)' }} />
      <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(90deg, transparent 0 18px, rgba(255,255,255,0.15) 18px 19px)' }} />
      <svg className="absolute right-6 top-1/2 h-[88px] w-[88px] -translate-y-1/2 drop-shadow-lg" viewBox="0 0 100 100">
        {rings.map((c, i) => (
          <circle key={i} cx="50" cy="50" r={46 - i * 9.5} fill={c} stroke="#1f2937" strokeWidth="0.6" />
        ))}
        <circle className="sa-hit" cx="50" cy="50" r="10" fill="none" stroke="#fde047" strokeWidth="2" />
      </svg>
      <svg className="sa-arrow absolute top-1/2 h-4 w-[130px] -translate-y-1/2" style={{ right: 'calc(1.5rem + 44px)' }} viewBox="0 0 130 16">
        <path d="M0 3 L14 8 L0 13 L5 8 Z M6 1 L18 8 L6 15 Z" fill="#fef3c7" opacity="0.9" />
        <rect x="10" y="7" width="112" height="2" fill="#e5e7eb" />
        <path d="M120 3 L130 8 L120 13 Z" fill="#9ca3af" />
      </svg>
    </>
  );
}

/* --------------------------------------------------------------- volume */

// Plywood sheets dropping onto a stack: a nod to what dealers buy.
function VolumeScene() {
  const sheets = range(6);
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#f5ebdd 0%,#e7d3b8 55%,#cfae84 100%)' }} />
      <div className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(100deg, transparent 0 7px, rgba(120,72,32,0.12) 7px 8px, transparent 8px 19px)' }} />
      <svg className="absolute bottom-2 right-6 h-[84px] w-40" viewBox="0 0 160 84">
        <ellipse cx="80" cy="80" rx="72" ry="3" fill="#7c4a24" opacity="0.25" />
        {sheets.map((i) => (
          <g key={i} className="sa-stack" style={{ animationDelay: `${0.15 + i * 0.22}s` }}>
            <g transform={`translate(${8 + (i % 2) * 3} ${66 - i * 11})`}>
              <path d="M10 0 H150 L140 8 H0 Z" fill="#e9c995" />
              <rect x="0" y="8" width="140" height="5" fill="#a86b3c" />
              <path d="M0 9.6 H140 M0 11.4 H140" stroke="#f3dcb6" strokeWidth="0.5" />
              <path d="M140 8 L150 0 V5 L140 13 Z" fill="#8a5530" />
            </g>
          </g>
        ))}
      </svg>
      <svg className="sa-float absolute left-[46%] top-3 h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="#713a1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17 L10 11 L14 15 L20 8" />
        <path d="M15 8 H20 V13" />
      </svg>
    </>
  );
}

/* -------------------------------------------------------------- payment */

function PaymentScene({ id, seed }) {
  const coins = range(9).map((i) => ({ left: 8 + rand(i, 1, seed) * 55, size: 12 + rand(i, 2, seed) * 8, delay: rand(i, 3, seed) * 2.6, dur: 2 + rand(i, 4, seed) }));
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#022c22 0%,#065f46 55%,#059669 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 80% at 80% 100%, rgba(253,230,138,0.35), transparent 70%)' }} />
      {coins.map((c, i) => (
        <span
          key={i}
          className="sa-coin absolute -top-6 rounded-full"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            background: 'radial-gradient(circle at 35% 30%, #fffbeb 0%, #fcd34d 30%, #d97706 80%, #92400e 100%)',
            boxShadow: 'inset 0 0 0 1.5px #b45309, 0 1px 3px rgba(0,0,0,0.35)',
            animationDuration: `${c.dur}s`,
            animationDelay: `-${c.delay}s`,
          }}
        />
      ))}
      <svg className="absolute bottom-0 right-6 h-[88px] w-28" viewBox="0 0 112 88">
        <defs>
          <linearGradient id={`${id}-edge`} x1="0" x2="1">
            <stop offset="0" stopColor="#92400e" />
            <stop offset="0.3" stopColor="#f59e0b" />
            <stop offset="0.6" stopColor="#fde68a" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
        </defs>
        {[
          { x: 6, n: 5 },
          { x: 44, n: 8 },
          { x: 78, n: 3 },
        ].map((col) =>
          range(col.n).map((i) => (
            <g key={`${col.x}-${i}`} transform={`translate(${col.x} ${80 - i * 8})`}>
              <rect x="0" y="0" width="30" height="7" rx="1" fill={`url(#${id}-edge)`} />
              <ellipse cx="15" cy="0" rx="15" ry="3.2" fill="#fcd34d" stroke="#b45309" strokeWidth="0.6" />
            </g>
          ))
        )}
        <path className="sa-twinkle" style={{ transformOrigin: '60px 14px' }} d="M60 6 L62 12 L68 14 L62 16 L60 22 L58 16 L52 14 L58 12 Z" fill="#fffbeb" />
      </svg>
    </>
  );
}

/* -------------------------------------------------------------- loyalty */

function LoyaltyScene({ id, seed }) {
  const stars = range(40).map((i) => ({ left: rand(i, 1, seed) * 100, top: rand(i, 2, seed) * 100, size: 1 + rand(i, 3, seed) * 2.2, delay: rand(i, 4, seed) * 3 }));
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#1e1048 0%,#3b1d7a 55%,#6d28d9 100%)' }} />
      {stars.map((s, i) => (
        <span
          key={i}
          className="sa-twinkle absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, boxShadow: '0 0 4px rgba(255,255,255,0.8)', animationDelay: `-${s.delay}s` }}
        />
      ))}
      <span className="sa-shoot absolute right-[30%] top-2 h-[1.5px] w-16 rotate-[-25deg] rounded-full" style={{ background: 'linear-gradient(to right, #fff, rgba(255,255,255,0))' }} />
      <svg className="sa-float absolute right-6 top-1/2 h-20 w-20 -translate-y-1/2" viewBox="0 0 48 48">
        <defs>
          <radialGradient id={`${id}-gold`} cx="0.4" cy="0.35">
            <stop offset="0" stopColor="#fffbeb" />
            <stop offset="0.5" stopColor="#fcd34d" />
            <stop offset="1" stopColor="#d97706" />
          </radialGradient>
        </defs>
        <circle className="sa-glow" cx="24" cy="24" r="22" fill="#fcd34d" opacity="0.25" />
        <path d="M24 6 l5.3 11 12.1 1.7 -8.7 8.5 2 12 -10.7 -5.7 -10.7 5.7 2 -12 -8.7 -8.5 12.1 -1.7 Z" fill={`url(#${id}-gold)`} stroke="#b45309" strokeWidth="0.8" />
      </svg>
    </>
  );
}

/* ----------------------------------------------------------- onboarding */

function OnboardingScene({ seed }) {
  const motes = range(14).map((i) => ({ left: rand(i, 1, seed) * 100, size: 3 + rand(i, 2, seed) * 4, delay: rand(i, 3, seed) * 4 }));
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#fff7d6 0%,#fde9b0 45%,#cdeccf 100%)' }} />
      <div className="absolute -top-8 left-1/3 h-24 w-24 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,251,235,0.95), rgba(253,230,138,0) 70%)' }} />
      <svg className="absolute inset-x-0 bottom-0 h-12 w-full" viewBox="0 0 400 48" preserveAspectRatio="none">
        <path d="M0 28 Q100 10 210 26 T400 20 V48 H0 Z" fill="#86c99a" />
        <path d="M0 38 Q120 24 240 36 T400 32 V48 H0 Z" fill="#4f9d69" />
      </svg>
      <svg className="sa-grow absolute bottom-3 right-10 h-16 w-14" viewBox="0 0 28 32">
        <path d="M14 32 V14" stroke="#2f6b3e" strokeWidth="1.8" strokeLinecap="round" />
        <path className="sa-leaf" d="M14 16 C14 9 18 5 26 5 C26 12 21 16 14 16 Z" fill="#4ade80" stroke="#2f6b3e" strokeWidth="0.8" />
        <path className="sa-leaf" style={{ animationDelay: '-1.2s' }} d="M14 19 C14 13 10.5 9.5 3 9.5 C3 16 7 19 14 19 Z" fill="#86efac" stroke="#2f6b3e" strokeWidth="0.8" />
      </svg>
      {motes.map((m, i) => (
        <span
          key={i}
          className="sa-rise absolute -bottom-2 rounded-full bg-white/80"
          style={{ left: `${m.left}%`, width: m.size, height: m.size, boxShadow: '0 0 6px rgba(255,255,255,0.9)', animationDelay: `-${m.delay}s` }}
        />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- shell */

const SCENES = {
  rain: { label: 'Monsoon', Scene: RainScene, dark: true },
  festive: { label: 'Festive', Scene: FestiveScene, dark: true },
  diwali: { label: 'Diwali', Scene: (props) => <FestiveScene {...props} diwali />, dark: true },
  winter: { label: 'Winter', Scene: WinterScene, dark: true },
  summer: { label: 'Summer', Scene: SummerScene },
  holi: { label: 'Holi', Scene: HoliScene },
  target: { label: 'Target', Scene: TargetScene, dark: true },
  volume: { label: 'Volume', Scene: VolumeScene },
  payment: { label: 'Payment', Scene: PaymentScene, dark: true },
  loyalty: { label: 'Loyalty', Scene: LoyaltyScene, dark: true },
  onboarding: { label: 'Welcome', Scene: OnboardingScene },
};

// The scenes are drawn for a 104px-tall strip.
const SCENE_HEIGHT = 104;

export function schemeSceneLabel(scheme) {
  return SCENES[schemeTheme(scheme)].label;
}

export default function SchemeArt({ scheme, seed = 0 }) {
  const id = `sa${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { label, Scene, dark } = SCENES[schemeTheme(scheme)];

  return (
    <div className="sa-scene relative -mx-4 -mt-4 h-[104px] overflow-hidden rounded-t-xl" aria-hidden="true">
      <Scene id={id} seed={seed} />
      <span
        className={`absolute bottom-2.5 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${
          dark ? 'bg-white/15 text-white ring-1 ring-white/25' : 'bg-white/70 text-gray-800 ring-1 ring-black/5'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * The same scene, scaled up to fill its parent (dashboard banner, small
 * thumbnails). The parent must be `relative`. The scene keeps its card
 * proportions, only bigger: it is scaled to the parent's measured height.
 */
export function SchemeBackdrop({ scheme, seed = 0, still = false }) {
  const id = `sb${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { Scene } = SCENES[schemeTheme(scheme)];
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    setHeight(ref.current.getBoundingClientRect().height);
    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const scale = height / SCENE_HEIGHT;
  return (
    <div ref={ref} className={`sa-scene pointer-events-none absolute inset-0 overflow-hidden${still ? ' sa-still' : ''}`} aria-hidden="true">
      {height > 0 && (
        <div
          className="relative origin-top-left"
          style={{ width: `${100 / scale}%`, height: SCENE_HEIGHT, transform: `scale(${scale})` }}
        >
          <Scene id={id} seed={seed} />
        </div>
      )}
    </div>
  );
}
