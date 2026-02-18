package com.sak.ultimatetictactoe

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.viewmodel.compose.viewModel
import com.sak.ultimatetictactoe.data.AppContainer
import com.sak.ultimatetictactoe.data.auth.FirebaseBootstrap
import com.sak.ultimatetictactoe.ui.MainViewModel
import com.sak.ultimatetictactoe.ui.UltimateGameApp
import com.sak.ultimatetictactoe.ui.theme.UltimateTicTacToeTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val firebaseReady = FirebaseBootstrap.initialize(this)
        val appContainer = AppContainer(applicationContext, firebaseReady)

        setContent {
            UltimateTicTacToeTheme {
                val mainViewModel: MainViewModel = viewModel(factory = MainViewModel.factory(appContainer))
                UltimateGameApp(viewModel = mainViewModel)
            }
        }
    }
}
