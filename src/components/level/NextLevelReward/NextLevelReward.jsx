import React from 'react';
import { FiLock } from 'react-icons/fi';
import { useLevel } from '../../../context/LevelContext.jsx';
import { REWARD_LABEL } from '../../../data/levelData.js';
import styles from './NextLevelReward.module.css';

export default function NextLevelReward() {
  const { nextLevel, nextLevelName, nextLevelReward, xpIntoLevel, xpForNextLevel, isMaxLevel, totalXP } = useLevel();

  if (isMaxLevel || !nextLevelReward) {
    return (
      <aside className={styles.card}>
        <h2 className={styles.heading}>Next reward</h2>
        <p className={styles.maxText}>
          You've unlocked every reward on the ladder — {totalXP.toLocaleString()} XP and counting.
        </p>
      </aside>
    );
  }

  const xpRemaining = Math.max(0, xpForNextLevel - xpIntoLevel);

  return (
    <aside className={styles.card}>
      <h2 className={styles.heading}>Next reward</h2>

      <div className={styles.preview}>
        <div className={styles.lockIcon}>
          <FiLock size={18} />
        </div>
        <div>
          <p className={styles.rewardAmount}>
            +{nextLevelReward.amount} {REWARD_LABEL[nextLevelReward.currency]}
          </p>
          <p className={styles.rewardMeta}>
            Unlocks at Level {nextLevel} · {nextLevelName}
          </p>
        </div>
      </div>

      <p className={styles.xpRemaining}>{xpRemaining.toLocaleString()} XP to go</p>
    </aside>
  );
}
