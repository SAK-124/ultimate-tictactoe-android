package com.sak.ultimatetictactoe.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.sak.ultimatetictactoe.domain.RoomState
import com.sak.ultimatetictactoe.domain.RoomStatus
import com.sak.ultimatetictactoe.domain.UltimateTicTacToeEngine
import com.sak.ultimatetictactoe.ui.components.NeonPanel
import com.sak.ultimatetictactoe.ui.components.UltimateBoard
import com.sak.ultimatetictactoe.ui.theme.NeonBlue
import com.sak.ultimatetictactoe.ui.theme.NeonPink
import com.sak.ultimatetictactoe.ui.theme.TextSecondary

@Composable
fun GameScreen(
    roomState: RoomState,
    myUid: String,
    opponentGraceRemainingMs: Long?,
    onMove: (miniGridIndex: Int, cellIndex: Int) -> Unit,
    onOpenHowTo: () -> Unit,
    onLeaveToHome: () -> Unit
) {
    val myPlayer = roomState.players[myUid]
    val mySymbol = myPlayer?.symbol
    val opponent = roomState.opponentUid(myUid)?.let { roomState.players[it] }

    val allowedMiniGrids = remember(roomState.board) {
        UltimateTicTacToeEngine.availableMiniGrids(roomState.board)
    }

    val isMyTurn = roomState.status == RoomStatus.ACTIVE && roomState.currentTurnUid == myUid
    val turnLabel = when {
        roomState.status == RoomStatus.WAITING -> "Waiting for second player..."
        isMyTurn -> "Your turn"
        roomState.status == RoomStatus.ACTIVE -> "${opponent?.nickname ?: "Opponent"} is playing"
        else -> "Match finished"
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xFF050A15),
                        androidx.compose.ui.graphics.Color(0xFF091B35),
                        androidx.compose.ui.graphics.Color(0xFF040B17)
                    )
                )
            )
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(onClick = onLeaveToHome) {
                Icon(Icons.Default.Home, contentDescription = "Home", tint = MaterialTheme.colorScheme.onSurface)
            }

            IconButton(onClick = onOpenHowTo) {
                Icon(Icons.Default.HelpOutline, contentDescription = "How to play", tint = NeonBlue)
            }
        }

        NeonPanel {
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(
                    text = "Room ${roomState.code}",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = turnLabel,
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (isMyTurn) NeonBlue else TextSecondary,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = "You: ${myPlayer?.nickname ?: "Player"} (${mySymbol?.name ?: "?"})  •  Opponent: ${opponent?.nickname ?: "Waiting"}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }
        }

        AnimatedVisibility(
            visible = opponentGraceRemainingMs != null,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            NeonPanel {
                val seconds = ((opponentGraceRemainingMs ?: 0L) / 1000L).coerceAtLeast(0)
                Text(
                    text = "Opponent disconnected. Forfeit claim in ${seconds}s if they don't return.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = NeonPink
                )
            }
        }

        UltimateBoard(
            board = roomState.board,
            allowedMiniGrids = allowedMiniGrids,
            interactive = isMyTurn,
            onCellTapped = onMove,
            modifier = Modifier.fillMaxWidth()
        )

        NeonPanel {
            Text(
                text = "Moves: ${roomState.board.moveCount}  •  Next mini-grid: ${if (roomState.board.nextMiniGrid >= 0) roomState.board.nextMiniGrid + 1 else "Any"}",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )
        }

        AnimatedVisibility(
            visible = roomState.status == RoomStatus.FINISHED,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp)
                    .background(
                        Brush.horizontalGradient(
                            listOf(NeonBlue, NeonPink, NeonBlue)
                        )
                    )
            ) {}
        }
    }
}
