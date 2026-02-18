package com.sak.ultimatetictactoe.ui

import android.content.Intent
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.sak.ultimatetictactoe.data.AppContainer
import com.sak.ultimatetictactoe.domain.AuthProvider
import com.sak.ultimatetictactoe.domain.BoardState
import com.sak.ultimatetictactoe.domain.Move
import com.sak.ultimatetictactoe.domain.MoveResult
import com.sak.ultimatetictactoe.domain.PlayerIdentity
import com.sak.ultimatetictactoe.domain.PlayerPresence
import com.sak.ultimatetictactoe.domain.PlayerSymbol
import com.sak.ultimatetictactoe.domain.RematchState
import com.sak.ultimatetictactoe.domain.RoomPlayer
import com.sak.ultimatetictactoe.domain.RoomState
import com.sak.ultimatetictactoe.domain.RoomStatus
import com.sak.ultimatetictactoe.domain.RoomTransactionEngine
import com.sak.ultimatetictactoe.domain.WinReason
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

enum class HomeMode {
    CREATE,
    JOIN,
    SOLO
}

enum class AuthUiState {
    AUTHENTICATED_GOOGLE,
    AUTHENTICATED_GUEST,
    AUTH_LOADING,
    AUTH_ERROR
}

data class MainUiState(
    val firebaseReady: Boolean = false,
    val isInitializing: Boolean = true,
    val isProcessing: Boolean = false,
    val identity: PlayerIdentity? = null,
    val authState: AuthUiState = AuthUiState.AUTH_LOADING,
    val selectedHomeMode: HomeMode = HomeMode.CREATE,
    val isAuthRequired: Boolean = true,
    val isSoloMode: Boolean = false,
    val nickname: String = "",
    val roomCodeInput: String = "",
    val currentRoomCode: String? = null,
    val roomState: RoomState? = null,
    val currentScreen: AppScreen = AppScreen.HOME,
    val howToReturnScreen: AppScreen = AppScreen.HOME,
    val firstRunHowTo: Boolean = false,
    val opponentGraceRemainingMs: Long? = null,
    val snackbarMessage: String? = null
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
                    firstRunHowTo = !howToSeen,
                    authState = AuthUiState.AUTH_LOADING,
                    isAuthRequired = true
                )
            }

            restoreIdentity()
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
        val normalized = value.filter { it.isDigit() }.take(4)
        _uiState.update { it.copy(roomCodeInput = normalized) }
    }

    fun onHomeModeSelected(mode: HomeMode) {
        _uiState.update { it.copy(selectedHomeMode = mode) }
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

    fun beginGoogleSignInIntent(): Intent? {
        if (_uiState.value.isProcessing) {
            return null
        }

        val intent = appContainer.authGateway.beginGoogleSignInIntent()
        if (intent == null) {
            postSnackbar("Google Sign-In is not configured for this build")
            _uiState.update {
                it.copy(
                    authState = AuthUiState.AUTH_ERROR,
                    isAuthRequired = true
                )
            }
            return null
        }

        _uiState.update {
            it.copy(
                isProcessing = true,
                authState = AuthUiState.AUTH_LOADING
            )
        }
        return intent
    }

    fun onGoogleSignInResult(resultData: Intent?) {
        viewModelScope.launch {
            val result = runCatching {
                appContainer.authGateway.completeGoogleSignIn(resultData)
            }

            result.onSuccess { identity ->
                applyIdentity(identity)
                postSnackbar("Signed in with Google")
            }.onFailure {
                _uiState.update {
                    it.copy(
                        isProcessing = false,
                        authState = AuthUiState.AUTH_ERROR,
                        isAuthRequired = true
                    )
                }
                postSnackbar(it.message ?: "Google Sign-In failed")
            }
        }
    }

    fun continueAsGuest() {
        if (_uiState.value.isProcessing) return

        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    isProcessing = true,
                    authState = AuthUiState.AUTH_LOADING
                )
            }

            val result = runCatching {
                appContainer.authGateway.continueAsGuest()
            }

            result.onSuccess { identity ->
                applyIdentity(identity)
                postSnackbar("Playing as Guest")
            }.onFailure {
                _uiState.update {
                    it.copy(
                        isProcessing = false,
                        authState = AuthUiState.AUTH_ERROR,
                        isAuthRequired = true
                    )
                }
                postSnackbar(it.message ?: "Guest sign-in failed")
            }
        }
    }

    fun signOut() {
        if (_uiState.value.currentRoomCode != null && !_uiState.value.isSoloMode) {
            postSnackbar("Leave the room before switching account")
            return
        }

        viewModelScope.launch {
            runCatching { appContainer.authGateway.signOut() }

            _uiState.update {
                it.copy(
                    identity = null,
                    authState = AuthUiState.AUTH_ERROR,
                    isAuthRequired = true,
                    isProcessing = false
                )
            }
            postSnackbar("Signed out")
        }
    }

    fun startSoloGame() {
        if (_uiState.value.isProcessing) return

        roomObservationJob?.cancel()
        roomObservationJob = null
        forfeitMonitorJob?.cancel()
        forfeitMonitorJob = null
        forfeitClaimInFlight = false

        val now = System.currentTimeMillis()
        val xUid = "solo-x"
        val oUid = "solo-o"
        val baseName = _uiState.value.nickname.trim()

        val soloRoom = RoomState(
            code = "SOLO",
            hostUid = xUid,
            players = mapOf(
                xUid to RoomPlayer(
                    uid = xUid,
                    nickname = if (baseName.isBlank()) "Player X" else "$baseName (X)",
                    symbol = PlayerSymbol.X,
                    joinedAt = now
                ),
                oUid to RoomPlayer(
                    uid = oUid,
                    nickname = "Player O",
                    symbol = PlayerSymbol.O,
                    joinedAt = now
                )
            ),
            status = RoomStatus.ACTIVE,
            board = BoardState(),
            currentTurnUid = xUid,
            winnerUid = null,
            winnerSymbol = null,
            winReason = WinReason.NONE,
            startedAt = now,
            updatedAt = now,
            version = 0,
            presence = mapOf(
                xUid to PlayerPresence(xUid, connected = true, lastSeen = now, disconnectedAt = null),
                oUid to PlayerPresence(oUid, connected = true, lastSeen = now, disconnectedAt = null)
            ),
            rematchHostReady = false,
            rematchGuestReady = false,
            rematchNonce = 0
        )

        _uiState.update {
            it.copy(
                isSoloMode = true,
                roomState = soloRoom,
                currentRoomCode = null,
                currentScreen = AppScreen.GAME,
                opponentGraceRemainingMs = null
            )
        }
    }

    fun createRoom() {
        val snapshot = _uiState.value
        val identity = snapshot.identity
        if (snapshot.isProcessing) return

        if (identity == null) {
            postSnackbar("Sign in first (Google or Guest)")
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isProcessing = true, isSoloMode = false) }

            val result = runCatching {
                appContainer.roomGateway.createRoom(
                    identity = identity,
                    nickname = resolvedNickname(identity)
                )
            }.getOrElse { throwable ->
                Result.failure(throwable)
            }

            result.onSuccess { session ->
                startRoomObservation(session.code)
                _uiState.update {
                    it.copy(
                        currentRoomCode = session.code,
                        currentScreen = AppScreen.GAME,
                        roomCodeInput = session.code,
                        isProcessing = false,
                        isSoloMode = false
                    )
                }
                postSnackbar("Room ${session.code} created")
            }.onFailure { throwable ->
                _uiState.update { it.copy(isProcessing = false) }
                postSnackbar(throwable.message ?: "Failed to create room")
            }
        }
    }

    fun joinRoom() {
        val snapshot = _uiState.value
        val identity = snapshot.identity
        val code = snapshot.roomCodeInput
        if (snapshot.isProcessing) return

        if (identity == null) {
            postSnackbar("Sign in first (Google or Guest)")
            return
        }

        if (code.length != 4) {
            postSnackbar("Enter a valid 4-digit room code")
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isProcessing = true, isSoloMode = false) }

            val result = runCatching {
                appContainer.roomGateway.joinRoom(
                    code = code,
                    identity = identity,
                    nickname = resolvedNickname(identity)
                )
            }.getOrElse { throwable ->
                Result.failure(throwable)
            }

            result.onSuccess { session ->
                startRoomObservation(session.code)
                _uiState.update {
                    it.copy(
                        currentRoomCode = session.code,
                        currentScreen = AppScreen.GAME,
                        roomCodeInput = session.code,
                        isProcessing = false,
                        isSoloMode = false
                    )
                }
                postSnackbar("Joined room ${session.code}")
            }.onFailure { throwable ->
                _uiState.update { it.copy(isProcessing = false) }
                postSnackbar(throwable.message ?: "Failed to join room")
            }
        }
    }

    fun submitMove(miniGridIndex: Int, cellIndex: Int) {
        val current = _uiState.value
        val roomState = current.roomState ?: return

        if (current.isSoloMode) {
            val soloMove = RoomTransactionEngine.submitMove(
                roomState = roomState,
                move = Move(
                    miniGridIndex = miniGridIndex,
                    cellIndex = cellIndex,
                    playerUid = roomState.currentTurnUid
                ),
                now = System.currentTimeMillis()
            )

            when (soloMove) {
                is RoomTransactionEngine.Outcome.Success -> {
                    val nextRoom = soloMove.roomState
                    _uiState.update {
                        it.copy(
                            roomState = nextRoom,
                            currentScreen = if (nextRoom.status == RoomStatus.FINISHED) AppScreen.SUMMARY else AppScreen.GAME
                        )
                    }
                }

                is RoomTransactionEngine.Outcome.Failure -> {
                    postSnackbar(soloMove.reason)
                }
            }
            return
        }

        val roomCode = current.currentRoomCode ?: return
        val uid = current.identity?.uid
        if (uid == null) {
            postSnackbar("You are signed out")
            return
        }

        viewModelScope.launch {
            val result = appContainer.roomGateway.submitMove(
                code = roomCode,
                move = Move(miniGridIndex = miniGridIndex, cellIndex = cellIndex, playerUid = uid)
            )

            when (result) {
                is MoveResult.Accepted -> {
                    _uiState.update { state ->
                        state.copy(roomState = result.roomState)
                    }
                }

                is MoveResult.Rejected -> {
                    postSnackbar(result.reason)
                }
            }
        }
    }

    fun requestRematch() {
        val current = _uiState.value
        val roomState = current.roomState

        if (current.isSoloMode && roomState != null) {
            val reset = roomState.copy(
                board = BoardState(),
                status = RoomStatus.ACTIVE,
                currentTurnUid = roomState.hostUid,
                winnerUid = null,
                winnerSymbol = null,
                winReason = WinReason.NONE,
                updatedAt = System.currentTimeMillis(),
                version = roomState.version + 1,
                rematchHostReady = false,
                rematchGuestReady = false,
                rematchNonce = roomState.rematchNonce + 1
            )
            _uiState.update {
                it.copy(roomState = reset, currentScreen = AppScreen.GAME)
            }
            return
        }

        val roomCode = current.currentRoomCode ?: return
        val uid = current.identity?.uid
        if (uid == null) {
            postSnackbar("You are signed out")
            return
        }

        viewModelScope.launch {
            when (val result = appContainer.roomGateway.requestRematch(roomCode, uid)) {
                is RematchState.Updated -> {
                    _uiState.update { state ->
                        val nextScreen = if (result.roomState.status == RoomStatus.ACTIVE) {
                            AppScreen.GAME
                        } else {
                            state.currentScreen
                        }
                        state.copy(roomState = result.roomState, currentScreen = nextScreen)
                    }
                }

                is RematchState.Rejected -> {
                    postSnackbar(result.reason)
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
            if (!snapshot.isSoloMode && roomCode != null && uid != null) {
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
                    isProcessing = false,
                    isSoloMode = false
                )
            }
        }
    }

    fun onAppForegrounded() {
        val state = _uiState.value
        if (state.isSoloMode) return

        val roomCode = state.currentRoomCode ?: return
        val uid = state.identity?.uid ?: return

        viewModelScope.launch {
            runCatching {
                appContainer.roomGateway.markPresence(roomCode, uid, connected = true)
            }
        }
    }

    fun onAppBackgrounded() {
        val state = _uiState.value
        if (state.isSoloMode) return

        val roomCode = state.currentRoomCode ?: return
        val uid = state.identity?.uid ?: return

        viewModelScope.launch {
            runCatching {
                appContainer.roomGateway.markPresence(roomCode, uid, connected = false)
            }
        }
    }

    fun clearSnackbar() {
        _uiState.update { it.copy(snackbarMessage = null) }
    }

    private suspend fun restoreIdentity() {
        _uiState.update {
            it.copy(
                isInitializing = true,
                authState = AuthUiState.AUTH_LOADING,
                isAuthRequired = true
            )
        }

        val result = runCatching {
            appContainer.authGateway.signInOrFallback()
        }

        result.onSuccess { identity ->
            applyIdentity(identity)
        }.onFailure {
            _uiState.update {
                it.copy(
                    isInitializing = false,
                    isProcessing = false,
                    identity = null,
                    authState = AuthUiState.AUTH_ERROR,
                    isAuthRequired = true
                )
            }
        }
    }

    private fun applyIdentity(identity: PlayerIdentity) {
        _uiState.update { state ->
            val nextNickname = state.nickname.ifBlank {
                identity.displayName.takeIf { identity.authProvider == AuthProvider.GOOGLE }
                    .orEmpty()
            }

            state.copy(
                identity = identity,
                nickname = nextNickname,
                isInitializing = false,
                isProcessing = false,
                authState = when (identity.authProvider) {
                    AuthProvider.GOOGLE -> AuthUiState.AUTHENTICATED_GOOGLE
                    AuthProvider.ANONYMOUS -> AuthUiState.AUTHENTICATED_GUEST
                },
                isAuthRequired = false
            )
        }

        viewModelScope.launch {
            if (_uiState.value.nickname.isNotBlank()) {
                appContainer.preferencesStore.setNickname(_uiState.value.nickname)
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
                            currentRoomCode = room.code
                        )
                    }
                }.onFailure { throwable ->
                    postSnackbar(throwable.message ?: "Lost room updates")
                }
            }
        }

        val uid = _uiState.value.identity?.uid
        if (uid != null) {
            viewModelScope.launch {
                runCatching {
                    appContainer.roomGateway.markPresence(code, uid, connected = true)
                }.onFailure {
                    postSnackbar(it.message ?: "Presence sync failed")
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
                if (state.isSoloMode) {
                    _uiState.update { it.copy(opponentGraceRemainingMs = null) }
                    continue
                }

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
                        postSnackbar(claim.exceptionOrNull()?.message ?: "Failed to claim forfeit")
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

    private fun postSnackbar(message: String) {
        _uiState.update { it.copy(snackbarMessage = message) }
    }

    override fun onCleared() {
        super.onCleared()
        roomObservationJob?.cancel()
        forfeitMonitorJob?.cancel()
        appContainer.authGateway.dispose()
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
