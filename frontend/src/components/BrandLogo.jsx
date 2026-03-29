import React from 'react';

const SIZE_MAP = {
  sm: {
    mark: 32,
    gap: 'gap-2.5',
    wordmark: 'text-[1.7rem]',
    tagline: 'text-[0.6rem]',
  },
  md: {
    mark: 42,
    gap: 'gap-3',
    wordmark: 'text-[2.15rem]',
    tagline: 'text-[0.64rem]',
  },
  lg: {
    mark: 60,
    gap: 'gap-4',
    wordmark: 'text-[3rem]',
    tagline: 'text-[0.72rem]',
  },
};

function PrepprMark({ size = 42, className = '' }) {
  return (
    <svg
      viewBox="0 0 140 140"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 118V26"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M27 39L40 18L53 39"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48 26H86C109 26 124 41 124 60C124 79 109 94 86 94H48"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M87 46C72.0883 46 60 55.1782 60 66.5C60 71.3037 62.1769 75.7212 65.8097 79.1668L62.5 92L75.9336 85.8677C79.2672 86.6121 82.9242 87 87 87C101.912 87 114 77.8218 114 66.5C114 55.1782 101.912 46 87 46Z"
        fill="white"
      />
      <path
        d="M77 68L86 77L103 58"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BrandLogo({
  size = 'md',
  className = '',
  showTagline = false,
  stacked = false,
  tone = 'default',
}) {
  const scale = SIZE_MAP[size] || SIZE_MAP.md;
  const toneClass = tone === 'inverse' ? 'text-white' : 'text-[var(--brand-ink)]';

  return (
    <div
      className={`inline-flex ${stacked ? 'flex-col items-start' : 'items-center'} ${scale.gap} ${toneClass} ${className}`}
    >
      <PrepprMark
        size={scale.mark}
        className="shrink-0 drop-shadow-[0_10px_18px_rgba(107,170,117,0.18)]"
      />
      <div className={`${stacked ? 'space-y-1' : 'space-y-0.5'}`}>
        <div
          className={`leading-none font-black tracking-[-0.08em] lowercase ${scale.wordmark}`}
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          preppr
        </div>
        {showTagline && (
          <div
            className={`uppercase tracking-[0.28em] text-[var(--color-on-surface-variant)] ${scale.tagline}`}
          >
            Smart Interview Practice
          </div>
        )}
      </div>
    </div>
  );
}
