import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { streamMap } from "../listeners/nmsListeners.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/watch/:streamerId/:file", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { streamerId, file } = req.params;
  const streamingKey = streamMap.get(streamerId);
  if (!streamingKey) return res.status(404).send();

  const filePath = path.join(__dirname, "../media/live", streamingKey, file);
  if (!fs.existsSync(filePath)) return res.status(404).send();

  res.sendFile(filePath);
});

export default router;
