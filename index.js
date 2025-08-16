import express from "express";
import NodeMediaServer from "node-media-server";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
// import * as streamKeyRoutes from "./routes/streamKeyRoutes.js";
import * as streamKeyService from "./services/streamKeyService.js";
import path from 'path';
import "dotenv/config.js";
import cors from 'cors';
import fs from 'fs'
import {
  getAllFollowers,
  getUserByStreamingKey,
} from "./services/userService.js";
import { fileURLToPath } from "url";


const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT_API = 3000;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Stream Key API",
    version: "1.0.0",
    description: "API to create stream keys for streamers",
  },
  servers: [
    {
      url: `http://localhost:${PORT_API}`,
      description: "Local server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/streamKeyRoutes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use("/", streamKeyRoutes);

const nmsConfig = {
  http: {
    port: 8000,
    allow_origin: "*",
    mediaroot: "./media",
    host: "0.0.0.0",
  },
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 10,
    ping_timeout: 60,
    host: "0.0.0.0",
  },
  trans: {
    ffmpeg: "/usr/bin/ffmpeg",
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
        hlsKeep: false,
      },
    ],
    MediaRoot: "./media",
  },
};

const nms = new NodeMediaServer(nmsConfig);

const streamMap = new Map();

nms.on("prePublish", async (id, StreamPath, args) => {
  console.log(`[NodeEvent on prePublish] id=${id} StreamPath=${StreamPath}`);

  const streamKey = StreamPath.split("/").pop();

  const userResponse = await getUserByStreamingKey(streamKey);
  if (!userResponse.ok) {
    const session = nms.getSession(id);
    session.reject();
    return;
  }
  streamMap.set(userResponse.ok.principal_id, userResponse.ok.streaming_key);

  const followersResponse = await getAllFollowers(userResponse.ok.principal_id);

  const payload = {
    streamerId: userResponse.ok.principal_id,
    followers: followersResponse.ok,
  };

  const notifyResponse = await fetch(
    `${process.env.BACKEND_URL}/api/v1/global-sockets/start-stream`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  // const { email, room } = streamKeyService.getStreamKeyInfo(streamKey);
  // console.log(`Stream started by ${email} in room ${room}`);
});


app.get('/watch/:streamerId/:file', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const {streamerId, file} = req.params;
  const streamingKey = streamMap.get(streamerId);
  if (!streamingKey) return res.status(404).send();

  const filePath = path.join(__dirname, 'media', 'live', streamingKey, file);
  if (!fs.existsSync(filePath)) return res.status(404).send();


  res.sendFile(filePath);
})

nms.run();

app.use(cors({
origin: '*',
allowedHeaders: '*'
}));

app.listen(PORT_API, () => {
  console.log(`API server running on port ${PORT_API}`);
  console.log(`Swagger UI available at http://localhost:${PORT_API}/api-docs`);
});
