// Pure reward calculation, kept outside of any component so the same
// rule can later be re-run on a backend as the source of truth.
export function calculateReward(score, rewardRules) {
  const { minimumScore = 0, coinsPerPoint = 0, maxReward = 0 } = rewardRules || {};

  if (!Number.isFinite(score) || score < minimumScore) return 0;

  const raw = Math.round(score * coinsPerPoint);
  return Math.max(0, Math.min(raw, maxReward));
}
