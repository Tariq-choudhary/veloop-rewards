import React from 'react';

// One small original SVG per game, keyed by game id. These are simple
// line/shape illustrations (not photos or stock art) since these are
// in-house fictional games with no real-world images to source.
const ICONS = {
  'merge-master': (
    <>
      <rect x="7" y="16" width="10" height="10" rx="2" />
      <rect x="15" y="6" width="10" height="10" rx="2" />
      <path d="M17 21l5-5" strokeLinecap="round" />
    </>
  ),
  wormzy: (
    <>
      <path
        d="M6 22c0-5 6-3 6-8s-5-4-5-9"
        strokeLinecap="round"
      />
      <circle cx="7" cy="5" r="2.4" />
    </>
  ),
  'block-blitz': (
    <>
      <rect x="5" y="18" width="6" height="6" />
      <rect x="13" y="12" width="6" height="12" />
      <rect x="21" y="6" width="6" height="18" />
    </>
  ),
  'coin-cascade': (
    <>
      <circle cx="10" cy="20" r="5" />
      <circle cx="18" cy="12" r="5" />
      <circle cx="22" cy="22" r="3.5" />
    </>
  ),
  'sky-runner': (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M9 10v7l-4 6M9 17l5 6M9 13l6-2" strokeLinecap="round" />
    </>
  ),
  'puzzle-vault': (
    <>
      <rect x="5" y="5" width="8" height="8" rx="1.5" />
      <rect x="16" y="5" width="8" height="8" rx="1.5" />
      <rect x="5" y="16" width="8" height="8" rx="1.5" />
    </>
  ),
  'star-sweep': (
    <>
      <path d="M15 5l1.8 4.4L21 11l-4.2 1.6L15 17l-1.8-4.4L9 11l4.2-1.6z" />
      <circle cx="6" cy="21" r="1.6" />
      <circle cx="24" cy="21" r="1.2" />
    </>
  ),
  'tile-tactics': (
    <>
      <rect x="4" y="4" width="8" height="8" />
      <rect x="17" y="4" width="8" height="8" fill="currentColor" stroke="none" opacity="0.35" />
      <rect x="4" y="17" width="8" height="8" fill="currentColor" stroke="none" opacity="0.35" />
      <rect x="17" y="17" width="8" height="8" />
    </>
  ),
  'reef-dash': (
    <>
      <path d="M4 12c3-4 6 4 9 0s6 4 9 0" strokeLinecap="round" />
      <path d="M4 19c3-4 6 4 9 0s6 4 9 0" strokeLinecap="round" />
    </>
  ),
  'gem-forge': (
    <>
      <path d="M9 5h10l5 7-10 12L4 12z" strokeLinejoin="round" />
      <path d="M9 5l5 7-5 12M19 5l-5 7 5 12M4 12h20" strokeLinejoin="round" />
    </>
  ),
  'orbit-drift': (
    <>
      <circle cx="14" cy="14" r="3.4" />
      <ellipse cx="14" cy="14" rx="11" ry="4.5" transform="rotate(-25 14 14)" />
    </>
  ),
  'quick-quiz': (
    <>
      <circle cx="14" cy="14" r="10" />
      <path d="M11 11a3 3 0 1 1 4.2 2.7c-1.1.5-1.7 1.1-1.7 2.3" strokeLinecap="round" />
      <circle cx="13.5" cy="19.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  'drift-racer': (
    <>
      <rect x="6" y="12" width="16" height="6" rx="2.5" />
      <circle cx="10" cy="20" r="2.2" />
      <circle cx="19" cy="20" r="2.2" />
      <path d="M3 21c3-1 3-4 6-4M25 21c-3-1-3-4-6-4" strokeLinecap="round" />
    </>
  ),
};

const FALLBACK = <circle cx="14" cy="14" r="9" />;

export default function GameIcon({ id, size = 52, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className={className}
    >
      {ICONS[id] || FALLBACK}
    </svg>
  );
}
