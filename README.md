# Ultimate Tic-Tac-Toe Android (Live 1v1)

Neon-themed, snappy Ultimate Tic-Tac-Toe built with Jetpack Compose and Firebase Realtime Database.

## Features
- Ultimate Tic-Tac-Toe rules with move-mapping and open-field fallback
- Live room-code multiplayer (host + one guest)
- Rematch in same room
- Disconnect grace timer and forfeit handling
- Home, How-To, Game, and Match Summary screens
- Hybrid auth: Google silent sign-in when configured, automatic anonymous fallback

## Stack
- Kotlin + Jetpack Compose
- Firebase Auth + Realtime Database
- Gradle wrapper build

## Firebase Setup (Free Spark tier)
1. Install Firebase CLI:
   - `npm install -g firebase-tools`
2. Login:
   - `firebase login`
3. Create/select project:
   - `firebase projects:list`
   - `firebase use <project_id>`
4. Ensure Realtime Database is enabled in a US region.
5. Deploy rules:
   - `firebase deploy --only database --project <project_id>`
6. Configure Android app credentials:
   - Preferred: add `app/google-services.json`
   - Or use `local.properties` with keys from `local.properties.example`

## Current Firebase Project (Already Provisioned)
- Project ID: `uttt-android-260218-sak`
- Realtime DB: `uttt-android-260218-sak-default-rtdb` (`us-central1`)

## Auth Mode Note
- The app tries Google sign-in first when `FIREBASE_WEB_CLIENT_ID` is configured.
- If Google sign-in is unavailable, it falls back to Firebase Anonymous Auth.

## Build Debug APK
```bash
./gradlew assembleDebug
```
APK output:
- `app/build/outputs/apk/debug/app-debug.apk`

## Testing
```bash
./gradlew test
```

## Room Flow
- Host taps **Create Room** and shares code.
- Guest enters code and taps **Join Room**.
- Each move directs opponent to a mini-grid matching the chosen cell position.
