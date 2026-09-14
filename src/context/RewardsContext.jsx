import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTokens } from './TokenContext.jsx';
import { useGameCoins } from './GameCoinContext.jsx';
import { useGiveaways } from './GiveawayContext.jsx';
import { rewardSessions, redemptionOptions, WITHDRAWAL_MIN_VE } from '../data/rewardsData.js';

const RewardsContext = createContext(null);

const CLAIMED_SESSIONS_KEY = 'veloopClaimedRewardSessions';
const REDEMPTION_HISTORY_KEY = 'veloopRedemptionHistory';
const WITHDRAWAL_HISTORY_KEY = 'veloopWithdrawalHistory';
const HISTORY_LIMIT = 20;

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD, resets claims daily
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Composes TokenContext, GameCoinContext, and GiveawayContext to power
 * the Rewards / Redeem / Withdraw pages. Must be mounted inside all
 * three providers (see main.jsx).
 */
export function RewardsProvider({ children }) {
  const { addTokens } = useTokens();
  const { balance: coinBalance, deductCoins } = useGameCoins();
  const { veBalance, addVEs, addSVEs, spendVEs } = useGiveaways();

  const [claimedByDay, setClaimedByDay] = useState(() => readJSON(CLAIMED_SESSIONS_KEY, {}));
  const [redemptionHistory, setRedemptionHistory] = useState(() => readJSON(REDEMPTION_HISTORY_KEY, []));
  const [withdrawalHistory, setWithdrawalHistory] = useState(() => readJSON(WITHDRAWAL_HISTORY_KEY, []));

  useEffect(() => {
    localStorage.setItem(CLAIMED_SESSIONS_KEY, JSON.stringify(claimedByDay));
  }, [claimedByDay]);

  useEffect(() => {
    localStorage.setItem(REDEMPTION_HISTORY_KEY, JSON.stringify(redemptionHistory));
  }, [redemptionHistory]);

  useEffect(() => {
    localStorage.setItem(WITHDRAWAL_HISTORY_KEY, JSON.stringify(withdrawalHistory));
  }, [withdrawalHistory]);

  const claimedToday = claimedByDay[todayKey()] || [];

  const isSessionClaimed = useCallback((sessionId) => claimedToday.includes(sessionId), [claimedToday]);

  const claimSession = useCallback(
    (sessionId) => {
      const session = rewardSessions.find((s) => s.id === sessionId);
      if (!session || claimedToday.includes(sessionId)) return false;

      addTokens(session.reward);
      setClaimedByDay((prev) => {
        const today = todayKey();
        return { ...prev, [today]: [...(prev[today] || []), sessionId] };
      });
      return true;
    },
    [claimedToday, addTokens]
  );

  /**
   * Spends Game Coins on one of redemptionOptions, credits the output
   * currency, and logs it. Returns false if the coin balance is short.
   */
  const redeem = useCallback(
    (optionId) => {
      const option = redemptionOptions.find((o) => o.id === optionId);
      if (!option) return false;
      if (coinBalance < option.coinsCost) return false;

      const ok = deductCoins(option.coinsCost);
      if (!ok) return false;

      if (option.output.currency === 'tokens') addTokens(option.output.amount);
      else if (option.output.currency === 've') addVEs(option.output.amount);
      else if (option.output.currency === 'sve') addSVEs(option.output.amount);

      setRedemptionHistory((prev) =>
        [{ id: `${optionId}_${Date.now()}`, optionId, label: option.label, coinsCost: option.coinsCost, output: option.output, date: new Date().toISOString() }, ...prev].slice(0, HISTORY_LIMIT)
      );
      return true;
    },
    [coinBalance, deductCoins, addTokens, addVEs, addSVEs]
  );

  /**
   * Records a (dummy, local-only) withdrawal request and deducts the VE
   * balance immediately. No real payout happens — this mirrors the
   * reference dashboard's "dummy local data" withdraw flow.
   */
  const requestWithdrawal = useCallback(
    ({ amount, method, destination }) => {
      if (!amount || amount < WITHDRAWAL_MIN_VE) return false;
      if (veBalance < amount) return false;
      if (!destination || !destination.trim()) return false;

      const ok = spendVEs(amount);
      if (!ok) return false;

      setWithdrawalHistory((prev) =>
        [
          {
            id: `wd_${Date.now()}`,
            amount,
            method,
            destination: destination.trim(),
            status: 'Pending',
            date: new Date().toISOString(),
          },
          ...prev,
        ].slice(0, HISTORY_LIMIT)
      );
      return true;
    },
    [veBalance, spendVEs]
  );

  const value = {
    rewardSessions,
    isSessionClaimed,
    claimSession,
    redemptionOptions,
    redemptionHistory,
    redeem,
    withdrawalHistory,
    requestWithdrawal,
    withdrawalMinVE: WITHDRAWAL_MIN_VE,
  };

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
}

export function useRewards() {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error('useRewards must be used within RewardsProvider');
  return ctx;
}
