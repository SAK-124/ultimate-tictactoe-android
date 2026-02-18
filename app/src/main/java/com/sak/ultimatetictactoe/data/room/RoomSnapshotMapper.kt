package com.sak.ultimatetictactoe.data.room

import com.sak.ultimatetictactoe.domain.BoardState
import com.sak.ultimatetictactoe.domain.PlayerPresence
import com.sak.ultimatetictactoe.domain.PlayerSymbol
import com.sak.ultimatetictactoe.domain.RoomPlayer
import com.sak.ultimatetictactoe.domain.RoomState
import com.sak.ultimatetictactoe.domain.RoomStatus
import com.sak.ultimatetictactoe.domain.WinReason

object RoomSnapshotMapper {

    fun fromSnapshot(codeHint: String, value: Any?): RoomState? {
        val root = value.asMap()
        if (root.isEmpty()) return null

        val roomCode = root["code"].asString().ifBlank { codeHint }

        val playersRaw = root["players"].asMap()
        val players = playersRaw.mapNotNull { (uid, data) ->
            val map = data.asMap()
            val symbol = PlayerSymbol.fromString(map["symbol"].asString()) ?: return@mapNotNull null
            uid to RoomPlayer(
                uid = uid,
                nickname = map["nickname"].asString().ifBlank { "Player" },
                symbol = symbol,
                joinedAt = map["joinedAt"].asLong()
            )
        }.toMap()

        if (players.isEmpty()) return null

        val meta = root["meta"].asMap()
        val hostUid = meta["hostUid"].asString().ifBlank {
            players.values.firstOrNull { it.symbol == PlayerSymbol.X }?.uid
                ?: players.keys.first()
        }

        val state = root["state"].asMap()
        val cells = state["cells"].asString().takeIf { it.length == 81 } ?: BoardState.EMPTY_CELLS
        val miniWinners = state["miniWinners"].asString().takeIf { it.length == 9 }
            ?: BoardState.EMPTY_MINI_WINNERS

        val board = BoardState(
            cells = cells,
            miniWinners = miniWinners,
            nextMiniGrid = state["nextMiniGrid"].asInt(default = -1),
            moveCount = state["moveCount"].asInt(default = 0)
        )

        val status = state["status"].asEnum(RoomStatus.WAITING)
        val winnerUid = state["winnerUid"].asString().ifBlank { null }
        val winnerSymbol = PlayerSymbol.fromString(state["winnerSymbol"].asString())
        val winReason = state["winReason"].asEnum(WinReason.NONE)

        val presenceRaw = root["presence"].asMap()
        val presence = presenceRaw.mapNotNull { (uid, data) ->
            val map = data.asMap()
            val disconnectedAtValue = map["disconnectedAt"].asLong()
            uid to PlayerPresence(
                uid = uid,
                connected = map["connected"].asBoolean(default = false),
                lastSeen = map["lastSeen"].asLong(),
                disconnectedAt = if (disconnectedAtValue > 0L) disconnectedAtValue else null
            )
        }.toMap()

        val rematch = root["rematch"].asMap()

        return RoomState(
            code = roomCode,
            hostUid = hostUid,
            players = players,
            status = status,
            board = board,
            currentTurnUid = state["currentTurnUid"].asString().ifBlank { hostUid },
            winnerUid = winnerUid,
            winnerSymbol = winnerSymbol,
            winReason = winReason,
            startedAt = state["startedAt"].asLong(),
            updatedAt = state["updatedAt"].asLong(),
            version = state["version"].asInt(),
            presence = presence,
            rematchHostReady = rematch["hostReady"].asBoolean(default = false),
            rematchGuestReady = rematch["guestReady"].asBoolean(default = false),
            rematchNonce = rematch["nonce"].asInt(default = 0)
        )
    }

    fun toMap(roomState: RoomState): Map<String, Any> {
        val playersMap = roomState.players.mapValues { (_, player) ->
            mapOf(
                "uid" to player.uid,
                "nickname" to player.nickname,
                "symbol" to player.symbol.name,
                "joinedAt" to player.joinedAt
            )
        }

        val presenceMap = roomState.presence.mapValues { (_, presence) ->
            mapOf(
                "uid" to presence.uid,
                "connected" to presence.connected,
                "lastSeen" to presence.lastSeen,
                "disconnectedAt" to (presence.disconnectedAt ?: 0L)
            )
        }

        return mapOf(
            "code" to roomState.code,
            "meta" to mapOf(
                "hostUid" to roomState.hostUid,
                "createdAt" to roomState.startedAt
            ),
            "players" to playersMap,
            "state" to mapOf(
                "cells" to roomState.board.cells,
                "miniWinners" to roomState.board.miniWinners,
                "nextMiniGrid" to roomState.board.nextMiniGrid,
                "moveCount" to roomState.board.moveCount,
                "currentTurnUid" to roomState.currentTurnUid,
                "status" to roomState.status.name,
                "winnerUid" to (roomState.winnerUid ?: ""),
                "winnerSymbol" to (roomState.winnerSymbol?.name ?: ""),
                "winReason" to roomState.winReason.name,
                "startedAt" to roomState.startedAt,
                "updatedAt" to roomState.updatedAt,
                "version" to roomState.version
            ),
            "presence" to presenceMap,
            "rematch" to mapOf(
                "hostReady" to roomState.rematchHostReady,
                "guestReady" to roomState.rematchGuestReady,
                "nonce" to roomState.rematchNonce
            )
        )
    }

    private fun Any?.asMap(): Map<String, Any?> {
        val raw = this as? Map<*, *> ?: return emptyMap()
        return raw.entries
            .filter { it.key != null }
            .associate { it.key.toString() to it.value }
    }

    private fun Any?.asString(): String = this as? String ?: ""

    private fun Any?.asLong(default: Long = 0L): Long = when (this) {
        is Long -> this
        is Int -> this.toLong()
        is Double -> this.toLong()
        is Float -> this.toLong()
        is String -> this.toLongOrNull() ?: default
        else -> default
    }

    private fun Any?.asInt(default: Int = 0): Int = when (this) {
        is Int -> this
        is Long -> this.toInt()
        is Double -> this.toInt()
        is Float -> this.toInt()
        is String -> this.toIntOrNull() ?: default
        else -> default
    }

    private fun Any?.asBoolean(default: Boolean = false): Boolean = when (this) {
        is Boolean -> this
        is String -> this.toBooleanStrictOrNull() ?: default
        else -> default
    }

    private inline fun <reified T : Enum<T>> Any?.asEnum(default: T): T {
        val name = (this as? String).orEmpty()
        return enumValues<T>().firstOrNull { it.name == name } ?: default
    }
}
