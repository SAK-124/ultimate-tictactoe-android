import "./styles.css";
import { BoardState, RoomStatus, WinReason } from "./engine/game-models";
import { FORFEIT_GRACE_MS, opponentUid } from "./engine/room-transaction-engine";
import { availableMiniGrids, globalBoardIndex } from "./engine/ultimate-engine";
import { firebaseReady, firebaseSetupError, realtimeClient } from "./lib/firebase-client";
import { createCalmFunSoundtrack } from "./lib/soundtrack";

const soundtrack = createCalmFunSoundtrack();

const state = {
  playerId: getOrCreatePlayerId(),
  nickname: localStorage.getItem("uttt.nickname") || "",
  roomCodeInput: "",
  roomCode: null,
  room: null,
  unsubscribeRoom: null,
  busy: false,
  notice: "",
  lastForfeitAttemptVersion: -1,
  lastMoveKey: null,
  lastMoveTimeoutId: null,
  musicEnabled: localStorage.getItem("uttt.musicEnabled") !== "false",
  timeOffsetMs: 0,
};

const app = document.querySelector("#app");
app.innerHTML = `
  <main class="shell">
    <section class="panel hero">
      <div class="hero-top">
        <p class="eyebrow">Ultimate Tic-Tac-Toe</p>
        <button id="music-toggle" class="btn btn-ghost"></button>
      </div>
      <h1>Neon Room Clash</h1>
      <p class="sub">Fast 2-player matches. No login, just a 4-digit room key.</p>
    </section>

    <section class="panel setup" id="setup-panel">
      <label class="label" for="nickname">Nickname</label>
      <input id="nickname" class="input" maxlength="22" placeholder="Player" />

      <div class="actions-grid">
        <button id="create-room" class="btn btn-primary">Create 4-digit room</button>
      </div>

      <label class="label" for="room-code">Join existing room</label>
      <div class="join-row">
        <input id="room-code" class="input" inputmode="numeric" maxlength="4" placeholder="0000" />
        <button id="join-room" class="btn">Join</button>
      </div>
      <p id="firebase-warning" class="warning hidden"></p>
    </section>

    <section class="panel room hidden" id="room-panel">
      <div class="room-meta">
        <div>
          <p class="label">Room code</p>
          <p class="room-code" id="room-code-active">----</p>
        </div>
        <div class="room-actions">
          <button id="copy-code" class="btn btn-ghost">Copy code</button>
          <button id="copy-link" class="btn btn-ghost">Copy link</button>
        </div>
      </div>

      <div id="hud-chips" class="hud-chips"></div>

      <p id="status-text" class="status">Waiting for room updates...</p>
      <p id="direction-text" class="direction"></p>
      <p id="forfeit-text" class="forfeit"></p>

      <div id="players" class="players"></div>

      <div id="board" class="board" aria-label="Ultimate board"></div>

      <div class="actions-grid actions-room" id="room-actions-bar">
        <button id="rematch" class="btn hidden">Rematch</button>
        <button id="leave" class="btn btn-danger">Leave room</button>
      </div>
    </section>

    <p id="notice" class="notice"></p>
  </main>
`;

const nicknameInput = document.querySelector("#nickname");
const roomCodeInput = document.querySelector("#room-code");
const setupPanel = document.querySelector("#setup-panel");
const roomPanel = document.querySelector("#room-panel");
const roomCodeActive = document.querySelector("#room-code-active");
const statusText = document.querySelector("#status-text");
const directionText = document.querySelector("#direction-text");
const forfeitText = document.querySelector("#forfeit-text");
const hudChipsEl = document.querySelector("#hud-chips");
const playersEl = document.querySelector("#players");
const boardEl = document.querySelector("#board");
const rematchBtn = document.querySelector("#rematch");
const leaveBtn = document.querySelector("#leave");
const noticeEl = document.querySelector("#notice");
const firebaseWarning = document.querySelector("#firebase-warning");
const musicToggle = document.querySelector("#music-toggle");
const createRoomBtn = document.querySelector("#create-room");
const joinRoomBtn = document.querySelector("#join-room");
const copyCodeBtn = document.querySelector("#copy-code");
const copyLinkBtn = document.querySelector("#copy-link");

