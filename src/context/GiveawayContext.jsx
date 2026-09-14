import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const GiveawayContext = createContext(null);

const VE_STORAGE_KEY = 'veloopVEs';
const SVE_STORAGE_KEY = 'veloopSVEs';
const ENTRIES_STORAGE_KEY = 'veloopGiveawayEntries';
const CLAIMED_STORAGE_KEY = 'veloopClaimedPrizes';

// Starter balances so the giveaways UI has something to interact with
// before any earn-VEs flow exists. Easy to change to 0 once that flow
// (or a dev-tools faucet) is wired up.
const DEFAULT_VE_BALANCE = 50;
const DEFAULT_SVE_BALANCE = 2;

function readBalance(key, fallback) {
  const raw = localStorage.getItem(key);
  const parsed = raw !== null ? Number(raw) : fallback;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function readEntries() {
  try {
    const raw = localStorage.getItem(ENTRIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function readClaimed() {
  try {
    const raw = localStorage.getItem(CLAIMED_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function GiveawayProvider({ children }) {
  const [veBalance, setVeBalance] = useState(() => readBalance(VE_STORAGE_KEY, DEFAULT_VE_BALANCE));
  const [sveBalance, setSveBalance] = useState(() => readBalance(SVE_STORAGE_KEY, DEFAULT_SVE_BALANCE));

  // Entries per giveaway: { [giveawayId]: { ve: number, sve: number } }
  const [entries, setEntries] = useState(readEntries);

  // Giveaway ids whose prize has already been claimed via ClaimModal.
  const [claimedPrizes, setClaimedPrizes] = useState(readClaimed);

  // Guards against a double "Enter" click firing two deductions before
  // the first state update has committed (same pattern as TokenContext).
  const spendLock = useRef(false);

  useEffect(() => {
    localStorage.setItem(VE_STORAGE_KEY, String(veBalance));
  }, [veBalance]);

  useEffect(() => {
    localStorage.setItem(SVE_STORAGE_KEY, String(sveBalance));
  }, [sveBalance]);

  useEffect(() => {
    localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(CLAIMED_STORAGE_KEY, JSON.stringify([...claimedPrizes]));
  }, [claimedPrizes]);

  const hasEnoughVEs = useCallback((amount) => veBalance >= amount, [veBalance]);
  const hasEnoughSVEs = useCallback((amount) => sveBalance >= amount, [sveBalance]);

  const addVEs = useCallback((amount) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setVeBalance((prev) => prev + amount);
  }, []);

  const addSVEs = useCallback((amount) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setSveBalance((prev) => prev + amount);
  }, []);

  /**
   * Enters a giveaway by spending VEs and/or SVEs together. Mirrors
   * TokenContext's spend-lock pattern so a double click on "Enter"
   * can't deduct twice before state commits. Returns true only if the
   * spend actually went through.
   */
  const enterGiveaway = useCallback(
    (giveawayId, { ve = 0, sve = 0 } = {}) => {
      if (!giveawayId) return false;
      if (ve <= 0 && sve <= 0) return false;
      if (spendLock.current) return false;
      if (veBalance < ve || sveBalance < sve) return false;

      spendLock.current = true;
      if (ve > 0) setVeBalance((prev) => (prev >= ve ? prev - ve : prev));
      if (sve > 0) setSveBalance((prev) => (prev >= sve ? prev - sve : prev));

      setEntries((prev) => {
        const current = prev[giveawayId] || { ve: 0, sve: 0 };
        return {
          ...prev,
          [giveawayId]: { ve: current.ve + ve, sve: current.sve + sve },
        };
      });

      // Release the lock on the next tick so a later, legitimate entry
      // isn't blocked forever.
      setTimeout(() => {
        spendLock.current = false;
      }, 400);
      return true;
    },
    [veBalance, sveBalance]
  );

  /**
   * Generic VE spend, not tied to a giveaway entry — used by the
   * Withdraw flow. Same spend-lock guard as enterGiveaway.
   */
  const spendVEs = useCallback(
    (amount) => {
      if (!amount || amount <= 0) return false;
      if (spendLock.current) return false;
      if (veBalance < amount) return false;

      spendLock.current = true;
      setVeBalance((prev) => (prev >= amount ? prev - amount : prev));
      setTimeout(() => {
        spendLock.current = false;
      }, 400);
      return true;
    },
    [veBalance]
  );

  const getEntriesForGiveaway = useCallback(
    (giveawayId) => entries[giveawayId] || { ve: 0, sve: 0 },
    [entries]
  );

  const hasEnteredGiveaway = useCallback(
    (giveawayId) => {
      const e = entries[giveawayId];
      return !!e && (e.ve > 0 || e.sve > 0);
    },
    [entries]
  );

  /**
   * Marks a won prize as claimed. Idempotent per giveawayId, the same
   * way GameCoinContext.addCoins is idempotent per sessionId. Ready for
   * ClaimModal to call once that flow is built.
   */
  const claimPrize = useCallback((giveawayId) => {
    if (!giveawayId) return false;
    let claimed = false;
    setClaimedPrizes((prev) => {
      if (prev.has(giveawayId)) return prev;
      claimed = true;
      const next = new Set(prev);
      next.add(giveawayId);
      return next;
    });
    return claimed;
  }, []);

  const isPrizeClaimed = useCallback((giveawayId) => claimedPrizes.has(giveawayId), [claimedPrizes]);

  const value = {
    veBalance,
    sveBalance,
    hasEnoughVEs,
    hasEnoughSVEs,
    addVEs,
    addSVEs,
    spendVEs,
    enterGiveaway,
    getEntriesForGiveaway,
    hasEnteredGiveaway,
    claimPrize,
    isPrizeClaimed,
  };

  return <GiveawayContext.Provider value={value}>{children}</GiveawayContext.Provider>;
}

export function useGiveaways() {
  const ctx = useContext(GiveawayContext);
  if (!ctx) throw new Error('useGiveaways must be used within GiveawayProvider');
  return ctx;
}
