import React from 'react';
import { FiCheck, FiLock } from 'react-icons/fi';
import { levelRoadmap, REWARD_LABEL } from '../../../data/levelData.js';
import styles from './LevelLadder.module.css';

function statusFor(level, currentLevel) {
  if (level < currentLevel) return 'completed';
  if (level === currentLevel) return 'current';
  return 'locked';
}

export default function LevelLadder({ currentLevel }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Your level ladder</h2>

      <div className={styles.track}>
        {levelRoadmap.map((item) => {
          const status = statusFor(item.level, currentLevel);
          return (
            <div key={item.level} className={styles.step}>
              <div className={`${styles.node} ${styles[status]}`}>
                {status === 'completed' && <FiCheck size={16} />}
                {status === 'locked' && <FiLock size={13} />}
                {status === 'current' && item.level}
              </div>

              <div className={styles.content}>
                <div className={styles.contentTop}>
                  <span className={styles.levelLabel}>Level {String(item.level).padStart(2, '0')}</span>
                  {status === 'current' && <span className={styles.hereTag}>You are here</span>}
                </div>
                <p className={styles.levelName}>{item.name}</p>
                <span className={`${styles.rewardChip} ${status === 'locked' ? styles.rewardChipLocked : ''}`}>
                  +{item.reward.amount} {REWARD_LABEL[item.reward.currency]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
