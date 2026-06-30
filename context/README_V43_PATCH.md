# RLCSS V43 — Pause Music UI Polish

Built on V42.

## Changes

- Removed the custom music player embedded inside the pause card.
- The pause menu now stays cleaner and only shows Settings, Resume, and Leave.
- The existing global music control dock is now available while the match is paused.
- On desktop, the global music dock stays visible at the top while paused.
- On phone, the same small music button is available at the top while paused and expands only when tapped.
- Kept the global dock hidden during active gameplay so it does not affect the match.
- Updated the menu version label to V43.

## Validation

- `node --check public/js/app.js`
- `node --check public/js/physics.js`
- `node --check public/js/config.js`
