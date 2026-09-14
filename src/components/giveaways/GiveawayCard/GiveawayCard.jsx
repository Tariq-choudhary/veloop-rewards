import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../Countdown/Countdown.jsx';
import { GIVEAWAY_STATUS } from '../../../data/giveawayData.js';
import styles from './GiveawayCard.module.css';

export default function GiveawayCard({ giveaway }) {
  const { slug, title, subtitle, prizeValue, category, banner, theme, endsAt, status, entryCost } = giveaway;

  return (
    <Link
      to={`/giveaway/${slug}`}
      className={styles.card}
      style={{ '--accent': theme.accent, '--glow': theme.glow }}
    >
      <div className={styles.banner} style={{ background: banner }}>
        {status === GIVEAWAY_STATUS.ENDING_SOON && <span className={styles.endingTag}>Ending soon</span>}
        <span className={styles.categoryTag}>{category}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.prize}>{prizeValue}</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.footer}>
          <Countdown endsAt={endsAt} />
          <span className={styles.entryCost}>
            {entryCost.ve} VE{entryCost.sve ? ` · ${entryCost.sve} SVE` : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}
