import React from 'react';
import { howItWorksSteps } from '../../../data/giveawayData.js';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>How it works</h2>
      <div className={styles.steps}>
        {howItWorksSteps.map((step, index) => (
          <div key={step.id} className={styles.step}>
            <span className={styles.number}>{index + 1}</span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
