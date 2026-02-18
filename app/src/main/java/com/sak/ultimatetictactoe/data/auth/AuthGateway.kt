package com.sak.ultimatetictactoe.data.auth

import android.content.Intent
import com.sak.ultimatetictactoe.domain.PlayerIdentity
import kotlinx.coroutines.flow.Flow

interface AuthGateway {
    suspend fun signInOrFallback(): PlayerIdentity
    fun beginGoogleSignInIntent(): Intent?
    suspend fun completeGoogleSignIn(resultData: Intent?): PlayerIdentity
    suspend fun continueAsGuest(): PlayerIdentity
    suspend fun signOut()
    fun observeIdentity(): Flow<PlayerIdentity?>
    fun dispose()
}
