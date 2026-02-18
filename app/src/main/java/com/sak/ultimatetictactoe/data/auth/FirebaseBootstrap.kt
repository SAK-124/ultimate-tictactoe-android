package com.sak.ultimatetictactoe.data.auth

import android.content.Context
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.sak.ultimatetictactoe.BuildConfig

object FirebaseBootstrap {

    fun initialize(context: Context): Boolean {
        if (FirebaseApp.getApps(context).isNotEmpty()) {
            return true
        }

        FirebaseApp.initializeApp(context)?.let {
            return true
        }

        val apiKey = BuildConfig.FIREBASE_API_KEY
        val appId = BuildConfig.FIREBASE_APP_ID
        val projectId = BuildConfig.FIREBASE_PROJECT_ID

        if (apiKey.isBlank() || appId.isBlank() || projectId.isBlank()) {
            return false
        }

        return runCatching {
            val optionsBuilder = FirebaseOptions.Builder()
                .setApiKey(apiKey)
                .setApplicationId(appId)
                .setProjectId(projectId)

            if (BuildConfig.FIREBASE_DATABASE_URL.isNotBlank()) {
                optionsBuilder.setDatabaseUrl(BuildConfig.FIREBASE_DATABASE_URL)
            }

            if (BuildConfig.FIREBASE_STORAGE_BUCKET.isNotBlank()) {
                optionsBuilder.setStorageBucket(BuildConfig.FIREBASE_STORAGE_BUCKET)
            }

            FirebaseApp.initializeApp(context, optionsBuilder.build())
        }.getOrNull() != null
    }
}
