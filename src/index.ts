import connectionToDb from "./config/db";
import { BACKEND_IP, PORT } from "./config/ENV";
import app from "./server";
import dotenv from "dotenv";
import http from "http";

// Loading the local Environment Variables from .env file
dotenv.config();

// connection to the database
connectionToDb();

// For Vercel compatibility, only start server if not in a serverless environment
if (!process.env.VERCEL_ENV) {
  // creating server
  const server = http.createServer(app);

  // Initialize socket.io only in non-serverless environments
  if (!process.env.VERCEL_ENV) {
    import("./config/socketio").then(({ default: setUpSocketIO }) => {
      const io = setUpSocketIO(server);
    });
  }

  //using the imported values
  const backendIp = BACKEND_IP || 'localhost';
  const port = PORT || 3000;

  server.listen(port, backendIp, () => {
    console.log(`Server is running at http://${backendIp}:${port}`);
  });
}

export default app;