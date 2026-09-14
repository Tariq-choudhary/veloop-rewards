const KEY_PREFIX = 'veloopBestScore:';

export function getBestScore(gameId) {
  const raw = localStorage.getItem(KEY_PREFIX + gameId);
  const parsed = raw !== null ? Number(raw) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function setBestScoreIfHigher(gameId, score) {
  const current = getBestScore(gameId);
  if (score > current) {
    localStorage.setItem(KEY_PREFIX + gameId, String(score));
    return score;
  }
  return current;
}
