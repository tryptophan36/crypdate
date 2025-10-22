import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { verifyInitData } from '../telegramVerify.js';
import { parseInitData } from '../utils/helpers.js';

class AuthService {
  private readonly JWT_SECRET: string;
  private readonly BOT_TOKEN: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
    this.BOT_TOKEN = process.env.BOT_TOKEN || "";
  }

  async verifyInit(data: { initData: string }) {
    const { initData } = data;
    
    if (!initData) {
      throw new Error("missing initData");
    }

    const ok = verifyInitData(initData, this.BOT_TOKEN);
    if (!ok) {
      throw new Error("invalid_signature");
    }

    const parsed = parseInitData(initData);
    const user = parsed["user"] ? JSON.parse(parsed["user"]) : null;
    if (!user || !user.id) {
      throw new Error("invalid_user");
    }

    const userId = String(user.id);
    
    // Upsert user into users table
    await query(
      `INSERT INTO users(id, first_name, last_name, username)
       VALUES($1,$2,$3,$4)
       ON CONFLICT (id) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, username = EXCLUDED.username`,
      [userId, user.first_name || null, user.last_name || null, user.username || null]
    );

    const token = jwt.sign({ sub: userId }, this.JWT_SECRET, { expiresIn: "6h" });
    
    return { 
      success: true, 
      data: { 
        user: { id: userId, first_name: user.first_name, username: user.username }, 
        sessionToken: token 
      } 
    };
  }
}

export default new AuthService();

