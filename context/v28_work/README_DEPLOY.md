# RLCSS Online Multiplayer — Firebase Deployment Guide

This folder is a Firebase-ready multiplayer rewrite of the RLCSS browser game.

It uses:

- **Firebase Hosting** for the static web app.
- **Firebase Authentication** with anonymous sign-in.
- **Firebase Realtime Database** for lobby data, player inputs, ready states, and replicated match state.
- A **host-authoritative simulation**: the player who creates the lobby runs the physics simulation; other players send inputs to Firebase and render the host's replicated state.

## Files

```text
rlcss-firebase/
├─ firebase.json
├─ database.rules.json
├─ .firebaserc.example
├─ README_DEPLOY.md
└─ public/
   ├─ index.html
   ├─ styles.css
   └─ js/
      ├─ app.js
      ├─ physics.js
      ├─ config.js
      └─ config.example.js
```


## V17 fixes

- Single Player now opens a **Solo Setup** screen first, so you can configure mode, team size, your team/role, AI roles, opponent difficulty, and opponent playstyle before starting.
- Press **Start Match** in the solo setup to launch immediately with AI filling the remaining slots.
- Create Lobby now uses smaller Firebase writes with timeouts, so it should either show the lobby code or show a clear Firebase/Auth/Rules error instead of staying stuck on “Creating lobby…”.
- If online lobby creation fails on a no-terminal deployment, paste the included `database.rules.json` into **Firebase Console → Realtime Database → Rules → Publish**.

## Implemented multiplayer features

- Create lobby.
- Generates a short lobby code.
- Join lobby by code.
- Everyone chooses team: Blue or Orange.
- Players can team up or play against each other.
- Game starts automatically once every human player is ready.
- Team size from **1v1 to 5v5**.
- Current 1v1 arena is the baseline size; larger teams scale the map up.
- AI fills empty team slots.
- AI roles:
  - Goalkeeper
  - Back / Defence
  - Midfield
  - Attack
- Host can configure AI roles for empty slots in the lobby.
- Opponent AI difficulty:
  - Rookie
  - Pro
  - All-Star
- Opponent AI playstyle:
  - Balanced
  - Defensive
  - Aggressive
  - Chaotic
- Game modes:
  - Standard
  - Ice Rink
  - Snooker Cue
  - Flying Scoutsman
- Max human lobby capacity depends on game mode:
  - Standard: up to full selected team size, e.g. 5v5 = 10 humans
  - Ice Rink: up to full selected team size
  - Flying Scoutsman: capped at 8 humans, AI can still fill remaining selected slots
  - Snooker Cue: capped at 6 humans, AI can still fill remaining selected slots

## Important architecture note

This is a Firebase-only multiplayer prototype. It does **not** use a dedicated authoritative server.

The lobby creator is the authority for the physics simulation. This keeps deployment simple because Firebase Hosting and Realtime Database are enough, but it means:

- The host should have a stable connection.
- Host cheating is not prevented.
- For a competitive public game, the next step should be a server-authoritative Node/WebSocket backend or Cloud Run service.


## Already configured Firebase web app

This package has been updated with your Firebase web app config for project `pocket-league-6d3ce` in `public/js/config.js`, and includes a `.firebaserc` pointing Firebase CLI deploys at that project.

Important: your Firebase snippet did **not** include `databaseURL`. I added the usual default Realtime Database URL:

```js
databaseURL: "https://pocket-league-6d3ce-default-rtdb.europe-west1.firebasedatabase.app"
```

Before deploying, open Firebase Console → Realtime Database and check the database URL at the top of the database page. If it is different, replace the `databaseURL` value in `public/js/config.js`. This commonly differs if you created the database in a regional location.

## Phone-only deployment using GitHub Codespaces

1. Upload this folder or ZIP to a new GitHub repository.
2. Open the repository on your phone.
3. Use **Code → Codespaces → Create codespace on main**.
4. In the Codespaces terminal, run:

```bash
npm install -g firebase-tools
firebase login --no-localhost
firebase deploy
```

If `firebase deploy` asks for the project, choose `pocket-league-6d3ce`.

## 1. Create a Firebase project

1. Go to the Firebase Console.
2. Create a new project.
3. Add a **Web App** to the project.
4. Copy the Firebase web app config object.

Firebase Console: https://console.firebase.google.com/

## 2. Enable Anonymous Authentication

