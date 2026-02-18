package com.sak.ultimatetictactoe.data.auth

import com.sak.ultimatetictactoe.domain.PlayerIdentity
import kotlinx.coroutines.flow.Flow

interface AuthGateway {
    suspend fun signInOrFallback(): PlayerIdentity
    fun observeIdentity(): Flow<PlayerIdentity?>
}
