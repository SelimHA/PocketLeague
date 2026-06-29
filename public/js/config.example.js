// Copy this file to config.js and paste your Firebase Web App config.
// Firebase Console -> Project settings -> General -> Your apps -> Web app.
export const FIREBASE_CONFIG = {
  apiKey: "PASTE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.REGION.firebasedatabase.app",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// Optional WebRTC voice chat configuration.
// Keep the STUN entry below, or add a TURN server if some networks cannot connect peer-to-peer.
export const WEBRTC_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
    // Example TURN entry:
    // { urls: "turn:YOUR_TURN_HOST:3478", username: "TURN_USER", credential: "TURN_PASSWORD" }
  ]
};
