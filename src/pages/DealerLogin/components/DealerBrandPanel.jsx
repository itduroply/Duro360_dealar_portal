import { LayersIcon, ShieldCheckIcon, HandshakeIcon, GrowthIcon } from './icons.jsx';

// The brand feature row shown on the left panel: four badged icons
// (layers / shield / handshake / growth).
const BRAND_FEATURES = [
  { Icon: LayersIcon, label: 'Premium Quality' },
  { Icon: ShieldCheckIcon, label: 'Trusted Partnership' },
  { Icon: HandshakeIcon, label: 'Stronger Together' },
  { Icon: GrowthIcon, label: 'Growing Together' },
];

/**
 * Left column of the Dealer login page, same as the original shared Login
 * page: brand statement and the four feature badges, shown over the dark
 * wood-grain part of the page photo (see DealerLogin.jsx). The DUROPLY logo
 * sits on the white sign-in card instead, where the red logo reads clearly.
 */
export default function DealerBrandPanel() {
  return (
    <div className="flex w-full flex-col justify-center text-white md:w-[55%]">
      <div className="mb-5 h-px w-16 bg-gradient-to-r from-brand-400 to-transparent" aria-hidden="true" />
      <h2 className="text-xl font-bold uppercase leading-snug tracking-wide sm:text-2xl md:text-4xl">
        <span className="block text-white">Strong by nature.</span>
        <span className="block text-brand-500">Trusted by professionals.</span>
      </h2>
      <p className="mt-2 max-w-sm text-sm text-white/85 md:mt-3 md:text-base">
        Empowering our partners with strength, quality &amp; commitment.
      </p>

      {/* Hidden below the desktop breakpoint so the stacked mobile layout
          reaches the sign-in form without much scrolling. */}
      <div className="hidden gap-x-6 gap-y-5 md:mt-10 md:grid md:grid-cols-4">
        {BRAND_FEATURES.map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-start gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-400/40 bg-gray-950/40 text-teal-500 backdrop-blur-sm">
              <Icon />
            </div>
            <span className="text-[10.5px] font-semibold uppercase tracking-wide text-white/90">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
