// src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {  query } from "./db.js";
import { verifyInitData } from "./telegramVerify.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(cors({
  origin: process.env.WEBAPP_ORIGIN || true,
}));

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const JWT_SECRET: string = process.env.JWT_SECRET || "dev_secret";

/**
 * Helper: parse initData query-string into object
 */
function parseInitData(initData: string) {
  const obj: Record<string, string> = {};
  initData.split("&").forEach(pair => {
    const [k, v] = pair.split("=");
    if (k) {
      obj[k] = decodeURIComponent(v || "");
    }
  });
  return obj;
}

/**
 * Middleware to authenticate using Bearer JWT
 */
function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = (req.headers.authorization || "");
  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ ok: false, error: "unauth" });
  const token = parts[1];
  if (!token) return res.status(401).json({ ok: false, error: "unauth" });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    if (payload && payload.sub) {
      (req as unknown as { userId: string }).userId = String(payload.sub);
      next();
    } else {
      return res.status(401).json({ ok: false, error: "invalid_token" });
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("authMiddleware error", e.message);
    } else {
      console.error("authMiddleware error", e);
    }
    return res.status(401).json({ ok: false, error: "invalid_token" });
  }
}

/**
 * POST /api/verify-init
 * body: { initData: string }
 * Verifies Telegram initData, upserts user, returns { user, sessionToken }
 */
app.post("/api/verify-init", async (req, res) => {
  const { initData } = req.body;
  if (!initData) return res.status(400).json({ ok: false, error: "missing initData" });

  const ok = verifyInitData(initData, BOT_TOKEN);
  if (!ok) return res.status(401).json({ ok: false, error: "invalid_signature" });

  const parsed = parseInitData(initData);
  const user = parsed["user"] ? JSON.parse(parsed["user"]) : null;
  if (!user || !user.id) return res.status(400).json({ ok: false, error: "invalid_user" });

  const userId = String(user.id);
  // Upsert user into users table
  await query(
    `INSERT INTO users(id, first_name, last_name, username)
     VALUES($1,$2,$3,$4)
     ON CONFLICT (id) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, username = EXCLUDED.username`,
    [userId, user.first_name || null, user.last_name || null, user.username || null]
  );

  const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "6h" });
  return res.json({ ok: true, user: { id: userId, first_name: user.first_name, username: user.username }, sessionToken: token });
});

/**
 * GET /api/user/watchlist
 * Returns watchlist for authenticated user
 */
app.get("/api/user/watchlist", authMiddleware, async (req, res) => {
  const userId = (req as unknown as { userId: string }).userId;
  const r = await query("SELECT token_symbol FROM watchlists WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
  const list = r.rows.map((r: { token_symbol: string }) => r.token_symbol);
  res.json({ ok: true, watchlist: list });
});

/**
 * POST /api/user/follow
 * body: { token: string }
 */
app.post("/api/user/follow", authMiddleware, async (req, res) => {
  const userId = (req as unknown as { userId: string }).userId;
  const { token } = req.body;
  if (!token) return res.status(400).json({ ok: false, error: "missing token" });
  const sym = String(token).trim().toUpperCase();

  try {
    await query("INSERT INTO watchlists (user_id, token_symbol) VALUES ($1, $2) ON CONFLICT DO NOTHING", [userId, sym]);
    // Optionally send confirmation via Telegram Bot API server-side here
    res.json({ ok: true, token: sym });
  } catch (err) {
    console.error("follow err", err);
    res.status(500).json({ ok: false, error: "db_error" });
  }
});

/**
 * health
 */
app.get("/_health", (req, res) => res.send("ok"));

// start server
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Server listening on ${port}`));
