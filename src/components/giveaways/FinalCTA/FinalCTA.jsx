import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Ready to earn more entries?</h2>
      <p className={styles.sub}>
        Play VELOOP games to rack up VEs, then put them toward the giveaways you actually want to win.
      </p>
      <Link to="/games" className="veloop-btn veloop-btn-primary">
        Play games to earn VEs
      </Link>
    </section>
  );
}
