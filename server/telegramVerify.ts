// src/telegramVerify.ts
import crypto from "crypto";

/**
 * Verify Telegram WebApp initData (raw query-like string) using BOT_TOKEN.
 * Returns true if valid.
 */
export function verifyInitData(initData: string, botToken: string): boolean {
  if (!initData || !botToken) return false;
  const parts = initData.split("&");
  const hashPart = parts.find(p => p.startsWith("hash="));
  if (!hashPart) return false;
  const hash = decodeURIComponent(hashPart.split("=")[1]);

  const dataCheckArray = parts.filter(p => !p.startsWith("hash=")).sort();
  const dataCheckString = dataCheckArray.join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const computed = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  return computed === hash;
}
