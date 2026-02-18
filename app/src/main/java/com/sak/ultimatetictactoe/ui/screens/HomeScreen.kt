package com.sak.ultimatetictactoe.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.sak.ultimatetictactoe.domain.AuthProvider
import com.sak.ultimatetictactoe.ui.AuthUiState
import com.sak.ultimatetictactoe.ui.HomeMode
import com.sak.ultimatetictactoe.ui.MainUiState
import com.sak.ultimatetictactoe.ui.components.NeonPanel
import com.sak.ultimatetictactoe.ui.theme.NeonBlue
import com.sak.ultimatetictactoe.ui.theme.NeonPink
import com.sak.ultimatetictactoe.ui.theme.PurpleAccent
import com.sak.ultimatetictactoe.ui.theme.TextSecondary

@Composable
fun HomeScreen(
    state: MainUiState,
    onHomeModeSelected: (HomeMode) -> Unit,
    onNicknameChanged: (String) -> Unit,
    onRoomCodeChanged: (String) -> Unit,
    onStartSoloGame: () -> Unit,
    onCreateRoom: () -> Unit,
    onJoinRoom: () -> Unit,
    onMusicEnabledChanged: (Boolean) -> Unit,
    onMusicVolumeChanged: (Float) -> Unit,
    onOpenHowTo: () -> Unit,
    onContinueWithGoogle: () -> Unit,
    onContinueAsGuest: () -> Unit,
    onSignOut: () -> Unit
) {
    val haptics = LocalHapticFeedback.current

    BoxWithConstraints(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xFF000000),
                        androidx.compose.ui.graphics.Color(0xFF120A20),
                        androidx.compose.ui.graphics.Color(0xFF000000)
                    )
                )
            )
    ) {
        val compactHeight = maxHeight < 760.dp
        val spacing = if (compactHeight) 10.dp else 14.dp
        val titleSize = if (compactHeight) MaterialTheme.typography.headlineMedium else MaterialTheme.typography.headlineLarge

        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 18.dp, vertical = if (compactHeight) 12.dp else 16.dp),
            verticalArrangement = Arrangement.spacedBy(spacing)
        ) {
            Text(
                text = "ULTIMATE TIC-TAC-TOE",
                style = titleSize,
                color = PurpleAccent
            )

            Text(
                text = "Fast 1v1 room battles or local pass-and-play.",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )

            ModeHero(state.selectedHomeMode)

            NeonPanel {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(
                            text = "Player Setup",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontWeight = FontWeight.Bold
                        )
                        IdentityChip(state)
                    }

                    if (state.identity == null) {
                        Button(
                            onClick = {
                                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                onContinueWithGoogle()
                            },
                            enabled = !state.isProcessing,
                            modifier = Modifier
                                .fillMaxWidth()
                                .sizeIn(minHeight = 52.dp)
                        ) {
                            Text("Continue with Google")
                        }

                        OutlinedButton(
                            onClick = {
                                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                onContinueAsGuest()
                            },
                            enabled = !state.isProcessing,
                            modifier = Modifier
                                .fillMaxWidth()
                                .sizeIn(minHeight = 52.dp)
                        ) {
                            Text("Play as Guest")
                        }
                    } else {
                        Text(
                            text = "${state.identity.displayName} (${if (state.identity.authProvider == AuthProvider.GOOGLE) "Google" else "Guest"})",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary
                        )

                        TextButton(
                            onClick = {
                                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                onSignOut()
                            },
                            enabled = !state.isProcessing
                        ) {
                            Text("Switch account")
                        }
                    }
                }
            }

            NeonPanel {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Choose Mode",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        ModeButton(
                            label = "Create",
                            selected = state.selectedHomeMode == HomeMode.CREATE,
                            onClick = {
                                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                onHomeModeSelected(HomeMode.CREATE)
                            },
                            modifier = Modifier.weight(1f)
                        )
                        ModeButton(
                            label = "Join",
                            selected = state.selectedHomeMode == HomeMode.JOIN,
                            onClick = {
                                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                onHomeModeSelected(HomeMode.JOIN)
                            },
                            modifier = Modifier.weight(1f)
                        )
                        ModeButton(
                            label = "Solo",
                            selected = state.selectedHomeMode == HomeMode.SOLO,
                            onClick = {
                                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                onHomeModeSelected(HomeMode.SOLO)
                            },
                            modifier = Modifier.weight(1f)
                        )
                    }

                    AnimatedContent(
                        targetState = state.selectedHomeMode,
                        transitionSpec = {
                            (slideInVertically { it / 4 } + fadeIn()).togetherWith(
                                slideOutVertically { -it / 4 } + fadeOut()
                            )
                        },
                        label = "home-step"
                    ) { mode ->
                        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            OutlinedTextField(
                                value = state.nickname,
                                onValueChange = onNicknameChanged,
                                modifier = Modifier.fillMaxWidth(),
                                label = { Text("Nickname") },
                                singleLine = true,
                                shape = RoundedCornerShape(18.dp),
                                colors = TextFieldDefaults.colors(
                                    focusedContainerColor = androidx.compose.ui.graphics.Color(0x2A8B5CF6),
                                    unfocusedContainerColor = androidx.compose.ui.graphics.Color(0x160F0C17)
                                )
                            )

                            if (mode == HomeMode.JOIN) {
                                OutlinedTextField(
                                    value = state.roomCodeInput,
                                    onValueChange = onRoomCodeChanged,
                                    modifier = Modifier.fillMaxWidth(),
                                    label = { Text("Room code") },
                                    singleLine = true,
                                    keyboardOptions = KeyboardOptions(
                                        keyboardType = KeyboardType.NumberPassword,
                                        capitalization = KeyboardCapitalization.None
                                    ),
                                    shape = RoundedCornerShape(18.dp),
                                    colors = TextFieldDefaults.colors(
                                        focusedContainerColor = androidx.compose.ui.graphics.Color(0x2A8B5CF6),
                                        unfocusedContainerColor = androidx.compose.ui.graphics.Color(0x160F0C17)
                                    )
                                )
                            }

                            val helperText = when (mode) {
                                HomeMode.CREATE -> "Create a live room and share the code."
                                HomeMode.JOIN -> "Enter your friend's 4-digit room code."
                                HomeMode.SOLO -> "Pass-and-play: one device, both X and O turns."
                            }

                            Text(
                                text = helperText,
                                style = MaterialTheme.typography.bodyMedium,
                                color = TextSecondary
                            )

                            Button(
                                onClick = {
                                    haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                    when (mode) {
                                        HomeMode.CREATE -> onCreateRoom()
                                        HomeMode.JOIN -> onJoinRoom()
                                        HomeMode.SOLO -> onStartSoloGame()
                                    }
                                },
                                enabled = !state.isProcessing && (mode == HomeMode.SOLO || !state.isAuthRequired),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .sizeIn(minHeight = 54.dp)
                            ) {
                                Text(
                                    when (mode) {
                                        HomeMode.CREATE -> "Create Room"
                                        HomeMode.JOIN -> "Join Room"
                                        HomeMode.SOLO -> "Start Solo Game"
                                    }
                                )
                            }
                        }
                    }
                }
            }

            NeonPanel {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Music",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontWeight = FontWeight.Bold
                        )
                        Switch(
                            checked = state.musicEnabled,
                            onCheckedChange = { enabled ->
                                haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                                onMusicEnabledChanged(enabled)
                            }
                        )
                    }

                    Text(
                        text = if (state.musicEnabled) "Background music is on" else "Background music is off",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary
                    )

                    Slider(
                        value = state.musicVolume,
                        enabled = state.musicEnabled,
                        onValueChange = onMusicVolumeChanged,
                        valueRange = 0f..1f
                    )
                }
            }

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(
                    onClick = {
                        haptics.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                        onOpenHowTo()
                    },
                    modifier = Modifier
                        .weight(1f)
                        .sizeIn(minHeight = 48.dp)
                ) {
                    Text("How To Play")
                }

                FilledTonalButton(
                    onClick = {},
                    enabled = false,
                    modifier = Modifier
                        .weight(1f)
                        .sizeIn(minHeight = 48.dp)
                ) {
                    Text("Game Lobby")
                }
            }

            Spacer(modifier = Modifier.height(if (compactHeight) 8.dp else 12.dp))
        }
    }
}

