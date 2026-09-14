import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiAward } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTokens } from '../../context/TokenContext.jsx';
import { useGameCoins } from '../../context/GameCoinContext.jsx';
import { useGiveaways } from '../../context/GiveawayContext.jsx';
import styles from './Header.module.css';

export default function Header() {
  const { user, isLoggedIn, requireLogin, logout } = useAuth();
  const { balance: tokenBalance } = useTokens();
  const { balance: coinBalance } = useGameCoins();
  const { veBalance } = useGiveaways();

  return (
    <header className={styles.header}>
      <Link to="/games" className={styles.logo} aria-label="VELOOP home">
        VELOOP
      </Link>

      <nav className={styles.nav}>
        <Link to="/games" className={styles.navLink}>
          Games
        </Link>
        <Link to="/giveaways" className={styles.navLink}>
          Giveaways
        </Link>
        <Link to="/level" className={styles.navLink}>
          Level
        </Link>
        <Link to="/rewards" className={styles.navLink}>
          Rewards
        </Link>
        <Link to="/redeem" className={styles.navLink}>
          Redeem
        </Link>
        <Link to="/withdraw" className={styles.navLink}>
          Withdraw
        </Link>
      </nav>

      <div className={styles.wallets}>
        <div className={styles.pill} title="Tokens">
          <FiZap aria-hidden="true" />
          <span>{tokenBalance}</span>
        </div>
        <div className={`${styles.pill} ${styles.pillGold}`} title="Game Coins">
          <FaCoins aria-hidden="true" />
          <span>{coinBalance}</span>
        </div>
        <div className={`${styles.pill} ${styles.pillTeal}`} title="VEs">
          <FiAward aria-hidden="true" />
          <span>{veBalance}</span>
        </div>

        {isLoggedIn ? (
          <button className={styles.userBtn} onClick={logout}>
            {user.name} · Sign out
          </button>
        ) : (
          <button className={`veloop-btn veloop-btn-ghost ${styles.loginBtn}`} onClick={() => requireLogin('/games')}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
