import app from '../src/server';
import { createServer } from 'http';
import { Server } from 'socket.io';

declare global {
  var dbConnected: boolean;
}

// Create a wrapper for the Express app to work with Vercel
export default async function handler(req: any, res: any) {
  // Connect to database once per cold start (in serverless environment)
  if (!global.dbConnected) {
    try {
      const connectionToDb = await import('../src/config/db');
      await connectionToDb.default();
      global.dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }

  // Handle different HTTP methods
  if (req.method === 'GET' && req.url === '/') {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Hello, TypeScript with Node and Express!' });
    return;
  }

  // For API routes, delegate to the Express app
  return app(req, res);
}

export const config = {
  api: {
    bodyParser: false, // Vercel handles body parsing
    externalResolver: true, // Indicate that we're using an external resolver (Express)
  },
};