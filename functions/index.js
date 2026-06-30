const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

const AI_API_KEY = defineSecret("AI_API_KEY");
const AI_TRANSCRIPTION_API_KEY = defineSecret("AI_TRANSCRIPTION_API_KEY");
const INTENTS = new Set(["ATTACK_BALL", "TAKE_SHOT", "DEFEND_GOAL", "ROTATE_BACK", "CLEAR_BALL", "PASS_LEFT", "PASS_RIGHT", "GET_BOOST", "GOALKEEPER_HOLD", "TEAM_PRESS", "MARK_OPPONENT", "SPREAD_OUT", "CENTER_BALL", "HOLD_POSITION", "SUPPORT_ME"]);
const PHRASES = [
  [/\b(defend|defense|defence|protect).*(goal|net)?\b/i, "DEFEND_GOAL"], [/\b(stay back|goalie|goalkeeper|keeper)\b/i, "GOALKEEPER_HOLD"],
  [/\b(take.*shot|shoot|score)\b/i, "TAKE_SHOT"], [/\b(go for it|attack|challenge)\b/i, "ATTACK_BALL"], [/\brotate back|fall back|come back\b/i, "ROTATE_BACK"],
  [/\bclear( it| ball)?\b/i, "CLEAR_BALL"], [/\bpass left|left pass\b/i, "PASS_LEFT"], [/\bpass right|right pass\b/i, "PASS_RIGHT"], [/\bboost|get boost|grab boost\b/i, "GET_BOOST"],
  [/\ball push|team press|pressure\b/i, "TEAM_PRESS"], [/\bmark|cover attacker\b/i, "MARK_OPPONENT"], [/\bspread|space out\b/i, "SPREAD_OUT"], [/\bcenter|centre\b/i, "CENTER_BALL"], [/\bhold position|wait\b/i, "HOLD_POSITION"], [/\bsupport me|help me\b/i, "SUPPORT_ME"]
];
function parseLocal(text) {
  const clean = String(text || "").slice(0, 240).trim();
  for (const [rx, intent] of PHRASES) if (rx.test(clean)) return { transcript: clean, intent, target: /defender/i.test(clean) ? "defence" : /goal/i.test(clean) ? "goalkeeper" : "all", durationMs: 8000, strength: 0.78, confidence: 0.86 };
  return { transcript: clean, intent: "HOLD_POSITION", target: "all", durationMs: 5000, strength: 0.45, confidence: 0.35 };
}
function cleanResponse(raw, fallbackTranscript = "") {
  const out = typeof raw === "object" && raw ? raw : parseLocal(fallbackTranscript);
  const intent = INTENTS.has(out.intent) ? out.intent : parseLocal(fallbackTranscript).intent;
  return { transcript: String(out.transcript || fallbackTranscript || "").slice(0, 240), intent, target: String(out.target || "all").slice(0, 24), durationMs: Math.max(2500, Math.min(12000, Number(out.durationMs) || 8000)), strength: Math.max(0.1, Math.min(1, Number(out.strength) || 0.75)), confidence: Math.max(0, Math.min(1, Number(out.confidence) || 0.7)) };
}
exports.parseAiTeamCommand = onCall({ secrets: [AI_API_KEY], timeoutSeconds: 10, memory: "256MiB" }, async request => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in is required.");
  const text = String(request.data?.text || "").slice(0, 240);
  if (!text.trim()) throw new HttpsError("invalid-argument", "Text command is required.");
  // Deterministic parser first; replace this block with an external AI provider call using AI_API_KEY.value() if desired.
  return cleanResponse(parseLocal(text), text);
});
exports.transcribeAiTeamCommand = onCall({ secrets: [AI_TRANSCRIPTION_API_KEY, AI_API_KEY], timeoutSeconds: 15, memory: "512MiB" }, async request => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in is required.");
  const audio = String(request.data?.audioDataUrl || "");
  if (!audio.startsWith("data:audio/") || audio.length > 900000) throw new HttpsError("invalid-argument", "A short audio data URL is required.");
  // Stub-safe endpoint: no raw audio is persisted. Configure provider code here with AI_TRANSCRIPTION_API_KEY.value().
  return cleanResponse({ transcript: "", intent: "HOLD_POSITION", target: "all", durationMs: 5000, strength: 0.45, confidence: 0.2 }, "");
});
