// Firebase Web App config for pocket-league-6d3ce.
// Realtime Database URL confirmed from Firebase Console (europe-west1).
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD2Cmcmd0LrEEzPwcR4gjK9tYA76MlQ0dU",
  authDomain: "pocket-league-6d3ce.firebaseapp.com",
  databaseURL: "https://pocket-league-6d3ce-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pocket-league-6d3ce",
  storageBucket: "pocket-league-6d3ce.firebasestorage.app",
  messagingSenderId: "1024169843400",
  appId: "1:1024169843400:web:6bad6a69977424a10923fd",
  measurementId: "G-87HGQ3J7PQ"
};

// WebRTC voice chat configuration.
// The default public STUN server works for many home/mobile networks.
// If voice connects for some players but not others, add your own TURN server here.
export const WEBRTC_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};
