package com.sak.ultimatetictactoe.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.sak.ultimatetictactoe.domain.RoomState
import com.sak.ultimatetictactoe.domain.WinReason
import com.sak.ultimatetictactoe.ui.components.NeonPanel
import com.sak.ultimatetictactoe.ui.theme.NeonBlue
import com.sak.ultimatetictactoe.ui.theme.NeonPink
import com.sak.ultimatetictactoe.ui.theme.TextSecondary

@Composable
fun SummaryScreen(
    roomState: RoomState,
    myUid: String,
    onRematch: () -> Unit,
    onNewGame: () -> Unit
) {
    val winnerName = roomState.winnerUid?.let { roomState.players[it]?.nickname }
    val meWon = roomState.winnerUid == myUid
    val xWins = roomState.board.miniWinners.count { it == 'X' }
    val oWins = roomState.board.miniWinners.count { it == 'O' }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xFF030914),
                        androidx.compose.ui.graphics.Color(0xFF0A1E3C),
                        androidx.compose.ui.graphics.Color(0xFF071329)
                    )
                )
            )
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 18.dp, vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = if (meWon) "VICTORY" else if (roomState.winReason == WinReason.DRAW) "DRAW" else "MATCH OVER",
            style = MaterialTheme.typography.headlineLarge,
            color = if (meWon) NeonBlue else NeonPink
        )

        Text(
            text = when (roomState.winReason) {
                WinReason.NORMAL -> "${winnerName ?: "A player"} won by claiming three mini-grids in a row."
                WinReason.FORFEIT -> "${winnerName ?: "A player"} wins by forfeit after disconnect grace period."
                WinReason.DRAW -> "All mini-grids resolved with no macro line."
                WinReason.NONE -> "Result pending."
            },
            style = MaterialTheme.typography.bodyLarge,
            color = TextSecondary
        )

        NeonPanel {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                StatRow("Room", roomState.code)
                StatRow("Total Moves", roomState.board.moveCount.toString())
                StatRow("Mini-grids won (X)", xWins.toString())
                StatRow("Mini-grids won (O)", oWins.toString())
                StatRow("Match time", formatElapsed(roomState.startedAt, roomState.updatedAt))
            }
        }

        NeonPanel {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Rematch",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.Bold
                )

                Text(
                    text = "Host ready: ${if (roomState.rematchHostReady) "Yes" else "No"}  •  Guest ready: ${if (roomState.rematchGuestReady) "Yes" else "No"}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )

                Button(onClick = onRematch, modifier = Modifier.fillMaxWidth()) {
                    Text("Rematch")
                }

                OutlinedButton(onClick = onNewGame, modifier = Modifier.fillMaxWidth()) {
                    Text("Back To Home")
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
