import { initializeApp } from "firebase/app";
import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  runTransaction,
  serverTimestamp,
  set,
} from "firebase/database";
import {
  createInitialRoom,
  createMove,
  FORFEIT_GRACE_MS,
  joinRoom,
  claimForfeit,
  requestRematch,
  submitMove,
} from "../engine/room-transaction-engine";
import { fromSnapshot, toMap } from "./room-mapper";

const ROOM_PATH = "webRooms";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.authDomain && firebaseConfig.projectId) {
  firebaseConfig.authDomain = `${firebaseConfig.projectId}.firebaseapp.com`;
}

const requiredKeys = [
  "apiKey",
  "appId",
  "databaseURL",
  "projectId",
  "storageBucket",
];

const missingConfig = requiredKeys
  .filter((key) => !firebaseConfig[key])
  .map((key) => key);

export const firebaseReady = missingConfig.length === 0;
export const firebaseSetupError = firebaseReady
  ? ""
  : `Missing Firebase config: ${missingConfig.join(", ")}`;

const app = firebaseReady ? initializeApp(firebaseConfig) : null;
const db = app ? getDatabase(app) : null;

const notReady = () => {
  throw new Error(firebaseSetupError || "Firebase is not configured");
};

export const realtimeClient = {
  async createRoom(playerId, nickname) {
    if (!db) notReady();

    const safeName = sanitizeNickname(nickname);

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const code = generate4DigitCode();
      const roomRef = ref(db, `${ROOM_PATH}/${code}`);
      const now = Date.now();

      const result = await runTransaction(roomRef, (currentValue) => {
        if (currentValue != null) return;

        const initialRoom = createInitialRoom(code, playerId, safeName, now);
        return toMap(initialRoom);
      }, { applyLocally: false });

      if (!result.committed) {
        continue;
      }

      await this.markPresence(code, playerId, true);
      return code;
    }

    throw new Error("Unable to allocate a unique room code");
  },

  async joinRoom(code, playerId, nickname) {
    if (!db) notReady();

    const normalizedCode = normalizeCode(code);
    const safeName = sanitizeNickname(nickname);

    await mutateRoom(normalizedCode, (currentRoom) => {
      if (!currentRoom) {
        return failure("Room not found");
      }

      return joinRoom(currentRoom, playerId, safeName, Date.now());
    });

    await this.markPresence(normalizedCode, playerId, true);
    return normalizedCode;
  },

  observeRoom(code, onSuccess, onFailure) {
    if (!db) notReady();

    const normalizedCode = normalizeCode(code);
    const roomRef = ref(db, `${ROOM_PATH}/${normalizedCode}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        onFailure(new Error("Room was deleted"));
        return;
      }

      const room = fromSnapshot(normalizedCode, snapshot.val());
      if (!room) {
        onFailure(new Error("Failed to parse room state"));
        return;
      }

      onSuccess(room);
    }, (error) => {
      onFailure(error);
    });

    return unsubscribe;
  },

  async submitMove(code, playerUid, miniGridIndex, cellIndex) {
    if (!db) notReady();

    return mutateRoom(normalizeCode(code), (currentRoom) => {
      if (!currentRoom) {
        return failure("Room not found");
      }

      return submitMove(
        currentRoom,
        createMove(miniGridIndex, cellIndex, playerUid),
        Date.now(),
      );
    });
  },

  async requestRematch(code, playerUid) {
    if (!db) notReady();

    return mutateRoom(normalizeCode(code), (currentRoom) => {
      if (!currentRoom) {
        return failure("Room not found");
      }

      return requestRematch(currentRoom, playerUid, Date.now());
    });
  },

  async claimForfeit(code, claimantUid) {
    if (!db) notReady();

    return mutateRoom(normalizeCode(code), (currentRoom) => {
      if (!currentRoom) {
        return failure("Room not found");
      }

      return claimForfeit(currentRoom, claimantUid, Date.now(), FORFEIT_GRACE_MS);
    });
  },

  async markPresence(code, playerUid, connected) {
    if (!db) notReady();

    const roomCode = normalizeCode(code);
    const presenceRef = ref(db, `${ROOM_PATH}/${roomCode}/presence/${playerUid}`);

    if (connected) {
      await set(presenceRef, {
        uid: playerUid,
        connected: true,
        lastSeen: serverTimestamp(),
        disconnectedAt: 0,
      });

      const disconnectHandle = onDisconnect(presenceRef);
      await disconnectHandle.update({
        connected: false,
        lastSeen: serverTimestamp(),
        disconnectedAt: serverTimestamp(),
      });
      return;
    }

    const now = Date.now();
    await set(presenceRef, {
      uid: playerUid,
      connected: false,
      lastSeen: now,
      disconnectedAt: now,
    });
  },
};

async function mutateRoom(code, mutation) {
  if (!db) notReady();

  const roomRef = ref(db, `${ROOM_PATH}/${code}`);
  let transactionFailure = null;

  const result = await runTransaction(roomRef, (currentValue) => {
    const currentRoom = fromSnapshot(code, currentValue);
    const outcome = mutation(currentRoom);

    if (!outcome.ok) {
      transactionFailure = outcome.reason;
      return;
    }

    return toMap(outcome.roomState);
  }, { applyLocally: false });

  if (!result.committed) {
    throw new Error(transactionFailure || "Operation aborted");
  }

  const parsed = fromSnapshot(code, result.snapshot.val());
  if (!parsed) {
    throw new Error("Failed to parse room after transaction");
  }

  return parsed;
}

function normalizeCode(code) {
  return String(code || "").trim().replace(/\D/g, "").slice(0, 4);
}

function sanitizeNickname(input) {
  const trimmed = String(input || "").trim().slice(0, 22);
  return trimmed || "Player";
}

function generate4DigitCode() {
  const value = Math.floor(Math.random() * 10_000);
  return String(value).padStart(4, "0");
}

function failure(reason) {
  return { ok: false, reason };
}
