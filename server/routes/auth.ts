import { Router } from 'express';
import { verifyInit } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /api/verify-init:
 *   post:
 *     summary: Verify Telegram initData and authenticate user
 *     description: Verifies Telegram initData, creates or updates user record, and returns JWT session token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyInitRequest'
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyInitResponse'
 *       400:
 *         description: Bad request - missing or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - invalid signature
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/verify-init', verifyInit);

export default router;
