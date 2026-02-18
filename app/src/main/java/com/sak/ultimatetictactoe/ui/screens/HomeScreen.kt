package com.sak.ultimatetictactoe.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.sak.ultimatetictactoe.domain.AuthProvider
import com.sak.ultimatetictactoe.ui.MainUiState
import com.sak.ultimatetictactoe.ui.components.NeonPanel
import com.sak.ultimatetictactoe.ui.theme.NeonBlue
import com.sak.ultimatetictactoe.ui.theme.NeonPink
import com.sak.ultimatetictactoe.ui.theme.TextSecondary
import com.sak.ultimatetictactoe.ui.theme.WarningYellow

@Composable
fun HomeScreen(
    state: MainUiState,
    onNicknameChanged: (String) -> Unit,
    onRoomCodeChanged: (String) -> Unit,
    onCreateRoom: () -> Unit,
    onJoinRoom: () -> Unit,
    onOpenHowTo: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        androidx.compose.ui.graphics.Color(0xFF040B18),
                        androidx.compose.ui.graphics.Color(0xFF091428),
                        androidx.compose.ui.graphics.Color(0xFF050913)
                    )
                )
            )
            .verticalScroll(scrollState)
            .padding(horizontal = 20.dp, vertical = 24.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text(
            text = "ULTIMATE TT-TOE",
            style = MaterialTheme.typography.headlineMedium,
            color = NeonBlue
        )

        Text(
            text = "Live 1v1 multiplayer with move-mapped mini-grids",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary
        )

        NeonPanel {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Player Identity",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = when (state.identity?.authProvider) {
                        AuthProvider.GOOGLE -> "Signed in with Google"
                        AuthProvider.ANONYMOUS -> "Guest mode (anonymous auth)"
                        null -> "Authenticating..."
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (state.identity?.authProvider == AuthProvider.GOOGLE) NeonBlue else NeonPink
                )

                OutlinedTextField(
                    value = state.nickname,
                    onValueChange = onNicknameChanged,
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Nickname") },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = androidx.compose.ui.graphics.Color(0x301B8BFF),
                        unfocusedContainerColor = androidx.compose.ui.graphics.Color(0x220E1B2F)
                    )
                )
            }
        }

        NeonPanel {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Room Code",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )

                OutlinedTextField(
                    value = state.roomCodeInput,
                    onValueChange = onRoomCodeChanged,
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Enter room code") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Ascii,
                        capitalization = KeyboardCapitalization.Characters
                    ),
                    shape = RoundedCornerShape(12.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = androidx.compose.ui.graphics.Color(0x301B8BFF),
                        unfocusedContainerColor = androidx.compose.ui.graphics.Color(0x220E1B2F)
                    )
                )

                Row(modifier = Modifier.fillMaxWidth()) {
                    Button(
                        onClick = onCreateRoom,
                        enabled = !state.isProcessing,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Create Room")
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    OutlinedButton(
                        onClick = onJoinRoom,
                        enabled = !state.isProcessing,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Join Room")
                    }
                }
            }
        }

        Row(modifier = Modifier.fillMaxWidth()) {
            OutlinedButton(onClick = onOpenHowTo, modifier = Modifier.weight(1f)) {
                Text("How To Play")
            }
        }

        if (!state.firebaseReady) {
            NeonPanel {
                Text(
                    text = "Firebase is not configured in this build. Add keys in local.properties or google-services.json before multiplayer tests.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = WarningYellow
                )
            }
        }

        state.errorMessage?.let { error ->
            Text(
                text = error,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.error,
                fontWeight = FontWeight.SemiBold
            )
        }

        state.infoMessage?.let { message ->
            Text(
                text = message,
                style = MaterialTheme.typography.bodyMedium,
                color = NeonBlue,
                fontWeight = FontWeight.Medium
            )
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}
