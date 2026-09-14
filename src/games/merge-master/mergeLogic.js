export const GRID_SIZE = 4;

export function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

export function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

export function getEmptyCells(grid) {
  const cells = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) cells.push([r, c]);
    }
  }
  return cells;
}

export function addRandomTile(grid) {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = cloneGrid(grid);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

export function startingGrid() {
  let grid = createEmptyGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
}

// Slides + merges a single row to the left, returns { row, gained }
function slideRowLeft(row) {
  const values = row.filter((v) => v !== 0);
  const merged = [];
  let gained = 0;

  for (let i = 0; i < values.length; i++) {
    if (values[i] === values[i + 1]) {
      const mergedValue = values[i] * 2;
      merged.push(mergedValue);
      gained += mergedValue;
      i++; // skip the tile we just merged into this one
    } else {
      merged.push(values[i]);
    }
  }

  while (merged.length < GRID_SIZE) merged.push(0);
  return { row: merged, gained };
}

function rotateGridClockwise(grid) {
  const next = createEmptyGrid();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      next[c][GRID_SIZE - 1 - r] = grid[r][c];
    }
  }
  return next;
}

// direction: 'left' | 'right' | 'up' | 'down'
export function move(grid, direction) {
  let working = cloneGrid(grid);
  let rotations = 0;

  // Normalize every direction down to a "slide left" by rotating the
  // board, then rotate back the same number of times afterward.
  if (direction === 'up') rotations = 3;
  if (direction === 'right') rotations = 2;
  if (direction === 'down') rotations = 1;

  for (let i = 0; i < rotations; i++) working = rotateGridClockwise(working);

  let totalGained = 0;
  let moved = false;
  const result = working.map((row) => {
    const before = row.join(',');
    const { row: slid, gained } = slideRowLeft(row);
    if (slid.join(',') !== before) moved = true;
    totalGained += gained;
    return slid;
  });

  let finalGrid = result;
  const remainingRotations = (4 - rotations) % 4;
  for (let i = 0; i < remainingRotations; i++) finalGrid = rotateGridClockwise(finalGrid);

  return { grid: finalGrid, gained: totalGained, moved };
}

export function isGameOver(grid) {
  if (getEmptyCells(grid).length > 0) return false;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const value = grid[r][c];
      const right = grid[r][c + 1];
      const down = grid[r + 1] ? grid[r + 1][c] : undefined;
      if (right === value || down === value) return false;
    }
  }
  return true;
}
