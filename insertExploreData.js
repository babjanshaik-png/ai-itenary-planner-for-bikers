// Script to insert explore posts data into MongoDB
// Run this file with: node insertExploreData.js

const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'login';
const COLLECTION_NAME = 'explore';

// Sample explore posts data
const explorePosts = [
  {
    riderId: new ObjectId(), // You can replace with actual user ObjectId from 'user' collection
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
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
        caption: "Mountain pass view",
        order: 1
      }
    ],
    mainPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    
    tags: ["Leh-Ladakh", "Himalayas", "Adventure"],
    
    likes: {
      count: 45,
      users: []
    },
    
    comments: {
      count: 12,
      list: [
        {
          commentId: new ObjectId(),
          userId: new ObjectId(),
          userName: "Priya Sharma",
          userInitial: "P",
          text: "Amazing trip! Would love to join next time.",
          timestamp: new Date("2025-10-20T10:30:00Z"),
          likes: 5
        },
        {
          commentId: new ObjectId(),
          userId: new ObjectId(),
          userName: "Arun Mehta",
          userInitial: "A",
          text: "How was the weather in October?",
          timestamp: new Date("2025-10-21T14:20:00Z"),
          likes: 2
        }
      ]
    },
    
    shares: {
      count: 8,
      users: []
    },
    
    createdAt: new Date("2025-10-15T08:00:00Z"),
    updatedAt: new Date("2025-10-22T12:30:00Z"),
    status: "published",
    visibility: "public",
    tripCompletedDate: new Date("2025-10-10T00:00:00Z")
  },
  {
    riderId: new ObjectId(),
    riderName: "Priya Sharma",
    riderInitial: "P",
    riderProfileColor: "bg-green-500",
    
    title: "Coastal Paradise Ride",
    description: "What an amazing coastal ride from Goa to Kerala! Beautiful beaches, delicious seafood, and the ocean breeze made this trip unforgettable. Highly recommend for anyone who loves coastal routes.",
    rating: 4,
    
    route: "Goa to Kerala",
    days: "7 Days",
    totalRiders: 5,
    
    photos: [
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
        caption: "Coastal road view",
        order: 1
      }
    ],
    mainPhoto: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
    
    tags: ["Coastal", "Beaches", "Kerala"],
    
    likes: {
      count: 32,
      users: []
    },
    
    comments: {
      count: 8,
      list: []
    },
    
    shares: {
      count: 5,
      users: []
    },
    
    createdAt: new Date("2025-10-18T09:00:00Z"),
    updatedAt: new Date("2025-10-23T10:15:00Z"),
    status: "published",
    visibility: "public",
    tripCompletedDate: new Date("2025-10-14T00:00:00Z")
  },
  {
    riderId: new ObjectId(),
    riderName: "Arun Mehta",
    riderInitial: "A",
    riderProfileColor: "bg-purple-500",
    
    title: "Western Ghats Adventure",
    description: "Explored the lush green Western Ghats with amazing winding roads. The hill stations were beautiful and the weather was perfect. Great ride through Mumbai, Lonavala, Mahabaleshwar, and ended at stunning Ooty.",
    rating: 5,
    
    route: "Mumbai to Ooty",
    days: "6 Days",
    totalRiders: 12,
    
    photos: [
      {
        url: "https://images.unsplash.com/photo-1548690596-88a73e4aacea?w=800&auto=format&fit=crop",
        caption: "Western Ghats road",
        order: 1
      }
    ],
    mainPhoto: "https://images.unsplash.com/photo-1548690596-88a73e4aacea?w=800&auto=format&fit=crop",
    
    tags: ["Western Ghats", "Hill Stations", "Monsoon"],
    
    likes: {
      count: 56,
      users: []
    },
    
    comments: {
      count: 15,
      list: []
    },
    
    shares: {
      count: 12,
      users: []
    },
    
    createdAt: new Date("2025-10-16T11:00:00Z"),
    updatedAt: new Date("2025-10-24T14:20:00Z"),
    status: "published",
    visibility: "public",
    tripCompletedDate: new Date("2025-10-12T00:00:00Z")
  },
  {
    riderId: new ObjectId(),
    riderName: "Neha Patel",
    riderInitial: "N",
    riderProfileColor: "bg-pink-500",
    
    title: "Rajasthan Heritage Tour",
    description: "Experienced the royal heritage of Rajasthan on two wheels. The magnificent forts and palaces were incredible. Riding through the golden sand dunes was a unique experience I'll never forget!",
    rating: 4,
    
    route: "Jaipur to Udaipur",
    days: "8 Days",
    totalRiders: 6,
    
    photos: [
      {
        url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
        caption: "Rajasthan palace",
        order: 1
      }
    ],
    mainPhoto: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop",
    
    tags: ["Rajasthan", "Heritage", "Forts"],
    
    likes: {
      count: 28,
      users: []
    },
    
    comments: {
      count: 6,
      list: []
    },
    
    shares: {
      count: 4,
      users: []
    },
    
    createdAt: new Date("2025-10-19T07:30:00Z"),
    updatedAt: new Date("2025-10-25T09:45:00Z"),
    status: "published",
    visibility: "public",
    tripCompletedDate: new Date("2025-10-16T00:00:00Z")
  },
  {
    riderId: new ObjectId(),
    riderName: "Vikram Singh",
    riderInitial: "V",
    riderProfileColor: "bg-orange-500",
    
    title: "Northeast Explorer",
    description: "Discovered the unexplored beauty of Northeast India. This was the most challenging but rewarding trip! The mountain passes were intense and the Buddhist monasteries provided peaceful moments. Absolutely worth it!",
    rating: 5,
    
    route: "Guwahati to Tawang",
    days: "12 Days",
    totalRiders: 4,
    
    photos: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
        caption: "Northeast mountain pass",
        order: 1
      }
    ],
    mainPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    
    tags: ["Northeast", "Mountains", "Monasteries"],
    
    likes: {
      count: 67,
      users: []
    },
    
    comments: {
      count: 20,
      list: []
    },
    
    shares: {
      count: 15,
      users: []
    },
    
    createdAt: new Date("2025-10-14T06:00:00Z"),
    updatedAt: new Date("2025-10-26T08:00:00Z"),
    status: "published",
    visibility: "public",
    tripCompletedDate: new Date("2025-10-08T00:00:00Z")
  }
];

