import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getGiveawayBySlug, GIVEAWAY_STATUS } from '../../data/giveawayData.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGiveaways } from '../../context/GiveawayContext.jsx';
import { useGiveawayEntry } from '../../hooks/useGiveawayEntry.js';
import Countdown from '../../components/giveaways/Countdown/Countdown.jsx';
import ClaimModal from '../../components/giveaways/ClaimModal/ClaimModal.jsx';
import styles from './GiveawayDetailsPage.module.css';

export default function GiveawayDetailsPage() {
  const { slug } = useParams();
  const giveaway = getGiveawayBySlug(slug);

  const { user, isLoggedIn } = useAuth();
  const { veBalance, sveBalance, getEntriesForGiveaway, isPrizeClaimed } = useGiveaways();
  const { attemptEntry, insufficientId } = useGiveawayEntry();

  // SVE is only offered when the giveaway actually has an SVE cost.
  const availableCurrencies = giveaway
    ? ['ve', giveaway.entryCost.sve > 0 ? 'sve' : null].filter(Boolean)
    : ['ve'];

  const [currency, setCurrency] = useState(availableCurrencies[0]);
  const [quantity, setQuantity] = useState(1);
  const [justEntered, setJustEntered] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  if (!giveaway) {
    return <Navigate to="/giveaways" replace />;
  }

  const isEnded = giveaway.status === GIVEAWAY_STATUS.ENDED;
  // Demo-level "did I win" check: no draw/backend exists yet, so this
  // matches the winner's stored name against the signed-in display name.
  const iWon = isEnded && !!giveaway.winner && isLoggedIn && user.name.toLowerCase() === giveaway.winner.name.toLowerCase();
  const claimed = isPrizeClaimed(giveaway.id);

  const costPerEntry = giveaway.entryCost[currency];
  const balance = currency === 've' ? veBalance : sveBalance;
  const myEntries = getEntriesForGiveaway(giveaway.id);

  // How many entries the user has already submitted in this currency,
  // derived from the VE/SVE amount already spent on this giveaway.
  const myEntryCount = costPerEntry > 0 ? Math.round(myEntries[currency] / costPerEntry) : 0;
  const remainingAllowed = Math.max(0, giveaway.maxEntriesPerUser - myEntryCount);
  const atCap = remainingAllowed <= 0;

  const totalCost = costPerEntry * quantity;
  const canAfford = balance >= totalCost;
  const isInsufficient = insufficientId === giveaway.id;

  const handleCurrencyChange = (next) => {
    setCurrency(next);
    setQuantity(1);
  };

  const handleEnter = () => {
    if (atCap) return;
    const ok = attemptEntry(giveaway, { currency, quantity });
    if (ok) {
      setJustEntered(true);
      setTimeout(() => setJustEntered(false), 3000);
      setQuantity(1);
    }
  };

  return (
    <main className={styles.page}>
      <Link to="/giveaways" className={styles.back}>
        ← All giveaways
      </Link>

      <section
        className={styles.hero}
        style={{ '--accent': giveaway.theme.accent, '--glow': giveaway.theme.glow }}
      >
        <div className={styles.banner} style={{ background: giveaway.banner }}>
          {giveaway.status === GIVEAWAY_STATUS.ENDING_SOON && (
            <span className={styles.endingTag}>Ending soon</span>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.category}>{giveaway.category}</span>
          <p className={styles.prize}>{giveaway.prizeValue}</p>
          <h1 className={styles.title}>{giveaway.title}</h1>
          <p className={styles.subtitle}>{giveaway.subtitle}</p>
          <p className={styles.description}>{giveaway.description}</p>

          <div className={styles.metaRow}>
            <Countdown endsAt={giveaway.endsAt} />
            <span className={styles.metaStat}>
              {giveaway.totalParticipants.toLocaleString()} entered
            </span>
          </div>
        </div>
      </section>

      {isEnded ? (
        <section className={styles.entryPanel}>
          <h2 className={styles.panelTitle}>This giveaway has ended</h2>
          {giveaway.winner ? (
            <p className={styles.myEntries}>Winner: {giveaway.winner.name}</p>
          ) : (
            <p className={styles.myEntries}>Winner announcement coming soon.</p>
          )}

          {iWon && (
            <button
              type="button"
              className={styles.enterBtn}
              onClick={() => setShowClaimModal(true)}
              disabled={claimed}
            >
              {claimed ? 'Prize claimed' : 'You won — claim your prize'}
            </button>
          )}
        </section>
      ) : (
        <section className={styles.entryPanel}>
          <h2 className={styles.panelTitle}>Enter this giveaway</h2>

          {availableCurrencies.length > 1 && (
            <div className={styles.currencyTabs}>
              {availableCurrencies.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.currencyTab} ${currency === c ? styles.currencyTabActive : ''}`}
                  onClick={() => handleCurrencyChange(c)}
                >
                  {c.toUpperCase()}s
                </button>
              ))}
            </div>
          )}

          <div className={styles.quantityRow}>
            <span className={styles.quantityLabel}>
              Entries ({costPerEntry} {currency.toUpperCase()} each)
            </span>
            <div className={styles.stepper}>
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(remainingAllowed || 1, q + 1))}
                disabled={atCap || quantity >= remainingAllowed}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.summaryRow}>
            <span>Cost</span>
            <strong>
              {totalCost} {currency.toUpperCase()}
              {totalCost !== 1 ? 's' : ''}
            </strong>
          </div>

          <div className={styles.summaryRow}>
            <span>Your balance</span>
            <strong>
              {balance} {currency.toUpperCase()}s
            </strong>
          </div>

          {(myEntries.ve > 0 || myEntries.sve > 0) && (
            <p className={styles.myEntries}>
              You're in with{' '}
              {myEntries.ve > 0 && (
                <>
                  {myEntries.ve} VE{myEntries.sve > 0 ? ' + ' : ''}
                </>
              )}
              {myEntries.sve > 0 && <>{myEntries.sve} SVE</>} so far.
            </p>
          )}

          {atCap && <p className={styles.error}>You've reached the max entries for this giveaway.</p>}
          {!atCap && isInsufficient && (
            <p className={styles.error}>Not enough {currency.toUpperCase()}s for that many entries.</p>
          )}
          {justEntered && <p className={styles.success}>Entry submitted — good luck!</p>}

          <button type="button" className={styles.enterBtn} onClick={handleEnter} disabled={atCap || !canAfford}>
            {atCap
              ? 'Max entries reached'
              : canAfford
              ? `Enter with ${totalCost} ${currency.toUpperCase()}${totalCost !== 1 ? 's' : ''}`
              : 'Not enough balance'}
          </button>
        </section>
      )}

      {showClaimModal && <ClaimModal giveaway={giveaway} onClose={() => setShowClaimModal(false)} />}
    </main>
  );
}
