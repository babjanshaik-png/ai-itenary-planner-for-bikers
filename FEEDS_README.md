# Feeds Collection - Setup & Usage Guide

## 📋 Overview

The `feeds` collection stores upcoming motorcycle trip data that appears on the Feeds page. This includes full trip details, host information, member lists, detailed itineraries, pricing breakdowns, and more.

---

## 🚀 Quick Start

### 1. Populate Sample Data

Run the populate script to add sample trips to your database:

```bash
cd login
node populate-feeds.js
```

This will:
- Clear existing feeds data (optional)
- Insert 3 sample trips (Himalayan Dawn Run, Coastal Paradise Ride, Western Ghats Adventure)
- Create necessary indexes for performance
- Display the inserted trip IDs

### 2. Verify Data in MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Navigate to `login` database
4. Click on `feeds` collection
5. You should see 3 sample trips

### 3. Start the Backend Server

```bash
cd login
node server.js
```

Server runs on: `http://localhost:3001`

---

## 📡 API Endpoints

### 1. Get All Upcoming Trips

**GET** `/api/feeds?status=upcoming&limit=10&skip=0`

**Response:**
```json
{
  "success": true,
  "trips": [...],
  "count": 3
}
```

**Usage in Frontend:**
```javascript
const response = await fetch('http://localhost:3001/api/feeds?status=upcoming');
const data = await response.json();
console.log(data.trips); // Array of trips
```

---

### 2. Get Single Trip Details

**GET** `/api/feeds/:tripId`

**Example:**
```
GET /api/feeds/673571d3b544fec4a59759
```

**Response:**
```json
{
  "success": true,
  "trip": {
    "_id": "673571d3b544fec4a59759",
    "title": "Himalayan Dawn Run 🏔️",
    "description": "Epic journey...",
    "itinerary": [...],
    "members": [...],
    ...
  }
}
```

**Usage in Frontend:**
```javascript
const tripId = '673571d3b544fec4a59759';
const response = await fetch(`http://localhost:3001/api/feeds/${tripId}`);
const data = await response.json();
console.log(data.trip); // Full trip object with itinerary
```

---

### 3. Create New Trip

**POST** `/api/feeds`

**Request Body:**
```json
{
  "title": "Rajasthan Royal Ride 🏰",
  "description": "Explore the royal heritage of Rajasthan",
  "route": {
    "from": "Jaipur",
    "to": "Jaisalmer",
    "fullRoute": "Jaipur → Jodhpur → Jaisalmer"
  },
  "duration": {
    "days": 5,
    "displayText": "5 Days"
  },
  "difficulty": "Beginner",
  "dates": {
    "start": "2025-12-15T00:00:00Z",
    "end": "2025-12-19T00:00:00Z",
    "startDisplay": "December 15, 2025",
    "endDisplay": "December 19, 2025"
  },
  "capacity": {
    "total": 12,
    "booked": 0,
    "available": 12
  },
  "pricing": {
    "perPerson": 18500,
    "displayText": "₹18,500",
    "currency": "INR"
  },
  "host": {
    "userId": "68f3571d3b544fec4a59759",
    "name": "Your Name",
    "username": "yourusername",
    "avatar": "Y",
    "totalTrips": 5,
    "rating": 4.6
  },
  "status": "upcoming",
  "isFeatured": false,
  "tags": ["rajasthan", "desert", "heritage"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trip created successfully",
  "tripId": "673571d3b544fec4a59760"
}
```

**Usage in Frontend:**
```javascript
const newTrip = {
  title: "Rajasthan Royal Ride 🏰",
  description: "...",
  // ... other fields
};

const response = await fetch('http://localhost:3001/api/feeds', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newTrip)
});

const data = await response.json();
console.log(data.tripId); // New trip ID
```

---

### 4. Update Trip

**PUT** `/api/feeds/:tripId`

**Request Body:** (fields to update)
```json
{
  "capacity": {
    "total": 12,
    "booked": 10,
    "available": 2
  },
  "status": "ongoing"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trip updated successfully"
}
```

---

### 5. Join a Trip

**POST** `/api/feeds/:tripId/join`

**Request Body:**
```json
{
  "userId": "68f3571d3b544fec4a59761",
  "name": "John Doe",
  "username": "johndoe",
  "avatar": "J"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined the trip"
}
```

**Usage in Frontend:**
```javascript
const userData = JSON.parse(sessionStorage.getItem('userData'));

const response = await fetch(`http://localhost:3001/api/feeds/${tripId}/join`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: userData.id,
    name: userData.name,
    username: userData.username,
    avatar: userData.name.charAt(0).toUpperCase()
  })
});

const data = await response.json();
if (data.success) {
  alert('Successfully joined the trip!');
}
```

---

### 6. Leave a Trip

**DELETE** `/api/feeds/:tripId/leave`

**Request Body:**
```json
{
  "userId": "68f3571d3b544fec4a59761"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully left the trip"
}
```

---

### 7. Get My Trips (as host)

**GET** `/api/feeds/my-trips/:userId`

**Example:**
```
GET /api/feeds/my-trips/68f3571d3b544fec4a59759
```

**Response:**
```json
{
  "success": true,
  "trips": [...],
  "count": 5
}
```

---

### 8. Get Joined Trips (as member)

**GET** `/api/feeds/joined/:userId`

**Example:**
```
GET /api/feeds/joined/68f3571d3b544fec4a59761
```

**Response:**
```json
{
  "success": true,
  "trips": [...],
  "count": 3
}
```

---

## 🔄 Integration with FeedsPage Component

Update your `FeedsPage.tsx` to fetch real data:

```typescript
import { useState, useEffect } from 'react';

