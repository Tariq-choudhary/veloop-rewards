import React, { useState } from 'react';
import { FaCoins } from 'react-icons/fa';
import { useGameCoins } from '../../context/GameCoinContext.jsx';
import { useRewards } from '../../context/RewardsContext.jsx';
import styles from './RedeemPage.module.css';

export default function RedeemPage() {
  const { balance: coinBalance } = useGameCoins();
  const { redemptionOptions, redemptionHistory, redeem } = useRewards();
  const [pendingOption, setPendingOption] = useState(null);

  const handleConfirm = () => {
    if (!pendingOption) return;
    redeem(pendingOption.id);
    setPendingOption(null);
  };

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>VELOOP Rewards</p>
      <h1 className={styles.title}>Redeem Center</h1>
      <p className={styles.sub}>Convert Game Coins into Tokens, VEs, or SVEs.</p>

      <div className={styles.balance}>
        <FaCoins aria-hidden="true" />
        <span>{coinBalance} Game Coins available</span>
      </div>

      <div className={styles.grid}>
        {redemptionOptions.map((option) => {
          const canAfford = coinBalance >= option.coinsCost;
          return (
            <div key={option.id} className={styles.card}>
              <p className={styles.label}>{option.label}</p>
              <p className={styles.desc}>{option.description}</p>
              <p className={styles.rate}>
                {option.coinsCost} Coins → {option.output.amount} {option.label}
              </p>
              <button
                type="button"
                className={styles.redeemBtn}
                disabled={!canAfford}
                onClick={() => setPendingOption(option)}
              >
                {canAfford ? 'Redeem' : 'Not enough Coins'}
              </button>
            </div>
          );
        })}
      </div>

      <section className={styles.historySection}>
        <h2 className={styles.historyHeading}>Recent Redemptions</h2>
        {redemptionHistory.length === 0 ? (
          <p className={styles.emptyText}>No redemptions yet. Play games to earn Game Coins.</p>
        ) : (
          <ul className={styles.historyList}>
            {redemptionHistory.map((entry) => (
              <li key={entry.id} className={styles.historyItem}>
                <span>
                  {entry.coinsCost} Coins → {entry.output.amount} {entry.label}
                </span>
                <span className={styles.historyDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pendingOption && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="redeem-title">
          <div className={styles.modal}>
            <h2 id="redeem-title">Redeem Game Coins?</h2>
            <p className={styles.modalText}>
              Convert {pendingOption.coinsCost} Game Coins into {pendingOption.output.amount} {pendingOption.label}.
            </p>
            <p className={styles.modalRemaining}>Remaining: {coinBalance - pendingOption.coinsCost} Game Coins</p>

            <div className={styles.modalActions}>
              <button type="button" className="veloop-btn veloop-btn-ghost" onClick={() => setPendingOption(null)}>
                Cancel
              </button>
              <button type="button" className="veloop-btn veloop-btn-primary" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
