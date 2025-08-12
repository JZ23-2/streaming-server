const express = require("express");
const router = express.Router();
const streamKeyController = require("../controllers/streamKeyController");

/**
 * @swagger
 * /create-stream-key:
 *   post:
 *     summary: Create a stream key for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Stream key created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 streamKey:
 *                   type: string
 *                   example: 9a1f3e4b2c7d8e6f
 *                 email:
 *                   type: string
 *                   example: nigger@example.com
 *       400:
 *         description: Missing required parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email are required
 */
router.post("/create-stream-key", streamKeyController.createStreamKey);

module.exports = router;