export default function FeedsPage({ onViewDetails }: { onViewDetails: (trip: any) => void }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/feeds?status=upcoming&limit=20');
      const data = await response.json();
      
      if (data.success) {
        setTrips(data.trips);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading trips...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Upcoming Trips</h1>
      <p className="text-gray-600 mb-8">Discover and join exciting motorcycle trips across India</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={trip.image} 
              alt={trip.title}
              className="w-full h-48 object-cover"
            />
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  trip.difficulty === 'Expert' ? 'bg-red-100 text-red-600' :
                  trip.difficulty === 'Intermediate' ? 'bg-orange-100 text-orange-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {trip.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{trip.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.route.fullRoute}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{trip.duration.displayText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{trip.capacity.booked}/{trip.capacity.total} Riders</span>
                </div>
              </div>
              
              <button
                onClick={() => onViewDetails(trip)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔄 Integration with TripDetailsPage

Update `TripDetailsPage.tsx` to handle real trip data:

```typescript
export default function TripDetailsPage({ trip, onBack }: { trip: any; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [hasJoined, setHasJoined] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');

  useEffect(() => {
    // Check if user is already a member
    if (trip.members && userData.id) {
      const isMember = trip.members.some(m => m.userId === userData.id);
      setHasJoined(isMember);
    }
  }, [trip, userData]);

  const handleJoinTrip = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/feeds/${trip._id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          name: userData.name,
          username: userData.username,
          avatar: userData.name.charAt(0).toUpperCase()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Successfully joined the trip!');
        setHasJoined(true);
        // Refresh trip data
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error joining trip:', error);
      alert('Failed to join trip');
    }
  };

  const handleLeaveTrip = async () => {
    if (!confirm('Are you sure you want to leave this trip?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/feeds/${trip._id}/leave`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('You have left the trip');
        setHasJoined(false);
        // Refresh trip data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error leaving trip:', error);
      alert('Failed to leave trip');
    }
  };

  // Rest of your component with Join/Leave buttons
  // ...
}
```

---

## 🎯 Testing the API

### Using Thunder Client / Postman

1. **Get all trips:**
   - Method: GET
   - URL: `http://localhost:3001/api/feeds`

2. **Get specific trip:**
   - Method: GET
   - URL: `http://localhost:3001/api/feeds/673571d3b544fec4a59759`

3. **Join a trip:**
   - Method: POST
   - URL: `http://localhost:3001/api/feeds/673571d3b544fec4a59759/join`
   - Body:
   ```json
   {
     "userId": "68f3571d3b544fec4a59761",
     "name": "Test User",
     "username": "testuser",
     "avatar": "T"
   }
   ```

---

## 📊 Database Schema Quick Reference

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  image: String,
  route: { from, to, fullRoute },
  duration: { days, displayText },
  difficulty: "Beginner" | "Intermediate" | "Expert",
  dates: { start, end, startDisplay, endDisplay },
  capacity: { total, booked, available },
  pricing: { perPerson, displayText, currency, breakdown },
  host: { userId, name, username, avatar, totalTrips, rating },
  members: [{ userId, name, username, avatar, joinedAt, joinedDisplay }],
  itinerary: [{ day, title, description, distance, startTime, activities, accommodation, meals, dailyCost }],
  bike: { model, tankCapacity, mileage, fuelPrice },
  inclusions: [String],
  exclusions: [String],
  safetyNotes: [String],
  stats: { totalDistance, highestPoint, passesToCross, totalFuel },
  status: "upcoming" | "ongoing" | "completed" | "cancelled",
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  isFeatured: Boolean,
  isPromoted: Boolean,
  tags: [String]
}
```

---

## ✅ Checklist

- [ ] MongoDB running on localhost:27017
- [ ] Backend server running on localhost:3001
- [ ] Run `node populate-feeds.js` to add sample data
- [ ] Verify data in MongoDB Compass
- [ ] Test API endpoints using Thunder Client/Postman
- [ ] Update FeedsPage.tsx to fetch real data
- [ ] Update TripDetailsPage.tsx to handle join/leave functionality
- [ ] Test joining and leaving trips
- [ ] Test trip capacity updates

---

## 🐛 Common Issues

### Issue: "Cannot connect to MongoDB"
**Solution:** Make sure MongoDB is running:
```bash
mongod
```

### Issue: "Trip not found"
**Solution:** Make sure you're using a valid trip ID from the database. Run populate-feeds.js to add sample data.

### Issue: "Already joined this trip"
**Solution:** User is already a member. Use the leave endpoint first.

### Issue: "Trip is full"
**Solution:** The trip has reached maximum capacity. No more riders can join.

---

## 📝 Notes

- All dates are stored as ISO Date objects
- Trip IDs are MongoDB ObjectIds
- User IDs should reference the `user` collection
- Always validate user authentication before joining/leaving trips
- Consider adding payment integration for booking trips
- Add email notifications when someone joins your trip
- Implement trip reviews/ratings after completion

---

## 🚀 Next Steps

1. Add image upload functionality for trip photos
2. Implement real-time chat for trip members
3. Add Google Maps integration for route visualization
4. Create trip templates for quick trip creation
5. Add filtering and search functionality
6. Implement trip recommendations based on user preferences
7. Add trip sharing on social media
8. Create trip cancellation and refund policies
