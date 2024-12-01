import express from 'express';
import authRoutes from './routes/authRoutes.js';  // Import the auth routes

const app = express();
app.use(express.json());  // To parse JSON bodies

app.use('/auth', authRoutes);  // Attach the auth routes to the '/auth' path

// More app configuration...

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
