package com.sak.ultimatetictactoe.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val NeonDarkScheme = darkColorScheme(
    primary = NeonBlue,
    onPrimary = TextPrimary,
    secondary = NeonPink,
    onSecondary = TextPrimary,
    tertiary = NeonBlueSoft,
    background = NightBase,
    onBackground = TextPrimary,
    surface = NightPanel,
    onSurface = TextPrimary,
    surfaceVariant = NightCard,
    onSurfaceVariant = TextSecondary,
    error = NeonPink
)

@Composable
fun UltimateTicTacToeTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = NeonDarkScheme,
        typography = AppTypography,
        content = content
    )
}
