// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // Reference the Role model
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);

export default User;
