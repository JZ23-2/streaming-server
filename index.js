const express = require("express");
const NodeMediaServer = require("node-media-server");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const streamKeyRoutes = require("./routes/streamKeyRoutes");
const streamKeyService = require("./services/streamKeyService");

const app = express();
app.use(express.json());

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

app.use("/", streamKeyRoutes);

const nmsConfig = {
  http: {
    port: 8000,
    allow_origin: "*",
    mediaroot: "./media",
  },
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 10,
    ping_timeout: 60,
  },
  trans: {
    ffmpeg: "./ffmpeg",
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

nms.on("prePublish", (id, StreamPath, args) => {
  console.log(`[NodeEvent on prePublish] id=${id} StreamPath=${StreamPath}`);

  const streamKey = StreamPath.split("/").pop();

  if (!streamKeyService.validateStreamKey(streamKey)) {
    console.log(`Invalid stream key: ${streamKey}. Rejecting stream.`);
    const session = nms.getSession(id);
    session.reject();
    return;
  }

  const { email, room } = streamKeyService.getStreamKeyInfo(streamKey);
  console.log(`Stream started by ${email} in room ${room}`);
});

nms.run();

app.listen(PORT_API, () => {
  console.log(`API server running on port ${PORT_API}`);
  console.log(`Swagger UI available at http://localhost:${PORT_API}/api-docs`);
});
