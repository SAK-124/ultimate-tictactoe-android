package com.sak.ultimatetictactoe.domain

object RoomTransactionEngine {

    const val FORFEIT_GRACE_MS: Long = 45_000

    sealed interface Outcome {
        data class Success(val roomState: RoomState) : Outcome
        data class Failure(val reason: String) : Outcome
    }

    fun createInitialRoom(
        code: String,
        hostUid: String,
        nickname: String,
        now: Long
    ): RoomState {
        val hostPlayer = RoomPlayer(
            uid = hostUid,
            nickname = nickname,
            symbol = PlayerSymbol.X,
            joinedAt = now
        )

        return RoomState(
            code = code,
            hostUid = hostUid,
            players = mapOf(hostUid to hostPlayer),
            status = RoomStatus.WAITING,
            board = BoardState(),
            currentTurnUid = hostUid,
            winnerUid = null,
            winnerSymbol = null,
            winReason = WinReason.NONE,
            startedAt = now,
            updatedAt = now,
            version = 0,
            presence = mapOf(
                hostUid to PlayerPresence(
                    uid = hostUid,
                    connected = true,
                    lastSeen = now,
                    disconnectedAt = null
                )
            ),
            rematchHostReady = false,
            rematchGuestReady = false,
            rematchNonce = 0
        )
    }

    fun joinRoom(
        roomState: RoomState,
        guestUid: String,
        nickname: String,
        now: Long
    ): Outcome {
        if (roomState.players.containsKey(guestUid)) {
            return Outcome.Success(roomState)
        }

        if (roomState.players.size >= 2) {
            return Outcome.Failure("Room is already full")
        }

        val usedSymbols = roomState.players.values.map { it.symbol }.toSet()
        val guestSymbol = if (PlayerSymbol.X in usedSymbols) PlayerSymbol.O else PlayerSymbol.X

        val updatedPlayers = roomState.players + (
            guestUid to RoomPlayer(
                uid = guestUid,
                nickname = nickname,
                symbol = guestSymbol,
                joinedAt = now
            )
            )

        val updatedPresence = roomState.presence + (
            guestUid to PlayerPresence(
                uid = guestUid,
                connected = true,
                lastSeen = now,
                disconnectedAt = null
            )
            )

        val updatedState = roomState.copy(
            players = updatedPlayers,
            presence = updatedPresence,
            status = RoomStatus.ACTIVE,
            updatedAt = now,
            version = roomState.version + 1
        )

        return Outcome.Success(updatedState)
    }

    fun updatePresence(roomState: RoomState, uid: String, connected: Boolean, now: Long): Outcome {
        if (!roomState.players.containsKey(uid)) {
            return Outcome.Failure("Only room participants can update presence")
        }

        val disconnectedAt = if (connected) null else now
        val updatedPresence = roomState.presence + (
            uid to PlayerPresence(
                uid = uid,
                connected = connected,
                lastSeen = now,
                disconnectedAt = disconnectedAt
            )
            )

        return Outcome.Success(
            roomState.copy(
                presence = updatedPresence,
                updatedAt = now,
                version = roomState.version + 1
            )
        )
    }

