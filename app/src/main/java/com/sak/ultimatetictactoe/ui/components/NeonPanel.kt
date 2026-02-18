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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.sak.ultimatetictactoe.ui.theme.PurpleAccent

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
                    colors = listOf(PurpleAccent.copy(alpha = 0.48f), PurpleAccent.copy(alpha = 0.12f))
                ),
                shape = androidx.compose.material3.MaterialTheme.shapes.large
            )
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xE6120F1D),
                        Color(0xCC08060F)
                    )
                ),
                shape = androidx.compose.material3.MaterialTheme.shapes.large
            )
            .padding(contentPadding)
    ) {
        content()
    }
}
