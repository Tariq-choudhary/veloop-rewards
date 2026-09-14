export const GRID_SIZE = 14;
export const STARTING_LENGTH = 3;
export const BASE_INTERVAL_MS = 180;
export const MIN_INTERVAL_MS = 80;
export const SPEEDUP_EVERY_N_FOOD = 3;
export const SPEEDUP_STEP_MS = 12;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function isOpposite(a, b) {
  return DIRECTIONS[a].x === -DIRECTIONS[b].x && DIRECTIONS[a].y === -DIRECTIONS[b].y;
}

export function createInitialWorm() {
  const mid = Math.floor(GRID_SIZE / 2);
  const segments = [];
  for (let i = 0; i < STARTING_LENGTH; i++) {
    segments.push({ x: mid - i, y: mid });
  }
  return segments;
}

export function randomFood(worm) {
  const occupied = new Set(worm.map((s) => `${s.x},${s.y}`));
  const free = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)];
}

export function nextHead(worm, direction) {
  const head = worm[0];
  const d = DIRECTIONS[direction];
  return { x: head.x + d.x, y: head.y + d.y };
}

export function isWallCollision(point) {
  return point.x < 0 || point.x >= GRID_SIZE || point.y < 0 || point.y >= GRID_SIZE;
}

export function isSelfCollision(point, worm) {
  return worm.some((s) => s.x === point.x && s.y === point.y);
}

export function intervalForFoodCount(foodEaten) {
  const steps = Math.floor(foodEaten / SPEEDUP_EVERY_N_FOOD);
  return Math.max(MIN_INTERVAL_MS, BASE_INTERVAL_MS - steps * SPEEDUP_STEP_MS);
}
