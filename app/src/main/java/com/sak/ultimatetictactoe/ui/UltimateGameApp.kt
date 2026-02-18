package com.sak.ultimatetictactoe.ui

import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.sak.ultimatetictactoe.ui.screens.GameScreen
import com.sak.ultimatetictactoe.ui.screens.HomeScreen
import com.sak.ultimatetictactoe.ui.screens.HowToScreen
import com.sak.ultimatetictactoe.ui.screens.SummaryScreen

@Composable
fun UltimateGameApp(
    viewModel: MainViewModel,
    onLaunchGoogleSignIn: (Intent) -> Unit
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(state.snackbarMessage) {
        val message = state.snackbarMessage ?: return@LaunchedEffect
        snackbarHostState.currentSnackbarData?.dismiss()
        snackbarHostState.showSnackbar(message)
        viewModel.clearSnackbar()
    }

    Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
        Scaffold(
            modifier = Modifier.fillMaxSize(),
            containerColor = MaterialTheme.colorScheme.background,
            snackbarHost = {
                SnackbarHost(
                    hostState = snackbarHostState,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
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
                            onHomeModeSelected = viewModel::onHomeModeSelected,
                            onNicknameChanged = viewModel::onNicknameChanged,
                            onRoomCodeChanged = viewModel::onRoomCodeChanged,
                            onStartSoloGame = viewModel::startSoloGame,
                            onCreateRoom = viewModel::createRoom,
                            onJoinRoom = viewModel::joinRoom,
                            onOpenHowTo = { viewModel.openHowTo(AppScreen.HOME) },
                            onContinueWithGoogle = {
                                val intent = viewModel.beginGoogleSignInIntent()
                                if (intent != null) {
                                    onLaunchGoogleSignIn(intent)
                                }
                            },
                            onContinueAsGuest = viewModel::continueAsGuest,
                            onSignOut = viewModel::signOut
                        )

                        AppScreen.HOW_TO -> HowToScreen(
                            firstRun = state.firstRunHowTo,
                            onDone = viewModel::closeHowTo
                        )

                        AppScreen.GAME -> {
                            val roomState = state.roomState
                            val myUid = when {
                                state.isSoloMode -> roomState?.currentTurnUid
                                else -> state.identity?.uid
                            }

                            if (roomState == null || myUid == null) {
                                WaitingForRoomView()
                            } else {
                                GameScreen(
                                    roomState = roomState,
                                    myUid = myUid,
                                    isSoloMode = state.isSoloMode,
                                    opponentGraceRemainingMs = state.opponentGraceRemainingMs,
                                    onMove = viewModel::submitMove,
                                    onOpenHowTo = { viewModel.openHowTo(AppScreen.GAME) },
                                    onLeaveToHome = viewModel::leaveMatchToHome
                                )
                            }
                        }

                        AppScreen.SUMMARY -> {
                            val roomState = state.roomState
                            val myUid = if (state.isSoloMode) null else state.identity?.uid

                            if (roomState == null || (!state.isSoloMode && myUid == null)) {
                                WaitingForRoomView()
                            } else {
                                SummaryScreen(
                                    roomState = roomState,
                                    myUid = myUid,
                                    isSoloMode = state.isSoloMode,
                                    onRematch = viewModel::requestRematch,
                                    onNewGame = viewModel::leaveMatchToHome
                                )
                            }
                        }
                    }
                }
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
