# Feeds Collection Database Schema

## Database: `login`
## Collection: `feeds`

This collection stores upcoming motorcycle trip data that appears on the Feeds page.

---

## Document Structure

```javascript
{
  _id: ObjectId("..."),
  
  // Basic Trip Information
  title: String,                    // e.g., "Himalayan Dawn Run 🏔️"
  description: String,              // Brief trip description
  image: String,                    // Trip cover image URL
  
  // Location & Route
  route: {
    from: String,                   // Starting point (e.g., "Manali")
    to: String,                     // Ending point (e.g., "Leh")
    fullRoute: String               // Complete route (e.g., "Manali → Leh → Manali")
  },
  
  // Trip Details
  duration: {
    days: Number,                   // Number of days (e.g., 10)
    displayText: String             // Display format (e.g., "10 Days")
  },
  
  difficulty: String,               // "Beginner" | "Intermediate" | "Expert"
  
  // Dates
  dates: {
    start: Date,                    // Start date
    end: Date,                      // End date
    startDisplay: String,           // Display format (e.g., "November 18, 2025")
    endDisplay: String              // Display format (e.g., "November 27, 2025")
  },
  
  // Riders/Capacity
  capacity: {
    total: Number,                  // Total slots (e.g., 10)
    booked: Number,                 // Booked slots (e.g., 8)
    available: Number               // Available slots (e.g., 2)
  },
  
  // Pricing
  pricing: {
    perPerson: Number,              // Price per person in rupees (e.g., 38471)
    displayText: String,            // Display format (e.g., "₹38,471")
    currency: String,               // Currency code (e.g., "INR")
    breakdown: {
      accommodation: Number,        // Accommodation cost
      fuel: Number,                 // Total fuel cost
      meals: Number,                // Total meals cost
      permits: Number,              // Permits and entry fees
      buffer: Number                // Buffer for unexpected costs
    }
  },
  
  // Host Information
  host: {
    userId: ObjectId,               // Reference to user collection
    name: String,                   // Host full name
    username: String,               // Host username
    avatar: String,                 // Avatar initial or URL
    totalTrips: Number,             // Total trips organized
    rating: Number                  // Host rating (e.g., 4.8)
  },
  
  // Members List (riders who joined)
  members: [
    {
      userId: ObjectId,             // Reference to user collection
      name: String,                 // Member name
      username: String,             // Member username
      avatar: String,               // Avatar initial or URL
      joinedAt: Date,               // When they joined
      joinedDisplay: String         // Display format (e.g., "2 weeks ago")
    }
  ],
  
  // Detailed Itinerary
  itinerary: [
    {
      day: Number,                  // Day number (1-10)
      title: String,                // Day title (e.g., "Manali → Sarchu")
      description: String,          // Day description
      distance: String,             // Distance (e.g., "~250 km (7-8 hrs)")
      startTime: String,            // Start time (e.g., "06:00 AM")
      
      activities: [String],         // List of activities with emojis
      
      accommodation: String,        // Where staying (e.g., "Basic Sarchu tents")
      meals: String,               // Meals included (e.g., "Breakfast, Lunch, Dinner")
      dailyCost: String            // Daily cost (e.g., "₹3,520")
    }
  ],
  
  // Bike Details
  bike: {
    model: String,                  // e.g., "Royal Enfield Himalayan"
    tankCapacity: Number,           // Tank capacity in liters (e.g., 15)
    mileage: Number,                // Mileage in kmpl (e.g., 28)
    fuelPrice: Number               // Fuel price per liter (e.g., 103)
  },
  
  // What's Included
  inclusions: [String],             // Array of included items
  
  // What's Not Included
  exclusions: [String],             // Array of excluded items
  
  // Safety Notes & Important Information
  safetyNotes: [String],            // Array of safety warnings
  
  // Trip Statistics
  stats: {
    totalDistance: Number,          // Total km (e.g., 1760)
    highestPoint: String,           // Highest altitude point
    passesToCross: [String],        // List of passes
    totalFuel: Number               // Total fuel needed in liters
  },
  
  // Status
  status: String,                   // "upcoming" | "ongoing" | "completed" | "cancelled"
  
  // Metadata
  createdAt: Date,                  // When trip was created
  updatedAt: Date,                  // Last update
  createdBy: ObjectId,              // User who created (reference to user collection)
  
  // Featured/Promoted
  isFeatured: Boolean,              // Show on top of feed
  isPromoted: Boolean,              // Promoted trip
  
  // Tags for filtering
  tags: [String]                    // e.g., ["himalayan", "ladakh", "adventure", "winter"]
}
```

