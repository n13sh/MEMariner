import React, { useId } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /** `light` renders the mark in white for dark backgrounds. */
  tone?: 'dark' | 'light';
}

/** "M [Anchor] E" emblem with the stacked wordmark. */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md', tone = 'dark' }) => {
  // Unique gradient ids per instance: shared ids resolve to the first (possibly hidden) copy and vanish
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gA = `memAnchor${uid}`;
  const gL = `memLetter${uid}`;
  const gR = `memRibbon${uid}`;
  const emblem = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
  const top = size === 'lg' ? 'text-[11px]' : 'text-[9px]';
  const main = size === 'lg' ? 'text-[26px]' : size === 'sm' ? 'text-[17px]' : 'text-[21px]';
  const light = tone === 'light';
  const fA = light ? '#ffffff' : `url(#${gA})`;
  const fL = light ? '#ffffff' : `url(#${gL})`;
  const fR = light ? 'rgba(255,255,255,0.7)' : `url(#${gR})`;
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg viewBox="0 0 120 112" className={`${emblem} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Middle East Mariner emblem">
        <defs>
          <linearGradient id={gA} x1="60" y1="6" x2="60" y2="104" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#299AD6" />
            <stop offset="45%" stopColor="#1B75BC" />
            <stop offset="100%" stopColor="#092C58" />
          </linearGradient>
          <linearGradient id={gL} x1="0" y1="22" x2="0" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#268BC8" />
            <stop offset="100%" stopColor="#0f4a86" />
          </linearGradient>
          <linearGradient id={gR} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        <path d="M22 95 L8 91 L14 98 L6 102 L26 101 Z" fill={fR} opacity="0.9" />
        <path d="M98 95 L112 91 L106 98 L114 102 L94 101 Z" fill={fR} opacity="0.9" />
        <path d="M10 72 V28 H21 L30 52 L39 28 H50 V72 H41 V43 L32 67 H28 L19 43 V72 H10 Z" fill={fL} />
        <path d="M72 72 V28 H108 V37 H82 V45 H104 V54 H82 V63 H109 V72 H72 Z" fill={fL} />
        <circle cx="60" cy="14" r="7.5" stroke={fA} strokeWidth="5" fill="none" />
        <rect x="55.5" y="21" width="9" height="75" rx="2" fill={fA} />
        <path d="M22 76 L24 93 L37 83 L31 82 C36 92 47 97 60 97 C73 97 84 92 89 82 L83 83 L96 93 L98 76 L83 79 C78 86 70 89 60 89 C50 89 42 86 37 79 L22 76 Z" fill={fA} />
        <path d="M25 84 C33 98 46 104 60 104 C74 104 87 98 95 84" stroke={fA} strokeWidth="7.5" strokeLinecap="round" fill="none" />
      </svg>
      <div className="flex flex-col leading-none whitespace-nowrap">
        <span className={`font-semibold uppercase tracking-[2px] ${light ? 'text-white/75' : 'text-ink-2'} ${top}`}>Middle East</span>
        <span className={`font-bold uppercase tracking-[1px] ${light ? 'text-white' : 'text-navy'} ${main}`}>Mariner</span>
      </div>
    </div>
  );
};
