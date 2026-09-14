import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getLevelProgress } from '../data/levelData.js';

const LevelContext = createContext(null);

const XP_STORAGE_KEY = 'veloopXP';

// Starter XP so the dashboard opens mid-roadmap (Level 4) instead of
// zeroed out, same reasoning as GiveawayContext's starter VE/SVE balance.
const DEFAULT_XP = 5200;

function readXP() {
  const raw = localStorage.getItem(XP_STORAGE_KEY);
  const parsed = raw !== null ? Number(raw) : DEFAULT_XP;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_XP;
}

export function LevelProvider({ children }) {
  const [totalXP, setTotalXP] = useState(readXP);

  useEffect(() => {
    localStorage.setItem(XP_STORAGE_KEY, String(totalXP));
  }, [totalXP]);

  // Not used by the core dashboard yet, but ready for EarnMoreXP /
  // PlayAndEarn / XPActivity once those are wired in.
  const addXP = useCallback((amount) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setTotalXP((prev) => prev + amount);
  }, []);

  const progress = useMemo(() => getLevelProgress(totalXP), [totalXP]);

  const value = { totalXP, addXP, ...progress };

  return <LevelContext.Provider value={value}>{children}</LevelContext.Provider>;
}

export function useLevel() {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error('useLevel must be used within LevelProvider');
  return ctx;
}
