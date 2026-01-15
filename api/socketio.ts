import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

// This API route will handle WebSocket connections
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const httpServer: any = res.socket.server;
    const io = new Server(httpServer, {
      path: '/api/socketio',
    });
    
    io.on('connection', (socket) => {
      console.log('New client connected');
      
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
    
    res.socket.server.io = io;
  }
  
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};