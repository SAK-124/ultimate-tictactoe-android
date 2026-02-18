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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
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
    onOpenHowTo: () -> Unit,
    onContinueWithGoogle: () -> Unit,
    onContinueAsGuest: () -> Unit,
    onSignOut: () -> Unit
) {
    BoxWithConstraints(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xFF030814),
                        androidx.compose.ui.graphics.Color(0xFF0A1B32),
                        androidx.compose.ui.graphics.Color(0xFF040A16)
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
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 18.dp, vertical = if (compactHeight) 14.dp else 18.dp),
            verticalArrangement = Arrangement.spacedBy(spacing)
        ) {
            Text(
                text = "ULTIMATE TT-TOE",
                style = titleSize,
                color = NeonBlue
            )

            Text(
                text = "Quick room code multiplayer",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary
            )

            NeonPanel {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(
                            text = "Identity",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontWeight = FontWeight.Bold
                        )
                        IdentityChip(state)
                    }

                    if (state.identity == null) {
                        Button(
                            onClick = onContinueWithGoogle,
                            enabled = !state.isProcessing,
                            modifier = Modifier
                                .fillMaxWidth()
                                .sizeIn(minHeight = 52.dp)
                        ) {
                            Text("Continue with Google")
                        }

                        OutlinedButton(
                            onClick = onContinueAsGuest,
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

                        TextButton(onClick = onSignOut, enabled = !state.isProcessing) {
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
                            onClick = { onHomeModeSelected(HomeMode.CREATE) },
                            modifier = Modifier.weight(1f)
                        )
                        ModeButton(
                            label = "Join",
                            selected = state.selectedHomeMode == HomeMode.JOIN,
                            onClick = { onHomeModeSelected(HomeMode.JOIN) },
                            modifier = Modifier.weight(1f)
                        )
                        ModeButton(
                            label = "Solo",
                            selected = state.selectedHomeMode == HomeMode.SOLO,
                            onClick = { onHomeModeSelected(HomeMode.SOLO) },
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
                                    focusedContainerColor = androidx.compose.ui.graphics.Color(0x241B8BFF),
                                    unfocusedContainerColor = androidx.compose.ui.graphics.Color(0x160D192C)
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
                                        keyboardType = KeyboardType.Ascii,
                                        capitalization = KeyboardCapitalization.Characters
                                    ),
                                    shape = RoundedCornerShape(18.dp),
                                    colors = TextFieldDefaults.colors(
                                        focusedContainerColor = androidx.compose.ui.graphics.Color(0x241B8BFF),
                                        unfocusedContainerColor = androidx.compose.ui.graphics.Color(0x160D192C)
                                    )
                                )
                            }

                            if (mode == HomeMode.SOLO) {
                                Text(
                                    text = "Pass-and-play on one phone. X and O alternate turns.",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = TextSecondary
                                )
                            }

                            Button(
                                onClick = when (mode) {
                                    HomeMode.CREATE -> onCreateRoom
                                    HomeMode.JOIN -> onJoinRoom
                                    HomeMode.SOLO -> onStartSoloGame
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

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(
                    onClick = onOpenHowTo,
                    modifier = Modifier
                        .weight(1f)
                        .sizeIn(minHeight = 48.dp)
                ) {
                    Text("How To")
                }

                FilledTonalButton(
                    onClick = {},
                    enabled = false,
                    modifier = Modifier
                        .weight(1f)
                        .sizeIn(minHeight = 48.dp)
                ) {
                    Text("Live + Solo")
                }
            }

            Spacer(modifier = Modifier.height(if (compactHeight) 8.dp else 14.dp))
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
        AuthUiState.AUTH_LOADING -> "Loading" to NeonBlue.copy(alpha = 0.8f)
        AuthUiState.AUTH_ERROR -> "Sign In" to NeonPink.copy(alpha = 0.8f)
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
