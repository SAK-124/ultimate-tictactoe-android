package com.sak.ultimatetictactoe

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import com.sak.ultimatetictactoe.data.AppContainer
import com.sak.ultimatetictactoe.data.auth.FirebaseBootstrap
import com.sak.ultimatetictactoe.ui.MainViewModel
import com.sak.ultimatetictactoe.ui.UltimateGameApp
import com.sak.ultimatetictactoe.ui.theme.UltimateTicTacToeTheme

class MainActivity : ComponentActivity() {

    private lateinit var appContainer: AppContainer

    private val mainViewModel: MainViewModel by viewModels {
        MainViewModel.factory(appContainer)
    }

    private val googleSignInLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            mainViewModel.onGoogleSignInResult(result.data)
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val firebaseReady = FirebaseBootstrap.initialize(this)
        appContainer = AppContainer(applicationContext, firebaseReady)

        setContent {
            UltimateTicTacToeTheme {
                UltimateGameApp(
                    viewModel = mainViewModel,
                    onLaunchGoogleSignIn = { intent: Intent ->
                        googleSignInLauncher.launch(intent)
                    }
                )
            }
        }
    }

    override fun onStart() {
        super.onStart()
        mainViewModel.onAppForegrounded()
    }

    override fun onStop() {
        mainViewModel.onAppBackgrounded()
        super.onStop()
    }
}
