import app from '../src/server';

// Connect to database once per cold start (in serverless environment)
let dbConnected = false;

async function connectDB() {
  if (!dbConnected) {
    try {
      const connectionToDbModule = await import('../src/config/db');
      const connectionToDb = connectionToDbModule.default;
      await connectionToDb();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }
}

export default async function handler(req: any, res: any) {
  // Connect to DB on cold start
  await connectDB();

  // Use the original Express app to handle the request
  // This approach delegates the request to Express while maintaining compatibility with Vercel
  return new Promise((resolve, reject) => {
    // Call the Express app with the Vercel request and response objects
    app(req, res, (err: any) => {
      if (err) {
        console.error('Express error:', err);
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to let Express handle it
    externalResolver: true, // Indicate that we're using an external resolver (Express)
  },
};