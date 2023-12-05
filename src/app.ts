import express from "express";
import https from "https";
import fs from "fs";
import http from "http";
import { logger } from "./utils/logger";
import { initDB } from "./utils/db";
import { logHandler } from "./routes/log";
import { checkUptime } from "./routes/log";


const app = express();

const PORT = process.env.PORT || 8081,
  LOCAL = process.env.LOCAL || 0,
  HTTP = process.env.HTTP || 0;

var bodyParser = require("body-parser");

logger.info("API Initialized");

var cors = require("cors");
app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);


app.use((_req, _res, next) => {
  console.log("Time:", Date.now());
  next();
});

app.get("/", (_req, res) => {
  logger.info("Received GET Request to / endpoint");
  res.send("Hans Wehr Logging API is up and running");
});


app.use(bodyParser.json());
app.use('/log', logHandler)


const UPTIME_CHECK_INTERVAL = process.env.UPTIME_CHECK_INTERVAL as unknown as number || 60000; // Default: 1 minute

setInterval(checkUptime, UPTIME_CHECK_INTERVAL);


initDB()
  .then((_database) => {
    logger.info("Database Initialized");
    startListening();
  })
  .catch((err) => {
    logger.error("Error connecting to the database", err);
  });

function startListening() {
  if (LOCAL) {
    app.listen(PORT, () => {
      logger.info(`API listening port ${PORT}...`);
    });
  } else if (HTTP) {
    initializeHTTP();
  }
  else {
    console.log("Trying to run HTTP and HTTPS Server")
    initializeHTTP();
    initializeHTTPS();

  }
}

// initializes the HTTP server
function initializeHTTP() {
  const httpServer = http.createServer(app);
  httpServer.listen(80, () => {
    console.log("HTTP Server running on port 80");
  });
}

// initializes the HTTPS server
function initializeHTTPS() {
  const HTTPS_KEY = fs.readFileSync(
    "privkey.pem"
  )
  const HTTPS_CERT = fs.readFileSync(
    "fullchain.pem"
  )
  // if (!HTTPS_CERT || !HTTPS_KEY) {
  //   logger.error("Error: Missing HTTPS Credentials")
  //   console.log("Error: Missing HTTPS Credentials")
  //   throw new Error("Error: Missing HTTPS Credentials")
  // }

  console.log("About to create HTTPS server")
  console.log("HTTPS KEY: " + HTTPS_KEY)
  console.log("HTTPS CERT: " + HTTPS_CERT)

  try {
    const httpsServer = https.createServer(
      {
        key: fs.readFileSync(
          "./privkey.pem"
        ),
        cert: fs.readFileSync(
          "./fullchain.pem"
        ),
      },
      app
    );

    console.log("Created HTTPS Server")

    httpsServer.listen(443, () => {
      console.log("HTTPS Server running on port 443");
    });
  } catch (err) {
    console.error(err);
  }
}
