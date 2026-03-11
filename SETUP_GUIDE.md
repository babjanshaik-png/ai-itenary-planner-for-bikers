# Revora - Complete Setup Guide

## System Architecture

This project consists of three separate applications:

1. **Landing Page** (Port 8081) - Marketing website
2. **Login System** (Port 3001) - Authentication with MongoDB
3. **Create Trip App** (Port 8082) - Trip planning chat interface

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

## Setup Instructions

### 1. Start MongoDB

Make sure MongoDB is running on your local machine:
```bash
# Start MongoDB service
mongod
```

### 2. Setup and Start Login Server

```bash
cd "c:\Users\Shyamnandhan S P\Desktop\LOVEABLE BIKER\login"

# Install dependencies (if not already installed)
npm install

# Start the login server
node server.js
```

The login server will run on **http://localhost:3001**

### 3. Start Landing Page

```bash
cd "c:\Users\Shyamnandhan S P\Desktop\LOVEABLE BIKER\LANDING PAGE"

# Install dependencies (if not already installed)
npm install

# Start the dev server
npm run dev
```

The landing page will run on **http://localhost:8081**

### 4. Start Create Trip App

```bash
cd "c:\Users\Shyamnandhan S P\Desktop\LOVEABLE BIKER\createtrip"

# Install dependencies (if not already installed)
npm install

# Start the dev server
npm run dev
```

The create trip app will run on **http://localhost:8082**

## User Flow

1. **User visits** → http://localhost:3001 (Login page)
2. **Sign up** → Create a new account with name, username, and password
3. **Login** → Enter credentials
4. **Success** → Automatically redirected to http://localhost:8082 (Create Trip page)
5. **Personalized Experience** → User's name is displayed in the welcome message

## MongoDB Configuration

### Database Details:
- **MongoDB URI**: `mongodb://localhost:27017`
- **Database Name**: `login`
- **Collection Name**: `user`

### User Schema:
```javascript
{
  name: String,      // Full name
  username: String,  // Unique username
  password: String,  // Password (Note: In production, use bcrypt hashing!)
  createdAt: Date    // Registration timestamp
}
```

## API Endpoints

### Login System (Port 3001)

#### Register User
```
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "password": "password123"
}
```

#### Login User
```
POST /api/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

#### Get All Users (Testing only)
```
GET /api/users
```

## Session Management

User data is stored in `sessionStorage` after successful login:
```javascript
{
  name: "John Doe",
  username: "johndoe"
}
```

The Create Trip app reads this data to personalize the experience.

## Features

### Login System
- ✅ User Registration
- ✅ User Login
- ✅ MongoDB Integration
- ✅ Session Storage
- ✅ Auto-redirect to Create Trip page

### Create Trip App
- ✅ Personalized welcome message with user's name
- ✅ Chat interface with AI assistant
- ✅ Trip filters (Where, When, Travelers, Budget)
- ✅ Location autocomplete API (OpenStreetMap Nominatim)
- ✅ Recommendations panel
- ✅ Responsive design

### Landing Page
- ✅ Hero section
- ✅ Features showcase
- ✅ Popular routes
- ✅ Call-to-action buttons linking to Create Trip app

## Security Notes

⚠️ **IMPORTANT**: This is a development setup. For production:

1. **Hash passwords** using bcrypt before storing
2. **Use HTTPS** for all communications
3. **Implement JWT** or session-based authentication
4. **Add input validation** and sanitization
5. **Set up environment variables** for sensitive data
6. **Enable CORS** properly with specific origins
7. **Add rate limiting** to prevent brute force attacks
8. **Use MongoDB Atlas** or secured MongoDB instance

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check if port 27017 is available
- Verify MongoDB URI in `server.js`

### Port Already in Use
- Login Server (3001): `netstat -ano | findstr :3001`
- Landing Page (8081): `netstat -ano | findstr :8081`
- Create Trip (8082): `netstat -ano | findstr :8082`

Kill the process using: `taskkill /PID <PID> /F`

### Session Data Not Persisting
- Check browser console for errors
- Verify sessionStorage is enabled
- Try clearing browser cache

## Development Commands

### Install all dependencies
```bash
# Login system
cd login && npm install

# Landing page
cd "LANDING PAGE" && npm install

# Create trip app
cd createtrip && npm install
```

### Start all servers (separate terminals)
```bash
# Terminal 1 - MongoDB
mongod

# Terminal 2 - Login Server
cd login && node server.js

# Terminal 3 - Landing Page
cd "LANDING PAGE" && npm run dev

# Terminal 4 - Create Trip App
cd createtrip && npm run dev
```

## Project Structure

```
LOVEABLE BIKER/
├── login/
│   ├── server.js           # Express server with MongoDB
│   ├── script.js           # Client-side auth logic
│   ├── index.html          # Login/Signup UI
│   └── package.json
├── LANDING PAGE/
│   ├── src/
│   │   ├── components/     # React components
│   │   └── pages/          # Page components
│   ├── vite.config.ts
│   └── package.json
└── createtrip/
    ├── src/
    │   ├── ChatPage.tsx    # Main chat interface
    │   ├── components/     # UI components
    │   └── lib/            # Utilities
    ├── vite.config.ts
    └── package.json
```

## Support

For issues or questions:
1. Check this README
2. Review error messages in browser console
3. Check terminal logs for server errors
4. Verify all services are running

---

**Created**: October 18, 2025  
**Version**: 1.0.0  
## Credits

**Author**: Revora Team
