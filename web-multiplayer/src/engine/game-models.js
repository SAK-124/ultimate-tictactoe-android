export const AuthProvider = {
  ANONYMOUS: "ANONYMOUS",
};

export const PlayerSymbol = {
  X: "X",
  O: "O",
};

export function playerSymbolFromMark(mark) {
  if (mark === "X") return PlayerSymbol.X;
  if (mark === "O") return PlayerSymbol.O;
  return null;
}

export const RoomStatus = {
  WAITING: "WAITING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

export const WinReason = {
  NONE: "NONE",
  NORMAL: "NORMAL",
  FORFEIT: "FORFEIT",
  DRAW: "DRAW",
};

export const BoardState = {
  EMPTY: ".",
  TIE: "T",
  EMPTY_CELLS: ".".repeat(81),
  EMPTY_MINI_WINNERS: ".".repeat(9),
};

export function createBoardState(overrides = {}) {
  const board = {
    cells: BoardState.EMPTY_CELLS,
    miniWinners: BoardState.EMPTY_MINI_WINNERS,
    nextMiniGrid: -1,
    moveCount: 0,
    ...overrides,
  };

  if (board.cells.length !== 81) {
    throw new Error("cells must contain 81 characters");
  }

  if (board.miniWinners.length !== 9) {
    throw new Error("miniWinners must contain 9 characters");
  }

  return board;
}
