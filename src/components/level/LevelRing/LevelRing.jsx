import React from 'react';
import styles from './LevelRing.module.css';

/**
 * Circular XP progress ring with the current level number centered
 * inside. Deliberately not a linear bar — that's the reference
 * dashboard's pattern; this is the "climb" metaphor's centerpiece.
 */
export default function LevelRing({ level, progressPct, size = 156, isMaxLevel = false }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, progressPct)) / 100) * circumference;

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.svg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-panel-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#levelRingGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={styles.progress}
        />
        <defs>
          <linearGradient id="levelRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gold-soft)" />
            <stop offset="100%" stopColor="var(--teal)" />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles.center}>
        <span className={styles.levelTag}>Level</span>
        <span className={styles.levelNumber}>{level}</span>
        {isMaxLevel && <span className={styles.maxTag}>MAX</span>}
      </div>
    </div>
  );
}
