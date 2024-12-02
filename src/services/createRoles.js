// scripts/createRoles.js
// import mongoose from 'mongoose';
import Role from '../models/Role.js'; // Import Role model

const createRoles = async () => {
  try {
    // Create Admin role with all permissions
    const adminRole = new Role({
      name: 'Admin',
      permissions: ['READ', 'WRITE', 'DELETE', 'UPDATE'],
    });

    await adminRole.save();

    // Create Moderator role with some permissions
    const moderatorRole = new Role({
      name: 'Moderator',
      permissions: ['READ', 'UPDATE'],
    });

    await moderatorRole.save();

    // Create User role with limited permissions
    const userRole = new Role({
      name: 'User',
      permissions: ['READ'],
    });

    await userRole.save();

    console.log("Roles created successfully!");
  } catch (err) {
    console.error("Error creating roles:", err);
  }
};

export default createRoles;
