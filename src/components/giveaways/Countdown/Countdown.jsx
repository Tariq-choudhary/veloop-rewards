import React, { useEffect, useState } from 'react';
import styles from './Countdown.module.css';

function getRemaining(endsAt) {
  const total = new Date(endsAt).getTime() - Date.now();
  if (total <= 0) return null;
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

/**
 * Live countdown to a giveaway's endsAt timestamp. Ticks every second so
 * it stays accurate on both the card grid and the details page.
 */
export default function Countdown({ endsAt }) {
  const [remaining, setRemaining] = useState(() => getRemaining(endsAt));

  useEffect(() => {
    setRemaining(getRemaining(endsAt));
    const interval = setInterval(() => {
      setRemaining(getRemaining(endsAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!remaining) {
    return <span className={`${styles.countdown} ${styles.ended}`}>Giveaway ended</span>;
  }

  const { days, hours, minutes, seconds } = remaining;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <span className={styles.countdown}>
      {days > 0 ? (
        <>
          <strong>{days}</strong>d <strong>{pad(hours)}</strong>h <strong>{pad(minutes)}</strong>m
        </>
      ) : (
        <>
          <strong>{pad(hours)}</strong>h <strong>{pad(minutes)}</strong>m <strong>{pad(seconds)}</strong>s
        </>
      )}
    </span>
  );
}
