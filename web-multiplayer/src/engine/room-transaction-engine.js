import {
  BoardState,
  PlayerSymbol,
  RoomStatus,
  WinReason,
  createBoardState,
} from "./game-models";
import { applyMove } from "./ultimate-engine";

export const FORFEIT_GRACE_MS = 45_000;

export function createInitialRoom(code, hostUid, nickname, now) {
  const hostPlayer = {
    uid: hostUid,
    nickname,
    symbol: PlayerSymbol.X,
    joinedAt: now,
  };

  return {
    code,
    hostUid,
    players: {
      [hostUid]: hostPlayer,
    },
    status: RoomStatus.WAITING,
    board: createBoardState(),
    currentTurnUid: hostUid,
    winnerUid: null,
    winnerSymbol: null,
    winReason: WinReason.NONE,
    startedAt: now,
    updatedAt: now,
    version: 0,
    presence: {
      [hostUid]: {
        uid: hostUid,
        connected: true,
        lastSeen: now,
        disconnectedAt: null,
      },
    },
    rematchHostReady: false,
    rematchGuestReady: false,
    rematchNonce: 0,
  };
}

export function joinRoom(roomState, guestUid, nickname, now) {
  if (roomState.players[guestUid]) {
    return success(roomState);
  }

  if (Object.keys(roomState.players).length >= 2) {
    return failure("Room is already full");
  }

  const usedSymbols = new Set(Object.values(roomState.players).map((player) => player.symbol));
  const guestSymbol = usedSymbols.has(PlayerSymbol.X) ? PlayerSymbol.O : PlayerSymbol.X;

  const updatedPlayers = {
    ...roomState.players,
    [guestUid]: {
      uid: guestUid,
      nickname,
      symbol: guestSymbol,
      joinedAt: now,
    },
  };

  const updatedPresence = {
    ...roomState.presence,
    [guestUid]: {
      uid: guestUid,
      connected: true,
      lastSeen: now,
      disconnectedAt: null,
    },
  };

  return success({
    ...roomState,
    players: updatedPlayers,
    presence: updatedPresence,
    status: RoomStatus.ACTIVE,
    updatedAt: now,
    version: roomState.version + 1,
  });
}

export function updatePresence(roomState, uid, connected, now) {
  if (!roomState.players[uid]) {
    return failure("Only room participants can update presence");
  }

  const disconnectedAt = connected ? null : now;
  const updatedPresence = {
    ...roomState.presence,
    [uid]: {
      uid,
      connected,
      lastSeen: now,
      disconnectedAt,
    },
  };

  return success({
    ...roomState,
    presence: updatedPresence,
    updatedAt: now,
    version: roomState.version + 1,
  });
}

export function submitMove(roomState, move, now) {
  if (roomState.status !== RoomStatus.ACTIVE) {
    return failure("Match is not active");
  }

  const player = roomState.players[move.playerUid];
  if (!player) {
    return failure("Player is not part of this room");
  }

  if (roomState.currentTurnUid !== move.playerUid) {
    return failure("It is not your turn");
  }

  const outcome = applyMove(
    roomState.board,
    move.miniGridIndex,
    move.cellIndex,
    player.symbol,
  );

  if (!outcome.isValid) {
    return failure(outcome.error || "Invalid move");
  }

  const winnerSymbol = outcome.globalWinner;
  const isDraw = outcome.isDraw;
  const isFinished = winnerSymbol !== null || isDraw;

  const nextTurn = isFinished
    ? roomState.currentTurnUid
    : opponentUid(roomState, move.playerUid) || roomState.currentTurnUid;

  return success({
    ...roomState,
    board: outcome.board,
    status: isFinished ? RoomStatus.FINISHED : RoomStatus.ACTIVE,
    currentTurnUid: nextTurn,
    winnerUid: winnerSymbol !== null ? move.playerUid : null,
    winnerSymbol,
    winReason: winnerSymbol !== null
      ? WinReason.NORMAL
      : (isDraw ? WinReason.DRAW : WinReason.NONE),
    updatedAt: now,
    version: roomState.version + 1,
    rematchHostReady: false,
    rematchGuestReady: false,
  });
}

export function requestRematch(roomState, uid, now) {
  if (roomState.status !== RoomStatus.FINISHED) {
    return failure("Rematch is only available after a finished game");
  }

  if (!roomState.players[uid]) {
    return failure("Only participants can request rematch");
  }

  if (Object.keys(roomState.players).length < 2) {
    return failure("Need two players for a rematch");
  }

  let hostReady = roomState.rematchHostReady;
  let guestReady = roomState.rematchGuestReady;

  if (uid === roomState.hostUid) {
    hostReady = true;
  } else {
    guestReady = true;
  }

  if (hostReady && guestReady) {
    return success({
      ...roomState,
      board: createBoardState(),
      status: RoomStatus.ACTIVE,
      currentTurnUid: roomState.hostUid,
      winnerUid: null,
      winnerSymbol: null,
      winReason: WinReason.NONE,
      updatedAt: now,
      version: roomState.version + 1,
      rematchHostReady: false,
      rematchGuestReady: false,
      rematchNonce: roomState.rematchNonce + 1,
    });
  }

  return success({
    ...roomState,
    rematchHostReady: hostReady,
    rematchGuestReady: guestReady,
    updatedAt: now,
    version: roomState.version + 1,
  });
}

export function claimForfeit(roomState, claimantUid, now, gracePeriodMs = FORFEIT_GRACE_MS) {
  if (roomState.status !== RoomStatus.ACTIVE) {
    return failure("Forfeit can only be claimed during an active match");
  }

  if (!roomState.players[claimantUid]) {
    return failure("Only participants can claim forfeit");
  }

  const foeUid = opponentUid(roomState, claimantUid);
  if (!foeUid) {
    return failure("Opponent is missing");
  }

  const foePresence = roomState.presence[foeUid];
  if (!foePresence) {
    return failure("Opponent presence not found");
  }

  if (foePresence.connected) {
    return failure("Opponent is still connected");
  }

  if (!foePresence.disconnectedAt) {
    return failure("No disconnect timestamp found");
  }

  if (now - foePresence.disconnectedAt < gracePeriodMs) {
    return failure("Grace period has not elapsed yet");
  }

  const winnerSymbol = symbolFor(roomState, claimantUid);
  if (!winnerSymbol) {
    return failure("Could not determine winner symbol");
  }

  return success({
    ...roomState,
    status: RoomStatus.FINISHED,
    winnerUid: claimantUid,
    winnerSymbol,
    winReason: WinReason.FORFEIT,
    updatedAt: now,
    version: roomState.version + 1,
    rematchHostReady: false,
    rematchGuestReady: false,
  });
}

export function symbolFor(roomState, uid) {
  return roomState.players[uid]?.symbol || null;
}

export function opponentUid(roomState, myUid) {
  return Object.keys(roomState.players).find((uid) => uid !== myUid) || null;
}

export function createMove(miniGridIndex, cellIndex, playerUid) {
  return {
    miniGridIndex,
    cellIndex,
    playerUid,
    timestamp: Date.now(),
  };
}

function success(roomState) {
  return { ok: true, roomState };
}

function failure(reason) {
  return { ok: false, reason };
}

export function isBoardResolved(board) {
  return !board.miniWinners.includes(BoardState.EMPTY);
}
