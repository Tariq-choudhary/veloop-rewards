import React, { useRef, useEffect, useState, useCallback } from 'react';
import GameCard from '../GameCard/GameCard.jsx';
import styles from './GameCarousel.module.css';

const AUTO_SCROLL_INTERVAL = 3200;
const RESUME_AFTER_INTERACTION = 4000;

export default function GameCarousel({ games, canAfford, onPlayNow }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);
  const autoScrollRef = useRef(null);

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      if (pausedRef.current) return;
      const track = trackRef.current;
      if (!track) return;

      const nextIndex = (activeIndex + 1) % games.length;
      scrollToIndex(nextIndex);
      setActiveIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(autoScrollRef.current);
  }, [activeIndex, games.length, scrollToIndex]);

  // Track which card is centered/leading, to drive the dots
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = null;
    const handleScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const children = Array.from(track.children);
        let closest = 0;
        let closestDist = Infinity;
        children.forEach((child, i) => {
          const dist = Math.abs(child.offsetLeft - track.scrollLeft - track.offsetLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
      });
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, []);

  const pauseAutoScroll = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_AFTER_INTERACTION);
  }, []);

  useEffect(() => () => resumeTimeoutRef.current && clearTimeout(resumeTimeoutRef.current), []);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        ref={trackRef}
        onPointerDown={pauseAutoScroll}
        onWheel={pauseAutoScroll}
        onTouchStart={pauseAutoScroll}
        role="list"
        aria-label="VELOOP games"
      >
        {games.map((game) => (
          <div role="listitem" key={game.id}>
            <GameCard game={game} canAfford={canAfford(game.entryCost)} onPlayNow={onPlayNow} />
          </div>
        ))}
      </div>

      <div className={styles.dots} role="tablist" aria-label="Carousel position">
        {games.map((game, i) => (
          <button
            key={game.id}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Go to ${game.name}`}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            onClick={() => {
              pauseAutoScroll();
              scrollToIndex(i);
              setActiveIndex(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}
