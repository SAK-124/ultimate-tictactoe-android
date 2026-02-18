package com.sak.ultimatetictactoe.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import com.sak.ultimatetictactoe.ui.theme.NeonBlue

@Composable
fun NeonPanel(
    modifier: Modifier = Modifier,
    contentPadding: PaddingValues = PaddingValues(14.dp),
    content: @Composable () -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(
                    colors = listOf(NeonBlue.copy(alpha = 0.6f), NeonBlue.copy(alpha = 0.12f))
                ),
                shape = RoundedCornerShape(14.dp)
            )
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xFF0B1B30),
                        androidx.compose.ui.graphics.Color(0xCC081424)
                    )
                ),
                shape = RoundedCornerShape(14.dp)
            )
            .padding(contentPadding)
    ) {
        content()
    }
}
