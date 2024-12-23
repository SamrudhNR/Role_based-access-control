import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import Role from '../models/Role.js';
import { config } from '../../config/env.js';
const SECRET_KEY = config.JWT_SECRET;



// Signup
export const signup = async (req, res)=>{

    // console.log(req.body)
    const {username,email,password,role}= req.body;

    const foundRole = await Role.findOne({ name: role });
    if (!foundRole) {
      return res.status(400).json({ message: 'Role not found' });
    }

    try{
        let user= await User.findOne({ $or: [{username},{email}]});
        if(user){
            return res.status(400).json({message:'Username or email already taken'});
        }


        //set default role as user
        // const userRole= role || 'User';

        user= new User({username,email, role:foundRole._id});
        const salt= await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(password, salt);
        await user.save();

        res.status(201).json({message:'User created successfully'});

    }catch(err){
        console.error(err);
        res.status(500).json({message:'Error creating user'});
    }
    
};

//   Signin or login
export const signin = async (req, res) =>{
   
    const{username,email, password} = req.body;
    // console.log(req.body)
    try{
        const user= await User.findOne({ $or:[ {username},{email}]});
        if(!user){
            return res.status(400).json({message:'Invalid credentials'}).populate('role', 'name');
        }

        //compare password
        const match= await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({message:"Invalid credential"});
        }

        const role = await Role.findById(user.role);
        //generate JWT token
        const token= jwt.sign(
            {userId: user._id, username: user.username, role:role.name},
            SECRET_KEY,
            {expiresIn:'1h'}
        );

        res.json({
            token,
            user:{id:user._id, username:user.username, role:role.name}
        });

    }catch(error){
        console.error(error)
        res.status(500).json({message:'Error signing in'})
    }

};


//  Signout
export const signout = async (req, res) =>{
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
  };