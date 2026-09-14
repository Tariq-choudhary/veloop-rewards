import React from 'react';
import { gamesData } from '../../data/gamesData.js';
import { useTokens } from '../../context/TokenContext.jsx';
import { useGameEntry } from '../../hooks/useGameEntry.js';
import GameCarousel from '../../components/games/GameCarousel/GameCarousel.jsx';
import styles from './GamesPage.module.css';

export default function GamesPage() {
  const { hasEnough } = useTokens();
  const { attemptPlay, insufficientGameId } = useGameEntry();

  const insufficientGame = gamesData.find((g) => g.id === insufficientGameId);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>VELOOP Games</p>
        <h1 className={styles.heading}>Play, score, and turn Tokens into Game Coins.</h1>
        <p className={styles.sub}>
          Every game costs 20 Tokens to enter. Reach a great score and walk away with Game Coins
          added straight to your balance.
        </p>
      </section>

      {insufficientGame && (
        <div className={styles.toast} role="alert">
          Not enough Tokens for {insufficientGame.name}. You need {insufficientGame.entryCost} Tokens to play.
        </div>
      )}

      <GameCarousel
        games={gamesData}
        canAfford={(cost) => hasEnough(cost)}
        onPlayNow={attemptPlay}
      />
    </main>
  );
}
