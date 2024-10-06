# Medium Backend (MERN Stack)

A robust backend for a content management and publishing platform built using the **MERN stack** (MongoDB, Express, React, Node.js). This backend handles user authentication, content creation, article permissions, purchases, and admin functionality. It is designed to be production-ready with MongoDB Atlas and offers a flexible API to manage content, users, and roles.

## Features

- **JWT-based authentication** with role-based access control (admin, author, user).
- **Content management**: Create, publish, and manage articles.
- **Permissions**: Users can request access to restricted articles.
- **Purchases**: Users can purchase content to unlock access.
- **Database seeding**: Initialize admin users and default data.
- **MongoDB** for production-ready database management.

## Getting Started

```bash
git clone https://github.com/faisalamin001/medium-backend.git
cd medium-backend

npm install

Create config/environments/development.json (I already created for you!)

{
  "port": 4000,
  "endpoint": "http://localhost:4000/api",
  "db": {
    "uri": "mongodb://localhost:27017/",
    "name": "medium"
  },
  "signIn": {
    "jwtSecret": "your_jwt_secret",
    "jwtExpiresIn": "30d"
  }
}


After configuring MongoDB, you can run the seed script to initialize the database with default values (like creating an admin user).

npm run db:seed


To start the server in development mode, run:

npm run server

```
