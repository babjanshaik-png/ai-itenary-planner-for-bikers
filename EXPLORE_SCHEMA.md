# MongoDB Schema for Explore Collection

## Collection Name: `explore`

## Document Structure

```javascript
{
  // Unique identifier (MongoDB ObjectId)
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  
  // Rider Information
  "riderId": ObjectId("507f191e810c19729de860ea"), // Reference to user collection
  "riderName": "Rajesh Kumar",
  "riderInitial": "R", // First letter of name for avatar
  "riderProfileColor": "bg-blue-500", // Avatar color class
  
  // Post Content
  "title": "Leh-Ladakh Expedition",
  "description": "Just completed an epic journey through the Himalayas! The route from Manali to Leh was absolutely breathtaking.",
  "rating": 5, // 1-5 stars
  
  // Ride Details
  "route": "Manali to Leh",
  "days": "10 Days",
  "totalRiders": 8, // Number of riders who completed the trip
  
  // Media
  "photos": [
    {
      "url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      "caption": "Rohtang Pass view",
      "order": 1
    },
    {
      "url": "https://images.unsplash.com/photo-1234567890",
      "caption": "Pangong Lake",
      "order": 2
    }
  ],
  "mainPhoto": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", // Primary photo for display
  
  // Tags/Categories
  "tags": ["Leh-Ladakh", "Himalayas", "Adventure"],
  
  // Engagement Metrics
  "likes": {
    "count": 45,
    "users": [
      ObjectId("507f191e810c19729de860eb"),
      ObjectId("507f191e810c19729de860ec")
      // Array of user IDs who liked
    ]
  },
  
  "comments": {
    "count": 12,
    "list": [
      {
        "commentId": ObjectId("507f191e810c19729de860ed"),
        "userId": ObjectId("507f191e810c19729de860ee"),
        "userName": "Priya Sharma",
        "userInitial": "P",
        "text": "Amazing trip! Would love to join next time.",
        "timestamp": ISODate("2025-10-20T10:30:00Z"),
        "likes": 5
      },
      {
        "commentId": ObjectId("507f191e810c19729de860ef"),
        "userId": ObjectId("507f191e810c19729de860f0"),
        "userName": "Arun Mehta",
        "userInitial": "A",
        "text": "How was the weather in October?",
        "timestamp": ISODate("2025-10-21T14:20:00Z"),
        "likes": 2
      }
    ]
  },
  
  "shares": {
    "count": 8,
    "users": [
      ObjectId("507f191e810c19729de860f1")
      // Array of user IDs who shared
    ]
  },
  
  // Timestamps
  "createdAt": ISODate("2025-10-15T08:00:00Z"),
  "updatedAt": ISODate("2025-10-22T12:30:00Z"),
  
  // Status & Visibility
  "status": "published", // draft, published, archived
  "visibility": "public", // public, private, friends-only
  
  // Optional: Trip completion date
  "tripCompletedDate": ISODate("2025-10-10T00:00:00Z")
}
```

## Example MongoDB Insert Command

```javascript
db.explore.insertOne({
  riderId: ObjectId("507f191e810c19729de860ea"),
  riderName: "Rajesh Kumar",
  riderInitial: "R",
  riderProfileColor: "bg-blue-500",
  
  title: "Leh-Ladakh Expedition",
  description: "Just completed an epic journey through the Himalayas! The route from Manali to Leh was absolutely breathtaking. Rohtang Pass was challenging but the views were worth every struggle. Pangong Lake left us speechless!",
  rating: 5,
  
  route: "Manali to Leh",
  days: "10 Days",
  totalRiders: 8,
  
  photos: [
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      caption: "Mountain pass view",
      order: 1
    }
  ],
  mainPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  
  tags: ["Leh-Ladakh", "Himalayas", "Adventure"],
  
  likes: {
    count: 45,
    users: []
  },
  
  comments: {
    count: 12,
    list: []
  },
  
  shares: {
    count: 8,
    users: []
  },
  
  createdAt: new Date(),
  updatedAt: new Date(),
  
  status: "published",
  visibility: "public",
  
  tripCompletedDate: new Date("2025-10-10")
});
```

## Indexes to Create (For Better Performance)

```javascript
// Index on rider for fetching user's posts
db.explore.createIndex({ riderId: 1 });

// Index on createdAt for sorting feed by date
db.explore.createIndex({ createdAt: -1 });

// Index on status and visibility for filtering
db.explore.createIndex({ status: 1, visibility: 1 });

// Text index for search functionality
db.explore.createIndex({ 
  title: "text", 
  description: "text", 
  tags: "text" 
});

// Compound index for feed queries
db.explore.createIndex({ 
  status: 1, 
  visibility: 1, 
  createdAt: -1 
});
```

## Common Queries

### Fetch all published posts (Feed)
```javascript
db.explore.find({ 
  status: "published", 
  visibility: "public" 
})
.sort({ createdAt: -1 })
.limit(20);
```

### Fetch posts by a specific rider
```javascript
db.explore.find({ 
  riderId: ObjectId("507f191e810c19729de860ea"),
  status: "published"
})
.sort({ createdAt: -1 });
```

### Increment like count
```javascript
db.explore.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  { 
    $inc: { "likes.count": 1 },
    $addToSet: { "likes.users": ObjectId("user_id_here") }
  }
);
```

### Add a comment
```javascript
db.explore.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  { 
    $inc: { "comments.count": 1 },
    $push: { 
      "comments.list": {
        commentId: ObjectId(),
        userId: ObjectId("user_id_here"),
        userName: "User Name",
        userInitial: "U",
        text: "Great post!",
        timestamp: new Date(),
        likes: 0
      }
    }
  }
);
```

### Search posts by tags or text
```javascript
db.explore.find({ 
  $text: { $search: "Ladakh mountains" },
  status: "published"
});
```
