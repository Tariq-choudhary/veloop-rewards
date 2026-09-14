import React from 'react';
import { useGiveaways } from '../../../context/GiveawayContext.jsx';
import styles from './GiveawayHero.module.css';

export default function GiveawayHero() {
  const { veBalance, sveBalance } = useGiveaways();

  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>VELOOP Giveaways</p>
      <h1 className={styles.heading}>Turn your entries into real prizes.</h1>
      <p className={styles.sub}>
        Spend VEs and SVEs on any live giveaway below. The more entries you put in, the better your odds when
        the countdown hits zero.
      </p>

      <div className={styles.balances}>
        <div className={styles.balancePill} title="Veloop Entries">
          <span className={styles.balanceLabel}>VEs</span>
          <span className={styles.balanceValue}>{veBalance}</span>
        </div>
        <div className={`${styles.balancePill} ${styles.balancePillGold}`} title="Super Veloop Entries">
          <span className={styles.balanceLabel}>SVEs</span>
          <span className={styles.balanceValue}>{sveBalance}</span>
        </div>
      </div>
    </section>
  );
}
