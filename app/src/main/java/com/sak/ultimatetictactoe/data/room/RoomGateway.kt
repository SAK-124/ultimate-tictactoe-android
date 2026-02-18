package com.sak.ultimatetictactoe.data.room

import com.sak.ultimatetictactoe.domain.Move
import com.sak.ultimatetictactoe.domain.MoveResult
import com.sak.ultimatetictactoe.domain.PlayerIdentity
import com.sak.ultimatetictactoe.domain.RematchState
import com.sak.ultimatetictactoe.domain.RoomSession
import com.sak.ultimatetictactoe.domain.RoomState
import kotlinx.coroutines.flow.Flow

interface RoomGateway {
    suspend fun createRoom(identity: PlayerIdentity, nickname: String): Result<RoomSession>
    suspend fun joinRoom(code: String, identity: PlayerIdentity, nickname: String): Result<RoomSession>
    fun observeRoom(code: String): Flow<Result<RoomState>>
    suspend fun submitMove(code: String, move: Move): MoveResult
    suspend fun requestRematch(code: String, playerUid: String): RematchState
    suspend fun markPresence(code: String, playerUid: String, connected: Boolean)
    suspend fun claimForfeit(code: String, claimantUid: String, graceMs: Long): Result<RoomState>
}