nicknameInput.value = state.nickname;
roomCodeInput.value = state.roomCodeInput;

if (!firebaseReady) {
  firebaseWarning.classList.remove("hidden");
  firebaseWarning.textContent = firebaseSetupError;
}

const urlCode = normalizeCodeInput(new URLSearchParams(window.location.search).get("room"));
if (urlCode) {
  state.roomCodeInput = urlCode;
  roomCodeInput.value = urlCode;
  setNotice(`Invite code ${urlCode} loaded.`);
}

syncMusicToggle();

nicknameInput.addEventListener("input", (event) => {
  state.nickname = event.target.value.slice(0, 22);
  localStorage.setItem("uttt.nickname", state.nickname);
});

roomCodeInput.addEventListener("input", (event) => {
  state.roomCodeInput = normalizeCodeInput(event.target.value);
  roomCodeInput.value = state.roomCodeInput;
});

createRoomBtn.addEventListener("click", async () => {
  if (!firebaseReady || state.busy) return;

  await runBusy(async () => {
    await maybeStartMusic();
    const code = await realtimeClient.createRoom(state.playerId, resolvedNickname());
    await openRoom(code);
    setNotice(`Room ${code} created. Share this key or invite link.`);
    pulseHaptic([12, 20, 12]);
  });
});

joinRoomBtn.addEventListener("click", async () => {
  if (!firebaseReady || state.busy) return;
  await joinCurrentInput();
});

copyCodeBtn.addEventListener("click", async () => {
  if (!state.roomCode) return;

  try {
    await navigator.clipboard.writeText(state.roomCode);
    setNotice("Room code copied.");
    pulseHaptic(10);
  } catch {
    setNotice("Copy failed. Share the code manually.");
  }
});

copyLinkBtn.addEventListener("click", async () => {
  if (!state.roomCode) return;

  const inviteUrl = `${window.location.origin}/?room=${state.roomCode}`;
  try {
    await navigator.clipboard.writeText(inviteUrl);
    setNotice("Invite link copied.");
    pulseHaptic(10);
  } catch {
    setNotice(`Share this link: ${inviteUrl}`);
  }
});

leaveBtn.addEventListener("click", async () => {
  await leaveRoom();
  setNotice("Left room.");
});

rematchBtn.addEventListener("click", async () => {
  if (!state.roomCode || !state.room || state.busy) return;
  await runBusy(async () => {
    await maybeStartMusic();
    await realtimeClient.requestRematch(state.roomCode, state.playerId);
    pulseHaptic([10, 40, 10]);
  });
});

boardEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-mini][data-cell]");
  if (!button || !state.roomCode || !state.room || state.busy) return;

  const miniGridIndex = Number(button.dataset.mini);
  const cellIndex = Number(button.dataset.cell);

  await runBusy(async () => {
    await maybeStartMusic();
    await realtimeClient.submitMove(state.roomCode, state.playerId, miniGridIndex, cellIndex);
    pulseHaptic(9);
  });
});

musicToggle.addEventListener("click", async () => {
  state.musicEnabled = !state.musicEnabled;
  localStorage.setItem("uttt.musicEnabled", String(state.musicEnabled));

  if (state.musicEnabled) {
    const started = await soundtrack.start();
    if (!started) {
      setNotice("Tap again to enable soundtrack.");
      state.musicEnabled = false;
      localStorage.setItem("uttt.musicEnabled", "false");
    }
  } else {
    soundtrack.stop();
  }

  syncMusicToggle();
});

window.addEventListener("pagehide", () => {
  void markOffline();
});