1. In Firebase Console, open **Build → Authentication**.
2. Click **Get started** if needed.
3. Go to **Sign-in method**.
4. Enable **Anonymous**.

The app uses anonymous auth so every browser gets a unique `uid` for lobby membership, ready state, and input writes.

## 3. Create a Realtime Database

1. In Firebase Console, open **Build → Realtime Database**.
2. Create a database.
3. Choose a region close to your expected players.
4. Start in locked mode or test mode; you will deploy the included rules later.

## 4. Paste your Firebase config

Open:

```text
public/js/config.js
```

Replace the placeholder object with your actual Firebase web app config:

```js
export const FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.REGION.firebasedatabase.app",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

Make sure `databaseURL` is included. Realtime Database needs this value.

## 5. Install Firebase CLI

Install the Firebase CLI if you do not have it:

```bash
npm install -g firebase-tools
```

Then sign in:

```bash
firebase login
```

## 6. Connect this folder to your Firebase project

From the `rlcss-firebase` folder, either run:

```bash
firebase use --add
```

Then choose your Firebase project and alias it as `default`.

Or create a `.firebaserc` file from the example:

```bash
cp .firebaserc.example .firebaserc
```

Then edit `.firebaserc`:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

## 7. Deploy Hosting and Realtime Database rules

From the `rlcss-firebase` folder:

```bash
firebase deploy
```

This deploys:

- `public/` to Firebase Hosting.
- `database.rules.json` to Realtime Database security rules.

## 8. Test online multiplayer

1. Open the deployed Hosting URL in one browser.
2. Create a lobby.
3. Copy the lobby code.
4. Open the Hosting URL in another browser/device.
5. Join using the code.
6. Pick teams/roles.
7. Ready up on every device.
8. The match should start automatically.

## Recommended next improvements

For a stronger production version:

1. Move physics authority to a server, such as Cloud Run + WebSockets.
2. Add region selection for lobbies.
3. Add reconnect/host migration.
4. Add lobby expiry cleanup with Cloud Functions.
5. Add gamepad support.
6. Add a proper interpolation buffer for remote clients.
7. Add match history and persistent player names.
8. Add rate-limited database rules or App Check.

## Official Firebase references

- Firebase Hosting quickstart: https://firebase.google.com/docs/hosting/quickstart
- Firebase Realtime Database web setup: https://firebase.google.com/docs/database/web/start
- Firebase Realtime Database read/write docs: https://firebase.google.com/docs/database/web/read-and-write
- Firebase Realtime Database security rules: https://firebase.google.com/docs/database/security


## Phone / no-terminal database rules

If you deployed the site through Netlify or another GitHub UI and did not run `firebase deploy`, the Realtime Database rules in `database.rules.json` will not be applied automatically. Multiplayer lobby creation will fail until the rules are installed.

From Firebase Console on your phone:

1. Open **Build → Realtime Database → Rules**.
2. Replace the rules with the contents of `database.rules.json`.
3. Tap **Publish**.
4. Make sure **Build → Authentication → Sign-in method → Anonymous** is enabled.

The app now shows a visible error message if Firebase Auth or Database writes fail, instead of making the Create Lobby button look dead.

## V18 hotfix notes

This version fixes a Single Player button crash caused by a missing browser-side `clamp()` helper in `public/js/app.js`. Symptoms were: tapping **Single Player Setup** appeared to do nothing.

It also simplifies `database.rules.json` for the prototype multiplayer lobby flow:

```json
{
  "rules": {
    "lobbies": {
      "$code": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

If you are hosting with Netlify/GitHub rather than Firebase CLI deploys, upload these rules manually in Firebase Console: **Realtime Database → Rules → paste → Publish**. Without the updated rules, online lobby creation may stay stuck or fail before showing a usable code.

## V28 notes

- Desktop performance pass: lower desktop DPR cap, lower shadow map size, no dynamic point lights on stadium props/boost pads, static props no longer cast shadows, fewer decorative props, and resize checks are skipped unless the canvas actually changed.
- Physics feel pass: slightly stronger acceleration/boost, tighter normal grip, more responsive powerslide yaw, better aerial control, and slightly stronger front-facing touches while keeping the heavier V26 ball feel.
- Added two selectable vehicles: Muscle GT and Utility Van.
- Added in-game text chat with Game and Team channels. Host can configure Game chat as everyone-visible or same-team-only per lobby. Chat can be muted locally.
- Added host-only pause/resume during matches; `P` also toggles pause for the host on desktop.
