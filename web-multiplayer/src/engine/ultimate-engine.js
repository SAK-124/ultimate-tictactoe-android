import { BoardState, createBoardState, playerSymbolFromMark } from "./game-models";

const winLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function availableMiniGrids(board) {
  const forced = board.nextMiniGrid;
  if (forced >= 0 && forced <= 8 && isMiniPlayable(board, forced)) {
    return new Set([forced]);
  }

  const allowed = new Set();
  for (let i = 0; i <= 8; i += 1) {
    if (isMiniPlayable(board, i)) {
      allowed.add(i);
    }
  }
  return allowed;
}

export function isMiniPlayable(board, miniGridIndex) {
  if (miniGridIndex < 0 || miniGridIndex > 8) return false;
  if (board.miniWinners[miniGridIndex] !== BoardState.EMPTY) return false;
  return !isMiniFull(board.cells, miniGridIndex);
}

export function isMiniFull(cells, miniGridIndex) {
  for (let cellIndex = 0; cellIndex <= 8; cellIndex += 1) {
    if (cells[globalBoardIndex(miniGridIndex, cellIndex)] === BoardState.EMPTY) {
      return false;
    }
  }
  return true;
}

export function globalBoardIndex(miniGridIndex, cellIndex) {
  if (miniGridIndex < 0 || miniGridIndex > 8) {
    throw new Error("miniGridIndex out of bounds");
  }

  if (cellIndex < 0 || cellIndex > 8) {
    throw new Error("cellIndex out of bounds");
  }

  const miniRow = Math.floor(miniGridIndex / 3);
  const miniCol = miniGridIndex % 3;
  const cellRow = Math.floor(cellIndex / 3);
  const cellCol = cellIndex % 3;

  const row = miniRow * 3 + cellRow;
  const col = miniCol * 3 + cellCol;
  return row * 9 + col;
}

export function applyMove(board, miniGridIndex, cellIndex, symbol) {
  if (miniGridIndex < 0 || miniGridIndex > 8 || cellIndex < 0 || cellIndex > 8) {
    return moveResult(board, null, false, "Move indices out of bounds");
  }

  const allowed = availableMiniGrids(board);
  if (allowed.size === 0) {
    return moveResult(board, null, false, "No playable mini-grids left");
  }

  if (!allowed.has(miniGridIndex)) {
    return moveResult(board, null, false, "Move must be played in the highlighted mini-grid");
  }

  const globalIndex = globalBoardIndex(miniGridIndex, cellIndex);
  if (board.cells[globalIndex] !== BoardState.EMPTY) {
    return moveResult(board, null, false, "Cell is already occupied");
  }

  const cells = board.cells.split("");
  const miniWinners = board.miniWinners.split("");
  cells[globalIndex] = symbol;

  const miniWinner = evaluateMiniWinner(cells, miniGridIndex);
  if (miniWinner !== null) {
    miniWinners[miniGridIndex] = miniWinner;
  } else if (isMiniFull(cells.join(""), miniGridIndex)) {
    miniWinners[miniGridIndex] = BoardState.TIE;
  }

  const globalWinnerMark = evaluateGlobalWinner(miniWinners);
  const globalWinner = playerSymbolFromMark(globalWinnerMark);
  const isDraw = globalWinner === null && miniWinners.every((value) => value !== BoardState.EMPTY);

  const directedMini = cellIndex;
  const directedBoard = createBoardState({
    cells: cells.join(""),
    miniWinners: miniWinners.join(""),
    nextMiniGrid: directedMini,
    moveCount: board.moveCount + 1,
  });

  const nextMiniGrid = directedMini >= 0 && directedMini <= 8 && isMiniPlayable(directedBoard, directedMini)
    ? directedMini
    : -1;

  const nextBoard = createBoardState({
    cells: cells.join(""),
    miniWinners: miniWinners.join(""),
    nextMiniGrid,
    moveCount: board.moveCount + 1,
  });

  return moveResult(nextBoard, globalWinner, isDraw, null);
}

function moveResult(board, globalWinner, isDraw, error) {
  return {
    board,
    globalWinner,
    isDraw,
    error,
    isValid: error === null,
  };
}

function evaluateMiniWinner(cells, miniGridIndex) {
  const miniValues = Array.from({ length: 9 }, (_, index) => cells[globalBoardIndex(miniGridIndex, index)]);
  return evaluateWinner(miniValues);
}

function evaluateGlobalWinner(miniWinners) {
  return evaluateWinner(miniWinners);
}

function evaluateWinner(values) {
  for (const line of winLines) {
    const a = values[line[0]];
    const b = values[line[1]];
    const c = values[line[2]];

    if (a !== BoardState.EMPTY && a !== BoardState.TIE && a === b && b === c) {
      return a;
    }
  }

  return null;
}
