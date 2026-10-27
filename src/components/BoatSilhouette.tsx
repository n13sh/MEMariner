import React from 'react';

interface BoatSilhouetteProps {
  scale?: number; // 0..1 relative length
  className?: string;
}

/**
 * Side-profile centre-console silhouette with T-top and twin outboards.
 * Rendered in currentColor; scale the width to compare hull lengths.
 */
export const BoatSilhouette: React.FC<BoatSilhouetteProps> = ({ scale = 1, className = '' }) => {
  return (
    <div className={`flex items-end justify-center ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 400 170"
        style={{ width: `${scale * 100}%` }}
        className="h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outboards */}
        <g fill="currentColor" opacity="0.85">
          <rect x="10" y="60" width="26" height="40" rx="7" />
          <path d="M16 100 H30 V122 Q30 128 24 128 H22 Q16 128 16 122 Z" />
          <path d="M20 128 L28 128 L32 140 L16 140 Z" opacity="0.8" />
        </g>
        <g fill="currentColor" opacity="0.55">
          <rect x="22" y="56" width="26" height="40" rx="7" />
          <path d="M28 96 H42 V118 Q42 124 36 124 H34 Q28 124 28 118 Z" />
        </g>

        {/* T-top */}
        <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9">
          <path d="M172 72 L168 30" />
          <path d="M214 68 L218 30" />
          <path d="M138 28 L246 28" strokeWidth="7" />
        </g>

        {/* Console with windscreen */}
        <path d="M160 96 L160 68 Q160 60 168 58 L214 50 Q224 49 226 58 L232 96 Z" fill="currentColor" opacity="0.75" />
        <path d="M176 62 L216 55 L220 70 L178 74 Z" fill="currentColor" opacity="0.35" />

        {/* Leaning post / seat */}
        <path d="M120 96 L120 80 Q120 76 124 76 L144 76 Q148 76 148 80 L148 96 Z" fill="currentColor" opacity="0.6" />

        {/* Hull */}
        <path
          d="M44 96 L392 76 L392 80 C384 112 346 136 300 138 L56 140 C48 140 44 134 44 128 Z"
          fill="currentColor"
        />
        {/* Sheer highlight and chine */}
        <path d="M46 100 L388 80" stroke="var(--bg, #092c58)" strokeOpacity="0.35" strokeWidth="2" />
        <path d="M60 124 L330 124" stroke="var(--bg, #092c58)" strokeOpacity="0.25" strokeWidth="2" />
        {/* Bow rail */}
        <path d="M300 74 Q340 70 382 62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <path d="M330 72 L330 64 M360 68 L360 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  );
};
