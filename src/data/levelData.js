// Central data/config layer for the Level Dashboard, mirroring the
// pattern used by giveawayData.js: flat config here, derived values
// computed by a helper, components stay dumb.
//
// Reward currencies intentionally reuse what already exists in the app
// (VEs/SVEs from GiveawayContext, Game Coins from GameCoinContext)
// rather than inventing a new "Gems"/"Spins" currency.

export const LEVEL_NAMES = [
  'Newcomer',
  'Explorer',
  'Achiever',
  'Voyager',
  'Champion',
  'Elite',
  'Master',
  'Legend',
];

export const REWARD_CURRENCY = {
  VE: 've',
  SVE: 'sve',
  GAME_COINS: 'gameCoins',
};

export const REWARD_LABEL = {
  ve: 'VE',
  sve: 'SVE',
  gameCoins: 'Game Coins',
};

// xpThreshold = cumulative total XP needed to REACH that level (level 1
// starts at 0). Everything else (current level, progress %, next reward)
// is derived from a single totalXP number via getLevelProgress().
export const levelRoadmap = [
  { level: 1, name: LEVEL_NAMES[0], xpThreshold: 0, reward: { currency: 've', amount: 100 } },
  { level: 2, name: LEVEL_NAMES[1], xpThreshold: 1000, reward: { currency: 've', amount: 150 } },
  { level: 3, name: LEVEL_NAMES[2], xpThreshold: 2500, reward: { currency: 'gameCoins', amount: 50 } },
  { level: 4, name: LEVEL_NAMES[3], xpThreshold: 4500, reward: { currency: 'gameCoins', amount: 75 } },
  { level: 5, name: LEVEL_NAMES[4], xpThreshold: 7000, reward: { currency: 've', amount: 500 } },
  { level: 6, name: LEVEL_NAMES[5], xpThreshold: 10000, reward: { currency: 'sve', amount: 2 } },
  { level: 7, name: LEVEL_NAMES[6], xpThreshold: 14000, reward: { currency: 've', amount: 900 } },
  { level: 8, name: LEVEL_NAMES[7], xpThreshold: 19000, reward: { currency: 'sve', amount: 4 } },
];

/**
 * Derives everything the dashboard needs from a single totalXP number:
 * current level, XP into the current level, XP needed for the next one,
 * progress percentage, and the next level's reward preview.
 */
export function getLevelProgress(totalXP) {
  let current = levelRoadmap[0];
  let next = levelRoadmap[1] || null;

  for (let i = 0; i < levelRoadmap.length; i += 1) {
    if (totalXP >= levelRoadmap[i].xpThreshold) {
      current = levelRoadmap[i];
      next = levelRoadmap[i + 1] || null;
    }
  }

  const xpIntoLevel = totalXP - current.xpThreshold;
  const xpForNextLevel = next ? next.xpThreshold - current.xpThreshold : 0;
  const progressPct = next ? Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100)) : 100;

  return {
    totalXP,
    currentLevel: current.level,
    currentLevelName: current.name,
    xpIntoLevel,
    xpForNextLevel,
    nextLevel: next ? next.level : null,
    nextLevelName: next ? next.name : null,
    nextLevelReward: next ? next.reward : null,
    progressPct,
    isMaxLevel: !next,
  };
}
