package com.sak.ultimatetictactoe.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.sak.ultimatetictactoe.data.AppContainer
import com.sak.ultimatetictactoe.domain.Move
import com.sak.ultimatetictactoe.domain.MoveResult
import com.sak.ultimatetictactoe.domain.PlayerIdentity
import com.sak.ultimatetictactoe.domain.RematchState
import com.sak.ultimatetictactoe.domain.RoomState
import com.sak.ultimatetictactoe.domain.RoomStatus
import com.sak.ultimatetictactoe.domain.RoomTransactionEngine
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

enum class AppScreen {
    HOME,
    HOW_TO,
    GAME,
    SUMMARY
}

data class MainUiState(
    val firebaseReady: Boolean = false,
    val isInitializing: Boolean = true,
    val isProcessing: Boolean = false,
    val identity: PlayerIdentity? = null,
    val nickname: String = "",
    val roomCodeInput: String = "",
    val currentRoomCode: String? = null,
    val roomState: RoomState? = null,
    val currentScreen: AppScreen = AppScreen.HOME,
    val howToReturnScreen: AppScreen = AppScreen.HOME,
    val firstRunHowTo: Boolean = false,
    val opponentGraceRemainingMs: Long? = null,
    val errorMessage: String? = null,
    val infoMessage: String? = null
)

