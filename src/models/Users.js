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
    type: String,
    enum: ['Admin', 'User', 'Moderator'],
    default: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// module.exports = mongoose.model('User', userSchema);
const User = mongoose.model('User', userSchema);

export default User;
