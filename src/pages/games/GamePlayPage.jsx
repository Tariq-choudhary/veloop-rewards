import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameBySlug } from '../../data/gamesData.js';
import { useGameSession, SESSION_STATUS } from '../../context/GameSessionContext.jsx';
import MergeMaster from '../../games/merge-master/MergeMaster.jsx';
import Wormzy from '../../games/wormzy/Wormzy.jsx';
import styles from './GamePlayPage.module.css';

const GAME_COMPONENTS = {
  'merge-master': MergeMaster,
  wormzy: Wormzy,
};

function readSnapshot(sessionId) {
  if (!sessionId) return null;
  try {
    const raw = sessionStorage.getItem(`veloopSnapshot:${sessionId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function GamePlayPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = getGameBySlug(gameId);
  const { session, beginPlaying, endGame } = useGameSession();
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!game || game.status !== 'playable') {
      navigate('/games', { replace: true });
      return;
    }

    // A session must already exist by the time we reach /play — it's
    // created by the Play Now gate (useGameEntry) once Tokens are paid,
    // or by Play Again / Revive on the result page. Arriving here with
    // no matching session (e.g. a direct URL visit) means entry was
    // never paid for, so send the player back to pay it properly.
    if (!session || session.gameId !== game.id) {
      navigate(`/games/${game.slug}`, { replace: true });
      return;
    }
    if (session.status === SESSION_STATUS.STARTED) {
      beginPlaying(game.rewardRules.maxRevives);
    }
    initialized.current = true;
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id]);

  if (!game || !ready || !session) return null;

  const GameComponent = GAME_COMPONENTS[game.slug];
  if (!GameComponent) {
    navigate(`/games/${game.slug}`, { replace: true });
    return null;
  }

  const isResuming = session.status === SESSION_STATUS.REVIVED;
  const snapshot = isResuming ? readSnapshot(session.sessionId) : null;

  function handleGameOver(finalScore, snapshotToSave) {
    if (snapshotToSave) {
      try {
        sessionStorage.setItem(
          `veloopSnapshot:${session.sessionId}`,
          JSON.stringify(snapshotToSave)
        );
      } catch {
        /* storage full or unavailable — non-critical for the prototype */
      }
    }
    endGame(finalScore);
    navigate(`/games/${game.slug}/result`);
  }

  return (
    <main className={styles.page} style={{ '--accent': game.theme.accent }}>
      <GameComponent
        game={game}
        sessionId={session.sessionId}
        resumeSnapshot={snapshot}
        onGameOver={handleGameOver}
      />
    </main>
  );
}
