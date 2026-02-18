import { describe, expect, it } from "vitest";
import { RoomStatus, WinReason } from "../src/engine/game-models";
import {
  FORFEIT_GRACE_MS,
  createMove,
  createInitialRoom,
  joinRoom,
  claimForfeit,
  requestRematch,
  submitMove,
  updatePresence,
} from "../src/engine/room-transaction-engine";

describe("RoomTransactionEngine parity", () => {
  it("allows second player join and blocks third player", () => {
    const created = createInitialRoom("1234", "host", "Host", 1_000);

    const joined = joinRoom(created, "guest", "Guest", 2_000);
    expect(joined.ok).toBe(true);

    const joinedRoom = joined.roomState;
    expect(Object.keys(joinedRoom.players).length).toBe(2);
    expect(joinedRoom.status).toBe(RoomStatus.ACTIVE);

    const thirdJoin = joinRoom(joinedRoom, "third", "Third", 3_000);
    expect(thirdJoin.ok).toBe(false);
  });

  it("rejects move when turn ownership is wrong", () => {
    const created = createInitialRoom("1234", "host", "Host", 1_000);
    const active = joinRoom(created, "guest", "Guest", 2_000).roomState;

    const result = submitMove(active, createMove(0, 0, "guest"), 3_000);
    expect(result.ok).toBe(false);
  });

  it("forfeit succeeds only after disconnect grace window", () => {
    const created = createInitialRoom("1234", "host", "Host", 1_000);
    const active = joinRoom(created, "guest", "Guest", 2_000).roomState;

    const disconnected = updatePresence(active, "guest", false, 3_000);
    const roomAfterDisconnect = disconnected.roomState;

    const earlyClaim = claimForfeit(
      roomAfterDisconnect,
      "host",
      3_000 + FORFEIT_GRACE_MS - 1,
      FORFEIT_GRACE_MS,
    );
    expect(earlyClaim.ok).toBe(false);

    const validClaim = claimForfeit(
      roomAfterDisconnect,
      "host",
      3_000 + FORFEIT_GRACE_MS + 10,
      FORFEIT_GRACE_MS,
    );
    expect(validClaim.ok).toBe(true);

    const finalRoom = validClaim.roomState;
    expect(finalRoom.status).toBe(RoomStatus.FINISHED);
    expect(finalRoom.winReason).toBe(WinReason.FORFEIT);
    expect(finalRoom.winnerUid).toBe("host");
  });

  it("rematch resets board after both players confirm", () => {
    const created = createInitialRoom("1234", "host", "Host", 1_000);
    const active = joinRoom(created, "guest", "Guest", 2_000).roomState;

    const finished = {
      ...active,
      status: RoomStatus.FINISHED,
      winnerUid: "host",
      winReason: WinReason.NORMAL,
      board: {
        ...active.board,
        moveCount: 15,
      },
    };

    const hostReady = requestRematch(finished, "host", 5_000);
    const hostReadyRoom = hostReady.roomState;

    expect(hostReadyRoom.rematchHostReady).toBe(true);
    expect(hostReadyRoom.rematchGuestReady).toBe(false);

    const bothReady = requestRematch(hostReadyRoom, "guest", 6_000);
    const rematchRoom = bothReady.roomState;

    expect(rematchRoom.status).toBe(RoomStatus.ACTIVE);
    expect(rematchRoom.board.moveCount).toBe(0);
    expect(rematchRoom.winnerUid).toBe(null);
    expect(rematchRoom.rematchHostReady).toBe(false);
    expect(rematchRoom.rematchGuestReady).toBe(false);
  });
});
