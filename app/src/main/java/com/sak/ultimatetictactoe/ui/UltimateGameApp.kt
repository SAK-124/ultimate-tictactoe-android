package com.sak.ultimatetictactoe.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sak.ultimatetictactoe.ui.screens.GameScreen
import com.sak.ultimatetictactoe.ui.screens.HomeScreen
import com.sak.ultimatetictactoe.ui.screens.HowToScreen
import com.sak.ultimatetictactoe.ui.screens.SummaryScreen
import com.sak.ultimatetictactoe.ui.theme.NeonPink

@Composable
fun UltimateGameApp(viewModel: MainViewModel) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
        Box(modifier = Modifier.fillMaxSize()) {
            if (state.isInitializing) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                listOf(
                                    androidx.compose.ui.graphics.Color(0xFF040A15),
                                    androidx.compose.ui.graphics.Color(0xFF0A1F3E)
                                )
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                }
            } else {
                when (state.currentScreen) {
                    AppScreen.HOME -> HomeScreen(
                        state = state,
                        onNicknameChanged = viewModel::onNicknameChanged,
                        onRoomCodeChanged = viewModel::onRoomCodeChanged,
                        onCreateRoom = viewModel::createRoom,
                        onJoinRoom = viewModel::joinRoom,
                        onOpenHowTo = { viewModel.openHowTo(AppScreen.HOME) }
                    )

                    AppScreen.HOW_TO -> HowToScreen(
                        firstRun = state.firstRunHowTo,
                        onDone = viewModel::closeHowTo
                    )

                    AppScreen.GAME -> {
                        val roomState = state.roomState
                        val identity = state.identity
                        if (roomState == null || identity == null) {
                            WaitingForRoomView()
                        } else {
                            GameScreen(
                                roomState = roomState,
                                myUid = identity.uid,
                                opponentGraceRemainingMs = state.opponentGraceRemainingMs,
                                onMove = viewModel::submitMove,
                                onOpenHowTo = { viewModel.openHowTo(AppScreen.GAME) },
                                onLeaveToHome = viewModel::leaveMatchToHome
                            )
                        }
                    }

                    AppScreen.SUMMARY -> {
                        val roomState = state.roomState
                        val identity = state.identity
                        if (roomState == null || identity == null) {
                            WaitingForRoomView()
                        } else {
                            SummaryScreen(
                                roomState = roomState,
                                myUid = identity.uid,
                                onRematch = viewModel::requestRematch,
                                onNewGame = viewModel::leaveMatchToHome
                            )
                        }
                    }
                }
            }

            state.errorMessage?.let { message ->
                MessageBanner(
                    text = message,
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 16.dp)
                )
            }
        }
    }
}

@Composable
private fun WaitingForRoomView() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Syncing room...",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onBackground
        )
    }
}

@Composable
private fun MessageBanner(text: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .background(NeonPink.copy(alpha = 0.85f), shape = androidx.compose.foundation.shape.RoundedCornerShape(10.dp))
            .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {
        Column {
            Text(
                text = text,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onPrimary
            )
        }
    }
}
