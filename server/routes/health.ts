import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /_health:
 *   get:
 *     summary: Health check endpoint
 *     description: Simple health check to verify the server is running
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "ok"
 */
router.get('/', (req, res) => res.send("ok"));

export default router;

