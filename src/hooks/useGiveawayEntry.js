import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGiveaways } from '../context/GiveawayContext.jsx';

/**
 * Encapsulates the "Enter" gate for a giveaway so it behaves identically
 * wherever it's triggered from: check login -> check balance -> spend.
 * Mirrors useGameEntry's shape (insufficient-state + click lock) but for
 * the VE/SVE giveaway currencies instead of Tokens.
 */
export function useGiveawayEntry() {
  const { isLoggedIn, requireLogin } = useAuth();
  const { hasEnoughVEs, hasEnoughSVEs, enterGiveaway } = useGiveaways();
  const [insufficientId, setInsufficientId] = useState(null);
  const clickLock = useRef(false);

  /**
   * @param {object} giveaway - a giveawayData entry
   * @param {{ currency: 've'|'sve', quantity: number }} entry - how many
   *   entries to submit; total cost is quantity * giveaway.entryCost[currency]
   * @returns {boolean} true if the entry went through
   */
  const attemptEntry = useCallback(
    (giveaway, { currency, quantity }) => {
      if (!giveaway || !quantity || quantity <= 0) return false;
      if (clickLock.current) return false; // guards rapid double clicks
      clickLock.current = true;
      setTimeout(() => {
        clickLock.current = false;
      }, 500);

      if (!isLoggedIn) {
        requireLogin(`/giveaway/${giveaway.slug}`);
        return false;
      }

      const costPerEntry = giveaway.entryCost[currency] || 0;
      if (costPerEntry <= 0) return false;
      const totalCost = costPerEntry * quantity;
      const affordable = currency === 've' ? hasEnoughVEs(totalCost) : hasEnoughSVEs(totalCost);

      if (!affordable) {
        setInsufficientId(giveaway.id);
        setTimeout(() => setInsufficientId(null), 3200);
        return false;
      }

      const payload = currency === 've' ? { ve: totalCost } : { sve: totalCost };
      const entered = enterGiveaway(giveaway.id, payload);
      if (!entered) {
        setInsufficientId(giveaway.id);
        setTimeout(() => setInsufficientId(null), 3200);
      }
      return entered;
    },
    [isLoggedIn, requireLogin, hasEnoughVEs, hasEnoughSVEs, enterGiveaway]
  );

  return { attemptEntry, insufficientId };
}
