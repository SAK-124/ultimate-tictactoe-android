package com.sak.ultimatetictactoe.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import com.sak.ultimatetictactoe.ui.theme.NeonBlue

@Composable
fun NeonPanel(
    modifier: Modifier = Modifier,
    contentPadding: PaddingValues = PaddingValues(horizontal = 14.dp, vertical = 12.dp),
    content: @Composable () -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(
                    colors = listOf(NeonBlue.copy(alpha = 0.42f), NeonBlue.copy(alpha = 0.1f))
                ),
                shape = androidx.compose.material3.MaterialTheme.shapes.large
            )
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xE60A1A2C),
                        androidx.compose.ui.graphics.Color(0xCC071220)
                    )
                ),
                shape = androidx.compose.material3.MaterialTheme.shapes.large
            )
            .padding(contentPadding)
    ) {
        content()
    }
}
