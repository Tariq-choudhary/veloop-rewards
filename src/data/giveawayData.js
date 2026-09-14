// Centralized, data-driven giveaway catalog.
// Mirrors the shape of gamesData.js: one flat array of giveaways plus
// lookup helpers, so components stay dumb and just render what's here.
//
// Currency model: giveaways are entered with VEs (Veloop Entries) and
// SVEs (Super Veloop Entries) — NOT Tokens or Game Coins. Those two
// currencies belong to GiveawayContext and are intentionally separate
// from the games economy. SVE_WEIGHT below is how much more an SVE
// entry counts for in the draw odds vs. a plain VE entry; it's just
// display/odds math, not a currency conversion.

export const GIVEAWAY_STATUS = {
  ACTIVE: 'active',
  ENDING_SOON: 'ending-soon',
  ENDED: 'ended',
};

export const GIVEAWAY_CATEGORY = {
  TECH: 'Tech',
  GIFT_CARD: 'Gift Card',
};

// How many VE-equivalent draw weight one SVE is worth. Used by odds/stat
// displays later (GiveawayStats, GiveawayCard) — not by the context.
export const SVE_WEIGHT = 10;

export const giveawaysData = [
  {
    id: 'iphone-15-pro',
    slug: 'iphone-15-pro',
    title: 'iPhone 15 Pro',
    subtitle: '256GB · Natural Titanium',
    prizeValue: '$999',
    prizeValueNumeric: 999,
    category: GIVEAWAY_CATEGORY.TECH,
    banner: 'linear-gradient(135deg, #1a1f2e 0%, #2d3450 55%, #33e0c2 130%)',
    theme: { accent: '#33e0c2', accentSoft: '#9df5e5', glow: 'rgba(51, 224, 194, 0.35)' },
    description:
      'The flagship iPhone with a titanium build, A17 Pro chip, and the best camera system Apple has shipped yet.',
    endsAt: '2026-10-15T23:59:59Z',
    status: GIVEAWAY_STATUS.ACTIVE,
    entryCost: { ve: 10, sve: 1 },
    maxEntriesPerUser: 50,
    totalEntries: 18420,
    totalParticipants: 3110,
    winner: null,
  },
  {
    id: 'apple-watch',
    slug: 'apple-watch',
    title: 'Apple Watch Series 10',
    subtitle: '46mm · GPS + Cellular',
    prizeValue: '$399',
    prizeValueNumeric: 399,
    category: GIVEAWAY_CATEGORY.TECH,
    banner: 'linear-gradient(135deg, #1c1a2e 0%, #3a2d50 55%, #f2b544 130%)',
    theme: { accent: '#f2b544', accentSoft: '#f7ce7c', glow: 'rgba(242, 181, 68, 0.35)' },
    description:
      'Stay on top of every workout and notification with Apple\u2019s latest cellular-ready Watch.',
    endsAt: '2026-09-30T23:59:59Z',
    status: GIVEAWAY_STATUS.ACTIVE,
    entryCost: { ve: 8, sve: 1 },
    maxEntriesPerUser: 50,
    totalEntries: 9870,
    totalParticipants: 1840,
    winner: null,
  },
  {
    id: 'airpods',
    slug: 'airpods',
    title: 'AirPods Pro (2nd Gen)',
    subtitle: 'USB-C · Active Noise Cancelling',
    prizeValue: '$249',
    prizeValueNumeric: 249,
    category: GIVEAWAY_CATEGORY.TECH,
    banner: 'linear-gradient(135deg, #14192b 0%, #27304f 55%, #ff6b5e 130%)',
    theme: { accent: '#ff6b5e', accentSoft: '#ffb199', glow: 'rgba(255, 107, 94, 0.35)' },
    description: 'Adaptive audio, best-in-class noise cancelling, and all-day battery.',
    endsAt: '2026-09-20T23:59:59Z',
    status: GIVEAWAY_STATUS.ENDING_SOON,
    entryCost: { ve: 5, sve: 1 },
    maxEntriesPerUser: 40,
    totalEntries: 7220,
    totalParticipants: 1510,
    winner: null,
  },
  {
    id: 'amazon-2000',
    slug: 'amazon-2000',
    title: '$2,000 Amazon Gift Card',
    subtitle: 'Spend it on anything, no expiry',
    prizeValue: '$2,000',
    prizeValueNumeric: 2000,
    category: GIVEAWAY_CATEGORY.GIFT_CARD,
    banner: 'linear-gradient(135deg, #171a28 0%, #232a45 55%, #33e0c2 130%)',
    theme: { accent: '#33e0c2', accentSoft: '#9df5e5', glow: 'rgba(51, 224, 194, 0.35)' },
    description: 'The big one. One winner walks away with a $2,000 Amazon balance.',
    endsAt: '2026-11-01T23:59:59Z',
    status: GIVEAWAY_STATUS.ACTIVE,
    entryCost: { ve: 15, sve: 1 },
    maxEntriesPerUser: 60,
    totalEntries: 24310,
    totalParticipants: 4290,
    winner: null,
  },
  {
    id: 'amazon-500',
    slug: 'amazon-500',
    title: '$500 Amazon Gift Card',
    subtitle: 'Spend it on anything, no expiry',
    prizeValue: '$500',
    prizeValueNumeric: 500,
    category: GIVEAWAY_CATEGORY.GIFT_CARD,
    banner: 'linear-gradient(135deg, #171a28 0%, #232a45 55%, #f2b544 130%)',
    theme: { accent: '#f2b544', accentSoft: '#f7ce7c', glow: 'rgba(242, 181, 68, 0.35)' },
    description: 'A mid-size Amazon gift card giveaway with a lower entry cost.',
    endsAt: '2026-10-05T23:59:59Z',
    status: GIVEAWAY_STATUS.ACTIVE,
    entryCost: { ve: 5, sve: 1 },
    maxEntriesPerUser: 50,
    totalEntries: 11540,
    totalParticipants: 2260,
    winner: null,
  },
  {
    id: 'amazon-20',
    slug: 'amazon-20',
    title: '$20 Amazon Gift Card',
    subtitle: 'Quick weekly giveaway',
    prizeValue: '$20',
    prizeValueNumeric: 20,
    category: GIVEAWAY_CATEGORY.GIFT_CARD,
    banner: 'linear-gradient(135deg, #171a28 0%, #232a45 55%, #7986ff 130%)',
    theme: { accent: '#7986ff', accentSoft: '#b7bcff', glow: 'rgba(121, 134, 255, 0.35)' },
    description: 'A fast, low-cost weekly giveaway \u2014 great for trying VEs out.',
    endsAt: '2026-09-14T23:59:59Z',
    status: GIVEAWAY_STATUS.ENDING_SOON,
    entryCost: { ve: 1, sve: 0 },
    maxEntriesPerUser: 20,
    totalEntries: 5390,
    totalParticipants: 2010,
    winner: null,
  },
];

