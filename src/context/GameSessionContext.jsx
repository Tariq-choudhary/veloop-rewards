import React, { createContext, useContext, useState, useCallback } from 'react';

const GameSessionContext = createContext(null);

export const SESSION_STATUS = {
  STARTED: 'STARTED',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
  REVIVED: 'REVIVED',
  COMPLETED: 'COMPLETED',
};

function makeSessionId(gameId) {
  return `${gameId}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function GameSessionProvider({ children }) {
  const [session, setSession] = useState(null);

  // Creates a brand new session every time a game is (re)started, so a
  // replay can never inherit a previous session's reward/revive state.
  const startSession = useCallback((gameId) => {
    const next = {
      sessionId: makeSessionId(gameId),
      gameId,
      startTime: Date.now(),
      score: 0,
      status: SESSION_STATUS.STARTED,
      reviveUsed: false,
      revivesRemaining: null, // set by the game once it knows maxRevives
      reward: 0,
      completed: false,
    };
    setSession(next);
    return next;
  }, []);

  const beginPlaying = useCallback((maxRevives = 0) => {
    setSession((prev) =>
      prev ? { ...prev, status: SESSION_STATUS.PLAYING, revivesRemaining: maxRevives } : prev
    );
  }, []);

  const updateScore = useCallback((score) => {
    setSession((prev) => (prev ? { ...prev, score: Math.max(prev.score, score) } : prev));
  }, []);

  const endGame = useCallback((finalScore) => {
    setSession((prev) =>
      prev
        ? {
            ...prev,
            score: Math.max(prev.score, finalScore),
            status: SESSION_STATUS.GAME_OVER,
          }
        : prev
    );
  }, []);

  // Returns true if a revive was actually granted (session existed and
  // still had revives left).
  const useRevive = useCallback(() => {
    let granted = false;
    setSession((prev) => {
      if (!prev || prev.revivesRemaining <= 0) return prev;
      granted = true;
      return {
        ...prev,
        reviveUsed: true,
        revivesRemaining: prev.revivesRemaining - 1,
        status: SESSION_STATUS.REVIVED,
      };
    });
    return granted;
  }, []);

  // Marks the session as finalized. Idempotent at the session-state
  // level; the actual coin grant idempotency lives in GameCoinContext
  // (keyed by sessionId) as a second line of defense.
  const completeSession = useCallback((reward) => {
    let didComplete = false;
    setSession((prev) => {
      if (!prev || prev.completed) return prev;
      didComplete = true;
      return { ...prev, completed: true, reward, status: SESSION_STATUS.COMPLETED };
    });
    return didComplete;
  }, []);

  const clearSession = useCallback(() => setSession(null), []);

  const value = {
    session,
    startSession,
    beginPlaying,
    updateScore,
    endGame,
    useRevive,
    completeSession,
    clearSession,
  };

  return <GameSessionContext.Provider value={value}>{children}</GameSessionContext.Provider>;
}

export function useGameSession() {
  const ctx = useContext(GameSessionContext);
  if (!ctx) throw new Error('useGameSession must be used within GameSessionProvider');
  return ctx;
}
