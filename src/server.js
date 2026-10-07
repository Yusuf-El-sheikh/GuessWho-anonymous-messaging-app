import http from "http";
import { createApp } from "./index.js";
import mongoose from "mongoose";
import { logger } from "./pkg/logger/logger.js";

const server = http.createServer(createApp);

server.listen(env.port, () => {
    logger.info("server running on port 3000\n\nhttp://localhost:3000");
  });

async function shutdown() {
  server.close();
  await mongoose.disconnect();
  process.exit(0);
}

server.on("SIGINT", shutdown);

server.on("SIGTERM", shutdown);
