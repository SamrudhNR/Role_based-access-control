import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../src/models/Users.js";
import connectionBD from "../config/db.js";
import { config } from '../config/env.js';

// process.env.PORT ||

const port=  3000;
const SECRET_KEY= config.JWT_SECRET


const app= express();
app.use(express.json());

connectionBD();


// Registration test
app.post("/register", async(req,res)=>{

    // console.log(req.body)
    const {username,email,password, role}= req.body;

    
    try{
        let user= await User.findOne({ $or: [{username},{email}]});
        if(user){
            return res.status(400).json({message:'Username or email already taken'});
        }


        // Set default role to 'User' if not provided
        const userRole = role || 'User';

        user= new User({username,email, role:userRole});
        const salt= await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(password, salt);
        await user.save();

        res.status(201).json({message:'User created successfully'});

    }catch(err){
        console.error(err);
        res.status(500).json({message:'Error creating user'});
    }

});


// Login test
app.post("/login", async(req,res)=>{
    const{username,email,password}= req.body;

    try{
        let user= await User.findOne({$or:[{username},{email}]});
        if(!user){
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token= jwt.sign(
            {userId: user._id, username: user.username, role:user.role},
            SECRET_KEY,
            {expiresIn: '1h'}
        );
        
        res.json({
            token,
            user:{id:user._id, username: user.username, role:user.role}
        });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error signing in' });
    }
});

// signout
app.post("/signout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  
    if (!token) {
      return res.status(400).json({ message: "Token is required for logout" });
    }
  
    try {
      // Verify token
      const decoded = jwt.verify(token, SECRET_KEY);
  
      res.json({ message: "Logged out successfully", userId: decoded.userId });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Invalid token" });
    }
  });


// Protected route for admin
app.get('/admin-only', authenticateToken, async(req,res)=>{
    res.json({message:'This is admin-only page', role:req.user.role})
});

// Protected route for Moderatore
app.get('/moderator-only', authenticateToken, async(req,res)=>{
    res.json({message:' this is moderator-only page', role:req.user.role})
});

// Protected route for users
app.get('/user-only',authenticateToken, async(req,res)=>{
    res.json({message:'This is user-only page', role:req.user.role})
});

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']; // getting auth header
    const token= authHeader && authHeader.split(' ')[1]; //split  header= 'bearer token'  & getting token part

    if(token==null){
        return res.sendStatus(401);
    }
    jwt.verify(token,SECRET_KEY,(err,user)=>{
        if(err) return res.sendStatus(403);
        req.user= user;
        next();
    })
}

// starting server
const startServer = async () => {
    try {
      await mongoose.connect(config.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');

      app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (err) {
      console.error(err.message);
    }
  };
  
startServer();
