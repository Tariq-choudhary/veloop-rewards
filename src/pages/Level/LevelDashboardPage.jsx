import React from 'react';
import { useLevel } from '../../context/LevelContext.jsx';
import LevelHero from '../../components/level/LevelHero/LevelHero.jsx';
import LevelLadder from '../../components/level/LevelLadder/LevelLadder.jsx';
import NextLevelReward from '../../components/level/NextLevelReward/NextLevelReward.jsx';
import styles from './LevelDashboardPage.module.css';

export default function LevelDashboardPage() {
  const { currentLevel } = useLevel();

  return (
    <main className={styles.page}>
      <LevelHero />

      <div className={styles.gridTwo}>
        <LevelLadder currentLevel={currentLevel} />
        <NextLevelReward />
      </div>
    </main>
  );
}
