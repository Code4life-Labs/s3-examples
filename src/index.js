const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Import endpoins
const endpoints = require("./endpoints");

const app = express();
const server = http.createServer(app);

// Add global middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create router
const router = express.Router();

// Apply router
app.use(router);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Build endpoints
endpoints.buildEndpoints(router).then(() => {
  server.listen(PORT, HOST, function () {
    console.log(`Your server is listening on http://localhost:${PORT}`);
  });
});
