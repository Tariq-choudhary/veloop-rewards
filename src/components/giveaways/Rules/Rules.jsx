import React from 'react';
import { giveawayRules } from '../../../data/giveawayData.js';
import styles from './Rules.module.css';

export default function Rules() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Rules</h2>
      <ol className={styles.list}>
        {giveawayRules.map((rule, index) => (
          <li key={index} className={styles.item}>
            {rule}
          </li>
        ))}
      </ol>
    </section>
  );
}
