// Centralized, data-driven game catalog.
// To add a new game later: add an entry here (status: 'coming-soon' until
// its gameplay component exists), then wire its slug into GamePlayPage.jsx.

export const GAME_STATUS = {
  PLAYABLE: 'playable',
  COMING_SOON: 'coming-soon',
};

export const gamesData = [
  {
    id: 'merge-master',
    slug: 'merge-master',
    name: 'Merge Master',
    description: 'Merge matching blocks and chase your highest tile.',
    tagline: 'Merge blocks. Build your highest score.',
    banner: 'linear-gradient(135deg, #2a1f45 0%, #4a2f6d 55%, #ff6b5e 130%)',
    theme: {
      accent: '#ff6b5e',
      accentSoft: '#ffb199',
      glow: 'rgba(255, 107, 94, 0.35)',
    },
    entryCost: 20,
    entryCurrency: 'tokens',
    gameType: 'grid-merge',
    difficulty: 'Medium',
    status: GAME_STATUS.PLAYABLE,
    rewardRules: {
      minimumScore: 20,
      coinsPerPoint: 0.05,
      maxReward: 150,
      reviveCostCoins: 30,
      maxRevives: 1,
    },
    instructions: {
      objective: 'Combine tiles of the same number to reach the highest value you can before the board fills up.',
      controls: 'Swipe or use arrow keys / WASD to slide all tiles in one direction.',
      rules: [
        'Tiles with the same number merge into one when they collide.',
        'A new tile appears after every move.',
        'The game ends when no more merges or moves are possible.',
      ],
      scoring: 'Each merge adds the resulting tile value to your score.',
      rewardExplanation: 'Game Coins are earned based on your final score, up to a maximum per run.',
      gameOverCondition: 'The board is full and no adjacent tiles can merge.',
    },
  },
  {
    id: 'wormzy',
    slug: 'wormzy',
    name: 'Wormzy',
    description: 'Guide your worm, eat, grow, and dodge your own tail.',
    tagline: 'Eat, grow, and outlast the arena.',
    banner: 'linear-gradient(135deg, #0f3d33 0%, #145c4a 55%, #33e0c2 130%)',
    theme: {
      accent: '#33e0c2',
      accentSoft: '#9df5e5',
      glow: 'rgba(51, 224, 194, 0.35)',
    },
    entryCost: 20,
    entryCurrency: 'tokens',
    gameType: 'arcade-snake',
    difficulty: 'Easy',
    status: GAME_STATUS.PLAYABLE,
    rewardRules: {
      minimumScore: 10,
      coinsPerPoint: 1.5,
      maxReward: 150,
      reviveCostCoins: 30,
      maxRevives: 1,
    },
    instructions: {
      objective: 'Eat as much food as possible to grow your worm and rack up score.',
      controls: 'Arrow keys / WASD on desktop, swipe or the on-screen pad on mobile.',
      rules: [
        'The worm moves continuously in the direction you set.',
        'Eating food grows the worm and increases your score.',
        'Speed increases gradually the longer you survive.',
        'Colliding with the wall or your own tail ends the game.',
      ],
      scoring: 'Each food item eaten adds points to your score.',
      rewardExplanation: 'Game Coins are earned based on your final score, up to a maximum per run.',
      gameOverCondition: 'The worm hits the arena wall or its own body.',
    },
  },
  ...[
    { id: 'block-blitz', name: 'Block Blitz', desc: 'Clear rows before the stack tops out.', c: '#5b6dff' },
    { id: 'coin-cascade', name: 'Coin Cascade', desc: 'Line up falling coins for combo payouts.', c: '#f2b544' },
    { id: 'sky-runner', name: 'Sky Runner', desc: 'Dash and jump across drifting platforms.', c: '#4fc3f7' },
    { id: 'puzzle-vault', name: 'Puzzle Vault', desc: 'Crack sliding-tile vaults against the clock.', c: '#b06ae0' },
    { id: 'star-sweep', name: 'Star Sweep', desc: 'Sweep constellations before they fade.', c: '#7986ff' },
    { id: 'tile-tactics', name: 'Tile Tactics', desc: 'Outmaneuver the board one tile at a time.', c: '#ff8a5c' },
    { id: 'reef-dash', name: 'Reef Dash', desc: 'Weave a current-swept reef at speed.', c: '#2fd3c7' },
    { id: 'gem-forge', name: 'Gem Forge', desc: 'Smelt matching gems into rare rewards.', c: '#e05c9c' },
    { id: 'orbit-drift', name: 'Orbit Drift', desc: 'Slingshot through asteroid fields.', c: '#8f7bff' },
    { id: 'quick-quiz', name: 'Quick Quiz', desc: 'Race the clock on rapid-fire trivia.', c: '#5cd66a' },
    { id: 'drift-racer', name: 'Drift Racer', desc: 'Chain perfect drifts around tight tracks.', c: '#ff5c7a' },
  ].map((g) => ({
    id: g.id,
    slug: g.id,
    name: g.name,
    description: g.desc,
    tagline: g.desc,
    banner: `linear-gradient(135deg, #171a28 0%, ${g.c}55 130%)`,
    theme: { accent: g.c, accentSoft: g.c, glow: `${g.c}55` },
    entryCost: 20,
    entryCurrency: 'tokens',
    gameType: 'coming-soon',
    difficulty: 'TBD',
    status: GAME_STATUS.COMING_SOON,
    rewardRules: { minimumScore: 0, coinsPerPoint: 0, maxReward: 0, reviveCostCoins: 0, maxRevives: 0 },
    instructions: {
      objective: 'This game is being polished and will unlock soon.',
      controls: '—',
      rules: [],
      scoring: '—',
      rewardExplanation: '—',
      gameOverCondition: '—',
    },
  })),
];

export function getGameBySlug(slug) {
  return gamesData.find((g) => g.slug === slug) || null;
}