// Site-wide numbers for GiveawayStats / TrustSection. Historical, so
// independent of the live giveawaysData totals above.
export const giveawayStats = {
  totalValueAwarded: '$48,200',
  totalWinners: 214,
  totalEntriesAllTime: 182400,
  activeGiveaways: giveawaysData.filter((g) => g.status !== GIVEAWAY_STATUS.ENDED).length,
};

// Past winners for the Winners / TrustSection components. Independent of
// the six live giveaways above (those haven't ended yet).
export const recentWinners = [
  { id: 'w1', name: 'Amara O.', prizeTitle: 'iPhone 14 Pro', prizeValue: '$899', date: '2026-08-20', entryType: 'sve' },
  { id: 'w2', name: 'Diego R.', prizeTitle: '$500 Amazon Gift Card', prizeValue: '$500', date: '2026-08-12', entryType: 've' },
  { id: 'w3', name: 'Priya K.', prizeTitle: 'AirPods Pro', prizeValue: '$249', date: '2026-08-05', entryType: 've' },
  { id: 'w4', name: 'Liam T.', prizeTitle: '$2,000 Amazon Gift Card', prizeValue: '$2,000', date: '2026-07-22', entryType: 'sve' },
  { id: 'w5', name: 'Sofia M.', prizeTitle: 'Apple Watch Series 9', prizeValue: '$379', date: '2026-07-10', entryType: 've' },
  { id: 'w6', name: 'Noah B.', prizeTitle: '$20 Amazon Gift Card', prizeValue: '$20', date: '2026-07-01', entryType: 've' },
];