document.addEventListener("visibilitychange", () => {
  if (!state.roomCode) return;

  if (document.visibilityState === "hidden") {
    void markOffline();
  } else {
    void realtimeClient.markPresence(state.roomCode, state.playerId, true);
  }
});

document.addEventListener("pointerdown", () => {
  void maybeStartMusic();
}, { once: true });

setInterval(() => {
  void tickForfeitMonitor();
}, 1_000);

installAutomationHooks();
render();

if (urlCode && firebaseReady) {
  void joinCurrentInput();
}

async function joinCurrentInput() {
  const inputCode = normalizeCodeInput(state.roomCodeInput);
  if (!inputCode) {
    setNotice("Enter the room code.");
    return;
  }

  await runBusy(async () => {
    await maybeStartMusic();
    const code = await realtimeClient.joinRoom(inputCode, state.playerId, resolvedNickname());
    await openRoom(code);
    setNotice(`Joined room ${code}.`);
    pulseHaptic([10, 16, 10]);
  });
}

async function openRoom(code) {
  if (state.unsubscribeRoom) {
    state.unsubscribeRoom();
    state.unsubscribeRoom = null;
  }

  state.roomCode = code;
  state.roomCodeInput = code;
  roomCodeInput.value = code;

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("room", code);
  window.history.replaceState({}, "", nextUrl);

  state.unsubscribeRoom = realtimeClient.observeRoom(
    code,
    (room) => {
      detectLatestMove(state.room, room);
      state.room = room;
      render();
    },
    (error) => {
      setNotice(error.message || "Lost room updates.");
    },
  );

  await realtimeClient.markPresence(code, state.playerId, true);
  render();
}

async function leaveRoom() {
  if (state.unsubscribeRoom) {
    state.unsubscribeRoom();
    state.unsubscribeRoom = null;
  }

  if (state.roomCode && firebaseReady) {
    try {
      await realtimeClient.markPresence(state.roomCode, state.playerId, false);
    } catch {
      // Ignore best-effort disconnect writes.
    }
  }

  state.room = null;
  state.roomCode = null;
  state.lastForfeitAttemptVersion = -1;
  state.lastMoveKey = null;

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.delete("room");
  window.history.replaceState({}, "", nextUrl);

  render();
}

function render() {
  const inRoom = Boolean(state.roomCode);
  setupPanel.classList.toggle("hidden", inRoom);
  roomPanel.classList.toggle("hidden", !inRoom);
  document.body.classList.toggle("in-room", inRoom);

  noticeEl.textContent = state.notice;
  setButtonBusyState();

  if (!inRoom) {
    return;
  }

  roomCodeActive.textContent = state.roomCode || "----";

  if (!state.room) {
    statusText.textContent = "Connecting to room...";
    directionText.textContent = "";
    forfeitText.textContent = "";
    hudChipsEl.innerHTML = "";
    playersEl.innerHTML = "";
    boardEl.innerHTML = "";
    rematchBtn.classList.add("hidden");
    return;
  }

  renderHud();
  renderPlayers();
  renderBoard();

  statusText.textContent = buildStatusText();
  directionText.textContent = buildDirectionText();
  forfeitText.textContent = buildForfeitText();

  const canRematch = state.room.status === RoomStatus.FINISHED && Object.keys(state.room.players).length === 2;
  rematchBtn.classList.toggle("hidden", !canRematch);
}

function renderHud() {
  const room = state.room;
  if (!room) return;

  const turnLabel = room.status === RoomStatus.ACTIVE
    ? (room.currentTurnUid === state.playerId ? "Your turn" : "Opponent turn")
    : (room.status === RoomStatus.WAITING ? "Waiting" : "Match complete");

  const forcedLabel = room.board.nextMiniGrid >= 0 && availableMiniGrids(room.board).has(room.board.nextMiniGrid)
    ? `Grid ${miniGridName(room.board.nextMiniGrid)}`
    : "Any open grid";

  const chips = [
    { label: "Phase", value: room.status },
    { label: "Turn", value: turnLabel },
    { label: "Next", value: forcedLabel },
    { label: "Moves", value: String(room.board.moveCount) },
  ];

  hudChipsEl.innerHTML = chips.map((chip) => `
    <article class="chip">
      <p class="chip-label">${chip.label}</p>
      <p class="chip-value">${chip.value}</p>
    </article>
  `).join("");
}

