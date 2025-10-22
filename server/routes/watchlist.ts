import { Router } from 'express';
import { getWatchlist, followToken } from '../controllers/watchlistController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/user/watchlist:
 *   get:
 *     summary: Get user's watchlist
 *     description: Returns the list of token symbols that the authenticated user is following
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of watchlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WatchlistResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/watchlist', authMiddleware, getWatchlist);

/**
 * @swagger
 * /api/user/follow:
 *   post:
 *     summary: Follow a token
 *     description: Adds a token symbol to the authenticated user's watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FollowRequest'
 *     responses:
 *       200:
 *         description: Successfully added token to watchlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowResponse'
 *       400:
 *         description: Bad request - missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/follow', authMiddleware, followToken);

export default router;

