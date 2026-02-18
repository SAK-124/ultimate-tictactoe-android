package com.sak.ultimatetictactoe.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.HelpOutline
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
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
    isSoloMode: Boolean,
    opponentGraceRemainingMs: Long?,
    onMove: (miniGridIndex: Int, cellIndex: Int) -> Unit,
    onOpenHowTo: () -> Unit,
    onLeaveToHome: () -> Unit
) {
    val haptics = LocalHapticFeedback.current
    val myPlayer = roomState.players[myUid]
    val mySymbol = myPlayer?.symbol
    val opponent = roomState.opponentUid(myUid)?.let { roomState.players[it] }

    val allowedMiniGrids = remember(roomState.board) {
        UltimateTicTacToeEngine.availableMiniGrids(roomState.board)
    }

    val currentTurnPlayer = roomState.players[roomState.currentTurnUid]
    val isMyTurn = if (isSoloMode) {
        roomState.status == RoomStatus.ACTIVE
    } else {
        roomState.status == RoomStatus.ACTIVE && roomState.currentTurnUid == myUid
    }
    val turnLabel = when {
        roomState.status == RoomStatus.WAITING -> "Waiting for opponent"
        isSoloMode && roomState.status == RoomStatus.ACTIVE ->
            "${currentTurnPlayer?.nickname ?: "Player"} turn"
        isMyTurn -> "Your turn"
        roomState.status == RoomStatus.ACTIVE -> "${opponent?.nickname ?: "Opponent"} is playing"
        else -> "Match finished"
    }

    BoxWithConstraints(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xFF040A15),
                        androidx.compose.ui.graphics.Color(0xFF0A1A32),
                        androidx.compose.ui.graphics.Color(0xFF030913)
                    )
                )
            )
    ) {
        val compactHeight = maxHeight < 740.dp
        val spacing = if (compactHeight) 10.dp else 12.dp

        Column(
            modifier = Modifier
                .fillMaxSize()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 14.dp, vertical = if (compactHeight) 12.dp else 16.dp),
            verticalArrangement = Arrangement.spacedBy(spacing)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(onClick = onLeaveToHome, modifier = Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)) {
                    Icon(Icons.Default.Home, contentDescription = "Home", tint = MaterialTheme.colorScheme.onSurface)
                }

                IconButton(onClick = onOpenHowTo, modifier = Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)) {
                    Icon(Icons.AutoMirrored.Filled.HelpOutline, contentDescription = "How to play", tint = NeonBlue)
                }
            }

            NeonPanel {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = if (isSoloMode) "Solo Mode" else "Room ${roomState.code}",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = turnLabel,
                        style = MaterialTheme.typography.titleLarge,
                        color = if (isMyTurn) NeonBlue else TextSecondary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = if (isSoloMode) {
                            "Pass-and-play: X and O alternate on this device"
                        } else {
                            "${myPlayer?.nickname ?: "You"} (${mySymbol?.name ?: "?"}) vs ${opponent?.nickname ?: "Waiting"}"
                        },
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )
                }
            }

            AnimatedVisibility(
                visible = !isSoloMode && opponentGraceRemainingMs != null,
                enter = fadeIn(),
                exit = fadeOut()
            ) {
                Surface(color = NeonPink.copy(alpha = 0.14f), shape = MaterialTheme.shapes.medium) {
                    val seconds = ((opponentGraceRemainingMs ?: 0L) / 1000L).coerceAtLeast(0)
                    Text(
                        text = "Opponent disconnected. Forfeit in ${seconds}s if they don't return.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = NeonPink,
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)
                    )
                }
            }

            UltimateBoard(
                board = roomState.board,
                allowedMiniGrids = allowedMiniGrids,
                interactive = isMyTurn,
                onCellTapped = { mini, cell ->
                    haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                    onMove(mini, cell)
                },
                onInvalidTap = {
                    haptics.performHapticFeedback(HapticFeedbackType.LongPress)
                },
                modifier = Modifier.fillMaxWidth()
            )

            NeonPanel {
                Text(
                    text = "Moves ${roomState.board.moveCount} • Next grid ${if (roomState.board.nextMiniGrid >= 0) roomState.board.nextMiniGrid + 1 else "Any"}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }
        }
    }
}
