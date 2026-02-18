package com.sak.ultimatetictactoe.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sak.ultimatetictactoe.domain.BoardState
import com.sak.ultimatetictactoe.domain.RoomState
import com.sak.ultimatetictactoe.domain.WinReason
import com.sak.ultimatetictactoe.ui.components.NeonPanel
import com.sak.ultimatetictactoe.ui.theme.NeonBlue
import com.sak.ultimatetictactoe.ui.theme.NeonPink
import com.sak.ultimatetictactoe.ui.theme.TextSecondary

@Composable
fun SummaryScreen(
    roomState: RoomState,
    myUid: String?,
    isSoloMode: Boolean,
    onRematch: () -> Unit,
    onNewGame: () -> Unit
) {
    val haptics = LocalHapticFeedback.current
    val winnerName = roomState.winnerUid?.let { roomState.players[it]?.nickname }
    val meWon = myUid != null && roomState.winnerUid == myUid
    val xWins = roomState.board.miniWinners.count { it == 'X' }
    val oWins = roomState.board.miniWinners.count { it == 'O' }
    val title = when {
        roomState.winReason == WinReason.DRAW -> "DRAW"
        isSoloMode && roomState.winnerSymbol?.mark == 'X' -> "X WINS"
        isSoloMode && roomState.winnerSymbol?.mark == 'O' -> "O WINS"
        meWon -> "VICTORY"
        roomState.winnerUid != null -> "DEFEAT"
        else -> "MATCH OVER"
    }
    val titleColor = when {
        roomState.winReason == WinReason.DRAW -> TextSecondary
        isSoloMode && roomState.winnerSymbol?.mark == 'X' -> NeonBlue
        isSoloMode && roomState.winnerSymbol?.mark == 'O' -> NeonPink
        meWon -> NeonBlue
        else -> NeonPink
    }

    BoxWithConstraints(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xFF000000),
                        androidx.compose.ui.graphics.Color(0xFF140A22),
                        androidx.compose.ui.graphics.Color(0xFF000000)
                    )
                )
            )
    ) {
        val compactHeight = maxHeight < 740.dp

        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 18.dp, vertical = if (compactHeight) 14.dp else 20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.headlineLarge,
                color = titleColor
            )

            Text(
                text = when (roomState.winReason) {
                    WinReason.NORMAL -> "${winnerName ?: "A player"} made the winning line."
                    WinReason.FORFEIT -> "${winnerName ?: "A player"} won by forfeit after disconnect grace."
                    WinReason.DRAW -> "All mini-grids resolved with no macro line."
                    WinReason.NONE -> "Result pending."
                },
                style = MaterialTheme.typography.bodyLarge,
                color = TextSecondary
            )

            NeonPanel {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    StatRow("Room", if (isSoloMode) "Solo" else roomState.code)
                    StatRow("Moves", roomState.board.moveCount.toString())
                    StatRow("X mini-grids", xWins.toString())
                    StatRow("O mini-grids", oWins.toString())
                    StatRow("Time", formatElapsed(roomState.startedAt, roomState.updatedAt))
                }
            }

            NeonPanel {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Final Board Snapshot",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Bold
                    )
                    SummaryBoardSnapshot(board = roomState.board)
                }
            }

            NeonPanel {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Rematch",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Bold
                    )

                    if (isSoloMode) {
                        Text(
                            text = "Instant board reset for another pass-and-play round.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary
                        )
                    } else {
                        Text(
                            text = "Host ready: ${if (roomState.rematchHostReady) "Yes" else "No"}  •  Guest ready: ${if (roomState.rematchGuestReady) "Yes" else "No"}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary
                        )
                    }

                    Button(
                        onClick = {
                            haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                            onRematch()
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .sizeIn(minHeight = 52.dp)
                    ) {
                        Text(if (isSoloMode) "Play Again" else "Rematch")
                    }

                    OutlinedButton(
                        onClick = {
                            haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                            onNewGame()
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .sizeIn(minHeight = 52.dp)
                    ) {
                        Text("Back To Home")
                    }
                }
            }
        }
    }
}

@Composable
private fun StatRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, color = TextSecondary, style = MaterialTheme.typography.bodyMedium)
        Text(text = value, color = MaterialTheme.colorScheme.onSurface, style = MaterialTheme.typography.bodyMedium)
    }
}

private fun formatElapsed(startedAt: Long, updatedAt: Long): String {
    val elapsed = (updatedAt - startedAt).coerceAtLeast(0L)
    val minutes = elapsed / 60_000
    val seconds = (elapsed % 60_000) / 1_000
    return "%02d:%02d".format(minutes, seconds)
}

@Composable
private fun SummaryBoardSnapshot(board: BoardState) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0x29000000), MaterialTheme.shapes.large)
            .padding(8.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        for (bigRow in 0 until 3) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                for (bigCol in 0 until 3) {
                    val miniGridIndex = bigRow * 3 + bigCol
                    MiniSnapshot(board = board, miniGridIndex = miniGridIndex, modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun MiniSnapshot(board: BoardState, miniGridIndex: Int, modifier: Modifier = Modifier) {
    val miniWinner = board.miniWinnerAt(miniGridIndex)
    val overlayColor = when (miniWinner) {
        'X' -> NeonBlue.copy(alpha = 0.2f)
        'O' -> NeonPink.copy(alpha = 0.2f)
        BoardState.TIE -> Color.White.copy(alpha = 0.1f)
        else -> Color.Transparent
    }

    Box(
        modifier = modifier
            .aspectRatio(1f)
            .background(Color(0x66151024), MaterialTheme.shapes.medium)
            .padding(3.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
            for (row in 0 until 3) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(3.dp)
                ) {
                    for (col in 0 until 3) {
                        val cellIndex = row * 3 + col
                        val symbol = board.cellAt(miniGridIndex, cellIndex)
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .aspectRatio(1f)
                                .background(Color(0x77211630), MaterialTheme.shapes.small)
                        ) {
                            if (symbol != BoardState.EMPTY) {
                                val cellColor = if (symbol == 'X') NeonBlue else NeonPink
                                Text(
                                    text = if (symbol == 'X') "✕" else "◉",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = cellColor,
                                    modifier = Modifier.padding(2.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        if (miniWinner == 'X' || miniWinner == 'O') {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(overlayColor, MaterialTheme.shapes.medium)
            )
            Text(
                text = if (miniWinner == 'X') "X" else "O",
                color = if (miniWinner == 'X') NeonBlue else NeonPink,
                fontWeight = FontWeight.Bold,
                fontStyle = FontStyle.Italic,
                fontSize = 18.sp,
                modifier = Modifier.padding(6.dp)
            )
        }
    }
}
