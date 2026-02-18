package com.sak.ultimatetictactoe.data

import android.content.Context
import com.sak.ultimatetictactoe.data.auth.AuthGateway
import com.sak.ultimatetictactoe.data.auth.FirebaseAuthGateway
import com.sak.ultimatetictactoe.data.room.FirebaseRoomGateway
import com.sak.ultimatetictactoe.data.room.RoomGateway

class AppContainer(
    context: Context,
    val firebaseReady: Boolean
) {
    val preferencesStore: AppPreferencesStore = AppPreferencesStore(context)
    val authGateway: AuthGateway = FirebaseAuthGateway(context, firebaseReady)
    val roomGateway: RoomGateway = FirebaseRoomGateway(firebaseReady)
}
