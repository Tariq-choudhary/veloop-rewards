import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCoins } from 'react-icons/fa';
import { getGameBySlug } from '../../data/gamesData.js';
import { useGameSession } from '../../context/GameSessionContext.jsx';
import { useGameCoins } from '../../context/GameCoinContext.jsx';
import { calculateReward } from '../../utils/rewardEngine.js';
import { getBestScore, setBestScoreIfHigher } from '../../utils/bestScore.js';
import styles from './GameResultPage.module.css';

export default function GameResultPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGameBySlug(gameId);
  const { session, useRevive, completeSession, startSession, beginPlaying } = useGameSession();
  const { addCoins, isSessionClaimed } = useGameCoins();

  const [bestScore, setBestScore] = useState(0);
  const [finalizing, setFinalizing] = useState(false);
  const [finalized, setFinalized] = useState(false);

  useEffect(() => {
    if (!game || !session || session.gameId !== game.id) {
      navigate('/games', { replace: true });
      return;
    }
    setBestScore(setBestScoreIfHigher(game.id, session.score));
  }, [game, session, navigate]);

  if (!game || !session) return null;

  const reward = calculateReward(session.score, game.rewardRules);
  const alreadyClaimed = isSessionClaimed(session.sessionId);
  const canRevive = session.revivesRemaining > 0 && !finalized && !alreadyClaimed;

  function handleRevive() {
    const granted = useRevive();
    if (granted) {
      navigate(`/games/${game.slug}/play`);
    }
  }

  function handlePlayAgain() {
    startSession(game.id);
    beginPlaying(game.rewardRules.maxRevives);
    navigate(`/games/${game.slug}/play`);
  }

  function handleNoThanks() {
    if (finalizing || finalized) return;
    setFinalizing(true);
    completeSession(reward);
    addCoins(reward, session.sessionId); // idempotent — safe even if re-triggered
    setFinalized(true);
    setTimeout(() => {
      navigate(`/games/${game.slug}`);
    }, 1200);
  }

  return (
    <main className={styles.page} style={{ '--accent': game.theme.accent }}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Game Over</p>
        <h1 className={styles.gameName}>{game.name}</h1>

        <div className={styles.scoreRow}>
          <div className={styles.scoreBlock}>
            <span className={styles.scoreLabel}>Score</span>
            <span className={styles.scoreValue}>{session.score.toLocaleString()}</span>
          </div>
          <div className={styles.scoreBlock}>
            <span className={styles.scoreLabel}>Best score</span>
            <span className={styles.scoreValue}>{bestScore.toLocaleString()}</span>
          </div>
        </div>

        <div className={`${styles.rewardBox} ${finalized ? styles.rewardBoxRevealed : ''}`}>
          <FaCoins aria-hidden="true" className={styles.rewardIcon} />
          <span className={styles.rewardLabel}>Game Coins Earned</span>
          <span className={styles.rewardValue}>+{reward}</span>
        </div>

        {finalized ? (
          <p className={styles.confirmText}>Added to your Game Coin balance. Returning to {game.name}…</p>
        ) : (
          <div className={styles.actions}>
            {canRevive && (
              <button className="veloop-btn veloop-btn-primary" onClick={handleRevive}>
                Revive
              </button>
            )}
            <button className="veloop-btn veloop-btn-ghost" onClick={handlePlayAgain}>
              Play Again
            </button>
            <button
              className="veloop-btn veloop-btn-danger"
              onClick={handleNoThanks}
              disabled={finalizing}
            >
              {finalizing ? 'Finalizing…' : 'No Thanks'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
