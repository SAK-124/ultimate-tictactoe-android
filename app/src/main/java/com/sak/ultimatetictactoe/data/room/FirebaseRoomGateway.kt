package com.sak.ultimatetictactoe.data.room

import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.MutableData
import com.google.firebase.database.ServerValue
import com.google.firebase.database.Transaction
import com.google.firebase.database.ValueEventListener
import com.google.firebase.auth.FirebaseAuth
import com.sak.ultimatetictactoe.BuildConfig
import com.sak.ultimatetictactoe.domain.Move
import com.sak.ultimatetictactoe.domain.MoveResult
import com.sak.ultimatetictactoe.domain.PlayerIdentity
import com.sak.ultimatetictactoe.domain.RematchState
import com.sak.ultimatetictactoe.domain.RoomSession
import com.sak.ultimatetictactoe.domain.RoomState
import com.sak.ultimatetictactoe.domain.RoomTransactionEngine
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.tasks.await
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine
import kotlin.random.Random

class FirebaseRoomGateway(
    private val firebaseReady: Boolean
) : RoomGateway {

    private val database: FirebaseDatabase? = if (firebaseReady) {
        if (BuildConfig.FIREBASE_DATABASE_URL.isNotBlank()) {
            FirebaseDatabase.getInstance(BuildConfig.FIREBASE_DATABASE_URL)
        } else {
            FirebaseDatabase.getInstance()
        }
    } else {
        null
    }

    private val roomsRef = database?.getReference("rooms")
    private val firebaseAuth: FirebaseAuth? = if (firebaseReady) FirebaseAuth.getInstance() else null

    override suspend fun createRoom(identity: PlayerIdentity, nickname: String): Result<RoomSession> {
        if (!firebaseReady || roomsRef == null) {
            return Result.failure(RoomOperationException("Firebase is not configured for this build"))
        }

        ensureAuthorizedIdentity(identity.uid).onFailure {
            return Result.failure(it)
        }

        val safeName = sanitizeNickname(nickname, identity.displayName)

        repeat(12) {
            val code = generateRoomCode()
            val result = mutateRoom(code) { currentRoom ->
                if (currentRoom != null) {
                    RoomTransactionEngine.Outcome.Failure("Room code collision")
                } else {
                    RoomTransactionEngine.Outcome.Success(
                        RoomTransactionEngine.createInitialRoom(
                            code = code,
                            hostUid = identity.uid,
                            nickname = safeName,
                            now = System.currentTimeMillis()
                        )
                    )
                }
            }

            if (result.isSuccess) {
                val presence = runCatching {
                    markPresence(code, identity.uid, connected = true)
                }

                if (presence.isFailure) {
                    return Result.failure(
                        RoomOperationException(
                            mapFirebaseMessage(presence.exceptionOrNull()?.message, null)
                        )
                    )
                }

                return Result.success(RoomSession(code = code, identity = identity))
            }

            val message = result.exceptionOrNull()?.message.orEmpty()
            if (message != "Room code collision") {
                return Result.failure(result.exceptionOrNull() ?: RoomOperationException("Failed to create room"))
            }
        }

        return Result.failure(RoomOperationException("Unable to allocate a unique room code"))
    }

    override suspend fun joinRoom(
        code: String,
        identity: PlayerIdentity,
        nickname: String
    ): Result<RoomSession> {
        if (!firebaseReady || roomsRef == null) {
            return Result.failure(RoomOperationException("Firebase is not configured for this build"))
        }

        ensureAuthorizedIdentity(identity.uid).onFailure {
            return Result.failure(it)
        }

        val normalizedCode = code.trim().uppercase()
        val safeName = sanitizeNickname(nickname, identity.displayName)

        val joinResult = mutateRoom(normalizedCode) { currentRoom ->
            if (currentRoom == null) {
                RoomTransactionEngine.Outcome.Failure("Room not found")
            } else {
                RoomTransactionEngine.joinRoom(
                    roomState = currentRoom,
                    guestUid = identity.uid,
                    nickname = safeName,
                    now = System.currentTimeMillis()
                )
            }
        }

        if (joinResult.isSuccess) {
            val presence = runCatching {
                markPresence(normalizedCode, identity.uid, connected = true)
            }

            if (presence.isFailure) {
                return Result.failure(
                    RoomOperationException(
                        mapFirebaseMessage(presence.exceptionOrNull()?.message, null)
                    )
                )
            }

            return Result.success(RoomSession(code = normalizedCode, identity = identity))
        }

        return Result.failure(joinResult.exceptionOrNull() ?: RoomOperationException("Unable to join room"))
    }

    override fun observeRoom(code: String): Flow<Result<RoomState>> {
        if (!firebaseReady || roomsRef == null) {
            return flowOf(Result.failure(RoomOperationException("Firebase is not configured for this build")))
        }

        val normalizedCode = code.trim().uppercase()
        val roomRef = roomsRef.child(normalizedCode)

        return callbackFlow {
            val listener = object : ValueEventListener {
                override fun onDataChange(snapshot: DataSnapshot) {
                    if (!snapshot.exists()) {
                        trySend(Result.failure(RoomOperationException("Room was deleted")))
                        return
                    }

                    val parsed = RoomSnapshotMapper.fromSnapshot(normalizedCode, snapshot.value)
                    if (parsed == null) {
                        trySend(Result.failure(RoomOperationException("Failed to parse room state")))
                    } else {
                        trySend(Result.success(parsed))
                    }
                }

                override fun onCancelled(error: DatabaseError) {
                    trySend(
                        Result.failure(
                            RoomOperationException(
                                mapFirebaseMessage(error.message, error.code)
                            )
                        )
                    )
                }
            }

            roomRef.addValueEventListener(listener)
            awaitClose { roomRef.removeEventListener(listener) }
        }
    }

    override suspend fun submitMove(code: String, move: Move): MoveResult {
        ensureAuthorizedIdentity(move.playerUid).onFailure {
            return MoveResult.Rejected(it.message ?: "Auth session expired. Sign in again.")
        }

        val normalizedCode = code.trim().uppercase()
        val result = mutateRoom(normalizedCode) { currentRoom ->
            if (currentRoom == null) {
                RoomTransactionEngine.Outcome.Failure("Room not found")
            } else {
                RoomTransactionEngine.submitMove(
                    roomState = currentRoom,
                    move = move,
                    now = System.currentTimeMillis()
                )
            }
        }

        return result.fold(
            onSuccess = { MoveResult.Accepted(it) },
            onFailure = { MoveResult.Rejected(it.message ?: "Move rejected") }
        )
    }

    override suspend fun requestRematch(code: String, playerUid: String): RematchState {
        ensureAuthorizedIdentity(playerUid).onFailure {
            return RematchState.Rejected(it.message ?: "Auth session expired. Sign in again.")
        }

        val normalizedCode = code.trim().uppercase()
        val result = mutateRoom(normalizedCode) { currentRoom ->
            if (currentRoom == null) {
                RoomTransactionEngine.Outcome.Failure("Room not found")
            } else {
                RoomTransactionEngine.requestRematch(
                    roomState = currentRoom,
                    uid = playerUid,
                    now = System.currentTimeMillis()
                )
            }
        }

        return result.fold(
            onSuccess = { RematchState.Updated(it) },
            onFailure = { RematchState.Rejected(it.message ?: "Rematch rejected") }
        )
    }

    override suspend fun markPresence(code: String, playerUid: String, connected: Boolean) {
        if (!firebaseReady || roomsRef == null) return
        if (ensureAuthorizedIdentity(playerUid).isFailure) return

        val normalizedCode = code.trim().uppercase()
        val presenceRef = roomsRef.child(normalizedCode).child("presence").child(playerUid)

        if (connected) {
            presenceRef.setValue(
                mapOf(
                    "uid" to playerUid,
                    "connected" to true,
                    "lastSeen" to ServerValue.TIMESTAMP,
                    "disconnectedAt" to 0L
                )
            ).await()

            presenceRef.onDisconnect().updateChildren(
                mapOf(
                    "connected" to false,
                    "lastSeen" to ServerValue.TIMESTAMP,
                    "disconnectedAt" to ServerValue.TIMESTAMP
                )
            )
        } else {
            presenceRef.setValue(
                mapOf(
                    "uid" to playerUid,
                    "connected" to false,
                    "lastSeen" to System.currentTimeMillis(),
                    "disconnectedAt" to System.currentTimeMillis()
                )
            ).await()
        }
    }

    override suspend fun claimForfeit(code: String, claimantUid: String, graceMs: Long): Result<RoomState> {
        ensureAuthorizedIdentity(claimantUid).onFailure {
            return Result.failure(it)
        }

        val normalizedCode = code.trim().uppercase()
        return mutateRoom(normalizedCode) { currentRoom ->
            if (currentRoom == null) {
                RoomTransactionEngine.Outcome.Failure("Room not found")
            } else {
                RoomTransactionEngine.claimForfeit(
                    roomState = currentRoom,
                    claimantUid = claimantUid,
                    now = System.currentTimeMillis(),
                    gracePeriodMs = graceMs
                )
            }
        }
    }

    private suspend fun mutateRoom(
        code: String,
        mutation: (RoomState?) -> RoomTransactionEngine.Outcome
    ): Result<RoomState> {
        if (!firebaseReady || roomsRef == null) {
            return Result.failure(RoomOperationException("Firebase is not configured for this build"))
        }

        val roomRef = roomsRef.child(code)
        var transactionFailure: String? = null

        return suspendCoroutine { continuation ->
            roomRef.runTransaction(object : Transaction.Handler {
                override fun doTransaction(mutableData: MutableData): Transaction.Result {
                    val currentRoom = RoomSnapshotMapper.fromSnapshot(code, mutableData.value)

                    return when (val outcome = mutation(currentRoom)) {
                        is RoomTransactionEngine.Outcome.Failure -> {
                            transactionFailure = outcome.reason
                            Transaction.abort()
                        }

                        is RoomTransactionEngine.Outcome.Success -> {
                            mutableData.value = RoomSnapshotMapper.toMap(outcome.roomState)
                            Transaction.success(mutableData)
                        }
                    }
                }

                override fun onComplete(
                    error: DatabaseError?,
                    committed: Boolean,
                    currentData: DataSnapshot?
                ) {
                    val result = when {
                        error != null -> Result.failure(
                            RoomOperationException(
                                mapFirebaseMessage(error.message, error.code)
                            )
                        )

                        !committed -> Result.failure(
                            RoomOperationException(
                                transactionFailure ?: "Operation aborted"
                            )
                        )

                        else -> {
                            val parsed = RoomSnapshotMapper.fromSnapshot(code, currentData?.value)
                            if (parsed == null) {
                                Result.failure(RoomOperationException("Failed to parse room after transaction"))
                            } else {
                                Result.success(parsed)
                            }
                        }
                    }

                    continuation.resume(result)
                }
            })
        }
    }

    private fun generateRoomCode(length: Int = 6): String {
        val alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        return buildString(length) {
            repeat(length) {
                append(alphabet[Random.nextInt(alphabet.length)])
            }
        }
    }

    private fun sanitizeNickname(input: String, fallback: String): String {
        return input.trim().ifBlank { fallback.trim() }.ifBlank { "Player" }
    }

    private suspend fun ensureAuthorizedIdentity(expectedUid: String): Result<Unit> {
        if (!firebaseReady) {
            return Result.failure(RoomOperationException("Firebase is not configured for this build"))
        }

        val currentUser = firebaseAuth?.currentUser
            ?: return Result.failure(RoomOperationException("Auth session expired. Sign in again."))

        if (currentUser.uid != expectedUid) {
            return Result.failure(RoomOperationException("Signed account changed. Sign in again."))
        }

        return runCatching {
            currentUser.getIdToken(false).await()
            Unit
        }.recoverCatching {
            throw RoomOperationException("Auth token invalid. Sign in again.")
        }
    }

    private fun mapFirebaseMessage(message: String?, code: Int?): String {
        if (code == DatabaseError.PERMISSION_DENIED || message?.contains("Permission denied", ignoreCase = true) == true) {
            return "Permission denied. Sign in and retry, or rejoin the room."
        }

        if (message?.contains("network", ignoreCase = true) == true) {
            return "Network issue. Check connection and try again."
        }

        return message ?: "Unexpected Firebase error"
    }
}
