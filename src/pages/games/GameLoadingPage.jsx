import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameBySlug } from '../../data/gamesData.js';
import GameIcon from '../../components/games/GameIcon/GameIcon.jsx';
import styles from './GameLoadingPage.module.css';

const LOAD_DURATION_MS = 1700;

export default function GameLoadingPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGameBySlug(gameId);
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    if (!game) {
      navigate('/games', { replace: true });
      return;
    }

    const startedAt = Date.now();
    const raf = { id: null, cancelled: false };

    function tick() {
      if (raf.cancelled) return;
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, Math.round((elapsed / LOAD_DURATION_MS) * 100));
      setProgress(Math.max(6, pct));
      if (pct < 100) {
        raf.id = requestAnimationFrame(tick);
      }
    }
    raf.id = requestAnimationFrame(tick);

    const redirectTimer = setTimeout(() => {
      navigate(`/games/${game.slug}`, { replace: true });
    }, LOAD_DURATION_MS + 250);

    return () => {
      raf.cancelled = true;
      if (raf.id) cancelAnimationFrame(raf.id);
      clearTimeout(redirectTimer);
    };
  }, [game, navigate]);

  if (!game) return null;

  return (
    <main
      className={styles.screen}
      style={{ background: game.banner, '--accent': game.theme.accent }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.artwork} aria-hidden="true">
          <GameIcon id={game.id} size={46} />
        </div>
        <h1 className={styles.title}>{game.name}</h1>
        <p className={styles.loadingText}>Loading game…</p>

        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Loading ${game.name}`}
        >
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.progressLabel}>{progress}%</p>

        <p className={styles.prep}>Preparing your game…</p>
      </div>
    </main>
  );
}
