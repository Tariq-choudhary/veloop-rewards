// Data layer for the Rewards / Redeem / Withdraw flow, mirroring the
// pattern used by gamesData.js and giveawayData.js: flat config here,
// balance changes handled by RewardsContext, components stay dumb.

// Three daily claimable windows that grant a Token boost. Claim state
// resets each calendar day (see RewardsContext).
export const rewardSessions = [
  {
    id: 'morning',
    label: 'Morning Boost',
    window: '06:00 – 12:00',
    description: 'Start the day with a token boost.',
    reward: 20,
  },
  {
    id: 'afternoon',
    label: 'Afternoon Boost',
    window: '12:00 – 18:00',
    description: 'Mid-day check-in for extra play power.',
    reward: 20,
  },
  {
    id: 'evening',
    label: 'Evening Boost',
    window: '18:00 – 23:59',
    description: 'Prime-time session with the best payout.',
    reward: 30,
  },
];

// Game Coin -> other-currency conversions offered in the Redeem Center.
// Reuses currencies that already exist elsewhere in the app (Tokens,
// VEs, SVEs) rather than inventing new ones like "Gems" or "Spins".
export const redemptionOptions = [
  {
    id: 'coins-to-tokens',
    label: 'Tokens',
    description: 'Convert Game Coins to Tokens',
    coinsCost: 40,
    output: { currency: 'tokens', amount: 20 },
  },
  {
    id: 'coins-to-ve',
    label: 'VEs',
    description: 'Convert Game Coins to Veloop Entries',
    coinsCost: 100,
    output: { currency: 've', amount: 10 },
  },
  {
    id: 'coins-to-sve',
    label: 'SVEs',
    description: 'Convert Game Coins to Super Veloop Entries',
    coinsCost: 400,
    output: { currency: 'sve', amount: 1 },
  },
];

export const WITHDRAWAL_MIN_VE = 50;

export const withdrawalMethods = [
  { id: 'upi', label: 'UPI', placeholder: 'yourname@upi' },
  { id: 'bank', label: 'Bank transfer', placeholder: 'Account number' },
];