---

## Sample Document Example

```javascript
{
  _id: ObjectId("673571d3b544fec4a59759"),
  title: "Himalayan Dawn Run 🏔️",
  description: "Epic journey through the Himalayas crossing world's highest motorable roads",
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
  
  route: {
    from: "Manali",
    to: "Leh",
    fullRoute: "Manali → Leh → Manali"
  },
  
  duration: {
    days: 10,
    displayText: "10 Days"
  },
  
  difficulty: "Expert",
  
  dates: {
    start: ISODate("2025-11-18T00:00:00Z"),
    end: ISODate("2025-11-27T00:00:00Z"),
    startDisplay: "November 18, 2025",
    endDisplay: "November 27, 2025"
  },
  
  capacity: {
    total: 10,
    booked: 8,
    available: 2
  },
  
  pricing: {
    perPerson: 38471,
    displayText: "₹38,471",
    currency: "INR",
    breakdown: {
      accommodation: 17600,
      fuel: 6474,
      meals: 10000,
      permits: 1900,
      buffer: 2497
    }
  },
  
  host: {
    userId: ObjectId("68f3571d3b544fec4a59759"),
    name: "Rajesh Kumar",
    username: "rajeshrides",
    avatar: "R",
    totalTrips: 15,
    rating: 4.8
  },
  
  members: [
    {
      userId: ObjectId("68f3571d3b544fec4a59760"),
      name: "Amit Sharma",
      username: "amitsharma",
      avatar: "A",
      joinedAt: ISODate("2025-10-15T00:00:00Z"),
      joinedDisplay: "2 weeks ago"
    }
  ],
  
  bike: {
    model: "Royal Enfield Himalayan",
    tankCapacity: 15,
    mileage: 28,
    fuelPrice: 103
  },
  
  status: "upcoming",
  createdAt: ISODate("2025-10-01T00:00:00Z"),
  updatedAt: ISODate("2025-10-28T00:00:00Z"),
  createdBy: ObjectId("68f3571d3b544fec4a59759"),
  isFeatured: true,
  isPromoted: false,
  tags: ["himalayan", "ladakh", "adventure", "winter", "khardung-la"]
}
```

---

## Indexes to Create

```javascript
// For faster queries
db.feeds.createIndex({ status: 1, "dates.start": 1 })
db.feeds.createIndex({ difficulty: 1 })
db.feeds.createIndex({ "host.userId": 1 })
db.feeds.createIndex({ tags: 1 })
db.feeds.createIndex({ isFeatured: -1, "dates.start": 1 })
```

---

## API Endpoints Needed

### 1. Get All Upcoming Trips
```
GET /api/feeds
Query params: ?status=upcoming&limit=10&skip=0
```

### 2. Get Single Trip Details
```
GET /api/feeds/:tripId
```

### 3. Create New Trip
```
POST /api/feeds
Body: Full trip object
```

### 4. Update Trip
```
PUT /api/feeds/:tripId
Body: Fields to update
```

### 5. Join Trip (Add Member)
```
POST /api/feeds/:tripId/join
Body: { userId, name, username }
```

### 6. Leave Trip (Remove Member)
```
DELETE /api/feeds/:tripId/leave
Body: { userId }
```

### 7. Get My Trips (as host)
```
GET /api/feeds/my-trips
Header: userId
```

### 8. Get Joined Trips (as member)
```
GET /api/feeds/joined
Header: userId
```

---

## Usage in Frontend

```typescript
// Fetch all upcoming trips
const response = await fetch('http://localhost:3001/api/feeds?status=upcoming');
const data = await response.json();

// Fetch single trip details
const tripDetails = await fetch(`http://localhost:3001/api/feeds/${tripId}`);
const trip = await tripDetails.json();

// Join a trip
await fetch(`http://localhost:3001/api/feeds/${tripId}/join`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: userData.id,
    name: userData.name,
    username: userData.username
  })
});
```
