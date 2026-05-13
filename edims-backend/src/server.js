// src/server.js
import './loadEnv.js';
import app, { connectToDatabase } from './app.js';

const PORT = process.env.PORT || 5000;

// This IIFE (Immediately Invoked Function Expression) starts our server
(async () => {
  // First, connect to the database
  await connectToDatabase();
  
  // Then, start the Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();