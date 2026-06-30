# RLCSS V40 patch

Changed files:

- `public/index.html`
- `public/styles.css`
- `public/js/app.js`

Highlights:

- Fixes menu music play/pause/loading state and adds a startup loader flow.
- Adds voice activation mode: always-on or push-to-talk.
- Adds separate voice chat volume.
- Adds audio device selection for microphone and output device where the browser supports it.
- Reorganises the Audio settings tab into clearer sections.
- Keeps the layout phone-friendly.

Note: browsers can still block audible autoplay until the first user interaction. The app now attempts launch autoplay, shows loading while the first song is being prepared, and falls back to first tap/click/key press if the browser blocks it.
