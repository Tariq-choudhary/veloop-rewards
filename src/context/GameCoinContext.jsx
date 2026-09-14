import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameCoinContext = createContext(null);
const STORAGE_KEY = 'veloopGameCoins';
const CLAIMED_SESSIONS_KEY = 'veloopClaimedSessions';
const DEFAULT_BALANCE = 0;

function readClaimedSessions() {
  try {
    const raw = localStorage.getItem(CLAIMED_SESSIONS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function GameCoinProvider({ children }) {
  const [balance, setBalance] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw !== null ? Number(raw) : DEFAULT_BALANCE;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_BALANCE;
  });

  // Session IDs that have already paid out a reward. A session id can
  // only ever appear here once, which is what stops double claiming.
  const [claimedSessions, setClaimedSessions] = useState(readClaimedSessions);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(CLAIMED_SESSIONS_KEY, JSON.stringify([...claimedSessions]));
  }, [claimedSessions]);

  const getBalance = useCallback(() => balance, [balance]);

  const deductCoins = useCallback((amount) => {
    if (amount <= 0) return false;
    let ok = false;
    setBalance((prev) => {
      if (prev < amount) return prev;
      ok = true;
      return prev - amount;
    });
    return ok;
  }, []);

  /**
   * Grants coins for a finished game session. Idempotent: calling this
   * twice with the same sessionId only ever pays out once.
   */
  const addCoins = useCallback((amount, sessionId) => {
    if (amount < 0 || !Number.isFinite(amount)) return false;
    if (!sessionId) return false;

    let granted = false;
    setClaimedSessions((prev) => {
      if (prev.has(sessionId)) return prev; // already claimed, no-op
      granted = true;
      const next = new Set(prev);
      next.add(sessionId);
      return next;
    });

    if (granted) {
      setBalance((prev) => prev + amount);
    }
    return granted;
  }, []);

  const isSessionClaimed = useCallback(
    (sessionId) => claimedSessions.has(sessionId),
    [claimedSessions]
  );

  const value = { balance, getBalance, addCoins, deductCoins, isSessionClaimed };

  return <GameCoinContext.Provider value={value}>{children}</GameCoinContext.Provider>;
}

export function useGameCoins() {
  const ctx = useContext(GameCoinContext);
  if (!ctx) throw new Error('useGameCoins must be used within GameCoinProvider');
  return ctx;
}
