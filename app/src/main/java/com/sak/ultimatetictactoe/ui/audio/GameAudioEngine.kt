package com.sak.ultimatetictactoe.ui.audio

import android.content.Context
import android.media.MediaPlayer
import android.media.SoundPool
import androidx.annotation.RawRes
import com.sak.ultimatetictactoe.R
import com.sak.ultimatetictactoe.ui.AppScreen

class GameAudioEngine(context: Context) {

    private val appContext = context.applicationContext

    private val soundPool = SoundPool.Builder()
        .setMaxStreams(4)
        .build()

    private val loadedSoundIds = mutableSetOf<Int>()

    private var placeSoundId: Int? = null
    private var miniGridWinSoundId: Int? = null
    private var matchWinSoundId: Int? = null

    private var bgmPlayer: MediaPlayer? = null
    private var activeScreen: AppScreen = AppScreen.HOME
    private var musicEnabled: Boolean = true
    private var musicVolume: Float = 0.35f

    init {
        soundPool.setOnLoadCompleteListener { _, sampleId, status ->
            if (status == 0) {
                loadedSoundIds += sampleId
            }
        }

        placeSoundId = loadSound(R.raw.sfx_place)
        miniGridWinSoundId = loadSound(R.raw.sfx_minigrid_win)
        matchWinSoundId = loadSound(R.raw.sfx_match_win)
    }

    fun setBgmScreen(screen: AppScreen) {
        activeScreen = screen
        if (shouldPlayBgm(screen)) {
            resume()
        } else {
            pause()
        }
    }

    fun setMusicEnabled(enabled: Boolean) {
        musicEnabled = enabled
        if (enabled) {
            resume()
        } else {
            pause()
        }
    }

    fun setMusicVolume(volume: Float) {
        musicVolume = volume.coerceIn(0f, 1f)
        bgmPlayer?.setVolume(musicVolume, musicVolume)
    }

    fun playPlace() {
        playSound(placeSoundId)
    }

    fun playMiniGridWin() {
        playSound(miniGridWinSoundId)
    }

    fun playMatchWin() {
        playSound(matchWinSoundId)
    }

    fun pause() {
        runCatching {
            bgmPlayer?.takeIf { it.isPlaying }?.pause()
        }
    }

    fun resume() {
        if (!musicEnabled || !shouldPlayBgm(activeScreen)) return

        val player = ensureBgmPlayer() ?: return
        runCatching {
            if (!player.isPlaying) {
                player.start()
            }
        }
    }

    fun release() {
        runCatching {
            bgmPlayer?.release()
            bgmPlayer = null
        }

        runCatching {
            soundPool.release()
        }
    }

    private fun shouldPlayBgm(screen: AppScreen): Boolean {
        return screen == AppScreen.HOME || screen == AppScreen.GAME || screen == AppScreen.SUMMARY
    }

    private fun ensureBgmPlayer(): MediaPlayer? {
        val existing = bgmPlayer
        if (existing != null) return existing

        val created = runCatching {
            MediaPlayer.create(appContext, R.raw.bgm_loop_main)
        }.getOrNull() ?: return null

        created.isLooping = true
        created.setVolume(musicVolume, musicVolume)
        bgmPlayer = created
        return created
    }

    private fun playSound(soundId: Int?) {
        val id = soundId ?: return
        if (id !in loadedSoundIds) return

        runCatching {
            soundPool.play(id, 0.9f, 0.9f, 1, 0, 1f)
        }
    }

    private fun loadSound(@RawRes soundRes: Int): Int? {
        return runCatching {
            soundPool.load(appContext, soundRes, 1)
        }.getOrNull()
    }
}
