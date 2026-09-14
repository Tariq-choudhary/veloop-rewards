import React from 'react';
import { useLevel } from '../../../context/LevelContext.jsx';
import LevelRing from '../LevelRing/LevelRing.jsx';
import styles from './LevelHero.module.css';

export default function LevelHero() {
  const { currentLevel, currentLevelName, nextLevelName, xpIntoLevel, xpForNextLevel, progressPct, isMaxLevel, totalXP } =
    useLevel();

  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>VELOOP Levels</p>
        <h1 className={styles.title}>Climb the ladder, unlock better rewards.</h1>
        <p className={styles.sub}>
          Every action on VELOOP earns XP. Level up to unlock bigger VE, SVE, and Game Coin drops along the way.
        </p>
      </div>

      <div className={styles.card}>
        <LevelRing level={currentLevel} progressPct={progressPct} isMaxLevel={isMaxLevel} />

        <div className={styles.details}>
          <p className={styles.levelName}>{currentLevelName}</p>
          {isMaxLevel ? (
            <p className={styles.xpLine}>You've reached the top level — {totalXP.toLocaleString()} XP total.</p>
          ) : (
            <>
              <p className={styles.xpLine}>
                <strong>{xpIntoLevel.toLocaleString()}</strong> / {xpForNextLevel.toLocaleString()} XP to{' '}
                <strong>{nextLevelName}</strong>
              </p>
              <p className={styles.xpPct}>{progressPct}% of the way there</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
