import app from "./app";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";

const rawPort = process.env["PORT"] || "5001";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Wait for database connection to establish
db.once("open", () => {
  logger.info("Connected to MongoDB");
  
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
});

db.on("error", (err) => {
  logger.error({ err }, "MongoDB connection error");
});