    fun submitMove(roomState: RoomState, move: Move, now: Long): Outcome {
        if (roomState.status != RoomStatus.ACTIVE) {
            return Outcome.Failure("Match is not active")
        }

        val player = roomState.players[move.playerUid]
            ?: return Outcome.Failure("Player is not part of this room")

        if (roomState.currentTurnUid != move.playerUid) {
            return Outcome.Failure("It is not your turn")
        }

        val outcome = UltimateTicTacToeEngine.applyMove(
            board = roomState.board,
            miniGridIndex = move.miniGridIndex,
            cellIndex = move.cellIndex,
            symbol = player.symbol
        )

        if (!outcome.isValid) {
            return Outcome.Failure(outcome.error ?: "Invalid move")
        }

        val winnerSymbol = outcome.globalWinner
        val isDraw = outcome.isDraw
        val isFinished = winnerSymbol != null || isDraw

        val nextTurn = if (isFinished) {
            roomState.currentTurnUid
        } else {
            roomState.opponentUid(move.playerUid) ?: roomState.currentTurnUid
        }

        val updatedState = roomState.copy(
            board = outcome.board,
            status = if (isFinished) RoomStatus.FINISHED else RoomStatus.ACTIVE,
            currentTurnUid = nextTurn,
            winnerUid = when {
                winnerSymbol != null -> move.playerUid
                else -> null
            },
            winnerSymbol = winnerSymbol,
            winReason = when {
                winnerSymbol != null -> WinReason.NORMAL
                isDraw -> WinReason.DRAW
                else -> WinReason.NONE
            },
            updatedAt = now,
            version = roomState.version + 1,
            rematchHostReady = false,
            rematchGuestReady = false
        )

        return Outcome.Success(updatedState)
    }

    fun requestRematch(roomState: RoomState, uid: String, now: Long): Outcome {
        if (roomState.status != RoomStatus.FINISHED) {
            return Outcome.Failure("Rematch is only available after a finished game")
        }

        if (!roomState.players.containsKey(uid)) {
            return Outcome.Failure("Only participants can request rematch")
        }

        if (roomState.players.size < 2) {
            return Outcome.Failure("Need two players for a rematch")
        }

        var hostReady = roomState.rematchHostReady
        var guestReady = roomState.rematchGuestReady

        if (uid == roomState.hostUid) {
            hostReady = true
        } else {
            guestReady = true
        }

        return if (hostReady && guestReady) {
            Outcome.Success(
                roomState.copy(
                    board = BoardState(),
                    status = RoomStatus.ACTIVE,
                    currentTurnUid = roomState.hostUid,
                    winnerUid = null,
                    winnerSymbol = null,
                    winReason = WinReason.NONE,
                    updatedAt = now,
                    version = roomState.version + 1,
                    rematchHostReady = false,
                    rematchGuestReady = false,
                    rematchNonce = roomState.rematchNonce + 1
                )
            )
        } else {
            Outcome.Success(
                roomState.copy(
                    rematchHostReady = hostReady,
                    rematchGuestReady = guestReady,
                    updatedAt = now,
                    version = roomState.version + 1
                )
            )
        }
    }

    fun claimForfeit(
        roomState: RoomState,
        claimantUid: String,
        now: Long,
        gracePeriodMs: Long = FORFEIT_GRACE_MS
    ): Outcome {
        if (roomState.status != RoomStatus.ACTIVE) {
            return Outcome.Failure("Forfeit can only be claimed during an active match")
        }

        if (!roomState.players.containsKey(claimantUid)) {
            return Outcome.Failure("Only participants can claim forfeit")
        }

        val opponentUid = roomState.opponentUid(claimantUid)
            ?: return Outcome.Failure("Opponent is missing")

        val opponentPresence = roomState.presence[opponentUid]
            ?: return Outcome.Failure("Opponent presence not found")

        if (opponentPresence.connected) {
            return Outcome.Failure("Opponent is still connected")
        }

        val disconnectedAt = opponentPresence.disconnectedAt
            ?: return Outcome.Failure("No disconnect timestamp found")

        if (now - disconnectedAt < gracePeriodMs) {
            return Outcome.Failure("Grace period has not elapsed yet")
        }

        val winnerSymbol = roomState.symbolFor(claimantUid)
            ?: return Outcome.Failure("Could not determine winner symbol")

        return Outcome.Success(
            roomState.copy(
                status = RoomStatus.FINISHED,
                winnerUid = claimantUid,
                winnerSymbol = winnerSymbol,
                winReason = WinReason.FORFEIT,
                updatedAt = now,
                version = roomState.version + 1,
                rematchHostReady = false,
                rematchGuestReady = false
            )
        )
    }
}
