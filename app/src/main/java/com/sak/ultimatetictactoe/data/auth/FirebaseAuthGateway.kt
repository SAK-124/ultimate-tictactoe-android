package com.sak.ultimatetictactoe.data.auth

import android.content.Context
import android.content.Intent
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
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
            return createOrGetLocalIdentity("Offline Player")
        }

        firebaseAuth.currentUser?.toPlayerIdentity()?.let {
            identityState.value = it
            return it
        }

        tryGoogleSignInSilently()?.let {
            identityState.value = it
            return it
        }

        throw IllegalStateException("Choose Google or Guest to continue")
    }

    override fun beginGoogleSignInIntent(): Intent? {
        return googleClient()?.signInIntent
    }

    override suspend fun completeGoogleSignIn(resultData: Intent?): PlayerIdentity {
        if (!firebaseReady) {
            return createOrGetLocalIdentity("Offline Player")
        }

        val webClientId = BuildConfig.FIREBASE_WEB_CLIENT_ID
        if (webClientId.isBlank()) {
            throw IllegalStateException("Google Sign-In is not configured for this build")
        }

        val account = runCatching {
            GoogleSignIn.getSignedInAccountFromIntent(resultData).await()
        }.getOrElse {
            throw IllegalStateException("Google Sign-In was canceled or failed")
        }

        val token = account.idToken ?: throw IllegalStateException("Google account token was missing")
        val credential = GoogleAuthProvider.getCredential(token, null)

        val firebaseUser = runCatching {
            firebaseAuth.signInWithCredential(credential).await().user
        }.getOrElse {
            throw IllegalStateException("Firebase auth failed after Google Sign-In")
        }

        val identity = firebaseUser?.toPlayerIdentity()
            ?: throw IllegalStateException("Google Sign-In did not return a Firebase user")

        identityState.value = identity
        return identity
    }

    override suspend fun continueAsGuest(): PlayerIdentity {
        if (!firebaseReady) {
            return createOrGetLocalIdentity("Offline Player")
        }

        val anonymous = runCatching {
            firebaseAuth.signInAnonymously().await().user?.toPlayerIdentity()
        }.getOrNull()

        if (anonymous != null) {
            identityState.value = anonymous
            return anonymous
        }

        throw IllegalStateException("Guest sign-in is unavailable. Enable Anonymous auth in Firebase")
    }

    override suspend fun signOut() {
        if (firebaseReady) {
            firebaseAuth.signOut()
            runCatching { googleClient()?.signOut()?.await() }
        }

        localFallbackIdentity = null
        identityState.value = null
    }

    override fun observeIdentity(): Flow<PlayerIdentity?> = identityState.asStateFlow()

    override fun dispose() {
        if (firebaseReady) {
            firebaseAuth.removeAuthStateListener(authStateListener)
        }
    }

    private suspend fun tryGoogleSignInSilently(): PlayerIdentity? {
        val client = googleClient() ?: return null

        return runCatching {
            val account = client.silentSignIn().await()
            val idToken = account.idToken ?: return null
            val credential = GoogleAuthProvider.getCredential(idToken, null)
            firebaseAuth.signInWithCredential(credential).await().user?.toPlayerIdentity()
        }.getOrNull()
    }

    private fun googleClient(): GoogleSignInClient? {
        if (!firebaseReady) return null

        val webClientId = BuildConfig.FIREBASE_WEB_CLIENT_ID
        if (webClientId.isBlank()) {
            return null
        }

        val options = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestIdToken(webClientId)
            .build()

        return GoogleSignIn.getClient(context, options)
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

    private fun createOrGetLocalIdentity(defaultName: String): PlayerIdentity {
        localFallbackIdentity?.let { return it }
        val localIdentity = PlayerIdentity(
            uid = "local-${UUID.randomUUID()}",
            displayName = defaultName,
            authProvider = AuthProvider.ANONYMOUS
        )
        localFallbackIdentity = localIdentity
        identityState.value = localIdentity
        return localIdentity
    }
}
