import React from 'react';
import { FiZap, FiLock } from 'react-icons/fi';
import GameIcon from '../GameIcon/GameIcon.jsx';
import styles from './GameCard.module.css';

export default function GameCard({ game, canAfford, onPlayNow }) {
  const isComingSoon = game.status === 'coming-soon';

  return (
    <div className={styles.card} style={{ '--accent': game.theme.accent, '--glow': game.theme.glow }}>
      <div className={styles.banner} style={{ background: game.banner }}>
        <div className={styles.dotField} aria-hidden="true" />
        <GameIcon id={game.id} size={132} className={styles.ghostIcon} />
        <div className={styles.iconWrap}>
          <GameIcon id={game.id} size={40} />
        </div>
        {isComingSoon && <span className={styles.comingSoonTag}>Coming soon</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{game.name}</h3>
        <p className={styles.desc}>{game.description}</p>

        <div className={styles.footer}>
          <span className={styles.cost}>
            <FiZap aria-hidden="true" /> {game.entryCost} Tokens
          </span>

          <button
            className={`${styles.playBtn} ${!canAfford && !isComingSoon ? styles.playBtnDisabled : ''}`}
            onClick={() => onPlayNow(game)}
            disabled={isComingSoon}
            aria-label={isComingSoon ? `${game.name} coming soon` : `Play ${game.name} now`}
          >
            {isComingSoon ? (
              <>
                <FiLock aria-hidden="true" /> Locked
              </>
            ) : !canAfford ? (
              'Need Tokens'
            ) : (
              'Play Now'
            )}
            {!isComingSoon && <span className={styles.shimmer} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
