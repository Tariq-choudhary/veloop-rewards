import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './LoginModal.module.css';

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, login, redirectAfterLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const navigate = useNavigate();

  if (!loginModalOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    login({ name, email, contact });
    if (redirectAfterLogin) {
      navigate(redirectAfterLogin);
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div className={styles.modal}>
        <h2 id="login-title">Sign in to play</h2>
        <p className={styles.sub}>
          Games require a signed-in VELOOP account. Your progress picks up right where you left off.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-name" className={styles.label}>
            Display name
          </label>
          <input
            id="login-name"
            className={styles.input}
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Riya"
          />

          <label htmlFor="login-email" className={styles.label}>
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            className={styles.input}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <label htmlFor="login-contact" className={styles.label}>
            Contact number
          </label>
          <input
            id="login-contact"
            type="tel"
            className={styles.input}
            required
            pattern="[0-9+\s-]{7,15}"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="e.g. 9876543210"
          />

          <div className={styles.actions}>
            <button
              type="button"
              className="veloop-btn veloop-btn-ghost"
              onClick={() => setLoginModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="veloop-btn veloop-btn-primary">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
