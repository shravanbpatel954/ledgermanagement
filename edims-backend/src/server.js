// src/server.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the project root (edims-backend directory)
dotenv.config({ path: join(__dirname, '..', '.env') });

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