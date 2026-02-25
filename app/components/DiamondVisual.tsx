export default function DiamondVisual() {
  return (
    <div className="diamond-entrance relative flex items-center justify-center">
      {/* ── Ambient Glow ── */}
      <div className="animate-pulse-glow absolute h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(200,169,110,0.12)_0%,_transparent_70%)]" />

      {/* ── Prismatic Ring ── */}
      <div className="animate-rotate-slow absolute h-[340px] w-[340px] rounded-full opacity-40 bg-[conic-gradient(from_0deg,_rgba(255,180,180,0.08),_rgba(180,220,255,0.08),_rgba(200,255,200,0.08),_rgba(220,180,255,0.08),_rgba(255,220,180,0.08),_rgba(255,180,180,0.08))] blur-[50px]" />

      {/* ── Diamond SVG ── */}
      <svg
        viewBox="0 0 300 420"
        className="relative z-10 h-[320px] w-[240px] drop-shadow-[0_0_60px_rgba(200,169,110,0.15)] sm:h-[400px] sm:w-[300px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Facet gradients */}
          <linearGradient id="facet-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
          </linearGradient>
          <linearGradient id="facet-left" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(180,210,255,0.12)" />
            <stop offset="100%" stopColor="rgba(200,220,255,0.04)" />
          </linearGradient>
          <linearGradient id="facet-right" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,200,220,0.14)" />
            <stop offset="100%" stopColor="rgba(255,220,240,0.05)" />
          </linearGradient>
          <linearGradient id="pav-left" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(200,220,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
          </linearGradient>
          <linearGradient id="pav-right" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(255,230,210,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
          <linearGradient id="pav-deep-l" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(220,230,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.005)" />
          </linearGradient>
          <linearGradient id="pav-deep-r" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(240,220,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.008)" />
          </linearGradient>
          <linearGradient id="crown-center" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
          </linearGradient>
        </defs>

        {/* ── Crown Facets ── */}
        {/* F1: Top triangle (table) */}
        <polygon
          points="150,10 80,80 220,80"
          fill="url(#facet-top)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />

        {/* F2: Center crown */}
        <polygon
          points="80,80 220,80 150,150"
          fill="url(#crown-center)"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="0.5"
        />

        {/* F3: Left upper crown */}
        <polygon
          points="150,10 80,80 10,150"
          fill="url(#facet-left)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />

        {/* F4: Right upper crown */}
        <polygon
          points="150,10 220,80 290,150"
          fill="url(#facet-right)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />

        {/* F5: Left lower crown */}
        <polygon
          points="80,80 10,150 150,150"
          fill="rgba(200,215,240,0.06)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />

        {/* F6: Right lower crown */}
        <polygon
          points="220,80 290,150 150,150"
          fill="rgba(240,215,220,0.08)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />

        {/* ── Girdle line ── */}
        <line
          x1="10" y1="150" x2="290" y2="150"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.8"
        />

        {/* ── Pavilion Facets ── */}
        {/* F7: Upper left pavilion */}
        <polygon
          points="10,150 85,275 150,150"
          fill="url(#pav-left)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />

        {/* F8: Upper right pavilion */}
        <polygon
          points="290,150 215,275 150,150"
          fill="url(#pav-right)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
        />

        {/* F9: Lower left pavilion */}
        <polygon
          points="85,275 150,405 150,150"
          fill="url(#pav-deep-l)"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.5"
        />

        {/* F10: Lower right pavilion */}
        <polygon
          points="215,275 150,405 150,150"
          fill="url(#pav-deep-r)"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.5"
        />

        {/* ── Internal Refraction Lines ── */}
        <line
          x1="60" y1="100" x2="240" y2="200"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.3"
        />
        <line
          x1="100" y1="180" x2="250" y2="120"
          stroke="rgba(200,220,255,0.04)"
          strokeWidth="0.3"
        />
        <line
          x1="80" y1="200" x2="200" y2="300"
          stroke="rgba(255,220,240,0.03)"
          strokeWidth="0.3"
        />

        {/* ── Sparkle Stars ── */}
        <g className="sparkle sparkle-1" transform="translate(120,35)">
          <path
            d="M5,0 L6,4 L10,5 L6,6 L5,10 L4,6 L0,5 L4,4 Z"
            fill="rgba(255,255,255,0.8)"
          />
        </g>
        <g className="sparkle sparkle-2" transform="translate(250,110)">
          <path
            d="M4,0 L5,3 L8,4 L5,5 L4,8 L3,5 L0,4 L3,3 Z"
            fill="rgba(255,255,255,0.6)"
          />
        </g>
        <g className="sparkle sparkle-3" transform="translate(40,160)">
          <path
            d="M3,0 L4,2.5 L6,3 L4,3.5 L3,6 L2,3.5 L0,3 L2,2.5 Z"
            fill="rgba(255,255,255,0.5)"
          />
        </g>
        <g className="sparkle sparkle-4" transform="translate(200,260)">
          <path
            d="M4,0 L5,3 L8,4 L5,5 L4,8 L3,5 L0,4 L3,3 Z"
            fill="rgba(255,255,255,0.4)"
          />
        </g>
        <g className="sparkle sparkle-5" transform="translate(170,70)">
          <path
            d="M3,0 L4,2.5 L6,3 L4,3.5 L3,6 L2,3.5 L0,3 L2,2.5 Z"
            fill="rgba(255,255,255,0.7)"
          />
        </g>
      </svg>

      {/* ── Reflection Below ── */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-[2px] w-48 bg-gradient-to-r from-transparent via-gold/20 to-transparent blur-[2px]" />
    </div>
  );
}
