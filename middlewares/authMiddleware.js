// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

const SECRET_KEY = config.JWT_SECRET;

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Extract the token from "Bearer token"

    if (!token) return res.sendStatus(401);  // No token provided

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);  // Invalid token

        req.user = user;  // Attach user info to request object
        next();  // Proceed to the next middleware or route handler
    });
};

export default authenticateToken;
