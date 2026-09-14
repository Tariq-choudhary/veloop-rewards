import React from 'react';
import { useGiveaways } from '../../../context/GiveawayContext.jsx';
import styles from './ClaimModal.module.css';

export default function ClaimModal({ giveaway, onClose }) {
  const { claimPrize, isPrizeClaimed } = useGiveaways();

  if (!giveaway) return null;

  const alreadyClaimed = isPrizeClaimed(giveaway.id);

  const handleClaim = () => {
    claimPrize(giveaway.id);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="claim-title">
      <div className={styles.modal}>
        <span className={styles.badge}>You won!</span>
        <h2 id="claim-title" className={styles.title}>
          {giveaway.title}
        </h2>
        <p className={styles.prize}>{giveaway.prizeValue}</p>
        <p className={styles.sub}>
          {alreadyClaimed
            ? 'This prize has already been claimed. Our team will be in touch with delivery details.'
            : 'Congratulations! Claim your prize below and our team will reach out with delivery details.'}
        </p>

        <div className={styles.actions}>
          <button type="button" className="veloop-btn veloop-btn-ghost" onClick={onClose}>
            Close
          </button>
          {!alreadyClaimed && (
            <button type="button" className="veloop-btn veloop-btn-primary" onClick={handleClaim}>
              Claim prize
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
