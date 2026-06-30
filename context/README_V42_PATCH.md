# RLCSS V42 — Lobby Voice/Chat, Audio and UI Polish

Built on V41.

## Changes

- Lobby-stage chat now works before the match starts as well as during matches.
- Team chat can be used by players already in the lobby.
- Voice chat can be joined in the lobby before match start.
- Voice join explicitly requests microphone permission and falls back to the default mic if a previously saved mic device is unavailable.
- Local microphone activity is visible even before another player joins:
  - PC: active-speaker overlay includes your local mic meter.
  - Phone/PC: mic button shows a small activity meter.
- Added mic sensitivity in Audio settings.
- Kept voice activation options: always-on or push-to-talk.
- Fixed top overlay button overlap with compact icon buttons.
- Made the phone lobby/music controls avoid each other.
- Simplified Controller settings messaging so users know they need to press a controller button once to wake it.
- Polished pause menu layout for desktop and phone.
- Pause menu now includes a small music player: previous/restart, play/pause, current song, next.

## Firebase

No new Firebase config is required. Use the existing V41/V42 database rules if your deployed rules are older than the voice/chat/profile versions.
