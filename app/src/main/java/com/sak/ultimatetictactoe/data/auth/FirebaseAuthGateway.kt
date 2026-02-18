package com.sak.ultimatetictactoe.data.auth

import android.content.Context
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.sak.ultimatetictactoe.BuildConfig
import com.sak.ultimatetictactoe.domain.AuthProvider
import com.sak.ultimatetictactoe.domain.PlayerIdentity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.tasks.await
import java.util.UUID

class FirebaseAuthGateway(
    private val context: Context,
    private val firebaseReady: Boolean,
    private val firebaseAuth: FirebaseAuth = FirebaseAuth.getInstance()
) : AuthGateway {

    private val identityState = MutableStateFlow<PlayerIdentity?>(null)
    private var localFallbackIdentity: PlayerIdentity? = null

    private val authStateListener = FirebaseAuth.AuthStateListener { auth ->
        identityState.value = auth.currentUser?.toPlayerIdentity()
    }

    init {
        if (firebaseReady) {
            firebaseAuth.addAuthStateListener(authStateListener)
            identityState.value = firebaseAuth.currentUser?.toPlayerIdentity()
        }
    }

    override suspend fun signInOrFallback(): PlayerIdentity {
        if (!firebaseReady) {
            localFallbackIdentity?.let { return it }
            val localIdentity = PlayerIdentity(
                uid = "local-${UUID.randomUUID()}",
                displayName = "Offline Player",
                authProvider = AuthProvider.ANONYMOUS
            )
            localFallbackIdentity = localIdentity
            identityState.value = localIdentity
            return localIdentity
        }

        firebaseAuth.currentUser?.toPlayerIdentity()?.let {
            identityState.value = it
            return it
        }

        tryGoogleSignInSilently()?.let {
            identityState.value = it
            return it
        }

        val anonymous = firebaseAuth.signInAnonymously().await().user?.toPlayerIdentity()
            ?: throw IllegalStateException("Anonymous sign-in did not return a user")

        identityState.value = anonymous
        return anonymous
    }

    override fun observeIdentity(): Flow<PlayerIdentity?> = identityState.asStateFlow()

    private suspend fun tryGoogleSignInSilently(): PlayerIdentity? {
        val webClientId = BuildConfig.FIREBASE_WEB_CLIENT_ID
        if (webClientId.isBlank()) {
            return null
        }

        return runCatching {
            val options = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(webClientId)
                .build()

            val account = GoogleSignIn.getClient(context, options).silentSignIn().await()
            val idToken = account.idToken ?: return null

            val credential = GoogleAuthProvider.getCredential(idToken, null)
            firebaseAuth.signInWithCredential(credential).await().user?.toPlayerIdentity()
        }.getOrNull()
    }

    private fun FirebaseUser.toPlayerIdentity(): PlayerIdentity {
        val provider = if (providerData.any { it.providerId == GoogleAuthProvider.PROVIDER_ID }) {
            AuthProvider.GOOGLE
        } else {
            AuthProvider.ANONYMOUS
        }

        val display = displayName.orEmpty().ifBlank {
            if (provider == AuthProvider.GOOGLE) "Google Player" else "Guest"
        }

        return PlayerIdentity(
            uid = uid,
            displayName = display,
            authProvider = provider
        )
    }
}
