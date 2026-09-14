import React from 'react';
import { FiZap, FiCheck } from 'react-icons/fi';
import { useRewards } from '../../context/RewardsContext.jsx';
import styles from './RewardsPage.module.css';

export default function RewardsPage() {
  const { rewardSessions, isSessionClaimed, claimSession } = useRewards();

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>VELOOP Rewards</p>
      <h1 className={styles.title}>Reward Sessions</h1>
      <p className={styles.sub}>
        Claim a token boost during each window of the day. Sessions reset every day at midnight.
      </p>

      <div className={styles.grid}>
        {rewardSessions.map((session) => {
          const claimed = isSessionClaimed(session.id);
          return (
            <div key={session.id} className={styles.card}>
              <p className={styles.window}>{session.window}</p>
              <h2 className={styles.label}>{session.label}</h2>
              <p className={styles.desc}>{session.description}</p>

              <div className={styles.rewardRow}>
                <FiZap aria-hidden="true" />
                <span>+{session.reward} Tokens</span>
              </div>

              <button
                type="button"
                className={`${styles.claimBtn} ${claimed ? styles.claimBtnDone : ''}`}
                onClick={() => claimSession(session.id)}
                disabled={claimed}
              >
                {claimed ? (
                  <>
                    <FiCheck aria-hidden="true" /> Claimed
                  </>
                ) : (
                  'Claim session'
                )}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
