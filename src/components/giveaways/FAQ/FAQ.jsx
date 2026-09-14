import React, { useState } from 'react';
import { faqData } from '../../../data/giveawayData.js';
import styles from './FAQ.module.css';

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Frequently asked questions</h2>
      <div className={styles.list}>
        {faqData.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className={styles.item}>
              <button
                type="button"
                className={styles.question}
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`} aria-hidden="true">
                  +
                </span>
              </button>
              {isOpen && <p className={styles.answer}>{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
