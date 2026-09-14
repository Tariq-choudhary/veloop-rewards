import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiRotateCcw, FiPause, FiPlay, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import {
  GRID_SIZE,
  DIRECTIONS,
  createInitialWorm,
  randomFood,
  nextHead,
  isWallCollision,
  isSelfCollision,
  intervalForFoodCount,
  isOpposite,
} from './wormzyLogic.js';
import { getBestScore } from '../../utils/bestScore.js';
import styles from './Wormzy.module.css';

export default function Wormzy({ game, sessionId, resumeSnapshot, onGameOver }) {
  const [worm, setWorm] = useState(() => resumeSnapshot?.worm ?? createInitialWorm());
  const [food, setFood] = useState(() => resumeSnapshot?.food ?? randomFood(worm));
  const [score, setScore] = useState(() => resumeSnapshot?.score ?? 0);
  const [foodEaten, setFoodEaten] = useState(() => resumeSnapshot?.foodEaten ?? 0);
  const [paused, setPaused] = useState(false);
  const bestScore = getBestScore(game.id);

  const directionRef = useRef(resumeSnapshot?.direction ?? 'right');
  const queuedDirectionRef = useRef(directionRef.current);
  const wormRef = useRef(worm);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const foodEatenRef = useRef(foodEaten);
  const pausedRef = useRef(false);
  const gameOverFired = useRef(false);
  const timeoutRef = useRef(null);
  const touchStart = useRef(null);

  useEffect(() => { wormRef.current = worm; }, [worm]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { foodEatenRef.current = foodEaten; }, [foodEaten]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const endRound = useCallback(() => {
    if (gameOverFired.current) return;
    gameOverFired.current = true;
    const snapshot = {
      worm: wormRef.current,
      food: foodRef.current,
      direction: directionRef.current,
      score: scoreRef.current,
      foodEaten: foodEatenRef.current,
    };
    onGameOver(scoreRef.current, snapshot);
  }, [onGameOver]);

  const tick = useCallback(() => {
    if (pausedRef.current || gameOverFired.current) {
      timeoutRef.current = setTimeout(tick, intervalForFoodCount(foodEatenRef.current));
      return;
    }

    if (!isOpposite(queuedDirectionRef.current, directionRef.current) || wormRef.current.length === 1) {
      directionRef.current = queuedDirectionRef.current;
    }

    const head = nextHead(wormRef.current, directionRef.current);

    if (isWallCollision(head) || isSelfCollision(head, wormRef.current)) {
      endRound();
      return;
    }

    const ateFood = foodRef.current && head.x === foodRef.current.x && head.y === foodRef.current.y;
    const newWorm = [head, ...wormRef.current];
    if (!ateFood) newWorm.pop();

    setWorm(newWorm);
    wormRef.current = newWorm;

    if (ateFood) {
      const gained = 10;
      setScore((s) => s + gained);
      scoreRef.current += gained;
      setFoodEaten((n) => n + 1);
      foodEatenRef.current += 1;
      const nextFood = randomFood(newWorm);
      setFood(nextFood);
      foodRef.current = nextFood;
      if (!nextFood) {
        // Board full — the player has effectively won the round.
        endRound();
        return;
      }
    }

    timeoutRef.current = setTimeout(tick, intervalForFoodCount(foodEatenRef.current));
  }, [endRound]);

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, intervalForFoodCount(foodEatenRef.current));
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDirection = useCallback((dir) => {
    queuedDirectionRef.current = dir;
  }, []);

  useEffect(() => {
    function handleKey(e) {
      const map = {
        ArrowUp: 'up', w: 'up', W: 'up',
        ArrowDown: 'down', s: 'down', S: 'down',
        ArrowLeft: 'left', a: 'left', A: 'left',
        ArrowRight: 'right', d: 'right', D: 'right',
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        setDirection(dir);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setDirection]);

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
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? 'right' : 'left');
    } else {
      setDirection(dy > 0 ? 'down' : 'up');
    }
  }

  function handleRestart() {
    gameOverFired.current = false;
    const fresh = createInitialWorm();
    setWorm(fresh);
    wormRef.current = fresh;
    const freshFood = randomFood(fresh);
    setFood(freshFood);
    foodRef.current = freshFood;
    setScore(0);
    scoreRef.current = 0;
    setFoodEaten(0);
    foodEatenRef.current = 0;
    directionRef.current = 'right';
    queuedDirectionRef.current = 'right';
    setPaused(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(tick, intervalForFoodCount(0));
  }

  const wormSet = new Set(worm.map((s) => `${s.x},${s.y}`));

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
          <button className={styles.iconBtn} aria-label={paused ? 'Resume' : 'Pause'} onClick={() => setPaused((v) => !v)}>
            {paused ? <FiPlay /> : <FiPause />}
          </button>
          <button className={styles.iconBtn} aria-label="Restart" onClick={handleRestart}>
            <FiRotateCcw />
          </button>
        </div>
      </div>

      <div
        className={styles.board}
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="group"
        aria-label="Wormzy arena"
      >
        {paused && (
          <div className={styles.pauseOverlay}>
            <p>Paused</p>
            <button className="veloop-btn veloop-btn-primary" onClick={() => setPaused(false)}>Resume</button>
          </div>
        )}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isHead = worm[0].x === x && worm[0].y === y;
          const isBody = !isHead && wormSet.has(`${x},${y}`);
          const isFood = food && food.x === x && food.y === y;
          return (
            <div
              key={i}
              className={`${styles.cell} ${isHead ? styles.head : ''} ${isBody ? styles.body : ''} ${isFood ? styles.food : ''}`}
            />
          );
        })}
      </div>

      <div className={styles.dpad} aria-hidden="false">
        <button className={styles.dpadBtn} style={{ gridArea: 'up' }} aria-label="Move up" onClick={() => setDirection('up')}>
          <FiArrowUp />
        </button>
        <button className={styles.dpadBtn} style={{ gridArea: 'left' }} aria-label="Move left" onClick={() => setDirection('left')}>
          <FiArrowLeft />
        </button>
        <button className={styles.dpadBtn} style={{ gridArea: 'right' }} aria-label="Move right" onClick={() => setDirection('right')}>
          <FiArrowRight />
        </button>
        <button className={styles.dpadBtn} style={{ gridArea: 'down' }} aria-label="Move down" onClick={() => setDirection('down')}>
          <FiArrowDown />
        </button>
      </div>

      <p className={styles.hint}>Swipe, use arrow keys / WASD, or the pad below to steer.</p>
    </div>
  );
}
