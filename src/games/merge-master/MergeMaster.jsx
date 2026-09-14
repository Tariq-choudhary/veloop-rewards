import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiRotateCcw, FiPause, FiPlay, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { startingGrid, move, addRandomTile, isGameOver } from './mergeLogic.js';
import { getBestScore } from '../../utils/bestScore.js';
import styles from './MergeMaster.module.css';

const TILE_COLORS = {
  2: '#2a2f45', 4: '#343a58', 8: '#ff8a5c', 16: '#ff6b5e',
  32: '#ff4f6d', 64: '#ff2e6d', 128: '#f2b544', 256: '#f7ce7c',
  512: '#33e0c2', 1024: '#9df5e5', 2048: '#ffd76b',
};

const SWIPE_THRESHOLD = 24;

export default function MergeMaster({ game, sessionId, resumeSnapshot, onGameOver }) {
  const [grid, setGrid] = useState(() => resumeSnapshot?.grid ?? startingGrid());
  const [score, setScore] = useState(() => resumeSnapshot?.score ?? 0);
  const [paused, setPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const bestScore = getBestScore(game.id);

  const gameOverFired = useRef(false);
  const touchStart = useRef(null);

  const applyMove = useCallback(
    (direction) => {
      if (paused || gameOverFired.current) return;
      setGrid((prevGrid) => {
        const { grid: movedGrid, gained, moved } = move(prevGrid, direction);
        if (!moved) return prevGrid;

        const withNewTile = addRandomTile(movedGrid);
        if (gained > 0) setScore((s) => s + gained);

        if (isGameOver(withNewTile) && !gameOverFired.current) {
          gameOverFired.current = true;
          const finalScore = score + gained;
          setTimeout(() => {
            onGameOver(finalScore, { grid: withNewTile, score: finalScore });
          }, 350);
        }
        return withNewTile;
      });
    },
    [paused, onGameOver, score]
  );

  useEffect(() => {
    function handleKey(e) {
      const map = {
        ArrowLeft: 'left', a: 'left', A: 'left',
        ArrowRight: 'right', d: 'right', D: 'right',
        ArrowUp: 'up', w: 'up', W: 'up',
        ArrowDown: 'down', s: 'down', S: 'down',
      };
      const direction = map[e.key];
      if (direction) {
        e.preventDefault();
        applyMove(direction);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [applyMove]);

  function handleTouchStart(e) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e) {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      applyMove(dx > 0 ? 'right' : 'left');
    } else {
      applyMove(dy > 0 ? 'down' : 'up');
    }
  }

  function handleRestart() {
    gameOverFired.current = false;
    setGrid(startingGrid());
    setScore(0);
    setPaused(false);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.hud}>
        <div className={styles.hudStat}>
          <span className={styles.hudLabel}>Score</span>
          <span className={styles.hudValue}>{score}</span>
        </div>
        <div className={styles.hudStat}>
          <span className={styles.hudLabel}>Best</span>
          <span className={styles.hudValue}>{Math.max(bestScore, score)}</span>
        </div>
        <div className={styles.hudControls}>
          <button
            className={styles.iconBtn}
            aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
            aria-pressed={soundOn}
            onClick={() => setSoundOn((v) => !v)}
          >
            {soundOn ? <FiVolume2 /> : <FiVolumeX />}
          </button>
          <button
            className={styles.iconBtn}
            aria-label={paused ? 'Resume' : 'Pause'}
            onClick={() => setPaused((v) => !v)}
          >
            {paused ? <FiPlay /> : <FiPause />}
          </button>
          <button className={styles.iconBtn} aria-label="Restart" onClick={handleRestart}>
            <FiRotateCcw />
          </button>
        </div>
      </div>

      <div
        className={styles.board}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="group"
        aria-label="Merge Master board"
      >
        {paused && (
          <div className={styles.pauseOverlay}>
            <p>Paused</p>
            <button className="veloop-btn veloop-btn-primary" onClick={() => setPaused(false)}>
              Resume
            </button>
          </div>
        )}
        {grid.map((row, r) =>
          row.map((value, c) => (
            <div key={`${r}-${c}`} className={styles.cell}>
              {value !== 0 && (
                <div
                  className={styles.tile}
                  style={{
                    background: TILE_COLORS[value] || '#ffd76b',
                    color: value <= 4 ? 'var(--text-primary)' : '#1a1305',
                    fontSize: value >= 1000 ? '1.05rem' : '1.3rem',
                  }}
                >
                  {value}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <p className={styles.hint}>Swipe or use arrow keys / WASD to merge matching tiles.</p>
    </div>
  );
}
