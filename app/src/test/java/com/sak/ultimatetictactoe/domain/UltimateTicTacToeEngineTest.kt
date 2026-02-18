package com.sak.ultimatetictactoe.domain

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class UltimateTicTacToeEngineTest {

    @Test
    fun `applies valid move and routes next mini-grid`() {
        val board = BoardState()

        val move = UltimateTicTacToeEngine.applyMove(
            board = board,
            miniGridIndex = 0,
            cellIndex = 8,
            symbol = PlayerSymbol.X
        )

        assertThat(move.isValid).isTrue()
        assertThat(move.board.cellAt(0, 8)).isEqualTo('X')
        assertThat(move.board.nextMiniGrid).isEqualTo(8)
    }

    @Test
    fun `rejects move outside forced mini-grid`() {
        val firstMove = UltimateTicTacToeEngine.applyMove(BoardState(), 0, 8, PlayerSymbol.X)

        val invalidMove = UltimateTicTacToeEngine.applyMove(
            board = firstMove.board,
            miniGridIndex = 0,
            cellIndex = 0,
            symbol = PlayerSymbol.O
        )

        assertThat(invalidMove.isValid).isFalse()
        assertThat(invalidMove.error).contains("highlighted mini-grid")
    }

    @Test
    fun `allows open field when directed mini-grid is resolved`() {
        val board = BoardState(
            miniWinners = "........T",
            nextMiniGrid = 8
        )

        val allowed = UltimateTicTacToeEngine.availableMiniGrids(board)
        assertThat(allowed).contains(0)
        assertThat(allowed).doesNotContain(8)

        val move = UltimateTicTacToeEngine.applyMove(board, 0, 0, PlayerSymbol.X)
        assertThat(move.isValid).isTrue()
    }

    @Test
    fun `claims mini-grid when three in row are completed`() {
        val cells = BoardState.EMPTY_CELLS.toCharArray()
        cells[UltimateTicTacToeEngine.globalBoardIndex(0, 0)] = 'X'
        cells[UltimateTicTacToeEngine.globalBoardIndex(0, 1)] = 'X'

        val board = BoardState(cells = cells.concatToString())

        val move = UltimateTicTacToeEngine.applyMove(board, 0, 2, PlayerSymbol.X)

        assertThat(move.isValid).isTrue()
        assertThat(move.board.miniWinners[0]).isEqualTo('X')
    }

    @Test
    fun `detects global winner from mini-grid victories`() {
        val cells = BoardState.EMPTY_CELLS.toCharArray()
        cells[UltimateTicTacToeEngine.globalBoardIndex(2, 0)] = 'X'
        cells[UltimateTicTacToeEngine.globalBoardIndex(2, 1)] = 'X'

        val board = BoardState(
            cells = cells.concatToString(),
            miniWinners = "XX......."
        )

        val move = UltimateTicTacToeEngine.applyMove(board, 2, 2, PlayerSymbol.X)

        assertThat(move.isValid).isTrue()
        assertThat(move.globalWinner).isEqualTo(PlayerSymbol.X)
        assertThat(move.isDraw).isFalse()
    }

    @Test
    fun `marks draw when all mini-grids resolved without global line`() {
        val cells = BoardState.EMPTY_CELLS.toCharArray()
        val preFill = mapOf(
            0 to 'X', 1 to 'O', 2 to 'X',
            3 to 'X', 4 to 'O', 5 to 'O',
            6 to 'O', 7 to 'X'
        )

        preFill.forEach { (cellIndex, value) ->
            cells[UltimateTicTacToeEngine.globalBoardIndex(8, cellIndex)] = value
        }

        val board = BoardState(
            cells = cells.concatToString(),
            miniWinners = "XOTOXOOX.",
            nextMiniGrid = -1
        )

        val move = UltimateTicTacToeEngine.applyMove(board, 8, 8, PlayerSymbol.X)

        assertThat(move.isValid).isTrue()
        assertThat(move.globalWinner).isNull()
        assertThat(move.isDraw).isTrue()
        assertThat(move.board.miniWinners[8]).isEqualTo('T')
    }
}
