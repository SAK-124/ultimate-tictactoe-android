package com.sak.ultimatetictactoe.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sak.ultimatetictactoe.domain.BoardState
import com.sak.ultimatetictactoe.ui.theme.GlowBlue
import com.sak.ultimatetictactoe.ui.theme.GlowPink
import com.sak.ultimatetictactoe.ui.theme.NeonBlue
import com.sak.ultimatetictactoe.ui.theme.NeonPink
import com.sak.ultimatetictactoe.ui.theme.NightCard

@Composable
fun UltimateBoard(
    board: BoardState,
    allowedMiniGrids: Set<Int>,
    interactive: Boolean,
    modifier: Modifier = Modifier,
    onCellTapped: (miniGridIndex: Int, cellIndex: Int) -> Unit,
    onInvalidTap: (() -> Unit)? = null
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(MaterialTheme.shapes.large)
            .background(
                Brush.verticalGradient(
                    colors = listOf(Color(0xFF050E1E), Color(0xFF091A33))
                )
            )
            .padding(10.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        for (row in 0 until 3) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                for (col in 0 until 3) {
                    val miniGridIndex = row * 3 + col
                    MiniGrid(
                        board = board,
                        miniGridIndex = miniGridIndex,
                        highlighted = miniGridIndex in allowedMiniGrids,
                        interactive = interactive,
                        onCellTapped = onCellTapped,
                        onInvalidTap = onInvalidTap,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

@Composable
private fun MiniGrid(
    board: BoardState,
    miniGridIndex: Int,
    highlighted: Boolean,
    interactive: Boolean,
    onCellTapped: (miniGridIndex: Int, cellIndex: Int) -> Unit,
    onInvalidTap: (() -> Unit)?,
    modifier: Modifier = Modifier
) {
    val pulseTransition = rememberInfiniteTransition(label = "mini-pulse")
    val pulse by pulseTransition.animateFloat(
        initialValue = 0.75f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 920),
            repeatMode = RepeatMode.Reverse
        ),
        label = "mini-pulse-alpha"
    )

    val borderColor by androidx.compose.animation.animateColorAsState(
        targetValue = when {
            board.miniWinnerAt(miniGridIndex) == 'X' -> NeonBlue
            board.miniWinnerAt(miniGridIndex) == 'O' -> NeonPink
            highlighted -> NeonBlue.copy(alpha = pulse)
            else -> Color(0xFF223754)
        },
        animationSpec = tween(230),
        label = "mini-border"
    )

    Column(
        modifier = modifier
            .aspectRatio(1f)
            .border(
                BorderStroke(
                    width = if (highlighted) 2.dp else 1.dp,
                    color = borderColor
                ),
                shape = MaterialTheme.shapes.medium
            )
            .background(NightCard.copy(alpha = 0.72f), MaterialTheme.shapes.medium)
            .padding(4.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        for (cellRow in 0 until 3) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                for (cellCol in 0 until 3) {
                    val cellIndex = cellRow * 3 + cellCol
                    val symbol = board.cellAt(miniGridIndex, cellIndex)
                    val isPlayableCell = highlighted && symbol == BoardState.EMPTY && !board.isMiniResolved(miniGridIndex)

                    BoardCell(
                        symbol = symbol,
                        enabled = isPlayableCell,
                        interactive = interactive,
                        onTap = {
                            if (interactive) {
                                if (isPlayableCell) {
                                    onCellTapped(miniGridIndex, cellIndex)
                                } else {
                                    onInvalidTap?.invoke()
                                }
                            }
                        },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

@Composable
private fun BoardCell(
    symbol: Char,
    enabled: Boolean,
    interactive: Boolean,
    onTap: () -> Unit,
    modifier: Modifier = Modifier
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed && interactive) 0.95f else 1f,
        animationSpec = spring(stiffness = 620f, dampingRatio = 0.68f),
        label = "cell-press-scale"
    )

    val backgroundColor = when (symbol) {
        'X' -> GlowBlue
        'O' -> GlowPink
        else -> if (enabled) Color(0xFF152740) else Color(0xFF101D31)
    }

    Box(
        modifier = modifier
            .aspectRatio(1f)
            .sizeIn(minWidth = 48.dp, minHeight = 48.dp)
            .scale(scale)
            .clip(MaterialTheme.shapes.small)
            .background(backgroundColor)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = interactive,
                onClick = onTap
            ),
        contentAlignment = Alignment.Center
    ) {
        AnimatedContent(
            targetState = symbol,
            transitionSpec = {
                (scaleIn(initialScale = 0.6f, animationSpec = tween(170)) + fadeIn(tween(120))).togetherWith(
                    scaleOut(targetScale = 1.2f, animationSpec = tween(140)) + fadeOut(tween(110))
                )
            },
            label = "symbol-reveal"
        ) { symbolState ->
            when (symbolState) {
                'X' -> BoardSymbol("✕", NeonBlue)
                'O' -> BoardSymbol("◉", NeonPink)
                else -> Spacer(modifier = Modifier.size(8.dp))
            }
        }
    }
}

@Composable
private fun BoardSymbol(value: String, color: Color) {
    Text(
        text = value,
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.ExtraBold,
        color = color,
        fontSize = 19.sp,
        modifier = Modifier.padding(top = 1.dp)
    )
}
