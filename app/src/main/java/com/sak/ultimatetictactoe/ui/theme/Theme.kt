package com.sak.ultimatetictactoe.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val NeonDarkScheme = darkColorScheme(
    primary = PurpleAccent,
    onPrimary = TextPrimary,
    secondary = PurpleAccentSoft,
    onSecondary = TextPrimary,
    tertiary = NeonBlue,
    background = NightBase,
    onBackground = TextPrimary,
    surface = NightPanel,
    onSurface = TextPrimary,
    surfaceVariant = NightCard,
    onSurfaceVariant = TextSecondary,
    error = NeonPink
)

@Composable
fun UltimateTicTacToeTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = NeonDarkScheme,
        typography = AppTypography,
        shapes = AppShapes,
        content = content
    )
}