function renderPlayers() {
  const room = state.room;
  const orderedPlayers = Object.values(room.players)
    .slice()
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  playersEl.innerHTML = orderedPlayers
    .map((player) => {
      const presence = room.presence[player.uid];
      const isMe = player.uid === state.playerId;
      const online = presence?.connected ?? false;
      const isTurn = room.currentTurnUid === player.uid && room.status === RoomStatus.ACTIVE;

      return `
        <article class="player-card ${isMe ? "mine" : ""} ${isTurn ? "is-turn" : ""}">
          <div>
            <p class="player-name">${escapeHtml(player.nickname)} ${isMe ? "(You)" : ""}</p>
            <p class="player-meta ${player.symbol === "X" ? "mark-x" : "mark-o"}">${player.symbol} ${player.uid === room.hostUid ? "• Host" : ""}</p>
          </div>
          <span class="presence ${online ? "online" : "offline"}">${online ? "Online" : "Offline"}</span>
        </article>
      `;
    })
    .join("");
}

function renderBoard() {
  const room = state.room;
  if (room.status === RoomStatus.WAITING) {
    boardEl.innerHTML = `
      <article class="waiting-placeholder">
        <p class="waiting-title">Room ready. Waiting for player two.</p>
        <p class="waiting-copy">Send the 4-digit code or invite link to start instantly.</p>
      </article>
    `;
    return;
  }

  const myPlayer = room.players[state.playerId];
  const amParticipant = Boolean(myPlayer);
  const isMyTurn = room.status === RoomStatus.ACTIVE && room.currentTurnUid === state.playerId;
  const allowedMiniGrids = availableMiniGrids(room.board);

  boardEl.innerHTML = Array.from({ length: 9 }, (_, miniGridIndex) => {
    const miniWinner = room.board.miniWinners[miniGridIndex];
    const isResolved = miniWinner !== BoardState.EMPTY;
    const isAllowed = allowedMiniGrids.has(miniGridIndex);

    const cellsHtml = Array.from({ length: 9 }, (_, cellIndex) => {
      const globalIndex = globalBoardIndex(miniGridIndex, cellIndex);
      const value = room.board.cells[globalIndex];
      const cellEmpty = value === BoardState.EMPTY;
      const cellKey = `${miniGridIndex}-${cellIndex}`;

      const playable = (
        amParticipant
        && isMyTurn
        && room.status === RoomStatus.ACTIVE
        && cellEmpty
        && !isResolved
        && isAllowed
      );

      const markClass = value === "X" ? "mark-x" : (value === "O" ? "mark-o" : "");
      const justPlayedClass = state.lastMoveKey === cellKey ? "just-played" : "";

      return `
        <button
          class="cell ${playable ? "playable" : ""} ${value !== BoardState.EMPTY ? "filled" : ""} ${markClass} ${justPlayedClass}"
          data-mini="${miniGridIndex}"
          data-cell="${cellIndex}"
          data-cell-key="${cellKey}"
          aria-label="Grid ${miniGridName(miniGridIndex)} cell ${cellIndex + 1}"
          ${playable ? "" : "disabled"}
        >
          ${value === BoardState.EMPTY ? "" : value}
        </button>
      `;
    }).join("");

    const winnerClass = miniWinner === "X" ? "mark-x" : (miniWinner === "O" ? "mark-o" : "");

    return `
      <section class="mini-grid ${isAllowed ? "allowed" : ""} ${isResolved ? "resolved" : ""}">
        <div class="mini-cells">${cellsHtml}</div>
        ${isResolved ? `<div class="mini-winner ${winnerClass}">${miniWinner === BoardState.TIE ? "T" : miniWinner}</div>` : ""}
      </section>
    `;
  }).join("");
}

