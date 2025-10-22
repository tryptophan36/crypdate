import type { Request, Response } from 'express';
import watchlistService from '../services/watchlistService.js';
import { handleServiceError } from '../utils/errorHandler.js';

export const getWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown as { userId: string }).userId;
    const result = await watchlistService.getWatchlist(userId);
    res.json({ data: result.data });
  } catch (error) {
    handleServiceError(error, res);
  }
};

export const followToken = async (req: Request, res: Response) => {
  try {
    const userId = (req as unknown as { userId: string }).userId;
    const result = await watchlistService.followToken(userId, req.body);
    res.status(201).json({ data: result.data });
  } catch (error) {
    handleServiceError(error, res);
  }
};
