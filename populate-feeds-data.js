const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'login';
const COLLECTION_NAME = 'feeds';

async function insertFeedsData() {
    const client = new MongoClient(MONGO_URI);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db(DB_NAME);
        const feedsCollection = db.collection(COLLECTION_NAME);
        
        // Delete existing data
        await feedsCollection.deleteMany({});
        console.log('🗑️ Cleared existing feeds data');
        
        // Drop slug index if it exists
        try {
            await feedsCollection.dropIndex('slug_1');
            console.log('🗑️ Dropped slug index');
        } catch (err) {
            // Index might not exist, that's okay
        }
        
        // Sample host user ID (use existing user from your database)
        const hostUserId = new ObjectId("68f3571d34b544fec4a59759");
        
        // Complete Himalayan Dawn Run Trip Data
        const himalayanTrip = {
            title: "Himalayan Dawn Run 🏔️",
            
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            
            location: "Manali → Leh → Manali",
            
            duration: {
                days: 10,
                display: "10 Days"
            },
            
            difficulty: "Expert",
            
            capacity: {
                total: 10,
                booked: 8,
                available: 2,
                display: "8/10 Riders"
            },
            
            route: {
                from: "Manali",
                to: "Leh",
                waypoints: ["Sarchu", "Leh", "Nubra Valley", "Pangong Lake", "Jispa", "Manali"],
                totalDistance: 1760
            },
            
            dates: {
                start: new Date("2025-11-18"),
                end: new Date("2025-11-27"),
                displayStart: "November 18, 2025",
                displayEnd: "November 27, 2025"
            },
            
            pricing: {
                perPerson: 38471,
                currency: "INR",
                display: "₹38,471",
                breakdown: {
                    accommodation: 17600,
                    fuel: 6474,
                    meals: 3350,
                    permits: 1500,
                    support: 3000,
                    buffer: 3497,
                    insurance: 3050
                }
            },
            
            host: {
                userId: hostUserId,
                name: "Rajesh Kumar",
                username: "rajeshrides",
                avatar: "R",
                rating: 4.8,
                totalTrips: 15,
                bio: "Experienced Himalayan rider with 15+ successful expeditions"
            },
            
            members: [
                {
                    userId: new ObjectId(),
                    name: "Amit Sharma",
                    username: "amitsharma",
                    avatar: "A",
                    joinedAt: new Date("2025-10-15T10:30:00"),
                    joinedDisplay: "2 weeks ago"
                },
                {
                    userId: new ObjectId(),
                    name: "Priya Singh",
                    username: "priyasingh",
                    avatar: "P",
                    joinedAt: new Date("2025-10-18T14:20:00"),
                    joinedDisplay: "2 weeks ago"
                },
                {
                    userId: new ObjectId(),
                    name: "Vikram Malhotra",
                    username: "vikramwheels",
                    avatar: "V",
                    joinedAt: new Date("2025-10-22T09:15:00"),
                    joinedDisplay: "1 week ago"
                },
                {
                    userId: new ObjectId(),
                    name: "Neha Kapoor",
                    username: "nehaadventure",
                    avatar: "N",
                    joinedAt: new Date("2025-10-25T16:45:00"),
                    joinedDisplay: "5 days ago"
                },
                {
                    userId: new ObjectId(),
                    name: "Arjun Reddy",
                    username: "arjunrides",
                    avatar: "A",
                    joinedAt: new Date("2025-10-27T11:20:00"),
                    joinedDisplay: "3 days ago"
                },
                {
                    userId: new ObjectId(),
                    name: "Kavya Menon",
                    username: "kavyaexplorer",
                    avatar: "K",
                    joinedAt: new Date("2025-10-28T14:30:00"),
                    joinedDisplay: "2 days ago"
                },
                {
                    userId: new ObjectId(),
                    name: "Rohit Desai",
                    username: "rohitbiker",
                    avatar: "R",
                    joinedAt: new Date("2025-10-29T10:00:00"),
                    joinedDisplay: "1 day ago"
                },
                {
                    userId: new ObjectId(),
                    name: "Ishita Joshi",
                    username: "ishitarides",
                    avatar: "I",
                    joinedAt: new Date("2025-10-30T13:45:00"),
                    joinedDisplay: "12 hours ago"
                }
            ],
            
            bike: {
                model: "Royal Enfield Himalayan",
                fuelTank: 15,
                mileage: 28,
                included: true
            },
            
            itinerary: [
                {
                    day: 1,
                    date: "18 Nov",
                    title: "Manali → Sarchu",
                    description: "Begin the epic journey through high mountain passes",
                    distance: "~250 km",
                    duration: "7–8 hrs",
                    startTime: "⏰ 06:00 AM",
                    
                    activities: [
                        "🏔️ Cross Rohtang Pass (3,978m)",
                        "� Navigate through Lahaul Valley",
                        "🏔️ Reach Baralacha Pass (4,890m)",
                        "🏕️ Camp at Sarchu high-altitude plains"
                    ],
                    
                    meals: {
                        breakfast: { time: "08:00 AM", venue: "Johnson's / local café, Manali", cost: 220 },
                        lunch: { time: "01:30 PM", venue: "Roadside dhaba, Keylong area", cost: 300 },
                        dinner: { time: "07:00 PM", venue: "Sarchu camp mess", cost: 400 }
                    },
                    
                    fuel: {
                        time: "09:30 AM",
                        location: "Manali IOCL",
                        liters: 8.93,
                        cost: 920
                    },
                    
                    accommodation: {
                        type: "Basic Sarchu tents (budget)",
                        location: "Sarchu plains",
                        checkIn: "07:30 PM",
                        checkOut: "06:30 AM",
                        cost: 2000
                    },
                    
                    dailyTotal: 3520
                },
                {
                    day: 2,
                    date: "19 Nov",
                    title: "Sarchu → Leh",
                    description: "Cross legendary high passes and arrive in Leh",
                    distance: "~300 km",
                    duration: "8–9 hrs",
                    startTime: "⏰ 06:00 AM",
                    
                    activities: [
                        "🏔️ Conquer the famous Gata Loops (21 hairpins)",
                        "⛰️ Touch sky at Tanglang La Pass (5,328m)",
                        "🏨 Arrive in Leh city",
                        "🍜 Evening local market visit"
                    ],
                    
                    meals: {
                        breakfast: { time: "07:00 AM", venue: "Camp breakfast, Sarchu", cost: 200 },
                        lunch: { time: "02:00 PM", venue: "Roadside cookhouse en route", cost: 350 },
                        dinner: { time: "08:00 PM", venue: "Budget diner, Leh", cost: 450 }
                    },
                    
                    fuel: {
                        time: "10:00 AM",
                        location: "Last reliable pump before stretch",
                        liters: 10.71,
                        cost: 1104
                    },
                    
                    accommodation: {
                        type: "Budget guesthouse",
                        location: "Leh city center",
                        checkIn: "08:30 PM",
                        checkOut: "08:00 AM",
                        cost: 2000
                    },
                    
                    dailyTotal: 4304
                },
                {
                    day: 3,
                    date: "20 Nov",
                    title: "Leh — Acclimatize & Local Photos",
                    description: "Rest day for altitude acclimatization with easy local rides",
                    distance: "Easy rides around Leh",
                    duration: "Flexible",
                    startTime: "⏰ 09:00 AM",
                    
                    activities: [
                        "🏔️ Acclimatization rest day (mandatory)",
                        "📸 Visit Shanti Stupa for sunset",
                        "🏛️ Explore Leh Palace and market",
                        "🍵 Relax at local cafes"
                    ],
                    
                    meals: {
                        breakfast: { time: "09:30 AM", venue: "The Bodhi Tree Café", cost: 300 },
                        lunch: { time: "01:00 PM", venue: "Tibetan Kitchen / local", cost: 400 },
                        dinner: { time: "07:00 PM", venue: "Druk / small café", cost: 350 }
                    },
                    
                    fuel: {
                        time: "11:00 AM",
                        location: "Leh IOCL (top-up)",
                        liters: 0.71,
                        cost: 74
                    },
                    
                    accommodation: {
                        type: "Budget guesthouse (same)",
                        location: "Leh",
                        checkIn: "Check-in done",
                        checkOut: "08:00 AM next day",
                        cost: 2000
                    },
                    
                    dailyTotal: 3324
                },
                {
                    day: 4,
                    date: "21 Nov",
                    title: "Leh → Nubra Valley (via Khardung La)",
                    description: "Conquer the world's highest motorable road",
                    distance: "~150 km",
                    duration: "5–6 hrs",
                    startTime: "⏰ 07:00 AM",
                    
                    activities: [
                        "🏔️ Cross Khardung La Pass (5,359m)",
                        "🏜️ Descend into Nubra Valley",
                        "🐫 Reach Diskit and Hunder area",
                        "🛣️ Short sandy trail rides near dunes"
                    ],
                    
                    meals: {
                        breakfast: { time: "07:30 AM", venue: "Hotel breakfast, Leh", cost: 200 },
                        lunch: { time: "01:00 PM", venue: "Roadside dhaba, Diskit area", cost: 300 },
                        dinner: { time: "07:00 PM", venue: "Guesthouse meal, Diskit", cost: 350 }
                    },
                    
                    fuel: {
                        time: "09:00 AM",
                        location: "Leh IOCL (top-up)",
                        liters: 5.36,
                        cost: 551
                    },
                    
                    accommodation: {
                        type: "Budget homestay",
                        location: "Diskit, Nubra Valley",
                        checkIn: "07:30 PM",
                        checkOut: "07:00 AM",
                        cost: 1600
                    },
                    
                    dailyTotal: 3201
                },
                {
                    day: 5,
                    date: "22 Nov",
                    title: "Nubra — Dunes & Local Trails",
                    description: "Explore Nubra Valley's unique landscape",
                    distance: "Short rides",
                    duration: "Flexible",
                    startTime: "⏰ 09:00 AM",
                    
                    activities: [
                        "🏜️ Morning ride through Hunder sand dunes",
                        "📸 Photography at golden hour dunes",
                        "🏛️ Visit Diskit Monastery (32m Buddha)",
                        "🌄 Village culture exploration"
                    ],
                    
                    meals: {
                        breakfast: { time: "09:30 AM", venue: "Homestay breakfast", cost: 200 },
                        lunch: { time: "01:00 PM", venue: "Local café, Hunder", cost: 300 },
                        dinner: { time: "07:00 PM", venue: "Guesthouse meal", cost: 300 }
                    },
                    
                    fuel: {
                        time: "11:30 AM",
                        location: "Diskit top-up",
                        liters: 2.14,
                        cost: 221
                    },
                    
                    accommodation: {
                        type: "Budget homestay (same)",
                        location: "Nubra Valley",
                        checkIn: "Already checked in",
                        checkOut: "08:00 AM next day",
                        cost: 1400
                    },
                    
                    dailyTotal: 2621
                },
                {
                    day: 6,
                    date: "23 Nov",
                    title: "Nubra → Leh",
                    description: "Return journey via Khardung La",
                    distance: "~150 km",
                    duration: "5–6 hrs",
                    startTime: "⏰ 08:00 AM",
                    
                    activities: [
                        "🏔️ Re-cross Khardung La Pass",
                        "📸 Photo stops at scenic viewpoints",
                        "🏨 Back to Leh for rest",
                        "🍜 Evening local market shopping"
                    ],
                    
                    meals: {
                        breakfast: { time: "08:30 AM", venue: "Homestay", cost: 200 },
                        lunch: { time: "01:00 PM", venue: "Roadside stop near Khardung", cost: 300 },
                        dinner: { time: "07:00 PM", venue: "Leh local eatery", cost: 350 }
                    },
                    
                    fuel: {
                        time: "10:30 AM",
                        location: "Diskit pump",
                        liters: 5.36,
                        cost: 551
                    },
                    
                    accommodation: {
                        type: "Budget guesthouse (same Leh one)",
                        location: "Leh",
                        checkIn: "Evening",
                        checkOut: "Early next morning",
                        cost: 1600
                    },
                    
                    dailyTotal: 3201
                },
                {
                    day: 7,
                    date: "24 Nov",
                    title: "Leh → Pangong Lake",
                    description: "Journey to the iconic blue lake",
                    distance: "~240 km",
                    duration: "7–8 hrs",
                    startTime: "⏰ 06:30 AM",
                    
                    activities: [
                        "🏔️ Cross Chang La Pass (5,360m)",
                        "🌊 Reach stunning Pangong Tso Lake",
                        "📸 Sunset photography at lake",
                        "⭐ Night star-gazing session"
                    ],
                    
                    meals: {
                        breakfast: { time: "07:00 AM", venue: "Hotel breakfast, Leh", cost: 250 },
                        lunch: { time: "01:30 PM", venue: "Highway dhaba en route", cost: 350 },
                        dinner: { time: "06:30 PM", venue: "Camp / homestay near Pangong", cost: 400 }
                    },
                    
                    fuel: {
                        time: "09:30 AM",
                        location: "Leh IOCL (top-up)",
                        liters: 8.57,
                        cost: 883
                    },
                    
                    accommodation: {
                        type: "Simple tents / homestay (budget)",
                        location: "Near Pangong Lake",
                        checkIn: "06:30 PM",
                        checkOut: "07:00 AM",
                        cost: 2200
                    },
                    
                    dailyTotal: 4283
                },
                {
                    day: 8,
                    date: "25 Nov",
                    title: "Pangong → Sarchu",
                    description: "Remote and challenging route back",
                    distance: "~300 km",
                    duration: "8–9 hrs",
                    startTime: "⏰ 06:00 AM",
                    
                    activities: [
                        "� Early sunrise at Pangong Lake",
                        "🛣️ Long remote stretch (carry spare fuel)",
                        "⚠️ Limited network - stay alert",
                        "🏕️ Camping at Sarchu plains"
                    ],
                    
                    meals: {
                        breakfast: { time: "06:30 AM", venue: "Camp breakfast, Pangong", cost: 200 },
                        lunch: { time: "01:30 PM", venue: "Roadside cookhouse en route", cost: 350 },
                        dinner: { time: "06:30 PM", venue: "Sarchu camp dinner", cost: 450 }
                    },
                    
                    fuel: {
                        time: "09:30 AM",
                        location: "Top-up at nearest pump / Changthang area",
                        liters: 10.71,
                        cost: 1104
                    },
                    
                    accommodation: {
                        type: "Basic Sarchu tents",
                        location: "Sarchu",
                        checkIn: "07:00 PM",
                        checkOut: "06:00 AM",
                        cost: 2000
                    },
                    
                    dailyTotal: 4304
                },
                {
                    day: 9,
                    date: "26 Nov",
                    title: "Sarchu → Jispa",
                    description: "Descending towards Manali",
                    distance: "~150 km",
                    duration: "5–6 hrs",
                    startTime: "⏰ 07:00 AM",
                    
                    activities: [
                        "🏔️ Descend from high altitude",
                        "🌲 Enter greener Lahaul Valley",
                        "📸 Scenic stops at Baralacha region",
                        "🏨 Rest at peaceful Jispa village"
                    ],
                    
                    meals: {
                        breakfast: { time: "07:30 AM", venue: "Camp breakfast, Sarchu", cost: 200 },
                        lunch: { time: "01:30 PM", venue: "Roadside dhaba, Darcha / Baralacha region", cost: 300 },
                        dinner: { time: "06:30 PM", venue: "Jispa guesthouse meal", cost: 350 }
                    },
                    
                    fuel: {
                        time: "10:30 AM",
                        location: "Last reliable pump top-up",
                        liters: 5.36,
                        cost: 551
                    },
                    
                    accommodation: {
                        type: "Budget guesthouse",
                        location: "Jispa",
                        checkIn: "07:00 PM",
                        checkOut: "07:00 AM",
                        cost: 1500
                    },
                    
                    dailyTotal: 3101
                },
                {
                    day: 10,
                    date: "27 Nov",
                    title: "Jispa → Manali — Homebound Finish",
                    description: "Final leg back to Manali",
                    distance: "~140 km",
                    duration: "4–5 hrs",
                    startTime: "⏰ 08:00 AM",
                    
                    activities: [
                        "🏔️ Final descent through Keylong",
                        "🌊 Scenic riverside mountain roads",
                        "🏁 Arrive in Manali (~18:00)",
                        "🎉 Trip completion celebration"
                    ],
                    
                    meals: {
                        breakfast: { time: "08:30 AM", venue: "Guesthouse, Jispa", cost: 200 },
                        lunch: { time: "01:00 PM", venue: "Riverside café, Keylong → Manali stretch", cost: 300 },
                        dinner: { time: "06:30 PM", venue: "Back in Manali / local celebration", cost: 400 }
                    },
                    
                    fuel: {
                        time: "10:30 AM",
                        location: "Petrol pump near Keylong / Jispa",
                        liters: 5.0,
                        cost: 515
                    },
                    
                    accommodation: {
                        type: "Trip ends",
                        location: "Manali arrival",
                        checkIn: "~06:00 PM ETA",
                        checkOut: "N/A",
                        cost: 0
                    },
                    
                    dailyTotal: 1415
                }
            ],
            
            inclusions: [
                "✅ Royal Enfield Himalayan motorcycle (15L tank, ~28 kmpl)",
                "✅ Accommodation for 9 nights (₹17,600)",
                "✅ Total fuel: ~62.85 L (₹6,474)",
                "✅ All meals as per itinerary (Breakfast, Lunch, Dinner)",
                "✅ Experienced ride captain and support",
                "✅ Basic medical kit and oxygen cylinders",
                "✅ Backup mechanic support",
                "✅ Inner line permits and entry fees",
                "✅ 10% buffer for unexpected costs"
            ],
            
            exclusions: [
                "❌ Travel to/from Manali starting point",
                "❌ Personal riding gear (helmet, jacket, gloves)",
                "❌ Travel insurance (highly recommended)",
                "❌ Personal expenses and shopping",
                "❌ Alcohol and additional beverages",
                "❌ Camera equipment rentals",
                "❌ Emergency evacuation costs",
                "❌ Tips for local guides and staff"
            ],
            
            safetyNotes: [
                "⚠️ Winter & high passes: Check local road/Army advisories daily (Zoji La, Baralacha seasonal closures)",
                "⛽ Carry a 2–3L jerry on remote legs (Pangong → Sarchu) — petrol availability is intermittent",
                "🧥 Pack warm liners, insulated gloves, wool layers, and sleeping liner for tent nights",
                "📋 Keep copies of ID, permits, emergency contacts; inform family of daily check-ins",
                "🏔️ Acclimatization day in Leh is MANDATORY - do not skip!",
                "🏥 Basic medical kit provided, but carry personal medications"
            ],
            
            stats: {
                totalDistance: 1760,
                highestPoint: "Khardung La - 5,359m",
                passesToCross: ["Rohtang La", "Baralacha La", "Tanglang La", "Khardung La", "Chang La"],
                totalFuelNeeded: 62.85
            },
            
            tags: ["himalayan", "ladakh", "adventure", "winter", "expert", "high-altitude"],
            
            status: "upcoming",
            isFeatured: true,
            isPromoted: false,
            
            createdBy: hostUserId,
            createdAt: new Date("2025-10-01T10:00:00"),
            updatedAt: new Date()
        };
        
        // Insert the trip
        const result = await feedsCollection.insertOne(himalayanTrip);
        console.log(`✅ Successfully inserted trip: ${himalayanTrip.title}`);
        console.log(`   Trip ID: ${result.insertedId}`);
        
        // Create indexes for better performance
        await feedsCollection.createIndex({ status: 1 });
        await feedsCollection.createIndex({ "dates.start": 1 });
        await feedsCollection.createIndex({ difficulty: 1 });
        await feedsCollection.createIndex({ isFeatured: -1 });
        await feedsCollection.createIndex({ "host.userId": 1 });
        await feedsCollection.createIndex({ "members.userId": 1 });
        console.log('✅ Indexes created successfully');
        
        console.log('\n📊 Summary:');
        console.log(`   - Trip: ${himalayanTrip.title}`);
        console.log(`   - Duration: ${himalayanTrip.duration.days} days`);
        console.log(`   - Members: ${himalayanTrip.members.length}/${himalayanTrip.capacity.total}`);
        console.log(`   - Price: ${himalayanTrip.pricing.display} per person`);
        console.log(`   - Itinerary days: ${himalayanTrip.itinerary.length}`);
        
    } catch (error) {
        console.error('❌ Error inserting feeds data:', error);
    } finally {
        await client.close();
        console.log('\n✅ Disconnected from MongoDB');
    }
}

// Run the script
insertFeedsData();
