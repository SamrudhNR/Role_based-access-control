// middlewares/permissionMiddleware.js
export const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
      const userPermissions = req.user.role.permissions; // Get user's permissions from the role
  
      // Check if the user has at least one of the required permissions
      const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));
  
      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }
  
      next(); // If permission is valid, move to the next middleware or route handler
    };
  };
  