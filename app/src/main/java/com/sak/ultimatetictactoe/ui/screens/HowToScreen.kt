package com.sak.ultimatetictactoe.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
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
    Column(
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
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 22.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "How to Play",
            style = MaterialTheme.typography.headlineMedium,
            color = NeonBlue
        )

        Text(
            text = "Master the 9x9 board by winning mini-grids and controlling where your opponent is sent next.",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary
        )

        RuleCard(
            title = "1) The Move-Mapping Rule",
            body = "Your move decides your opponent's next mini-grid. Play a cell in position 8, they must play in mini-grid 8."
        )

        RuleCard(
            title = "2) Claim Mini-Grids",
            body = "Get three-in-a-row inside a mini-grid to claim it with your symbol (X or O)."
        )

        RuleCard(
            title = "3) Win the Macro Board",
            body = "Claim three mini-grids in a line on the large 3x3 board to win the whole match."
        )

        RuleCard(
            title = "4) Open Field Rule",
            body = "If you are sent to a full or already won mini-grid, you can play in any unfinished mini-grid.",
            accent = WarningYellow
        )

        Button(
            onClick = onDone,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(if (firstRun) "Start Playing" else "Back")
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
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge,
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
