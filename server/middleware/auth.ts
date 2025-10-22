import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET: string = process.env.JWT_SECRET || "dev_secret";

/**
 * Middleware to authenticate using Bearer JWT
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = (req.headers.authorization || "");
  const parts = auth.split(" ");
  
  if (parts.length !== 2) {
    return res.status(401).json({ ok: false, error: "unauth" });
  }
  
  const token = parts[1];
  if (!token) {
    return res.status(401).json({ ok: false, error: "unauth" });
  }
  
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