async function insertExplorePosts() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db(DB_NAME);
    const exploreCollection = db.collection(COLLECTION_NAME);
    
    // Clear existing data (optional - remove this if you want to keep existing data)
    // await exploreCollection.deleteMany({});
    // console.log('🗑️  Cleared existing explore posts');
    
    // Insert explore posts
    const result = await exploreCollection.insertMany(explorePosts);
    console.log(`✅ Successfully inserted ${result.insertedCount} explore posts!`);
    console.log('Inserted IDs:', Object.values(result.insertedIds));
    
    // Create indexes
    await exploreCollection.createIndex({ riderId: 1 });
    await exploreCollection.createIndex({ createdAt: -1 });
    await exploreCollection.createIndex({ status: 1, visibility: 1 });
    await exploreCollection.createIndex({ 
      title: "text", 
      description: "text", 
      tags: "text" 
    });
    await exploreCollection.createIndex({ 
      status: 1, 
      visibility: 1, 
      createdAt: -1 
    });
    console.log('✅ Created indexes successfully!');
    
    // Verify the data
    const count = await exploreCollection.countDocuments();
    console.log(`\n📊 Total posts in explore collection: ${count}`);
    
    // Show sample post
    const samplePost = await exploreCollection.findOne({});
    console.log('\n📝 Sample post:');
    console.log(JSON.stringify(samplePost, null, 2));
    
  } catch (error) {
    console.error('❌ Error inserting explore posts:', error);
  } finally {
    await client.close();
    console.log('\n👋 Connection closed');
  }
}

// Run the function
insertExplorePosts();
