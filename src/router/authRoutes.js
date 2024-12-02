import express from "express"
import { signup, signin, signout } from '../controllers/authControllers.js'; // import controller functions
import {authenticateToken , authorizeRoles} from '../../middlewares/authMiddleware.js'; // import authentication middleware
import { checkPermission } from "../../middlewares/permissionMiddleware.js";

const router= express.Router();
// const SECRET_KEY= config.JWT_SECRET


// Define routes and map them to controller functions
router.post('/signup', signup);  
router.post('/signin', signin); 
router.post('/signout',signout);



// Protected route for admin (checks if user has Admin role)
router.get('/admin-only', authenticateToken, authorizeRoles(['Admin']), (req, res) => {
    res.json({ message: 'This is admin-only page', role: req.user.role });
});

// Protected route for moderator (checks if user has Moderator role)
router.get('/moderator-only', authenticateToken, authorizeRoles(['Moderator']), (req, res) => {
    res.json({ message: 'This is moderator-only page', role: req.user.role });
});

// Protected route for users (any authenticated user can access this)
router.get('/user-only', authenticateToken, authorizeRoles(['User']), (req, res) => {
    res.json({ message: 'This is user-only page', role: req.user.role });
});


// route with permission checking ( for "READ" permission)
router.get('/read-data', authenticateToken, authorizeRoles(['Admin', 'Moderator', 'User']), checkPermission(['READ']), (req, res) => {
    res.json({ message: 'You have access to read the data' });
  });
  
  //  route with permission checking ( for "WRITE" permission)
  router.post('/write-data', authenticateToken, authorizeRoles(['Admin', 'Moderator']), checkPermission(['WRITE']), (req, res) => {
    res.json({ message: 'You have access to write data' });
  });
  
  //  route with permission checking ( for "DELETE" permission)
  router.delete('/delete-data', authenticateToken, authorizeRoles(['Admin']), checkPermission(['DELETE']), (req, res) => {
    res.json({ message: 'You have access to delete data' });
  });


export default router;


