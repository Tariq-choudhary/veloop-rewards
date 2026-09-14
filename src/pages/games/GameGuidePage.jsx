import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiTarget, FiSliders, FiList, FiAward, FiFlag, FiArrowLeft } from 'react-icons/fi';
import { getGameBySlug } from '../../data/gamesData.js';
import styles from './GameGuidePage.module.css';

export default function GameGuidePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGameBySlug(gameId);

  React.useEffect(() => {
    if (!game) navigate('/games', { replace: true });
  }, [game, navigate]);

  if (!game) return null;

  const { instructions } = game;

  const cards = [
    { icon: FiTarget, label: 'Objective', text: instructions.objective },
    { icon: FiSliders, label: 'Controls', text: instructions.controls },
    { icon: FiAward, label: 'Scoring', text: instructions.scoring },
    { icon: FiFlag, label: 'Game over', text: instructions.gameOverCondition },
  ];

  return (
    <main className={styles.page} style={{ '--accent': game.theme.accent }}>
      <button className={styles.backLink} onClick={() => navigate(`/games/${game.slug}`)}>
        <FiArrowLeft aria-hidden="true" /> Back to {game.name}
      </button>

      <h1 className={styles.title}>How to play {game.name}</h1>
      <p className={styles.reward}>{instructions.rewardExplanation}</p>

      <div className={styles.grid}>
        {cards.map(({ icon: Icon, label, text }) => (
          <div className={styles.card} key={label}>
            <Icon className={styles.cardIcon} aria-hidden="true" />
            <h2 className={styles.cardLabel}>{label}</h2>
            <p className={styles.cardText}>{text}</p>
          </div>
        ))}
      </div>

      {instructions.rules.length > 0 && (
        <div className={styles.rulesBox}>
          <h2 className={styles.rulesTitle}>
            <FiList aria-hidden="true" /> Rules
          </h2>
          <ol className={styles.rulesList}>
            {instructions.rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ol>
        </div>
      )}

      <div className={styles.actions}>
        <button
          className="veloop-btn veloop-btn-primary"
          onClick={() => navigate(`/games/${game.slug}/play`)}
        >
          Start Game
        </button>
        <Link to={`/games/${game.slug}`} className="veloop-btn veloop-btn-ghost">
          Cancel
        </Link>
      </div>
    </main>
  );
}
