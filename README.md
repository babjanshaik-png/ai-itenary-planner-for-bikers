# Login Application with MongoDB

This is a simple login application that uses MongoDB to store user data.

## Prerequisites

1. **Node.js** - Download from [nodejs.org](https://nodejs.org/)
2. **MongoDB** - Download from [mongodb.com](https://www.mongodb.com/try/download/community)

## Setup Instructions

### 1. Install Dependencies

Open a terminal in this folder and run:
```bash
npm install
```

### 2. Make sure MongoDB is running

Start MongoDB service:
- **Windows**: MongoDB should be running as a service after installation
- Or run: `mongod --dbpath <path-to-data-directory>`

### 3. Start the Server

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

### 4. Open the Application

Open your browser and go to:
```
http://localhost:3000
```

## Database Information

- **Connection String**: `mongodb://localhost:27017`
- **Database Name**: `login`
- **Collection Name**: `user`

## Features

- User registration (Sign Up)
- User login
- Data stored in MongoDB
- Toggle between Login and Sign Up forms
- Input validation
- Error and success messages

## User Schema

Each user document contains:
- `name` - User's full name
- `username` - Unique username
- `password` - User's password (Note: In production, passwords should be hashed!)
- `createdAt` - Timestamp of registration

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login existing user
- `GET /api/users` - Get all users (for testing only)

## Security Note

⚠️ **Important**: This is a basic implementation for learning purposes. In a production environment:
1. Always hash passwords using bcrypt or similar
2. Implement JWT or session-based authentication
3. Add HTTPS
4. Implement rate limiting
5. Add CSRF protection
6. Validate and sanitize all inputs
7. Remove the `/api/users` endpoint
