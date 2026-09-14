import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiZap, FiArrowLeft } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';
import { getGameBySlug } from '../../data/gamesData.js';
import GameIcon from '../../components/games/GameIcon/GameIcon.jsx';
import { useGameCoins } from '../../context/GameCoinContext.jsx';
import { useGameSession } from '../../context/GameSessionContext.jsx';
import { useGameEntry } from '../../hooks/useGameEntry.js';
import { getBestScore } from '../../utils/bestScore.js';
import styles from './GameHomePage.module.css';

export default function GameHomePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGameBySlug(gameId);
  const { balance: coinBalance } = useGameCoins();
  const { session } = useGameSession();
  const { attemptPlay, insufficientGameId } = useGameEntry();
  const [bestScore, setBestScore] = useState(0);

  // If Tokens were already spent for this game (e.g. the player just
  // arrived here from the loading screen), don't charge them again —
  // just continue straight into the game.
  const hasActiveEntry =
    !!session && game && session.gameId === game.id && session.status !== 'COMPLETED';

  function handlePlayClick() {
    if (hasActiveEntry) {
      navigate(`/games/${game.slug}/play`);
    } else {
      attemptPlay(game);
    }
  }

  useEffect(() => {
    if (!game) {
      navigate('/games', { replace: true });
      return;
    }
    setBestScore(getBestScore(game.id));
  }, [game, navigate]);

  if (!game) return null;

  const insufficient = insufficientGameId === game.id;
  const isComingSoon = game.status === 'coming-soon';

  return (
    <main className={styles.page} style={{ '--accent': game.theme.accent }}>
      <div className={styles.hero} style={{ background: game.banner }}>
        <GameIcon id={game.id} size={200} className={styles.heroGhostIcon} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.artwork} aria-hidden="true">
            <GameIcon id={game.id} size={30} />
          </div>
          <h1 className={styles.title}>{game.name}</h1>
          <p className={styles.tagline}>{game.tagline}</p>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Best score</span>
            <span className={styles.statValue}>{bestScore.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Game Coins</span>
            <span className={styles.statValue}>
              <FaCoins aria-hidden="true" className={styles.coinIcon} /> {coinBalance}
            </span>
          </div>
        </div>

        {insufficient && (
          <div className={styles.toast} role="alert">
            Not enough Tokens. You need {game.entryCost} to play {game.name}.
          </div>
        )}

        {isComingSoon ? (
          <div className={styles.comingSoon}>
            <p>{game.name} is still being polished. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.actions}>
            <button
              className="veloop-btn veloop-btn-primary"
              onClick={handlePlayClick}
            >
              {hasActiveEntry ? 'Continue' : 'Play Now'}
            </button>
            <Link to={`/games/${game.slug}/guide`} className="veloop-btn veloop-btn-ghost">
              How to Play
            </Link>
          </div>
        )}

        <div className={styles.entryInfo}>
          <span className={styles.entryCost}>
            <FiZap aria-hidden="true" /> Entry: {game.entryCost} Tokens
          </span>
          <span className={styles.rewardNote}>
            Win up to {game.rewardRules.maxReward} Game Coins based on your final score.
          </span>
        </div>

        <button className={styles.backLink} onClick={() => navigate('/games')}>
          <FiArrowLeft aria-hidden="true" /> Back to Games
        </button>
      </div>
    </main>
  );
}
