import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const TokenContext = createContext(null);
const STORAGE_KEY = 'veloopTokens';
const DEFAULT_BALANCE = 100;

export function TokenProvider({ children }) {
  const [balance, setBalance] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw !== null ? Number(raw) : DEFAULT_BALANCE;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_BALANCE;
  });

  // Guards against a double "Play Now" click firing two deductions
  // before the first state update has committed.
  const spendLock = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(balance));
  }, [balance]);

  const hasEnough = useCallback((amount) => balance >= amount, [balance]);

  /**
   * Attempts to deduct `amount` tokens exactly once.
   * Returns true if the deduction succeeded, false if balance was
   * insufficient or a spend was already in flight.
   */
  const spendTokens = useCallback(
    (amount) => {
      if (spendLock.current) return false;
      if (balance < amount) return false;

      spendLock.current = true;
      setBalance((prev) => (prev >= amount ? prev - amount : prev));
      // Release the lock on the next tick so legitimate subsequent
      // spends (e.g. a later game) are not blocked forever.
      setTimeout(() => {
        spendLock.current = false;
      }, 400);
      return true;
    },
    [balance]
  );

  const addTokens = useCallback((amount) => {
    if (amount <= 0) return;
    setBalance((prev) => prev + amount);
  }, []);

  const value = { balance, hasEnough, spendTokens, addTokens };

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useTokens() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error('useTokens must be used within TokenProvider');
  return ctx;
}
