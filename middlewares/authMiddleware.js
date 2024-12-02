// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import  User  from '../src/models/Users.js';


const SECRET_KEY = config.JWT_SECRET;

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) return res.status(401).json({ message: "Access Denied" });
  
    jwt.verify(token, SECRET_KEY, async (err, decodedToken) => {
      if (err) return res.status(403).json({ message: "Invalid Token" });
  
      try {
        const user = await User.findById(decodedToken.userId).populate("role");
        if (!user) return res.status(404).json({ message: "User not found" });
  
        req.user = user; // Attach user info to request
        next();
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  };

// Middleware for role-based access control (RBAC)
export const authorizeRoles = (requiredRoles) => {
    return async (req, res, next) => {
      const userRole = req.user.role;
  
      if (!userRole || !requiredRoles.includes(userRole.name)) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }
  
      next();
    };
};
  
  


