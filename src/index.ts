import connectionToDb from "./config/db";
import { BACKEND_IP, PORT } from "./config/ENV";
import setUpSocketIO from "./config/socketio";
import app from "./server";
import dotenv from "dotenv";
import http from "http";

// Loading the local Environment Variables from .env file
dotenv.config();

// connection to the database
connectionToDb();

// creating server
const server = http.createServer(app);

// initialize the socket io
const io = setUpSocketIO(server);

//using the post and ip over here
const backendIp = process.env.BACKEND_IP;
const port = process.env.PORT || 3000;

server.listen(PORT, BACKEND_IP, () => {
  console.log(`Server is running at http://${BACKEND_IP}:${PORT}`);
});
