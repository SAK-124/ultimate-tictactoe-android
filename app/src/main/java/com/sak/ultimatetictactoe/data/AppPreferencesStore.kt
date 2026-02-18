package com.sak.ultimatetictactoe.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.appDataStore by preferencesDataStore(name = "ultimate_ttt_prefs")

class AppPreferencesStore(
    private val context: Context
) {

    private val nicknameKey = stringPreferencesKey("nickname")
    private val howToSeenKey = booleanPreferencesKey("how_to_seen")
    private val musicEnabledKey = booleanPreferencesKey("music_enabled")
    private val musicVolumePercentKey = intPreferencesKey("music_volume_percent")

    val nicknameFlow: Flow<String> = context.appDataStore.data
        .map { preferences -> preferences[nicknameKey].orEmpty() }

    val howToSeenFlow: Flow<Boolean> = context.appDataStore.data
        .map { preferences -> preferences[howToSeenKey] ?: false }

    val musicEnabledFlow: Flow<Boolean> = context.appDataStore.data
        .map { preferences -> preferences[musicEnabledKey] ?: true }

    val musicVolumeFlow: Flow<Float> = context.appDataStore.data
        .map { preferences ->
            val savedPercent = preferences[musicVolumePercentKey] ?: 35
            (savedPercent.coerceIn(0, 100) / 100f)
        }

    suspend fun setNickname(nickname: String) {
        context.appDataStore.edit { preferences ->
            preferences[nicknameKey] = nickname.trim()
        }
    }

    suspend fun setHowToSeen(seen: Boolean) {
        context.appDataStore.edit { preferences ->
            preferences[howToSeenKey] = seen
        }
    }

    suspend fun setMusicEnabled(enabled: Boolean) {
        context.appDataStore.edit { preferences ->
            preferences[musicEnabledKey] = enabled
        }
    }

    suspend fun setMusicVolume(volume: Float) {
        val percent = (volume.coerceIn(0f, 1f) * 100f).toInt()
        context.appDataStore.edit { preferences ->
            preferences[musicVolumePercentKey] = percent
        }
    }
}
