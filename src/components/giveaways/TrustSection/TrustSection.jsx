import React from 'react';
import { trustBadges } from '../../../data/giveawayData.js';
import styles from './TrustSection.module.css';

export default function TrustSection() {
  return (
    <section className={styles.section}>
      <div className={styles.badges}>
        {trustBadges.map((badge) => (
          <div key={badge.id} className={styles.badge}>
            <p className={styles.label}>{badge.label}</p>
            <p className={styles.description}>{badge.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
