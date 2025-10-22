import type { Request, Response } from 'express';

import AuthService from '../services/authService.js';
import { handleServiceError } from '../utils/errorHandler.js';

export const verifyInit = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.verifyInit(req.body);
    res.json({ data: result.data });
  } catch (error) {
    handleServiceError(error, res);
  }
};