export const howItWorksSteps = [
  {
    id: 'earn',
    title: 'Earn VEs',
    description: 'Collect Veloop Entries (VEs) by playing games and completing everyday actions on VELOOP.',
  },
  {
    id: 'boost',
    title: 'Boost with SVEs',
    description: 'Super Veloop Entries (SVEs) carry much more weight in the draw for the giveaways that matter most to you.',
  },
  {
    id: 'enter',
    title: 'Enter a giveaway',
    description: 'Spend VEs or SVEs on any live giveaway. More entries improve your odds \u2014 there\u2019s no cap on how many you use.',
  },
  {
    id: 'win',
    title: 'Winners are drawn',
    description: 'When the countdown ends, a winner is drawn at random, weighted by total entries. Winners are notified and can claim their prize.',
  },
];

export const giveawayRules = [
  'One VELOOP account per person. Duplicate accounts will be disqualified.',
  'Entries must be submitted before the countdown for that giveaway reaches zero.',
  'Winners are selected at random, weighted by the number and type of entries submitted.',
  'SVEs count for more draw weight than VEs but do not guarantee a win.',
  'Winners will be notified in-app and must claim their prize within 14 days.',
  'VELOOP reserves the right to substitute a prize of equal or greater value if the original becomes unavailable.',
];

export const faqData = [
  {
    id: 'faq-1',
    question: 'What\u2019s the difference between a VE and an SVE?',
    answer:
      'VEs (Veloop Entries) are the standard giveaway currency you earn through regular play. SVEs (Super Veloop Entries) are a rarer, higher-value entry that counts for significantly more draw weight.',
  },
  {
    id: 'faq-2',
    question: 'How do I get VEs and SVEs?',
    answer:
      'VEs are earned through everyday activity on VELOOP. SVEs are awarded less frequently, usually for standout achievements or milestones.',
  },
  {
    id: 'faq-3',
    question: 'Do unused entries roll over?',
    answer: 'Your VE and SVE balances carry over between giveaways \u2014 only entries you\u2019ve already spent on a giveaway are locked in.',
  },
  {
    id: 'faq-4',
    question: 'How are winners chosen?',
    answer: 'Winners are drawn at random once a giveaway\u2019s countdown ends, weighted by how many entries were submitted.',
  },
  {
    id: 'faq-5',
    question: 'How do I claim a prize if I win?',
    answer: 'You\u2019ll get an in-app notification with a claim window. Open the giveaway and follow the claim steps before the deadline.',
  },
];

export const trustBadges = [
  { id: 'verified', label: 'Verified draws', description: 'Every giveaway is drawn and logged the same way, every time.' },
  { id: 'real-winners', label: 'Real winners', description: `${giveawayStats.totalWinners}+ prizes awarded so far.` },
  { id: 'no-purchase', label: 'No purchase necessary', description: 'VEs are earned through play, never sold.' },
];

export function getGiveawayBySlug(slug) {
  return giveawaysData.find((g) => g.slug === slug) || null;
}

export function getActiveGiveaways() {
  return giveawaysData.filter((g) => g.status !== GIVEAWAY_STATUS.ENDED);
}

export function getEndedGiveaways() {
  return giveawaysData.filter((g) => g.status === GIVEAWAY_STATUS.ENDED);
}
