import { query } from '../db.js';

class WatchlistService {
  async getWatchlist(userId: string) {
    const result = await query(
      "SELECT token_symbol FROM watchlists WHERE user_id = $1 ORDER BY created_at DESC", 
      [userId]
    );
    const watchlist = result.rows.map((r: { token_symbol: string }) => r.token_symbol);
    
    return { success: true, data: { watchlist } };
  }

  async followToken(userId: string, data: { token: string }) {
    const { token } = data;
    
    if (!token) {
      throw new Error("missing token");
    }
    
    const symbol = String(token).trim().toUpperCase();
    
    await query(
      "INSERT INTO watchlists (user_id, token_symbol) VALUES ($1, $2) ON CONFLICT DO NOTHING", 
      [userId, symbol]
    );
    
    return { success: true, data: { token: symbol } };
  }
}

export default new WatchlistService();

