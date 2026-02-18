package com.sak.ultimatetictactoe.domain

enum class AuthProvider {
    GOOGLE,
    ANONYMOUS
}

data class PlayerIdentity(
    val uid: String,
    val displayName: String,
    val authProvider: AuthProvider
)

enum class PlayerSymbol(val mark: Char) {
    X('X'),
    O('O');

    companion object {
        fun fromMark(mark: Char?): PlayerSymbol? = when (mark) {
            'X' -> X
            'O' -> O
            else -> null
        }

        fun fromString(value: String?): PlayerSymbol? = fromMark(value?.firstOrNull())
    }
}

data class RoomPlayer(
    val uid: String,
    val nickname: String,
    val symbol: PlayerSymbol,
    val joinedAt: Long
)

data class PlayerPresence(
    val uid: String,
    val connected: Boolean,
    val lastSeen: Long,
    val disconnectedAt: Long?
)

enum class RoomStatus {
    WAITING,
    ACTIVE,
    FINISHED
}

enum class WinReason {
    NONE,
    NORMAL,
    FORFEIT,
    DRAW
}

data class BoardState(
    val cells: String = EMPTY_CELLS,
    val miniWinners: String = EMPTY_MINI_WINNERS,
    val nextMiniGrid: Int = -1,
    val moveCount: Int = 0
) {
    init {
        require(cells.length == 81) { "cells must contain 81 characters" }
        require(miniWinners.length == 9) { "miniWinners must contain 9 characters" }
    }

    fun cellAt(miniGridIndex: Int, cellIndex: Int): Char {
        val boardIndex = UltimateTicTacToeEngine.globalBoardIndex(miniGridIndex, cellIndex)
        return cells[boardIndex]
    }

    fun miniWinnerAt(miniGridIndex: Int): Char = miniWinners[miniGridIndex]

    fun isMiniResolved(miniGridIndex: Int): Boolean = miniWinnerAt(miniGridIndex) != EMPTY

    companion object {
        const val EMPTY: Char = '.'
        const val TIE: Char = 'T'
        val EMPTY_CELLS: String = CharArray(81) { EMPTY }.concatToString()
        val EMPTY_MINI_WINNERS: String = CharArray(9) { EMPTY }.concatToString()
    }
}

data class RoomState(
    val code: String,
    val hostUid: String,
    val players: Map<String, RoomPlayer>,
    val status: RoomStatus,
    val board: BoardState,
    val currentTurnUid: String,
    val winnerUid: String?,
    val winnerSymbol: PlayerSymbol?,
    val winReason: WinReason,
    val startedAt: Long,
    val updatedAt: Long,
    val version: Int,
    val presence: Map<String, PlayerPresence>,
    val rematchHostReady: Boolean,
    val rematchGuestReady: Boolean,
    val rematchNonce: Int
) {
    fun opponentUid(myUid: String): String? = players.keys.firstOrNull { it != myUid }
    fun symbolFor(uid: String): PlayerSymbol? = players[uid]?.symbol
}

data class RoomSession(
    val code: String,
    val identity: PlayerIdentity
)

data class Move(
    val miniGridIndex: Int,
    val cellIndex: Int,
    val playerUid: String,
    val timestamp: Long = System.currentTimeMillis()
)

sealed interface MoveResult {
    data class Accepted(val roomState: RoomState) : MoveResult
    data class Rejected(val reason: String) : MoveResult
}

sealed interface RematchState {
    data class Updated(val roomState: RoomState) : RematchState
    data class Rejected(val reason: String) : RematchState
}
