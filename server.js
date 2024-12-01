import express from 'express';
import authRoutes from './src/router/authRoutes.js';  // Import the auth routes
import connectionBD from './config/db.js';          // Import the DB connection function

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectionBD();  // Call the database connection function here

// Attach the auth routes to the '/auth' path
app.use('/auth', authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
