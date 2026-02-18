import {
  BoardState,
  PlayerSymbol,
  RoomStatus,
  WinReason,
  createBoardState,
  playerSymbolFromMark,
} from "../engine/game-models";

export function fromSnapshot(codeHint, value) {
  const root = asMap(value);
  if (Object.keys(root).length === 0) return null;

  const roomCode = asString(root.code) || codeHint;
  const playersRaw = asMap(root.players);

  const players = {};
  for (const [uid, data] of Object.entries(playersRaw)) {
    const map = asMap(data);
    const symbol = playerSymbolFromMark(asString(map.symbol));
    if (!symbol) continue;

    players[uid] = {
      uid,
      nickname: asString(map.nickname) || "Player",
      symbol,
      joinedAt: asLong(map.joinedAt),
    };
  }

  if (Object.keys(players).length === 0) return null;

  const meta = asMap(root.meta);
  const xPlayer = Object.values(players).find((player) => player.symbol === PlayerSymbol.X);
  const hostUid = asString(meta.hostUid) || xPlayer?.uid || Object.keys(players)[0];

  const state = asMap(root.state);
  const cells = asString(state.cells);
  const miniWinners = asString(state.miniWinners);

  const board = createBoardState({
    cells: cells.length === 81 ? cells : BoardState.EMPTY_CELLS,
    miniWinners: miniWinners.length === 9 ? miniWinners : BoardState.EMPTY_MINI_WINNERS,
    nextMiniGrid: asInt(state.nextMiniGrid, -1),
    moveCount: asInt(state.moveCount, 0),
  });

  const winnerSymbol = playerSymbolFromMark(asString(state.winnerSymbol));

  const presenceRaw = asMap(root.presence);
  const presence = {};
  for (const [uid, data] of Object.entries(presenceRaw)) {
    const map = asMap(data);
    const disconnectedAt = asLong(map.disconnectedAt);
    presence[uid] = {
      uid,
      connected: asBoolean(map.connected, false),
      lastSeen: asLong(map.lastSeen),
      disconnectedAt: disconnectedAt > 0 ? disconnectedAt : null,
    };
  }

  const rematch = asMap(root.rematch);

  return {
    code: roomCode,
    hostUid,
    players,
    status: asEnum(state.status, RoomStatus, RoomStatus.WAITING),
    board,
    currentTurnUid: asString(state.currentTurnUid) || hostUid,
    winnerUid: asString(state.winnerUid) || null,
    winnerSymbol,
    winReason: asEnum(state.winReason, WinReason, WinReason.NONE),
    startedAt: asLong(state.startedAt),
    updatedAt: asLong(state.updatedAt),
    version: asInt(state.version, 0),
    presence,
    rematchHostReady: asBoolean(rematch.hostReady, false),
    rematchGuestReady: asBoolean(rematch.guestReady, false),
    rematchNonce: asInt(rematch.nonce, 0),
  };
}

export function toMap(roomState) {
  const playersMap = {};
  for (const [uid, player] of Object.entries(roomState.players)) {
    playersMap[uid] = {
      uid: player.uid,
      nickname: player.nickname,
      symbol: player.symbol,
      joinedAt: player.joinedAt,
    };
  }

  const presenceMap = {};
  for (const [uid, presence] of Object.entries(roomState.presence)) {
    presenceMap[uid] = {
      uid: presence.uid,
      connected: presence.connected,
      lastSeen: presence.lastSeen,
      disconnectedAt: presence.disconnectedAt ?? 0,
    };
  }

  return {
    code: roomState.code,
    meta: {
      hostUid: roomState.hostUid,
      createdAt: roomState.startedAt,
    },
    players: playersMap,
    state: {
      cells: roomState.board.cells,
      miniWinners: roomState.board.miniWinners,
      nextMiniGrid: roomState.board.nextMiniGrid,
      moveCount: roomState.board.moveCount,
      currentTurnUid: roomState.currentTurnUid,
      status: roomState.status,
      winnerUid: roomState.winnerUid || "",
      winnerSymbol: roomState.winnerSymbol || "",
      winReason: roomState.winReason,
      startedAt: roomState.startedAt,
      updatedAt: roomState.updatedAt,
      version: roomState.version,
    },
    presence: presenceMap,
    rematch: {
      hostReady: roomState.rematchHostReady,
      guestReady: roomState.rematchGuestReady,
      nonce: roomState.rematchNonce,
    },
  };
}

function asMap(value) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.fromEntries(Object.entries(value));
}

function asString(value) {
  return typeof value === "string" ? value : "";
}

function asLong(value, defaultValue = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

function asInt(value, defaultValue = 0) {
  return asLong(value, defaultValue);
}

function asBoolean(value, defaultValue = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return defaultValue;
}

function asEnum(value, enumValues, defaultValue) {
  if (typeof value !== "string") return defaultValue;
  return Object.values(enumValues).includes(value) ? value : defaultValue;
}
