package com.sak.ultimatetictactoe.data.room

import com.google.common.truth.Truth.assertThat
import com.sak.ultimatetictactoe.domain.Move
import com.sak.ultimatetictactoe.domain.RoomStatus
import com.sak.ultimatetictactoe.domain.RoomTransactionEngine
import com.sak.ultimatetictactoe.domain.WinReason
import org.junit.Test

class RoomTransactionEngineTest {

    @Test
    fun `allows second player join and blocks third player`() {
        val created = RoomTransactionEngine.createInitialRoom(
            code = "ABC123",
            hostUid = "host",
            nickname = "Host",
            now = 1_000L
        )

        val joined = RoomTransactionEngine.joinRoom(created, "guest", "Guest", 2_000L)
        assertThat(joined).isInstanceOf(RoomTransactionEngine.Outcome.Success::class.java)

        val joinedRoom = (joined as RoomTransactionEngine.Outcome.Success).roomState
        assertThat(joinedRoom.players.size).isEqualTo(2)
        assertThat(joinedRoom.status).isEqualTo(RoomStatus.ACTIVE)

        val thirdJoin = RoomTransactionEngine.joinRoom(joinedRoom, "third", "Third", 3_000L)
        assertThat(thirdJoin).isInstanceOf(RoomTransactionEngine.Outcome.Failure::class.java)
    }

    @Test
    fun `rejects move when turn ownership is wrong`() {
        val created = RoomTransactionEngine.createInitialRoom("ABC123", "host", "Host", 1_000L)
        val joined = RoomTransactionEngine.joinRoom(created, "guest", "Guest", 2_000L)
        val active = (joined as RoomTransactionEngine.Outcome.Success).roomState

        val result = RoomTransactionEngine.submitMove(
            roomState = active,
            move = Move(miniGridIndex = 0, cellIndex = 0, playerUid = "guest"),
            now = 3_000L
        )

        assertThat(result).isInstanceOf(RoomTransactionEngine.Outcome.Failure::class.java)
    }

    @Test
    fun `forfeit succeeds only after disconnect grace window`() {
        val created = RoomTransactionEngine.createInitialRoom("ABC123", "host", "Host", 1_000L)
        val joined = RoomTransactionEngine.joinRoom(created, "guest", "Guest", 2_000L)
        val active = (joined as RoomTransactionEngine.Outcome.Success).roomState

        val disconnected = RoomTransactionEngine.updatePresence(
            roomState = active,
            uid = "guest",
            connected = false,
            now = 3_000L
        )
        val roomAfterDisconnect = (disconnected as RoomTransactionEngine.Outcome.Success).roomState

        val earlyClaim = RoomTransactionEngine.claimForfeit(
            roomState = roomAfterDisconnect,
            claimantUid = "host",
            now = 3_000L + RoomTransactionEngine.FORFEIT_GRACE_MS - 1,
            gracePeriodMs = RoomTransactionEngine.FORFEIT_GRACE_MS
        )
        assertThat(earlyClaim).isInstanceOf(RoomTransactionEngine.Outcome.Failure::class.java)

        val validClaim = RoomTransactionEngine.claimForfeit(
            roomState = roomAfterDisconnect,
            claimantUid = "host",
            now = 3_000L + RoomTransactionEngine.FORFEIT_GRACE_MS + 10,
            gracePeriodMs = RoomTransactionEngine.FORFEIT_GRACE_MS
        )
        assertThat(validClaim).isInstanceOf(RoomTransactionEngine.Outcome.Success::class.java)

        val finalRoom = (validClaim as RoomTransactionEngine.Outcome.Success).roomState
        assertThat(finalRoom.status).isEqualTo(RoomStatus.FINISHED)
        assertThat(finalRoom.winReason).isEqualTo(WinReason.FORFEIT)
        assertThat(finalRoom.winnerUid).isEqualTo("host")
    }

    @Test
    fun `rematch resets board after both players confirm`() {
        val created = RoomTransactionEngine.createInitialRoom("ABC123", "host", "Host", 1_000L)
        val joined = RoomTransactionEngine.joinRoom(created, "guest", "Guest", 2_000L)
        val active = (joined as RoomTransactionEngine.Outcome.Success).roomState

        val finished = active.copy(
            status = RoomStatus.FINISHED,
            winnerUid = "host",
            winReason = WinReason.NORMAL,
            board = active.board.copy(moveCount = 15)
        )

        val hostReady = RoomTransactionEngine.requestRematch(finished, "host", 5_000L)
        val hostReadyRoom = (hostReady as RoomTransactionEngine.Outcome.Success).roomState
        assertThat(hostReadyRoom.rematchHostReady).isTrue()
        assertThat(hostReadyRoom.rematchGuestReady).isFalse()

        val bothReady = RoomTransactionEngine.requestRematch(hostReadyRoom, "guest", 6_000L)
        val rematchRoom = (bothReady as RoomTransactionEngine.Outcome.Success).roomState

        assertThat(rematchRoom.status).isEqualTo(RoomStatus.ACTIVE)
        assertThat(rematchRoom.board.moveCount).isEqualTo(0)
        assertThat(rematchRoom.winnerUid).isNull()
        assertThat(rematchRoom.rematchHostReady).isFalse()
        assertThat(rematchRoom.rematchGuestReady).isFalse()
    }
}