function buildStatusText() {
  const room = state.room;

  if (room.status === RoomStatus.WAITING) {
    return "Waiting for a second player to join this room.";
  }

  if (room.status === RoomStatus.ACTIVE) {
    const myTurn = room.currentTurnUid === state.playerId;
    if (myTurn) {
      const symbol = room.players[state.playerId]?.symbol || "?";
      return `Your turn (${symbol}).`;
    }

    const currentPlayer = room.players[room.currentTurnUid];
    return `${currentPlayer?.nickname || "Opponent"}'s turn.`;
  }

  if (room.winReason === WinReason.DRAW) {
    return "Match ended in a draw.";
  }

  const winnerName = room.winnerUid === state.playerId
    ? "You"
    : (room.players[room.winnerUid]?.nickname || "Opponent");

  if (room.winReason === WinReason.FORFEIT) {
    return `${winnerName} won by forfeit.`;
  }

  return `${winnerName} won the match.`;
}

function buildDirectionText() {
  const room = state.room;
  if (!room || room.status !== RoomStatus.ACTIVE) {
    return "";
  }

  const allowedMiniGrids = availableMiniGrids(room.board);
  if (allowedMiniGrids.size === 1) {
    const [only] = [...allowedMiniGrids];
    return `Play inside mini-grid ${miniGridName(only)}.`;
  }

  return "Play in any highlighted mini-grid.";
}

function buildForfeitText() {
  const room = state.room;
  if (!room || room.status !== RoomStatus.ACTIVE) return "";

  const foeUid = opponentUid(room, state.playerId);
  if (!foeUid) return "";

  const foePresence = room.presence[foeUid];
  if (!foePresence || foePresence.connected || !foePresence.disconnectedAt) return "";

  const remainingMs = FORFEIT_GRACE_MS - (nowMs() - foePresence.disconnectedAt);
  if (remainingMs <= 0) {
    return "Opponent disconnected. Claiming forfeit...";
  }

  const seconds = Math.ceil(remainingMs / 1_000);
  return `Opponent disconnected. Forfeit in ${seconds}s.`;
}

async function tickForfeitMonitor() {
  const room = state.room;
  if (!room || !state.roomCode || room.status !== RoomStatus.ACTIVE) return;

  const foeUid = opponentUid(room, state.playerId);
  if (!foeUid) return;

  const foePresence = room.presence[foeUid];
  if (!foePresence || foePresence.connected || !foePresence.disconnectedAt) return;

  const elapsed = nowMs() - foePresence.disconnectedAt;
  if (elapsed < FORFEIT_GRACE_MS) {
    render();
    return;
  }

  if (state.lastForfeitAttemptVersion === room.version || state.busy) {
    return;
  }

  state.lastForfeitAttemptVersion = room.version;
  await runBusy(async () => {
    await realtimeClient.claimForfeit(state.roomCode, state.playerId);
  });
}

async function markOffline() {
  if (!state.roomCode || !firebaseReady) return;
  try {
    await realtimeClient.markPresence(state.roomCode, state.playerId, false);
  } catch {
    // Best effort.
  }
}

async function runBusy(task) {
  state.busy = true;
  setButtonBusyState();
  try {
    await task();
  } catch (error) {
    setNotice(error?.message || "Operation failed.");
  } finally {
    state.busy = false;
    setButtonBusyState();
    render();
  }
}

function setButtonBusyState() {
  const disableLobbyActions = state.busy || !firebaseReady;
  createRoomBtn.disabled = disableLobbyActions;
  joinRoomBtn.disabled = disableLobbyActions;

  const disableRoomActions = state.busy || !state.roomCode;
  copyCodeBtn.disabled = disableRoomActions;
  copyLinkBtn.disabled = disableRoomActions;
  leaveBtn.disabled = state.busy;
  rematchBtn.disabled = state.busy;
}

