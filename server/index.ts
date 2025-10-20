// server/index.js
import express from "express";
import crypto from "crypto";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("Set BOT_TOKEN in env");

const sessions = {}; // { sessionToken: { user } }
const watchlists = {}; // { telegramId: [ "BTC", "ETH" ] }

// verify-init endpoint
function verifyInitData(initData, botToken) {
  // initData is a querystring like "user={...}&auth_date=...&hash=..."
  const params = initData.split("&").map(s => s);
  const hashParam = params.find(p => p.startsWith("hash="));
  if (!hashParam) return false;
  const hash = decodeURIComponent(hashParam.split("=")[1]);

  const dataCheckArray = params.filter(p => !p.startsWith("hash=")).sort();
  const dataCheckString = dataCheckArray.join("\n");

  const secret = crypto.createHash("sha256").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

  return computedHash === hash;
}

app.post("/api/verify-init", (req, res) => {
  const { initData } = req.body;
  if (!initData) return res.json({ ok: false, error: "missing initData" });

  const ok = verifyInitData(initData, BOT_TOKEN);
  if (!ok) return res.json({ ok: false, error: "invalid signature" });

  // parse params to get user JSON
  const obj = {};
  initData.split("&").forEach(pair => {
    const [k, v] = pair.split("=");
    obj[k] = decodeURIComponent(v || "");
  });

  let user = {};
  try { user = JSON.parse(obj["user"] || "{}"); } catch (e) { user = {}; }

  // create a short-lived session token (demo)
  const sessionToken = crypto.randomBytes(16).toString("hex");
  sessions[sessionToken] = { user, createdAt: Date.now() };

  // ensure watchlist exists
  watchlists[user.id] = watchlists[user.id] || [];

  res.json({ ok: true, user, sessionToken });
});

// protected helper
function getUserFromSession(req) {
  const auth = req.headers.authorization || "";
  const parts = auth.split(" ");
  if (parts.length !== 2) return null;
  const token = parts[1];
  return sessions[token]?.user || null;
}

app.get("/api/user/watchlist", (req, res) => {
  const user = getUserFromSession(req);
  if (!user) return res.status(401).json({ ok: false, error: "unauth" });
  const list = watchlists[user.id] || [];
  res.json({ ok: true, watchlist: list });
});

app.post("/api/user/follow", (req, res) => {
  const user = getUserFromSession(req);
  if (!user) return res.status(401).json({ ok: false, error: "unauth" });
  const { token } = req.body;
  if (!token) return res.json({ ok: false, error: "missing token" });
  watchlists[user.id] = watchlists[user.id] || [];
  if (!watchlists[user.id].includes(token)) watchlists[user.id].push(token);
  // Optionally: call Telegram bot to send confirmation via Bot API here
  res.json({ ok: true, watchlist: watchlists[user.id] });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("API listening on", port));
