package com.sak.ultimatetictactoe.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
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

    val nicknameFlow: Flow<String> = context.appDataStore.data
        .map { preferences -> preferences[nicknameKey].orEmpty() }

    val howToSeenFlow: Flow<Boolean> = context.appDataStore.data
        .map { preferences -> preferences[howToSeenKey] ?: false }

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
}
