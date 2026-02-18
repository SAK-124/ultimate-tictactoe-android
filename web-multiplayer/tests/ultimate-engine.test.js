import { describe, expect, it } from "vitest";
import { BoardState, PlayerSymbol, createBoardState } from "../src/engine/game-models";
import {
  applyMove,
  availableMiniGrids,
  globalBoardIndex,
} from "../src/engine/ultimate-engine";

describe("UltimateTicTacToeEngine parity", () => {
  it("applies valid move and routes next mini-grid", () => {
    const board = createBoardState();

    const move = applyMove(board, 0, 8, PlayerSymbol.X);

    expect(move.isValid).toBe(true);
    expect(move.board.cells[globalBoardIndex(0, 8)]).toBe("X");
    expect(move.board.nextMiniGrid).toBe(8);
  });

  it("rejects move outside forced mini-grid", () => {
    const firstMove = applyMove(createBoardState(), 0, 8, PlayerSymbol.X);
    const invalidMove = applyMove(firstMove.board, 0, 0, PlayerSymbol.O);

    expect(invalidMove.isValid).toBe(false);
    expect(invalidMove.error).toContain("highlighted mini-grid");
  });

  it("allows open field when directed mini-grid is resolved", () => {
    const board = createBoardState({
      miniWinners: "........T",
      nextMiniGrid: 8,
    });

    const allowed = availableMiniGrids(board);
    expect(allowed.has(0)).toBe(true);
    expect(allowed.has(8)).toBe(false);

    const move = applyMove(board, 0, 0, PlayerSymbol.X);
    expect(move.isValid).toBe(true);
  });

  it("claims mini-grid when three in row are completed", () => {
    const cells = BoardState.EMPTY_CELLS.split("");
    cells[globalBoardIndex(0, 0)] = "X";
    cells[globalBoardIndex(0, 1)] = "X";

    const board = createBoardState({
      cells: cells.join(""),
    });

    const move = applyMove(board, 0, 2, PlayerSymbol.X);

    expect(move.isValid).toBe(true);
    expect(move.board.miniWinners[0]).toBe("X");
  });

  it("detects global winner from mini-grid victories", () => {
    const cells = BoardState.EMPTY_CELLS.split("");
    cells[globalBoardIndex(2, 0)] = "X";
    cells[globalBoardIndex(2, 1)] = "X";

    const board = createBoardState({
      cells: cells.join(""),
      miniWinners: "XX.......",
    });

    const move = applyMove(board, 2, 2, PlayerSymbol.X);

    expect(move.isValid).toBe(true);
    expect(move.globalWinner).toBe(PlayerSymbol.X);
    expect(move.isDraw).toBe(false);
  });

  it("marks draw when all mini-grids resolved without global line", () => {
    const cells = BoardState.EMPTY_CELLS.split("");
    const preFill = {
      0: "X", 1: "O", 2: "X",
      3: "X", 4: "O", 5: "O",
      6: "O", 7: "X",
    };

    for (const [cellIndex, value] of Object.entries(preFill)) {
      cells[globalBoardIndex(8, Number(cellIndex))] = value;
    }

    const board = createBoardState({
      cells: cells.join(""),
      miniWinners: "XOTOXOOX.",
      nextMiniGrid: -1,
    });

    const move = applyMove(board, 8, 8, PlayerSymbol.X);

    expect(move.isValid).toBe(true);
    expect(move.globalWinner).toBe(null);
    expect(move.isDraw).toBe(true);
    expect(move.board.miniWinners[8]).toBe("T");
  });
});
