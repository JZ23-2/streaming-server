import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import "dotenv/config.js";
import path from "path";
import { fileURLToPath } from "url";

import { nms } from "./configs/nmsConfig.js";
import streamRoutes from "./routes/streamRoutes.js";
import { registerNmsListeners } from "./listeners/nmsListeners.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", allowedHeaders: "*" }));

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Stream Key API",
    version: "1.0.0",
    description: "API to create stream keys for streamers",
  },
  servers: [{ url: `${process.env.API_URL}`, description: "Local server" }],
};
const options = { swaggerDefinition, apis: ["./routes/*.js"] };
const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", streamRoutes);

const PORT_API = process.env.PORT_API;

app.listen(PORT_API, () => {
  console.log(`API server running on port ${PORT_API}`);
  console.log(`Swagger UI available at http://localhost:${PORT_API}/api-docs`);
});

nms.run();
registerNmsListeners(nms, __dirname);