@Composable
private fun ModeHero(mode: HomeMode) {
    val (left, right, subtitle) = when (mode) {
        HomeMode.CREATE -> Triple("X", "O", "Live duel mode")
        HomeMode.JOIN -> Triple("O", "X", "Jump into a friend's room")
        HomeMode.SOLO -> Triple("X", "O", "Pass-and-play on one device")
    }

    NeonPanel {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(left, style = MaterialTheme.typography.titleLarge, color = NeonBlue)
                Text("VS", style = MaterialTheme.typography.labelLarge, color = TextSecondary)
                Text(right, style = MaterialTheme.typography.titleLarge, color = NeonPink)
            }
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )
        }
    }
}

@Composable
private fun ModeButton(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (selected) {
        Button(
            onClick = onClick,
            modifier = modifier.sizeIn(minHeight = 48.dp)
        ) {
            Text(label)
        }
    } else {
        OutlinedButton(
            onClick = onClick,
            modifier = modifier.sizeIn(minHeight = 48.dp)
        ) {
            Text(label)
        }
    }
}

@Composable
private fun IdentityChip(state: MainUiState) {
    val (label, color) = when (state.authState) {
        AuthUiState.AUTHENTICATED_GOOGLE -> "Google" to NeonBlue
        AuthUiState.AUTHENTICATED_GUEST -> "Guest" to NeonPink
        AuthUiState.AUTH_LOADING -> "Loading" to PurpleAccent
        AuthUiState.AUTH_ERROR -> "Sign In" to PurpleAccent
    }

    Surface(
        color = color.copy(alpha = 0.17f),
        shape = RoundedCornerShape(999.dp)
    ) {
        Text(
            text = label,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            style = MaterialTheme.typography.labelLarge,
            color = color
        )
    }
}
