import winston from "winston"; import { Loggly } from "winston-loggly-bulk";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [],
});

if (process.env.LOCAL === "1") {
  logger.add(
    new winston.transports.Console({
      level: "debug",
      format: winston.format.simple(),
    })
  );
}

if (true) {
  logger.add(
    new Loggly({
      token: "2d22dcaa-4f11-4398-a2a3-2cf8c5fdb5a5",
      subdomain: "hanswehr",
      tags: ["Winston-NodeJS"],
      json: true,
    })
  );
}

