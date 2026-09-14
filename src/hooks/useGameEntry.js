import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTokens } from '../context/TokenContext.jsx';
import { useGameSession } from '../context/GameSessionContext.jsx';

/**
 * Encapsulates the Play Now gate so it behaves identically whether it's
 * triggered from the carousel card or a game's own home page:
 *   check login -> check tokens -> deduct -> navigate to loading screen
 */
export function useGameEntry() {
  const navigate = useNavigate();
  const { isLoggedIn, requireLogin } = useAuth();
  const { hasEnough, spendTokens } = useTokens();
  const { startSession } = useGameSession();
  const [insufficientGameId, setInsufficientGameId] = useState(null);
  const clickLock = useRef(false);

  const attemptPlay = useCallback(
    (game) => {
      if (!game || game.status === 'coming-soon') return;
      if (clickLock.current) return; // guards rapid double clicks
      clickLock.current = true;
      setTimeout(() => {
        clickLock.current = false;
      }, 500);

      if (!isLoggedIn) {
        requireLogin(`/games/${game.slug}`);
        return;
      }

      if (!hasEnough(game.entryCost)) {
        setInsufficientGameId(game.id);
        setTimeout(() => setInsufficientGameId(null), 3200);
        return;
      }

      const spent = spendTokens(game.entryCost);
      if (!spent) {
        setInsufficientGameId(game.id);
        setTimeout(() => setInsufficientGameId(null), 3200);
        return;
      }

      // Tokens are paid exactly once, right here. Starting the session
      // now (rather than on the play page) lets the home page recognize
      // "already paid, not yet played" and skip charging a second time.
      startSession(game.id);
      navigate(`/games/${game.slug}/loading`);
    },
    [isLoggedIn, requireLogin, hasEnough, spendTokens, startSession, navigate]
  );

  return { attemptPlay, insufficientGameId };
}
