// models/Role.js
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Admin', 'User', 'Moderator'],
    required: true
  },
  permissions: [
    {
        type: String,
        enum: ['READ', 'WRITE', 'DELETE', 'UPDATE'], 
    },
  ], // List of permissions like ['READ', 'WRITE', 'DELETE']
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
