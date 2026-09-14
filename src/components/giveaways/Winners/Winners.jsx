import React from 'react';
import { recentWinners } from '../../../data/giveawayData.js';
import styles from './Winners.module.css';

export default function Winners() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Recent winners</h2>
      <div className={styles.list}>
        {recentWinners.map((winner) => (
          <div key={winner.id} className={styles.card}>
            <div className={styles.avatar} aria-hidden="true">
              {winner.name.charAt(0)}
            </div>
            <div className={styles.details}>
              <p className={styles.name}>
                {winner.name}
                <span className={`${styles.entryBadge} ${winner.entryType === 'sve' ? styles.entryBadgeSve : ''}`}>
                  {winner.entryType.toUpperCase()}
                </span>
              </p>
              <p className={styles.prize}>{winner.prizeTitle}</p>
            </div>
            <div className={styles.value}>
              <p className={styles.prizeValue}>{winner.prizeValue}</p>
              <p className={styles.date}>{new Date(winner.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
