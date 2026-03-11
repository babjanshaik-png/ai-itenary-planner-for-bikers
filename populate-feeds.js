const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'login';

const sampleTrips = [
  {
    _id: new ObjectId(),
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
      start: new Date("2025-11-18T00:00:00Z"),
      end: new Date("2025-11-27T00:00:00Z"),
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
      userId: new ObjectId(),
      name: "Rajesh Kumar",
      username: "rajeshrides",
      avatar: "R",
      totalTrips: 15,
      rating: 4.8
    },
    
    members: [
      {
        userId: new ObjectId(),
        name: "Amit Sharma",
        username: "amitsharma",
        avatar: "A",
        joinedAt: new Date("2025-10-15T00:00:00Z"),
        joinedDisplay: "2 weeks ago"
      },
      {
        userId: new ObjectId(),
        name: "Priya Singh",
        username: "priyarides",
        avatar: "P",
        joinedAt: new Date("2025-10-18T00:00:00Z"),
        joinedDisplay: "2 weeks ago"
      },
      {
        userId: new ObjectId(),
        name: "Vikram Patel",
        username: "vikrampatel",
        avatar: "V",
        joinedAt: new Date("2025-10-20T00:00:00Z"),
        joinedDisplay: "12 days ago"
      }
    ],
    
    itinerary: [
      {
        day: 1,
        title: "Manali → Sarchu",
        description: "Start the epic journey with an early morning departure",
        distance: "~250 km (7-8 hrs)",
        startTime: "06:00 AM",
        activities: [
          "🏔️ Cross Rohtang Pass (3,978m)",
          "🏔️ Navigate Baralacha Pass (4,890m)",
          "🏕️ Camp at Sarchu plains"
        ],
        accommodation: "Basic Sarchu tents",
        meals: "Breakfast, Lunch, Dinner",
        dailyCost: "₹3,520"
      },
      {
        day: 2,
        title: "Sarchu → Leh",
        description: "Cross high altitude passes and reach Leh",
        distance: "~250 km (8-9 hrs)",
        startTime: "06:00 AM",
        activities: [
          "🏔️ Cross Gata Loops (21 hairpin bends)",
          "🏔️ Touch Tanglang La Pass (5,328m)",
          "🏨 Check into Leh hotel",
          "🍜 Evening local market visit"
        ],
        accommodation: "Hotel in Leh",
        meals: "Breakfast, Lunch, Dinner",
        dailyCost: "₹4,200"
      },
      {
        day: 3,
        title: "Rest & Acclimatization Day",
        description: "Acclimatize to high altitude and explore Leh",
        distance: "Local sightseeing",
        startTime: "09:00 AM",
        activities: [
          "🏰 Visit Leh Palace",
          "🕌 Shanti Stupa visit",
          "🛍️ Shopping in Leh market",
          "☕ Café hopping"
        ],
        accommodation: "Hotel in Leh",
        meals: "Breakfast, Lunch, Dinner",
        dailyCost: "₹3,200"
      },
      {
        day: 4,
        title: "Leh → Nubra Valley",
        description: "Experience the cold desert via world's highest motorable road",
        distance: "~160 km (5-6 hrs)",
        startTime: "07:00 AM",
        activities: [
          "🏔️ Cross Khardung La Pass (5,359m)",
          "🐫 Ride through sand dunes",
          "🏜️ Camel safari at Hunder",
          "🏕️ Camp under stars"
        ],
        accommodation: "Camps in Nubra",
        meals: "Breakfast, Lunch, Dinner",
        dailyCost: "₹3,800"
      },
      {
        day: 5,
        title: "Nubra → Pangong Lake",
        description: "Ride to the stunning blue waters of Pangong",
        distance: "~180 km (6-7 hrs)",
        startTime: "07:00 AM",
        activities: [
          "🏔️ Cross Shyok village",
          "🏞️ Reach Pangong Tso",
          "📸 Photography session",
          "🌅 Sunset at lake"
        ],
        accommodation: "Camps at Pangong",
        meals: "Breakfast, Lunch, Dinner",
        dailyCost: "₹3,600"
      },
      {
        day: 6,
        title: "Pangong → Leh",
        description: "Return to Leh via scenic Chang La pass",
        distance: "~220 km (7-8 hrs)",
        startTime: "06:00 AM",
        activities: [
          "🌅 Sunrise at Pangong",
          "🏔️ Cross Chang La Pass (5,360m)",
          "🕌 Visit Thiksey Monastery",
          "🏨 Back to Leh hotel"
        ],
        accommodation: "Hotel in Leh",
        meals: "Breakfast, Lunch, Dinner",
        dailyCost: "₹3,400"
      },
      {
        day: 7,
        title: "Leh → Tso Moriri",
        description: "Ride to the lesser-known beautiful lake",
        distance: "~240 km (8-9 hrs)",
        startTime: "06:00 AM",
        activities: [
          "🏔️ Cross multiple high passes",
          "🏞️ Reach Tso Moriri Lake",
          "🏕️ Camp by the lake",
          "🌌 Stargazing night"
        ],
        accommodation: "Camps at Tso Moriri",
        meals: "Breakfast, Lunch, Dinner",
        dailyCost: "₹3,500"
      },
      {
        day: 8,
        title: "Tso Moriri → Jispa",
        description: "Long ride back towards Manali",
        distance: "~280 km (9-10 hrs)",
        startTime: "05:30 AM",
        activities: [
          "🏔️ Cross Baralacha Pass again",
          "🏨 Stay at Jispa",
          "🍲 Bonfire dinner",
          "💤 Early sleep for next day"
        ],
        accommodation: "Hotel in Jispa",
        meals: "Breakfast, Lunch, Dinner",
        dailyCost: "₹3,100"
      },
      {
        day: 9,
        title: "Jispa → Manali",
        description: "Final leg back to Manali",
        distance: "~180 km (6-7 hrs)",
        startTime: "07:00 AM",
        activities: [
          "🏔️ Cross Rohtang Pass descent",
          "🏨 Check into Manali hotel",
          "🎉 Celebration dinner",
          "🍻 Group party"
        ],
        accommodation: "Hotel in Manali",
        meals: "Breakfast, Lunch, Dinner",
        dailyCost: "₹3,800"
      },
      {
        day: 10,
        title: "Departure Day",
        description: "Farewell and departure",
        distance: "Local",
        startTime: "10:00 AM",
        activities: [
          "☕ Breakfast together",
          "📸 Final group photos",
          "🎁 Trip memories exchange",
          "👋 Safe journey home"
        ],
        accommodation: "Check-out",
        meals: "Breakfast",
        dailyCost: "₹1,351"
      }
    ],
    
    bike: {
      model: "Royal Enfield Himalayan",
      tankCapacity: 15,
      mileage: 28,
      fuelPrice: 103
    },
    
    inclusions: [
      "✅ 10 days accommodation (hotels/camps)",
      "✅ All meals (breakfast, lunch, dinner)",
      "✅ Fuel for the entire trip",
      "✅ All permits and entry fees",
      "✅ Experienced trip leader",
      "✅ Basic medical kit",
      "✅ Mechanic support",
      "✅ Backup vehicle for emergencies"
    ],
    
    exclusions: [
      "❌ Your own motorcycle (you can rent)",
      "❌ Personal expenses and shopping",
      "❌ Travel to/from Manali",
      "❌ Insurance (mandatory to have)",
      "❌ Any alcoholic beverages",
      "❌ Tips to staff/guide"
    ],
    
    safetyNotes: [
      "⚠️ High altitude - acclimatization needed",
      "⚠️ Valid driving license mandatory",
      "⚠️ Minimum riding experience: 2 years",
      "⚠️ Medical fitness certificate required",
      "⚠️ Travel insurance highly recommended",
      "⚠️ Carry warm clothing (temps drop to -5°C)",
      "⚠️ Mobile network limited in many areas"
    ],
    
    stats: {
      totalDistance: 1760,
      highestPoint: "Khardung La - 5,359m",
      passesToCross: ["Rohtang La", "Baralacha La", "Tanglang La", "Khardung La", "Chang La"],
      totalFuel: 62.86
    },
    
    status: "upcoming",
    createdAt: new Date("2025-10-01T00:00:00Z"),
    updatedAt: new Date("2025-10-28T00:00:00Z"),
    createdBy: new ObjectId(),
    isFeatured: true,
    isPromoted: false,
    tags: ["himalayan", "ladakh", "adventure", "winter", "khardung-la", "pangong", "nubra"]
  },
  
  // Trip 2: Coastal Paradise Ride
  {
    _id: new ObjectId(),
    title: "Coastal Paradise Ride 🌊",
    description: "Ride along India's stunning western coastline with beaches and sunsets",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
    
    route: {
      from: "Goa",
      to: "Kerala",
      fullRoute: "Goa → Gokarna → Mangalore → Kerala"
    },
    
    duration: {
      days: 7,
      displayText: "7 Days"
    },
    
    difficulty: "Intermediate",
    
    dates: {
      start: new Date("2025-12-05T00:00:00Z"),
      end: new Date("2025-12-11T00:00:00Z"),
      startDisplay: "December 5, 2025",
      endDisplay: "December 11, 2025"
    },
    
    capacity: {
      total: 8,
      booked: 5,
      available: 3
    },
    
    pricing: {
      perPerson: 24500,
      displayText: "₹24,500",
      currency: "INR",
      breakdown: {
        accommodation: 10500,
        fuel: 3200,
        meals: 8400,
        permits: 500,
        buffer: 1900
      }
    },
    
    host: {
      userId: new ObjectId(),
      name: "Arjun Menon",
      username: "arjunrides",
      avatar: "A",
      totalTrips: 22,
      rating: 4.9
    },
    
    members: [
      {
        userId: new ObjectId(),
        name: "Sneha Reddy",
        username: "snehareddy",
        avatar: "S",
        joinedAt: new Date("2025-10-20T00:00:00Z"),
        joinedDisplay: "12 days ago"
      }
    ],
    
    itinerary: [],
    
    bike: {
      model: "Any cruiser bike",
      tankCapacity: 13,
      mileage: 35,
      fuelPrice: 98
    },
    
    inclusions: [
      "✅ Beach side accommodations",
      "✅ All meals included",
      "✅ Fuel for entire trip",
      "✅ Beach activities",
      "✅ Sunset rides"
    ],
    
    exclusions: [
      "❌ Your motorcycle",
      "❌ Water sports costs",
      "❌ Personal shopping"
    ],
    
    safetyNotes: [
      "⚠️ Coastal roads can be slippery",
      "⚠️ Stay hydrated in humid weather",
      "⚠️ Valid license required"
    ],
    
    stats: {
      totalDistance: 650,
      highestPoint: "Sea level riding",
      passesToCross: [],
      totalFuel: 18.57
    },
    
    status: "upcoming",
    createdAt: new Date("2025-10-10T00:00:00Z"),
    updatedAt: new Date("2025-10-25T00:00:00Z"),
    createdBy: new ObjectId(),
    isFeatured: true,
    isPromoted: false,
    tags: ["coastal", "beach", "goa", "kerala", "scenic", "relaxed"]
  },
  
  // Trip 3: Western Ghats Adventure
  {
    _id: new ObjectId(),
    title: "Western Ghats Adventure 🌲",
    description: "Explore lush green mountains, waterfalls and winding roads",
    image: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=1200",
    
    route: {
      from: "Mumbai",
      to: "Ooty",
      fullRoute: "Mumbai → Lonavala → Goa → Coorg → Ooty"
    },
    
    duration: {
      days: 6,
      displayText: "6 Days"
    },
    
    difficulty: "Intermediate",
    
    dates: {
      start: new Date("2025-11-25T00:00:00Z"),
      end: new Date("2025-11-30T00:00:00Z"),
      startDisplay: "November 25, 2025",
      endDisplay: "November 30, 2025"
    },
    
    capacity: {
      total: 15,
      booked: 12,
      available: 3
    },
    
    pricing: {
      perPerson: 19800,
      displayText: "₹19,800",
      currency: "INR",
      breakdown: {
        accommodation: 9000,
        fuel: 2800,
        meals: 6000,
        permits: 500,
        buffer: 1500
      }
    },
    
    host: {
      userId: new ObjectId(),
      name: "Rohan Desai",
      username: "rohandesai",
      avatar: "R",
      totalTrips: 18,
      rating: 4.7
    },
    
    members: [],
    
    itinerary: [],
    
    bike: {
      model: "Any adventure bike",
      tankCapacity: 15,
      mileage: 30,
      fuelPrice: 105
    },
    
    inclusions: [
      "✅ Mountain resort stays",
      "✅ All meals",
      "✅ Fuel costs covered",
      "✅ Waterfall visits",
      "✅ Coffee plantation tours"
    ],
    
    exclusions: [
      "❌ Your motorcycle",
      "❌ Shopping expenses",
      "❌ Extra activities"
    ],
    
    safetyNotes: [
      "⚠️ Wet roads during monsoon",
      "⚠️ Hairpin bends require skill",
      "⚠️ Valid license mandatory"
    ],
    
    stats: {
      totalDistance: 1200,
      highestPoint: "Ooty - 2,240m",
      passesToCross: ["Bhor Ghat", "Amboli Ghat"],
      totalFuel: 40
    },
    
    status: "upcoming",
    createdAt: new Date("2025-10-05T00:00:00Z"),
    updatedAt: new Date("2025-10-27T00:00:00Z"),
    createdBy: new ObjectId(),
    isFeatured: false,
    isPromoted: true,
    tags: ["western-ghats", "mountains", "nature", "waterfalls", "coffee"]
  }
];

async function populateFeeds() {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const feedsCollection = db.collection('feeds');
    
    // Clear existing data (optional)
    await feedsCollection.deleteMany({});
    console.log('Cleared existing feeds data');
    
    // Insert sample trips
    const result = await feedsCollection.insertMany(sampleTrips);
    console.log(`${result.insertedCount} trips inserted successfully`);
    
    // Create indexes
    await feedsCollection.createIndex({ status: 1, "dates.start": 1 });
    await feedsCollection.createIndex({ difficulty: 1 });
    await feedsCollection.createIndex({ "host.userId": 1 });
    await feedsCollection.createIndex({ tags: 1 });
    await feedsCollection.createIndex({ isFeatured: -1, "dates.start": 1 });
    console.log('Indexes created successfully');
    
    console.log('\n✅ Database populated successfully!');
    console.log('\nSample trip IDs:');
    sampleTrips.forEach((trip, index) => {
      console.log(`${index + 1}. ${trip.title} - ID: ${trip._id}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

populateFeeds();
