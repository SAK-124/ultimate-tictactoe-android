package com.sak.ultimatetictactoe.domain

object UltimateTicTacToeEngine {

    private val winLines = listOf(
        intArrayOf(0, 1, 2),
        intArrayOf(3, 4, 5),
        intArrayOf(6, 7, 8),
        intArrayOf(0, 3, 6),
        intArrayOf(1, 4, 7),
        intArrayOf(2, 5, 8),
        intArrayOf(0, 4, 8),
        intArrayOf(2, 4, 6)
    )

    data class MoveApplication(
        val board: BoardState,
        val globalWinner: PlayerSymbol?,
        val isDraw: Boolean,
        val error: String?
    ) {
        val isValid: Boolean = error == null
    }

    fun availableMiniGrids(board: BoardState): Set<Int> {
        val forced = board.nextMiniGrid
        if (forced in 0..8 && isMiniPlayable(board, forced)) {
            return setOf(forced)
        }

        return (0..8)
            .asSequence()
            .filter { isMiniPlayable(board, it) }
            .toSet()
    }

    fun isMiniPlayable(board: BoardState, miniGridIndex: Int): Boolean {
        if (miniGridIndex !in 0..8) return false
        if (board.miniWinners[miniGridIndex] != BoardState.EMPTY) return false
        return !isMiniFull(board.cells, miniGridIndex)
    }

    fun isMiniFull(cells: String, miniGridIndex: Int): Boolean {
        for (cellIndex in 0..8) {
            if (cells[globalBoardIndex(miniGridIndex, cellIndex)] == BoardState.EMPTY) {
                return false
            }
        }
        return true
    }

    fun globalBoardIndex(miniGridIndex: Int, cellIndex: Int): Int {
        require(miniGridIndex in 0..8) { "miniGridIndex out of bounds" }
        require(cellIndex in 0..8) { "cellIndex out of bounds" }

        val miniRow = miniGridIndex / 3
        val miniCol = miniGridIndex % 3
        val cellRow = cellIndex / 3
        val cellCol = cellIndex % 3

        val row = miniRow * 3 + cellRow
        val col = miniCol * 3 + cellCol
        return row * 9 + col
    }

    fun applyMove(
        board: BoardState,
        miniGridIndex: Int,
        cellIndex: Int,
        symbol: PlayerSymbol
    ): MoveApplication {
        if (miniGridIndex !in 0..8 || cellIndex !in 0..8) {
            return MoveApplication(board, null, false, "Move indices out of bounds")
        }

        val allowed = availableMiniGrids(board)
        if (allowed.isEmpty()) {
            return MoveApplication(board, null, false, "No playable mini-grids left")
        }

        if (miniGridIndex !in allowed) {
            return MoveApplication(board, null, false, "Move must be played in the highlighted mini-grid")
        }

        val globalIndex = globalBoardIndex(miniGridIndex, cellIndex)
        if (board.cells[globalIndex] != BoardState.EMPTY) {
            return MoveApplication(board, null, false, "Cell is already occupied")
        }

        val cells = board.cells.toCharArray()
        val miniWinners = board.miniWinners.toCharArray()
        cells[globalIndex] = symbol.mark

        val miniWinner = evaluateMiniWinner(cells, miniGridIndex)
        if (miniWinner != null) {
            miniWinners[miniGridIndex] = miniWinner
        } else if (isMiniFull(cells.concatToString(), miniGridIndex)) {
            miniWinners[miniGridIndex] = BoardState.TIE
        }

        val globalWinnerMark = evaluateGlobalWinner(miniWinners)
        val globalWinner = PlayerSymbol.fromMark(globalWinnerMark)
        val isDraw = globalWinner == null && miniWinners.none { it == BoardState.EMPTY }

        val directedMini = cellIndex
        val nextMiniGrid = if (directedMini in 0..8 && isMiniPlayable(
                BoardState(
                    cells = cells.concatToString(),
                    miniWinners = miniWinners.concatToString(),
                    nextMiniGrid = directedMini,
                    moveCount = board.moveCount + 1
                ),
                directedMini
            )
        ) {
            directedMini
        } else {
            -1
        }

        val nextBoard = BoardState(
            cells = cells.concatToString(),
            miniWinners = miniWinners.concatToString(),
            nextMiniGrid = nextMiniGrid,
            moveCount = board.moveCount + 1
        )

        return MoveApplication(
            board = nextBoard,
            globalWinner = globalWinner,
            isDraw = isDraw,
            error = null
        )
    }

    private fun evaluateMiniWinner(cells: CharArray, miniGridIndex: Int): Char? {
        val miniValues = CharArray(9) { index -> cells[globalBoardIndex(miniGridIndex, index)] }
        return evaluateWinner(miniValues)
    }

    private fun evaluateGlobalWinner(miniWinners: CharArray): Char? {
        return evaluateWinner(miniWinners)
    }

    private fun evaluateWinner(values: CharArray): Char? {
        for (line in winLines) {
            val a = values[line[0]]
            val b = values[line[1]]
            val c = values[line[2]]
            if (a != BoardState.EMPTY && a != BoardState.TIE && a == b && b == c) {
                return a
            }
        }
        return null
    }
}