function resolvedNickname() {
  const name = state.nickname.trim().slice(0, 22);
  return name || "Player";
}

function setNotice(message) {
  state.notice = message;
  render();
}

function normalizeCodeInput(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 4);
}

async function maybeStartMusic() {
  if (!state.musicEnabled || soundtrack.isRunning()) {
    return;
  }

  const started = await soundtrack.start();
  if (!started) {
    state.musicEnabled = false;
    localStorage.setItem("uttt.musicEnabled", "false");
    syncMusicToggle();
  }
}

function syncMusicToggle() {
  musicToggle.textContent = state.musicEnabled ? "Sound: On" : "Sound: Off";
}

function detectLatestMove(previousRoom, nextRoom) {
  if (!previousRoom || !nextRoom) {
    return;
  }

  const previous = previousRoom.board.cells;
  const current = nextRoom.board.cells;
  if (!previous || !current || previous.length !== current.length) {
    return;
  }

  for (let index = 0; index < current.length; index += 1) {
    if (previous[index] === BoardState.EMPTY && current[index] !== BoardState.EMPTY) {
      const key = keyFromGlobalIndex(index);
      state.lastMoveKey = key;
      if (state.lastMoveTimeoutId) {
        window.clearTimeout(state.lastMoveTimeoutId);
      }
      state.lastMoveTimeoutId = window.setTimeout(() => {
        state.lastMoveKey = null;
        render();
      }, 700);
      return;
    }
  }
}

function keyFromGlobalIndex(index) {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const miniRow = Math.floor(row / 3);
  const miniCol = Math.floor(col / 3);
  const cellRow = row % 3;
  const cellCol = col % 3;
  const miniGridIndex = miniRow * 3 + miniCol;
  const cellIndex = cellRow * 3 + cellCol;
  return `${miniGridIndex}-${cellIndex}`;
}

function miniGridName(miniGridIndex) {
  const row = Math.floor(miniGridIndex / 3) + 1;
  const col = (miniGridIndex % 3) + 1;
  return `R${row}C${col}`;
}

function pulseHaptic(pattern) {
  if (!navigator.vibrate) return;
  navigator.vibrate(pattern);
}

function nowMs() {
  return Date.now() + state.timeOffsetMs;
}

function buildRenderState() {
  const room = state.room;
  return {
    mode: state.roomCode ? "room" : "lobby",
    coordinate_system: "miniGridIndex 0-8 and cellIndex 0-8, row-major",
    self: {
      player_id: state.playerId,
      nickname: resolvedNickname(),
      in_room: Boolean(state.roomCode),
    },
    room: room ? {
      code: room.code,
      status: room.status,
      current_turn_uid: room.currentTurnUid,
      next_mini_grid: room.board.nextMiniGrid,
      allowed_mini_grids: [...availableMiniGrids(room.board)],
      move_count: room.board.moveCount,
      players: Object.values(room.players).map((player) => ({
        uid: player.uid,
        nickname: player.nickname,
        symbol: player.symbol,
      })),
      board_cells: room.board.cells,
      mini_winners: room.board.miniWinners,
      win_reason: room.winReason,
      winner_uid: room.winnerUid,
    } : null,
    ui: {
      busy: state.busy,
      message: state.notice,
      music_enabled: state.musicEnabled,
    },
  };
}

function installAutomationHooks() {
  window.render_game_to_text = () => JSON.stringify(buildRenderState());
  window.advanceTime = async (ms = 16) => {
    const delta = Math.max(0, Number(ms) || 0);
    state.timeOffsetMs += delta;
    render();
  };
}

function getOrCreatePlayerId() {
  const key = "uttt.playerId";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const next = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `player-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  localStorage.setItem(key, next);
  return next;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
