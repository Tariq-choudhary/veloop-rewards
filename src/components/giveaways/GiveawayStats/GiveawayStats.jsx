import React from 'react';
import { giveawayStats } from '../../../data/giveawayData.js';
import styles from './GiveawayStats.module.css';

const STAT_ITEMS = [
  { key: 'totalValueAwarded', label: 'Awarded so far' },
  { key: 'totalWinners', label: 'Winners' },
  { key: 'activeGiveaways', label: 'Live giveaways' },
  { key: 'totalEntriesAllTime', label: 'Entries submitted' },
];

export default function GiveawayStats() {
  return (
    <section className={styles.stats}>
      {STAT_ITEMS.map(({ key, label }) => {
        const raw = giveawayStats[key];
        const display = typeof raw === 'number' ? raw.toLocaleString() : raw;
        return (
          <div key={key} className={styles.stat}>
            <p className={styles.value}>{display}</p>
            <p className={styles.label}>{label}</p>
          </div>
        );
      })}
    </section>
  );
}
