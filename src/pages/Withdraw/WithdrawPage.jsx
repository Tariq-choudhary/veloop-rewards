import React, { useState } from 'react';
import { FiZap } from 'react-icons/fi';
import { useGiveaways } from '../../context/GiveawayContext.jsx';
import { useRewards } from '../../context/RewardsContext.jsx';
import { withdrawalMethods } from '../../data/rewardsData.js';
import styles from './WithdrawPage.module.css';

export default function WithdrawPage() {
  const { veBalance } = useGiveaways();
  const { requestWithdrawal, withdrawalHistory, withdrawalMinVE } = useRewards();

  const [amount, setAmount] = useState(String(withdrawalMinVE));
  const [methodId, setMethodId] = useState(withdrawalMethods[0].id);
  const [destination, setDestination] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }

  const method = withdrawalMethods.find((m) => m.id === methodId) || withdrawalMethods[0];
  const numericAmount = Number(amount);

  function handleSubmit(e) {
    e.preventDefault();

    if (!Number.isFinite(numericAmount) || numericAmount < withdrawalMinVE) {
      setFeedback({ type: 'error', text: `Minimum withdrawal is ${withdrawalMinVE} VE.` });
      return;
    }
    if (numericAmount > veBalance) {
      setFeedback({ type: 'error', text: 'Not enough VEs for that amount.' });
      return;
    }
    if (!destination.trim()) {
      setFeedback({ type: 'error', text: 'Enter a destination to withdraw to.' });
      return;
    }

    const ok = requestWithdrawal({ amount: numericAmount, method: method.label, destination });
    if (ok) {
      setFeedback({ type: 'success', text: 'Withdrawal request submitted.' });
      setDestination('');
      setAmount(String(withdrawalMinVE));
    } else {
      setFeedback({ type: 'error', text: 'Something went wrong — try again.' });
    }
  }

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>VELOOP Rewards</p>
      <h1 className={styles.title}>Withdraw VEs</h1>
      <p className={styles.sub}>
        Redeem Game Coins into VEs first. Withdrawals use dummy local data and a {withdrawalMinVE} VE minimum.
      </p>

      <div className={styles.balance}>
        <FiZap aria-hidden="true" />
        <span>{veBalance} VEs available</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="wd-amount" className={styles.label}>
          Amount (VE)
        </label>
        <input
          id="wd-amount"
          type="number"
          className={styles.input}
          min={withdrawalMinVE}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label htmlFor="wd-method" className={styles.label}>
          Method
        </label>
        <select
          id="wd-method"
          className={styles.input}
          value={methodId}
          onChange={(e) => setMethodId(e.target.value)}
        >
          {withdrawalMethods.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>

        <label htmlFor="wd-destination" className={styles.label}>
          Destination
        </label>
        <input
          id="wd-destination"
          className={styles.input}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder={method.placeholder}
        />

        {feedback && (
          <p className={feedback.type === 'success' ? styles.success : styles.error}>{feedback.text}</p>
        )}

        <button type="submit" className={`veloop-btn veloop-btn-primary ${styles.submitBtn}`}>
          Request withdrawal
        </button>
      </form>

      <section className={styles.historySection}>
        <h2 className={styles.historyHeading}>Withdrawal history</h2>
        {withdrawalHistory.length === 0 ? (
          <p className={styles.emptyText}>No withdrawals yet.</p>
        ) : (
          <ul className={styles.historyList}>
            {withdrawalHistory.map((entry) => (
              <li key={entry.id} className={styles.historyItem}>
                <span>
                  {entry.amount} VE → {entry.method} ({entry.destination})
                </span>
                <span className={styles.historyStatus}>{entry.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
