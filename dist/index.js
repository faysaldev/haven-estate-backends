"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: local Server running
const db_1 = __importDefault(require("./config/db"));
const ENV_1 = require("./config/ENV");
const socketio_1 = __importDefault(require("./config/socketio"));
const server_1 = __importDefault(require("./server"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
// Loading the local Environment Variables from .env file
dotenv_1.default.config();
// connection to the database
(0, db_1.default)();
// creating server
const server = http_1.default.createServer(server_1.default);
// initialize the socket io
const io = (0, socketio_1.default)(server);
//using the post and ip over here
const backendIp = process.env.BACKEND_IP;
const port = process.env.PORT || 3000;
// server.listen(PORT, BACKEND_IP, () => {
//   console.log(`Server is running at http://${BACKEND_IP}:${PORT}`);
// });
server.listen(ENV_1.PORT, () => {
    console.log(`Server is running at http://${ENV_1.BACKEND_IP}:${ENV_1.PORT}`);
});
// TODO: vercel code running
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import http from "http";
// import app from "./server"; // or "./app" if that's your Express app
// import setUpSocketIO from "./config/socketio";
// import connectionToDb from "./config/db";
// dotenv.config();
// const PORT = process.env.PORT || 3000;
// async function main() {
//   try {
//     // Connect to MongoDB
//     await connectionToDb(); // assumes connectionToDb() returns a Promise
//     console.log("Connected to the database");
//     // Create HTTP server
//     const server = http.createServer(app);
//     // Initialize Socket.IO
//     setUpSocketIO(server);
//     // Start server
//     server.listen(PORT, () => {
//       console.log(`Server is running at http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("Error starting the server:", error);
//   }
// }
// main();
