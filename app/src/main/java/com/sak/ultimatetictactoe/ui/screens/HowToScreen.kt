package com.sak.ultimatetictactoe.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.sak.ultimatetictactoe.ui.components.NeonPanel
import com.sak.ultimatetictactoe.ui.theme.NeonBlue
import com.sak.ultimatetictactoe.ui.theme.NeonPink
import com.sak.ultimatetictactoe.ui.theme.TextSecondary
import com.sak.ultimatetictactoe.ui.theme.WarningYellow

@Composable
fun HowToScreen(
    firstRun: Boolean,
    onDone: () -> Unit
) {
    BoxWithConstraints(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xFF030A16),
                        androidx.compose.ui.graphics.Color(0xFF0A1A32),
                        androidx.compose.ui.graphics.Color(0xFF061324)
                    )
                )
            )
    ) {
        val compactHeight = maxHeight < 760.dp

        Column(
            modifier = Modifier
                .fillMaxSize()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 18.dp, vertical = if (compactHeight) 14.dp else 20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Text(
                text = "How to Play",
                style = MaterialTheme.typography.headlineMedium,
                color = NeonBlue
            )

            Text(
                text = "Win mini-grids, then win the macro board.",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )

            RuleCard(
                title = "Move Mapping",
                body = "The cell you play decides which mini-grid your opponent must play in next."
            )

            RuleCard(
                title = "Claiming Grids",
                body = "Get three in a row inside a mini-grid to claim it for X or O."
            )

            RuleCard(
                title = "Final Victory",
                body = "Claim three mini-grids in a row on the big board to win the match."
            )

            RuleCard(
                title = "Open Field",
                body = "If directed to a full or already won mini-grid, play in any unfinished mini-grid.",
                accent = WarningYellow
            )

            Button(
                onClick = onDone,
                modifier = Modifier
                    .fillMaxWidth()
                    .sizeIn(minHeight = 52.dp)
            ) {
                Text(if (firstRun) "Start Playing" else "Back")
            }
        }
    }
}

@Composable
private fun RuleCard(
    title: String,
    body: String,
    accent: androidx.compose.ui.graphics.Color = NeonPink
) {
    NeonPanel {
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                color = accent,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = body,
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )
        }
    }
}
