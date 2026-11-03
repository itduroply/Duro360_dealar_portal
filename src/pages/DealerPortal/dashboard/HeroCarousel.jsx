import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SchemeBackdrop } from '../../../components/Schemes/SchemeArt.jsx';
import NewBadge from '../../../components/Motion/NewBadge.jsx';

const TONES = {
  brand: 'from-brand-600 via-brand-700 to-brand-900',
  dark: 'from-gray-800 via-gray-900 to-gray-950',
  amber: 'from-[#b8741a] via-[#9a5b12] to-[#6e3f0c]',
};

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d={dir === 'left' ? 'M12 5l-5 5 5 5' : 'M8 5l5 5-5 5'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Banner at the top of the Dealer dashboard.
 *
 *   <HeroCarousel slides={[{ id, tone, eyebrow, title, text, progress?, cta: { label, to } }]} />
 *
 * A slide with `scheme` (a scheme row from the Console) uses that scheme's
 * scene as its background, shown without motion. `isNew` adds the "New"
 * badge.
 *
 * Changes only when the user clicks the arrows or dots, or swipes on a
 * touch screen. No auto-slide and no motion.
 */
export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  const touchX = useRef(null);
  const count = slides.length;

  const go = useCallback((next) => setIndex((next + count) % count), [count]);

  if (count === 0) return null;

  return (
    <section
      className="group relative overflow-hidden rounded-3xl shadow-theme-md"
      aria-roledescription="carousel"
      aria-label="Updates"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="flex" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`relative w-full shrink-0 overflow-hidden px-6 py-7 text-white sm:px-9 sm:py-8 ${
              s.scheme ? 'bg-gray-900' : `bg-gradient-to-br ${TONES[s.tone] || TONES.brand}`
            }`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
          >
            {s.scheme ? (
              <>
                <SchemeBackdrop scheme={s.scheme} seed={i} still />
                {/* shade on the left so the text stays readable on every scene */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/0" aria-hidden="true" />
              </>
            ) : (
              <>
                {/* soft decorative rings */}
                <span className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[36px] border-white/[0.06]" aria-hidden="true" />
                <span className="pointer-events-none absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-white/[0.05]" aria-hidden="true" />
              </>
            )}

            <div className="relative max-w-xl">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                {s.eyebrow}
                {s.isNew && <NewBadge className="tracking-wide" />}
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-white/80">{s.text}</p>

              {s.progress && (
                <div className="mt-4 max-w-sm">
                  <div className="h-2 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${Math.min(100, s.progress.pct)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-white/75">{s.progress.label}</p>
                </div>
              )}

              {s.cta && (
                <Link
                  to={s.cta.to}
                  tabIndex={i === index ? 0 : -1}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm"
                >
                  {s.cta.label}
                  <Chevron dir="right" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <div className="absolute bottom-4 right-6 flex items-center gap-2 rounded-full bg-black/25 px-2.5 py-1.5 backdrop-blur-sm">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                className={`h-1.5 rounded-full ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'}`}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
          <div className="absolute right-6 top-5 hidden gap-2 sm:flex">
            {['left', 'right'].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(index + (dir === 'left' ? -1 : 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity hover:bg-white/25 focus:opacity-100 group-hover:opacity-100"
                aria-label={dir === 'left' ? 'Previous slide' : 'Next slide'}
              >
                <Chevron dir={dir} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
