# Role_based-access-control

Role-Based Access Control (RBAC) with JWT Authentication
This project implements role-based access control (RBAC) using JWT (JSON Web Tokens) for authentication in a Node.js application. The app supports multiple user roles, such as Admin and Moderator, and enables fine-grained access control for different routes. It allows users to sign up, sign in, and access restricted routes based on their role permissions.

Features
Role-Based Access Control (RBAC): Admin and Moderator roles with distinct permissions.
JWT Authentication: Secure login using JSON Web Tokens.
CRUD Operations: Protected routes for reading and writing data based on user role.
Middleware: Custom authentication and authorization middleware.


Folder Structure
    RBAC/
    ├── config/
    │   ├── db.js
    │   └── env.js
    ├── middlewares/
    │   ├── authMiddleware.js
    │   └── permissionMiddleware.js
    ├── src/
    │   ├── controllers/
    │   │   └── authControllers.js
    │   ├── models/
    │   │   ├── Role.js
    │   │   └── Users.js
    │   ├── router/
    │   │   └── authRoutes.js
    │   └── services/
    │       └── createRoles.js
    ├── tests/
    │   └── auth.test.js
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── server.js


Technologies Used
Node.js: JavaScript runtime environment.
JWT: JSON Web Tokens for secure user authentication.
MongoDB: Database for storing user and role data (Mongoose for ODM).
Bcryptjs: Password hashing for secure storage.
Express.js: Web framework for routing.
Mongoose: ODM for MongoDB.


Installation
  1.Clone the repository:
    git clone <repository_url>
  2.Install dependencies:
    npm install
    
  3.Set up your environment variables by editing the .env file. You can configure the JWT secret key and database connection string.

  4.Start the server:
    npm start

The server will be running on http://localhost:3000.

API Endpoints
1. Sign Up
    Route: /auth/signup
    Method: POST
    Description: Registers a new user with a given role (Admin, Moderator, or User).
    Request Body:
    json
        {
        "username": "adminUser",
        "email": "admin@example.com",
        "password": "admin123",
        "role": "Admin"
        }
2. Sign In
    Route: /auth/signin
    Method: POST
    Description: Authenticates a user and returns a JWT token.
    Request Body:
    json
        {
        "username": "adminUser",
        "password": "admin123"
        }

    Response:
    json
        {
        "token": "<jwt_token>",
        "user": {
            "id": "user_id",
            "username": "adminUser",
            "role": "Admin"
        }
        }
3. Moderator-Only Route
    Route: /auth/moderator-only
    Method: GET
    Description: Accessible only by users with the Moderator role.
    Authorization: Bearer <jwt_token>
    Response:
    json
        {
        "message": "This is moderator-only page",
        "role": {
            "_id": "role_id",
            "name": "Moderator",
            "permissions": ["READ", "UPDATE"]
        }
        }

Role-Based Routes
    1.Write Data (POST /auth/write-data):
        Protected by Admin role.
        Returns the message: "You have access to write data".

    2.Read Data (GET /auth/read-data):
        Protected by Admin and Moderator roles.
        Returns the message: "You have access to read data".

    3.Delete Data (DELETE /auth/delete-data):
        Protected by Admin role.
        Returns the message: "You have access to delete data".

Middleware
    1.authMiddleware.js: Verifies the JWT token.
        If the token is valid, it attaches the user information to the request (req.user).
        If the token is invalid or missing, it returns a 401 Unauthorized response.

    2.permissionMiddleware.js: Ensures that the user has the correct role for accessing the route.
        Uses the authorizeRoles function to check if the user's role is allowed to access a specific route.
        If the user does not have the required role, it returns a 403 Forbidden response.

Example of Role-Based Access Control
    Admin: Can access write, read, and delete data.
    Moderator: Can only access read data (not write or delete).
    User: Can only access non-protected routes.