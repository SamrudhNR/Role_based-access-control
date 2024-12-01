import express from "express"
import { signup, signin, signout } from '../controllers/authControllers.js'; // import controller functions
import authenticateToken from '../../middlewares/authMiddleware.js'; // import authentication middleware

const router= express.Router();
// const SECRET_KEY= config.JWT_SECRET


// Define routes and map them to controller functions
router.post('/signup', signup);  
router.post('/signin', signin); 
router.post('/signout',signout);



// Protected route for admin
router.get('/admin-only', authenticateToken, (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    res.json({ message: 'This is admin-only page', role: req.user.role });
});

// Protected route for moderator
router.get('/moderator-only', authenticateToken, (req, res) => {
    if (req.user.role !== 'Moderator') {
        return res.status(403).json({ message: 'Access denied. Moderators only.' });
    }
    res.json({ message: 'This is moderator-only page', role: req.user.role });
});

// Protected route for users
router.get('/user-only', authenticateToken, (req, res) => {
    res.json({ message: 'This is user-only page', role: req.user.role });
});


export default router;


