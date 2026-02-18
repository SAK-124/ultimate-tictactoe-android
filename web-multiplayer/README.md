# Ultimate Tic-Tac-Toe Web (No Login)

Standalone mobile-friendly web app for 2-player Ultimate Tic-Tac-Toe using the same move + room transaction logic as the Android app.

## Features

- No login required
- Random 4-digit room code creation
- Join by 4-digit code
- Same gameplay rules as existing Android game engine
- Realtime sync via Firebase Realtime Database
- Presence tracking and auto-forfeit after 45 seconds disconnect
- Rematch flow

## 1) Configure Firebase env

Create `.env` in this folder using `.env.example`:

```bash
cp .env.example .env
```

Fill with your Firebase web config values (`VITE_FIREBASE_*`).

## 2) Run locally

```bash
npm install
npm run dev
```

## 3) Test parity logic

```bash
npm test
```

## 4) Build production bundle

```bash
npm run build
```

## 5) Deploy Firebase DB rules for `webRooms`

This project has its own Firebase config/rules in this folder so Android files stay untouched.

```bash
firebase deploy --project <project_id> --only database --config firebase.json
```

## 6) Deploy to Netlify

From this folder:

```bash
npx netlify status
npx netlify link
npx netlify deploy --prod --dir dist
```

If environment vars are not set on Netlify, set them first:

```bash
npx netlify env:set VITE_FIREBASE_API_KEY "..."
npx netlify env:set VITE_FIREBASE_APP_ID "..."
npx netlify env:set VITE_FIREBASE_DATABASE_URL "..."
npx netlify env:set VITE_FIREBASE_PROJECT_ID "..."
npx netlify env:set VITE_FIREBASE_STORAGE_BUCKET "..."
npx netlify env:set VITE_FIREBASE_AUTH_DOMAIN "..."
```