class MainViewModel(
    private val appContainer: AppContainer
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        MainUiState(firebaseReady = appContainer.firebaseReady)
    )
    val uiState: StateFlow<MainUiState> = _uiState.asStateFlow()

    private var roomObservationJob: Job? = null
    private var forfeitMonitorJob: Job? = null
    private var forfeitClaimInFlight = false

    init {
        viewModelScope.launch {
            val nickname = appContainer.preferencesStore.nicknameFlow.first()
            val howToSeen = appContainer.preferencesStore.howToSeenFlow.first()

            _uiState.update {
                it.copy(
                    nickname = nickname,
                    currentScreen = if (howToSeen) AppScreen.HOME else AppScreen.HOW_TO,
                    howToReturnScreen = AppScreen.HOME,
                    firstRunHowTo = !howToSeen
                )
            }

            signIn()
        }
    }

    fun onNicknameChanged(value: String) {
        val normalized = value.take(22)
        _uiState.update { it.copy(nickname = normalized) }

        viewModelScope.launch {
            appContainer.preferencesStore.setNickname(normalized)
        }
    }

    fun onRoomCodeChanged(value: String) {
        val normalized = value.uppercase().filter { it.isLetterOrDigit() }.take(6)
        _uiState.update { it.copy(roomCodeInput = normalized) }
    }

    fun openHowTo(fromScreen: AppScreen) {
        _uiState.update {
            it.copy(
                currentScreen = AppScreen.HOW_TO,
                howToReturnScreen = fromScreen,
                firstRunHowTo = it.firstRunHowTo && fromScreen == AppScreen.HOME
            )
        }
    }

    fun closeHowTo() {
        viewModelScope.launch {
            if (_uiState.value.firstRunHowTo) {
                appContainer.preferencesStore.setHowToSeen(true)
            }

            _uiState.update {
                it.copy(
                    currentScreen = it.howToReturnScreen,
                    firstRunHowTo = false
                )
            }
        }
    }

    fun createRoom() {
        val identity = _uiState.value.identity ?: return

        viewModelScope.launch {
            _uiState.update { it.copy(isProcessing = true, errorMessage = null, infoMessage = null) }
            val result = appContainer.roomGateway.createRoom(
                identity = identity,
                nickname = resolvedNickname(identity)
            )

            result.onSuccess { session ->
                startRoomObservation(session.code)
                _uiState.update {
                    it.copy(
                        currentRoomCode = session.code,
                        currentScreen = AppScreen.GAME,
                        roomCodeInput = session.code,
                        isProcessing = false,
                        infoMessage = "Room ${session.code} created"
                    )
                }
            }.onFailure { throwable ->
                _uiState.update {
                    it.copy(
                        isProcessing = false,
                        errorMessage = throwable.message ?: "Failed to create room"
                    )
                }
            }
        }
    }

    fun joinRoom() {
        val current = _uiState.value
        val identity = current.identity ?: return
        val code = current.roomCodeInput
        if (code.length < 4) {
            _uiState.update { it.copy(errorMessage = "Enter a valid room code") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isProcessing = true, errorMessage = null, infoMessage = null) }
            val result = appContainer.roomGateway.joinRoom(
                code = code,
                identity = identity,
                nickname = resolvedNickname(identity)
            )

            result.onSuccess { session ->
                startRoomObservation(session.code)
                _uiState.update {
                    it.copy(
                        currentRoomCode = session.code,
                        currentScreen = AppScreen.GAME,
                        roomCodeInput = session.code,
                        isProcessing = false,
                        infoMessage = "Joined room ${session.code}"
                    )
                }
            }.onFailure { throwable ->
                _uiState.update {
                    it.copy(
                        isProcessing = false,
                        errorMessage = throwable.message ?: "Failed to join room"
                    )
                }
            }
        }
    }

    fun submitMove(miniGridIndex: Int, cellIndex: Int) {
        val current = _uiState.value
        val roomCode = current.currentRoomCode ?: return
        val uid = current.identity?.uid ?: return

        viewModelScope.launch {
            val result = appContainer.roomGateway.submitMove(
                code = roomCode,
                move = Move(miniGridIndex = miniGridIndex, cellIndex = cellIndex, playerUid = uid)
            )

            when (result) {
                is MoveResult.Accepted -> {
                    _uiState.update { state ->
                        state.copy(roomState = result.roomState, errorMessage = null)
                    }
                }

                is MoveResult.Rejected -> {
                    _uiState.update { it.copy(errorMessage = result.reason) }
                }
            }
        }
    }

    fun requestRematch() {
        val current = _uiState.value
        val roomCode = current.currentRoomCode ?: return
        val uid = current.identity?.uid ?: return

        viewModelScope.launch {
            when (val result = appContainer.roomGateway.requestRematch(roomCode, uid)) {
                is RematchState.Updated -> {
                    _uiState.update { state ->
                        val nextScreen = if (result.roomState.status == RoomStatus.ACTIVE) {
                            AppScreen.GAME
                        } else {
                            state.currentScreen
                        }
                        state.copy(roomState = result.roomState, currentScreen = nextScreen, errorMessage = null)
                    }
                }

                is RematchState.Rejected -> {
                    _uiState.update { it.copy(errorMessage = result.reason) }
                }
            }
        }
    }

    fun leaveMatchToHome() {
        val snapshot = _uiState.value
        val roomCode = snapshot.currentRoomCode
        val uid = snapshot.identity?.uid

        roomObservationJob?.cancel()
        roomObservationJob = null
        forfeitMonitorJob?.cancel()
        forfeitMonitorJob = null
        forfeitClaimInFlight = false

        viewModelScope.launch {
            if (roomCode != null && uid != null) {
                runCatching {
                    appContainer.roomGateway.markPresence(roomCode, uid, connected = false)
                }
            }

            _uiState.update {
                it.copy(
                    currentRoomCode = null,
                    roomState = null,
                    currentScreen = AppScreen.HOME,
                    opponentGraceRemainingMs = null,
                    infoMessage = null
                )
            }
        }
    }

    fun dismissMessage() {
        _uiState.update { it.copy(errorMessage = null, infoMessage = null) }
    }

    private suspend fun signIn() {
        _uiState.update { it.copy(isInitializing = true, errorMessage = null) }

        val result = runCatching {
            appContainer.authGateway.signInOrFallback()
        }

        result.onSuccess { identity ->
            _uiState.update { state ->
                val nextNickname = state.nickname.ifBlank {
                    identity.displayName.takeIf { identity.authProvider.name == "GOOGLE" }.orEmpty()
                }
                state.copy(
                    identity = identity,
                    nickname = nextNickname,
                    isInitializing = false
                )
            }

            if (_uiState.value.nickname.isNotBlank()) {
                appContainer.preferencesStore.setNickname(_uiState.value.nickname)
            }
        }.onFailure { throwable ->
            _uiState.update {
                it.copy(
                    isInitializing = false,
                    errorMessage = throwable.message ?: "Sign-in failed"
                )
            }
        }
    }

    private fun startRoomObservation(code: String) {
        roomObservationJob?.cancel()
        roomObservationJob = viewModelScope.launch {
            appContainer.roomGateway.observeRoom(code).collect { result ->
                result.onSuccess { room ->
                    _uiState.update { state ->
                        val nextScreen = when {
                            room.status == RoomStatus.FINISHED -> AppScreen.SUMMARY
                            room.status == RoomStatus.ACTIVE && state.currentScreen == AppScreen.SUMMARY -> AppScreen.GAME
                            else -> state.currentScreen
                        }

                        state.copy(
                            roomState = room,
                            currentScreen = nextScreen,
                            errorMessage = null,
                            currentRoomCode = room.code
                        )
                    }
                }.onFailure { throwable ->
                    _uiState.update {
                        it.copy(errorMessage = throwable.message ?: "Lost room updates")
                    }
                }
            }
        }

        val uid = _uiState.value.identity?.uid
        if (uid != null) {
            viewModelScope.launch {
                runCatching {
                    appContainer.roomGateway.markPresence(code, uid, connected = true)
                }
            }
        }

        startForfeitMonitor()
    }

    private fun startForfeitMonitor() {
        if (forfeitMonitorJob?.isActive == true) return

        forfeitMonitorJob = viewModelScope.launch {
            while (true) {
                delay(1_000)

                val state = _uiState.value
                val room = state.roomState
                val myUid = state.identity?.uid

                if (room == null || myUid == null || room.status != RoomStatus.ACTIVE) {
                    _uiState.update { it.copy(opponentGraceRemainingMs = null) }
                    continue
                }

                val opponentUid = room.opponentUid(myUid)
                val opponentPresence = opponentUid?.let { room.presence[it] }
                val disconnectedAt = opponentPresence?.disconnectedAt

                if (opponentPresence == null || opponentPresence.connected || disconnectedAt == null) {
                    _uiState.update { it.copy(opponentGraceRemainingMs = null) }
                    continue
                }

                val elapsed = System.currentTimeMillis() - disconnectedAt
                val remaining = (RoomTransactionEngine.FORFEIT_GRACE_MS - elapsed).coerceAtLeast(0)
                _uiState.update { it.copy(opponentGraceRemainingMs = remaining) }

                if (remaining <= 0 && !forfeitClaimInFlight) {
                    forfeitClaimInFlight = true
                    val claim = appContainer.roomGateway.claimForfeit(
                        code = room.code,
                        claimantUid = myUid,
                        graceMs = RoomTransactionEngine.FORFEIT_GRACE_MS
                    )

                    if (claim.isFailure) {
                        _uiState.update {
                            it.copy(errorMessage = claim.exceptionOrNull()?.message ?: "Failed to claim forfeit")
                        }
                    }
                    forfeitClaimInFlight = false
                }
            }
        }
    }

    private fun resolvedNickname(identity: PlayerIdentity): String {
        return _uiState.value.nickname.trim().ifBlank {
            identity.displayName.ifBlank { "Player" }
        }
    }

    companion object {
        fun factory(appContainer: AppContainer): ViewModelProvider.Factory {
            return object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return MainViewModel(appContainer) as T
                }
            }
        }
    }
}
