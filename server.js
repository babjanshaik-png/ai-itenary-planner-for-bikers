const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDUBB2KJLlE5r6POLpXCCWTJYLfwJlIX_c');

// MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'login';
const COLLECTION_NAME = 'user';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB client
let db;
let usersCollection;
let createTripCollection;
let exploreCollection;
let feedsCollection;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        console.log('Connected to MongoDB successfully!');
        
        db = client.db(DB_NAME);
        usersCollection = db.collection(COLLECTION_NAME);
        createTripCollection = db.collection('createtrip');
        exploreCollection = db.collection('newexplore');
        feedsCollection = db.collection('feeds');
        
        // Create index on username for faster queries and uniqueness
        await usersCollection.createIndex({ username: 1 }, { unique: true });
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Routes - API Only (no HTML serving)

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API server is running' });
});

// Register a new user
app.post('/api/register', async (req, res) => {
    try {
        const { name, username, password } = req.body;
        
        // Validate input
        if (!name || !username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, username, and password are required' 
            });
        }
        
        // Check if username already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'Username already exists' 
            });
        }
        
        // Insert new user
        const newUser = {
            name,
            username,
            password, // In production, ALWAYS hash passwords!
            createdAt: new Date()
        };
        
        const result = await usersCollection.insertOne(newUser);
        
        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            userId: result.insertedId
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }
        
        // Find user
        const user = await usersCollection.findOne({ username, password });
        
        if (user) {
            res.json({ 
                success: true, 
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username
                }
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Get all users (for testing - remove in production)
app.get('/api/users', async (req, res) => {
    try {
        const users = await usersCollection.find({}, { 
            projection: { password: 0 } // Don't send passwords
        }).toArray();
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching users' 
        });
    }
});

// Create a new trip
app.post('/api/createtrip', async (req, res) => {
    try {
        const { userId, riderName, username, where, when, from, travelers, budget, createdAt } = req.body;
        
        // Validate input
        if (!riderName && !username) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rider name or username is required' 
            });
        }
        
        // Create trip document
        const newTrip = {
            userId: userId || null,
            riderName: riderName || username || 'Anonymous',
            username: username || 'anonymous',
            where: where || 'Not specified',
            when: when || 'Not specified',
            from: from || 'Not specified',
            travelers: travelers || { adults: 0, children: 0, infants: 0, pets: 0, total: 0 },
            budget: budget || 'any',
            createdAt: createdAt || new Date().toISOString()
        };
        
        // Insert trip into MongoDB
        const result = await createTripCollection.insertOne(newTrip);
        
        console.log('Trip created successfully:', result.insertedId);
        
        res.status(201).json({ 
            success: true, 
            message: 'Trip created successfully',
            tripId: result.insertedId,
            trip: newTrip
        });
        
    } catch (error) {
        console.error('Create trip error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while creating trip' 
        });
    }
});

// Get all trips (for testing)
app.get('/api/trips', async (req, res) => {
    try {
        const trips = await createTripCollection.find({}).toArray();
        res.json({ success: true, trips });
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching trips' 
        });
    }
});

// ============= FEEDS API ENDPOINTS =============

// Get all upcoming trips (feeds)
app.get('/api/feeds', async (req, res) => {
    try {
        const { status = 'upcoming', limit = 10, skip = 0 } = req.query;
        
        const trips = await feedsCollection
            .find({ status })
            .sort({ isFeatured: -1, 'dates.start': 1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .toArray();
        
        res.json({ 
            success: true, 
            trips,
            count: trips.length
        });
    } catch (error) {
        console.error('Error fetching feeds:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching feeds' 
        });
    }
});

// Get joined trips for a user
app.get('/api/feeds/joined/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { ObjectId } = require('mongodb');
        
        // Try to convert userId to ObjectId, otherwise use as string
        let userIdQuery;
        try {
            userIdQuery = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
        } catch (e) {
            userIdQuery = userId;
        }
        
        // Find trips where user is in members array
        const trips = await feedsCollection
            .find({ 
                $or: [
                    { "members.userId": userIdQuery },
                    { "members.userId": userId }  // Also check as string
                ]
            })
            .sort({ 'dates.start': 1 })
            .toArray();
        
        res.json({ 
            success: true, 
            trips,
            count: trips.length
        });
    } catch (error) {
        console.error('Error fetching joined trips:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching joined trips' 
        });
    }
});

// Get single trip details by ID
app.get('/api/feeds/:tripId', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const { tripId } = req.params;
        
        if (!ObjectId.isValid(tripId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid trip ID' 
            });
        }
        
        const trip = await feedsCollection.findOne({ _id: new ObjectId(tripId) });
        
        if (!trip) {
            return res.status(404).json({ 
                success: false, 
                message: 'Trip not found' 
            });
        }
        
        res.json({ 
            success: true, 
            trip 
        });
    } catch (error) {
        console.error('Error fetching trip details:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching trip details' 
        });
    }
});

// Create new trip (feed)
app.post('/api/feeds', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const tripData = req.body;
        
        // Add timestamps
        tripData.createdAt = new Date();
        tripData.updatedAt = new Date();
        
        // Convert string IDs to ObjectId if needed
        if (tripData.host && tripData.host.userId && typeof tripData.host.userId === 'string') {
            tripData.host.userId = new ObjectId(tripData.host.userId);
        }
        if (tripData.createdBy && typeof tripData.createdBy === 'string') {
            tripData.createdBy = new ObjectId(tripData.createdBy);
        }
        
        const result = await feedsCollection.insertOne(tripData);
        
        res.status(201).json({ 
            success: true, 
            message: 'Trip created successfully',
            tripId: result.insertedId
        });
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating trip' 
        });
    }
});

// Create trip with AI (Gemini-powered itinerary parsing)
app.post('/api/feeds/create-with-ai', async (req, res) => {
    try {
        const { 
            title,
            fromLocation, 
            toLocation, 
            difficulty, 
            maxRiders, 
            imageDescription,
            itineraryText,
            hostUserId,
            hostName,
            hostUsername
        } = req.body;

        console.log('🤖 AI Processing started for trip:', title, '|', fromLocation, '→', toLocation);

        // Initialize Gemini 2.5 Flash model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.1,
            }
        });

        // Create prompt for extracting itinerary data
        const prompt = `
You are an expert at parsing motorcycle trip itineraries and creating cinematic image descriptions. Extract structured data from the following itinerary text and return ONLY a valid JSON object (no markdown, no code blocks).

Route: ${fromLocation} → ${toLocation}
Max Riders: ${maxRiders}
User Image Description (if provided): ${imageDescription || 'Not provided - generate automatically'}
Itinerary Text:
${itineraryText}

Extract and return JSON with this EXACT structure:
{
  "duration": <number of days as integer>,
  "startDate": "<date in YYYY-MM-DD format>",
  "endDate": "<date in YYYY-MM-DD format>",
  "pricePerPerson": <total price calculated from all daily totals>,
  "cinematicImagePrompt": "A group of 4-5 adventure motorcyclists riding their [BIKE_TYPE based on itinerary: dual-sport for mountains, touring for long distances, cruiser for coastal] bikes on a [ROAD_TYPE_AND_CONDITION: e.g., winding asphalt mountain road, dusty gravel track, pristine coastal highway]. The backdrop features [MAIN_GEOGRAPHIC_FEATURE_1 from route: e.g., towering snow-capped Himalayan peaks, lush green rainforest, vast white salt flats] and [MAIN_GEOGRAPHIC_FEATURE_2_OR_LANDMARK from itinerary: e.g., a serene blue high-altitude lake, an ancient fort, a specific waterfall, dense palm tree groves]. This is an ultra-realistic photograph, rendered with cinematic lighting, epic scale, and high detail, in the style of professional travel photography. The image is captured with a [CAMERA_LENS_PERSPECTIVE: e.g., wide-angle lens from a low-angle perspective, drone shot looking down, rear-view tracking shot]. The riders are wearing [GEAR_COLOR_AND_STYLE: e.g., dark grey and orange protective gear, black and red adventure gear] and are [RIDER_ACTION_DETAIL: e.g., kicking up a small amount of dust, cruising smoothly, navigating a sharp turn]. The time of day is [TIME_OF_DAY_AND_WEATHER based on route/season: e.g., bright mid-day sun with a clear blue sky, a dramatic sunset, a misty morning, heavy rain]. Dominant colors are [DOMINANT_COLORS based on geography: e.g., earth tones, deep blue, green, and white for mountains; golden orange, teal, and lush green for coastal].",
  "imageSearchKeywords": "<5-7 keywords for image search based on the cinematic prompt, e.g., 'himalayan motorcycle adventure mountain peaks lake sunset riders'>",
  "itinerary": [
    {
      "day": <day number>,
      "date": "<date string like '18 Nov'>",
      "title": "<route like 'Manali → Sarchu'>",
      "description": "<brief description>",
      "distance": "<distance with unit>",
      "duration": "<time duration>",
      "startTime": "<start time>",
      "activities": [
        "IMPORTANT: Generate 3-5 creative, specific activities for this day based on:
        1. The day's route (From → To locations) - what can you do along THIS specific route?
        2. Geographic features mentioned (passes, lakes, valleys, cities)
        3. Cultural/historical landmarks near the route
        4. Photography opportunities at scenic viewpoints
        5. Local experiences (markets, monasteries, viewpoints)
        6. Adventure activities available in the region
        Examples for reference (Himalayan Dawn Run style):
        - 🏔️ Conquer the famous Gata Loops (21 hairpins)
        - 🌅 Touch sky at Tanglang La Pass (5,328m)
        - 🏛️ Visit Shanti Stupa for sunset
        - 🏪 Explore Leh Palace and market
        - 📸 Photo stops at scenic viewpoints
        - 🛣️ Re-cross Khardung La Pass
        - 🏞️ Visit Pangong Lake shoreline
        Make activities SPECIFIC to the route, NOT generic!"
      ],
      "meals": {
        "breakfast": { "time": "<time>", "venue": "<venue name>", "cost": <number> },
        "lunch": { "time": "<time>", "venue": "<venue name>", "cost": <number> },
        "dinner": { "time": "<time>", "venue": "<venue name>", "cost": <number> }
      },
      "fuel": {
        "time": "<time>",
        "location": "<location>",
        "liters": <number>,
        "cost": <number>
      },
      "accommodation": {
        "type": "<accommodation type>",
        "location": "<location>",
        "checkIn": "<time>",
        "checkOut": "<time>",
        "cost": <number>
      },
      "dailyTotal": <number>
    }
  ],
  "inclusions": [
    "✅ Accommodation for X nights (₹Y total calculated from itinerary)",
    "✅ Total fuel: ~X L (₹Y total calculated from itinerary)",
    "✅ All meals as per itinerary (Breakfast, Lunch, Dinner)",
    "✅ Support services mentioned in itinerary",
    "✅ Permits and entry fees (if mentioned)",
    "✅ Buffer for unexpected costs"
  ],
  "exclusions": [
    "❌ Travel to/from ${fromLocation} starting point",
    "❌ Personal riding gear (helmet, jacket, gloves)",
    "❌ Travel insurance (highly recommended)",
    "❌ Personal expenses and shopping",
    "❌ Alcohol and additional beverages",
    "❌ Camera equipment rentals",
    "❌ Emergency evacuation costs",
    "❌ Tips for local guides and staff"
  ],
  "safetyNotes": ["<note 1>", "<note 2>", ...]
}

CRITICAL RULES for ACTIVITIES (Look at Himalayan Dawn Run as reference):
1. Analyze EACH day's From→To route and identify:
   - Mountain passes (add altitude if high-altitude)
   - Lakes, viewpoints, scenic stops
   - Historical/cultural landmarks (palaces, monasteries, forts)
   - Cities/towns along the way (markets, local attractions)
   - Adventure spots (rope bridges, valleys, waterfalls)
2. Use emojis to categorize activities:
   🏔️ Mountain/Pass crossings
   🌅 Sunset/Sunrise viewpoints
   🏛️ Cultural/Historical sites
   🏪 Markets/Shopping/Local experiences
   📸 Photo opportunities
   🏞️ Natural attractions (lakes, valleys, waterfalls)
   🛣️ Road experiences (hairpin bends, scenic routes)
3. Make activities SPECIFIC and ACTIONABLE:
   ✅ "🏔️ Conquer the famous Gata Loops (21 hairpins)"
   ✅ "🌅 Touch sky at Tanglang La Pass (5,328m)"
   ✅ "🏛️ Visit Shanti Stupa for sunset"
   ❌ "Enjoy scenic views" (TOO GENERIC)
   ❌ "Take photos" (TOO VAGUE)
4. Limit to 3-5 activities per day
5. Match activity intensity to difficulty level and distance covered

CRITICAL RULES for cinematicImagePrompt:
1. Fill EVERY placeholder with specific details from the itinerary
2. Use actual geographic features mentioned in the route (e.g., "Khardung La Pass", "Pangong Lake", "Arabian Sea coastline")
3. Match bike type to terrain: mountains=dual-sport, long-distance=touring, coastal=cruiser
4. Choose time of day based on season/weather in itinerary
5. Select dominant colors that match the geography (Himalayas=white/blue/brown, Coastal=orange/teal/green, Desert=orange/brown/gold)
6. Make the image prompt CINEMATIC and PROFESSIONAL
7. If user provided imageDescription, incorporate those specific elements into the prompt
8. Generate imageSearchKeywords by extracting key visual elements from the cinematic prompt

OTHER IMPORTANT Rules:
- DO NOT include motorcycle model details in inclusions
- Calculate accommodation nights and total costs from itinerary
- Calculate total fuel amount and costs from daily fuel entries
- Generate a cinematic image prompt with specific details from the route
- Extract ALL days from the itinerary
- Calculate dates based on year 2025
- Sum up ALL daily totals for pricePerPerson
- Return ONLY valid JSON, no other text
`;

        // Call Gemini API
        console.log('📡 Calling Gemini API...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let extractedText = response.text();
        
        // Clean up response (remove markdown code blocks if present)
        extractedText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        console.log('✅ AI Response received, parsing JSON...');
        console.log('📝 Raw response length:', extractedText.length, 'characters');
        
        // Try to parse JSON with better error handling
        let extractedData;
        try {
            extractedData = JSON.parse(extractedText);
        } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError.message);
            console.error('🔍 Problematic JSON around position', parseError.message.match(/\d+/)?.[0] || 'unknown');
            
            // Log a snippet around the error position
            const errorPos = parseInt(parseError.message.match(/\d+/)?.[0] || '0');
            const start = Math.max(0, errorPos - 200);
            const end = Math.min(extractedText.length, errorPos + 200);
            console.error('📄 JSON snippet around error:\n', extractedText.substring(start, end));
            
            throw new Error(`AI response JSON parsing failed: ${parseError.message}`);
        }
        
        console.log(`📊 Extracted: "${title}", ${extractedData.duration} days, ₹${extractedData.pricePerPerson}, ${extractedData.itinerary.length} day entries`);
        console.log(`🎬 Cinematic Prompt Generated: ${extractedData.cinematicImagePrompt?.substring(0, 150)}...`);

        // Generate image using the cinematic prompt
        let imageUrl;
        
        if (extractedData.cinematicImagePrompt) {
            // Use Pollinations.ai free image generation API with the cinematic prompt
            // This API generates images from text prompts in HD quality
            const encodedPrompt = encodeURIComponent(extractedData.cinematicImagePrompt);
            imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true&enhance=true`;
            console.log('🎨 Generating HD cinematic image (1920×1080) with AI from detailed prompt...');
            console.log('📸 Image URL:', imageUrl);
        } else if (imageDescription && imageDescription.trim()) {
            // Fallback: User provided custom description - also use image generation in HD
            const encodedDesc = encodeURIComponent(imageDescription);
            imageUrl = `https://image.pollinations.ai/prompt/${encodedDesc}?width=1920&height=1080&nologo=true&enhance=true`;
            console.log('🎨 Using custom image description for HD generation (1920×1080):', imageDescription);
        } else {
            // Final fallback: Generate basic prompt in HD
            const basicPrompt = `Professional travel photography of motorcyclists riding from ${fromLocation} to ${toLocation}, cinematic lighting, epic landscape, adventure travel`;
            const encodedBasic = encodeURIComponent(basicPrompt);
            imageUrl = `https://image.pollinations.ai/prompt/${encodedBasic}?width=1920&height=1080&nologo=true&enhance=true`;
            console.log('🎨 Using basic route-based HD generation (1920×1080)');
        }

        // Store the cinematic prompt for reference
        const cinematicPrompt = extractedData.cinematicImagePrompt;

        // Create trip document
        const tripDocument = {
            title: title,
            image: imageUrl,
            location: `${fromLocation} → ${toLocation}`,
            duration: {
                days: extractedData.duration,
                display: `${extractedData.duration} Days`
            },
            difficulty,
            capacity: {
                total: maxRiders,
                booked: 0,
                available: maxRiders,
                display: `0/${maxRiders} Riders`
            },
            route: {
                from: fromLocation,
                to: toLocation,
                waypoints: extractedData.itinerary.map(day => day.title.split('→').map(s => s.trim())).flat().filter((v, i, a) => a.indexOf(v) === i),
                totalDistance: extractedData.itinerary.reduce((sum, day) => {
                    const match = day.distance?.match(/(\d+)/);
                    return sum + (match ? parseInt(match[1]) : 0);
                }, 0)
            },
            dates: {
                start: new Date(extractedData.startDate),
                end: new Date(extractedData.endDate),
                displayStart: extractedData.startDate,
                displayEnd: extractedData.endDate
            },
            pricing: {
                perPerson: extractedData.pricePerPerson,
                currency: "INR",
                display: `₹${extractedData.pricePerPerson.toLocaleString('en-IN')}`
            },
            host: {
                userId: new ObjectId(hostUserId),
                name: hostName,
                username: hostUsername,
                avatar: hostName.charAt(0).toUpperCase(),
                rating: 4.5,
                totalTrips: 0
            },
            members: [],
            itinerary: extractedData.itinerary,
            inclusions: extractedData.inclusions || [],
            exclusions: extractedData.exclusions || [],
            safetyNotes: extractedData.safetyNotes || [],
            tags: [fromLocation.toLowerCase(), toLocation.toLowerCase(), difficulty.toLowerCase(), "adventure"],
            status: "upcoming",
            isFeatured: false,
            isPromoted: false,
            createdBy: new ObjectId(hostUserId),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save to MongoDB - Save to both feeds and explore collections
        console.log('💾 Saving to MongoDB (feeds collection)...');
        const insertResult = await feedsCollection.insertOne(tripDocument);
        
        // Also save to explore collection with appropriate structure
        console.log('💾 Saving to MongoDB (explore collection)...');
        const exploreDocument = {
            riderId: new ObjectId(hostUserId),
            riderName: hostName,
            riderInitial: hostName.charAt(0).toUpperCase(),
            riderProfileColor: "bg-orange-500",
            
            title: title,
            description: itineraryText.substring(0, 300) + (itineraryText.length > 300 ? '...' : ''),
            rating: 5,
            
            route: `${fromLocation} to ${toLocation}`,
            days: `${extractedData.duration} Days`,
            totalRiders: maxRiders,
            
            photos: [
                {
                    url: imageUrl,
                    caption: `${title} - ${fromLocation} to ${toLocation}`,
                    order: 1
                }
            ],
            mainPhoto: imageUrl,
            
            tags: [fromLocation, toLocation, difficulty, "Adventure"],
            
            likes: {
                count: 0,
                users: []
            },
            
            comments: {
                count: 0,
                list: []
            },
            
            shares: {
                count: 0,
                users: []
            },
            
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "published",
            visibility: "public",
            tripCompletedDate: null, // Will be set when trip is completed
            
            // Additional reference to the feeds collection trip
            feedsTripId: insertResult.insertedId
        };
        
        const exploreResult = await exploreCollection.insertOne(exploreDocument);
        
        console.log(`✅ Trip created successfully! Feeds ID: ${insertResult.insertedId}, Explore ID: ${exploreResult.insertedId}`);

        res.status(201).json({ 
            success: true, 
            message: 'Trip created successfully with AI and saved to explore!',
            tripId: insertResult.insertedId,
            exploreId: exploreResult.insertedId,
            extractedData: {
                duration: extractedData.duration,
                pricePerPerson: extractedData.pricePerPerson,
                totalDays: extractedData.itinerary.length
            }
        });

    } catch (error) {
        console.error('❌ Error creating trip with AI:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error creating trip with AI' 
        });
    }
});

// Create explore post (simple form submission without AI)
app.post('/api/explore/create', async (req, res) => {
    try {
        // Check if collection is initialized
        if (!exploreCollection) {
            console.error('❌ exploreCollection is not initialized!');
            return res.status(500).json({ 
                success: false, 
                message: 'Database not ready. Please try again.' 
            });
        }

        const { 
            title,
            description,
            riderName,
            riderId,
            fromLocation, 
            toLocation, 
            totalRiders,
            days,
            rating,
            imageUrl
        } = req.body;

        console.log('📝 Creating explore post:', title, '|', fromLocation, '→', toLocation);
        console.log('📊 Request body:', req.body);

        // Validation
        if (!title || !fromLocation || !toLocation || !riderName || !days || !totalRiders) {
            console.log('❌ Validation failed. Missing fields:', {
                title: !!title,
                fromLocation: !!fromLocation,
                toLocation: !!toLocation,
                riderName: !!riderName,
                days: !!days,
                totalRiders: !!totalRiders
            });
            return res.status(400).json({ 
                success: false, 
                message: 'Required fields: title, fromLocation, toLocation, riderName, days, totalRiders' 
            });
        }

        // Function to generate consistent color based on user ID
        const getUserColor = (userId) => {
            const colors = [
                'bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
                'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500',
                'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
            ];
            // Use user ID to consistently pick a color
            const idString = userId ? userId.toString() : '';
            let hash = 0;
            for (let i = 0; i < idString.length; i++) {
                hash = idString.charCodeAt(i) + ((hash << 5) - hash);
            }
            return colors[Math.abs(hash) % colors.length];
        };

        // Create explore document
        const exploreDocument = {
            riderId: riderId ? new ObjectId(riderId) : new ObjectId(),
            riderName: riderName,
            riderInitial: riderName.charAt(0).toUpperCase(),
            riderProfileColor: getUserColor(riderId),
            
            title: title,
            description: description || `Amazing ride from ${fromLocation} to ${toLocation}`,
            rating: rating || 5,
            
            route: `${fromLocation} to ${toLocation}`,
            days: `${days} Days`,
            totalRiders: parseInt(totalRiders),
            
            photos: imageUrl ? [
                {
                    url: imageUrl,
                    caption: `${title} - ${fromLocation} to ${toLocation}`,
                    order: 1
                }
            ] : [],
            mainPhoto: imageUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop`,
            
            tags: [fromLocation, toLocation, "Adventure"],
            
            likes: {
                count: 0,
                likedBy: []
            },
            
            comments: [],
            
            shares: {
                count: 0,
                users: []
            },
            
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "published",
            visibility: "public",
            tripCompletedDate: new Date()
        };

        // Save to explore collection
        console.log('💾 Saving to MongoDB (explore collection)...');
        const exploreResult = await exploreCollection.insertOne(exploreDocument);
        
        console.log(`✅ Explore post created successfully! ID: ${exploreResult.insertedId}`);

        res.status(201).json({ 
            success: true, 
            message: 'Explore post created successfully!',
            exploreId: exploreResult.insertedId,
            post: exploreDocument
        });

    } catch (error) {
        console.error('❌ Error creating explore post:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error creating explore post' 
        });
    }
});

// Get all explore posts
app.get('/api/explore', async (req, res) => {
    try {
        const explorePosts = await exploreCollection
            .find({ status: "published" })
            .sort({ createdAt: -1 })
            .toArray();
        
        // Normalize data structure - ensure comments is always an array
        const normalizedPosts = explorePosts.map(post => {
            // Handle old posts with comments as object {count, list}
            if (post.comments && typeof post.comments === 'object' && !Array.isArray(post.comments)) {
                post.comments = post.comments.list || [];
            }
            // Ensure comments is an array
            if (!Array.isArray(post.comments)) {
                post.comments = [];
            }
            
            // Ensure likes has likedBy array
            if (post.likes && !post.likes.likedBy) {
                post.likes.likedBy = post.likes.users || [];
            }
            
            return post;
        });
        
        res.json({ 
            success: true, 
            posts: normalizedPosts,
            count: normalizedPosts.length
        });
    } catch (error) {
        console.error('Error fetching explore posts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching explore posts' 
        });
    }
});

// Get saved posts for a user
app.get('/api/explore/saved/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const savedPosts = await exploreCollection
            .find({ 
                status: "published",
                savedBy: userId 
            })
            .sort({ createdAt: -1 })
            .toArray();
        
        res.json({ 
            success: true, 
            posts: savedPosts,
            count: savedPosts.length
        });
    } catch (error) {
        console.error('Error fetching saved posts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching saved posts' 
        });
    }
});

// Like/Unlike an explore post
app.post('/api/explore/:postId/like', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        console.log('Post like request:', { postId, userId });

        if (!exploreCollection) {
            console.error('exploreCollection is undefined!');
            return res.status(500).json({
                success: false,
                message: 'Database collection not initialized'
            });
        }

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid post ID' 
            });
        }

        const post = await exploreCollection.findOne({ _id: new ObjectId(postId) });
        
        if (!post) {
            console.log('Post not found');
            return res.status(404).json({ 
                success: false, 
                message: 'Post not found' 
            });
        }

        console.log('Post found. Current likes:', post.likes.count);

        // Initialize likedBy array if it doesn't exist (for old posts)
        if (!post.likes.likedBy) {
            post.likes.likedBy = [];
        }

        // Check if user already liked
        const userIndex = post.likes.likedBy.indexOf(userId);
        
        if (userIndex > -1) {
            // Unlike - remove user from likedBy array
            post.likes.likedBy.splice(userIndex, 1);
            post.likes.count = Math.max(0, post.likes.count - 1);
            console.log('Post unliked. New likes:', post.likes.count);
        } else {
            // Like - add user to likedBy array
            post.likes.likedBy.push(userId);
            post.likes.count += 1;
            console.log('Post liked. New likes:', post.likes.count);
        }

        // Update the post
        await exploreCollection.updateOne(
            { _id: new ObjectId(postId) },
            { 
                $set: { 
                    likes: post.likes,
                    updatedAt: new Date()
                }
            }
        );

        console.log('Post updated. LikedBy array:', post.likes.likedBy);

        res.json({ 
            success: true, 
            likes: post.likes
        });
    } catch (error) {
        console.error('Error liking post:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            message: 'Error liking post',
            error: error.message
        });
    }
});

// Save/Unsave explore post
app.post('/api/explore/:postId/save', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        console.log('Save request for post:', postId, 'by user:', userId);

        const post = await exploreCollection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Initialize savedBy array if it doesn't exist
        if (!post.savedBy) {
            post.savedBy = [];
        }

        // Toggle save/unsave
        const isSaved = post.savedBy.includes(userId);
        if (isSaved) {
            // Unsave: remove userId from savedBy array
            post.savedBy = post.savedBy.filter(id => id !== userId);
            console.log('Unsaved post. New savedBy:', post.savedBy);
        } else {
            // Save: add userId to savedBy array
            post.savedBy.push(userId);
            console.log('Saved post. New savedBy:', post.savedBy);
        }

        // Update in database
        await exploreCollection.updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    savedBy: post.savedBy,
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            savedBy: post.savedBy,
            isSaved: !isSaved
        });

    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ success: false, message: 'Error saving post' });
    }
});

// Add comment to explore post
app.post('/api/explore/:postId/comment', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, userName, text } = req.body;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid post ID' 
            });
        }

        if (!text || !text.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Comment text is required' 
            });
        }

        const post = await exploreCollection.findOne({ _id: new ObjectId(postId) });
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: 'Post not found' 
            });
        }

        // Create new comment
        const newComment = {
            commentId: new ObjectId(),
            userId: userId,
            userName: userName,
            userInitial: userName.charAt(0).toUpperCase(),
            text: text.trim(),
            timestamp: new Date(),
            likes: 0,
            likedBy: []
        };

        // Add comment to array (direct array, not nested in .list)
        if (!Array.isArray(post.comments)) {
            post.comments = [];
        }
        post.comments.push(newComment);

        // Update the post
        await exploreCollection.updateOne(
            { _id: new ObjectId(postId) },
            { 
                $set: { 
                    comments: post.comments,
                    updatedAt: new Date()
                }
            }
        );

        res.json({ 
            success: true, 
            comments: post.comments
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding comment' 
        });
    }
});

// Like/Unlike a comment on an explore post
app.post('/api/explore/:postId/comment/:commentId/like', async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { userId } = req.body;

        console.log('Comment like request:', { postId, commentId, userId });

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid post ID' 
            });
        }

        const post = await exploreCollection.findOne({ _id: new ObjectId(postId) });
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: 'Post not found' 
            });
        }

        console.log('Post found, comments count:', post.comments.length);

        // Find the comment
        const comment = post.comments.find(c => 
            c.commentId.toString() === commentId || c._id?.toString() === commentId
        );

        if (!comment) {
            console.log('Comment not found. Available commentIds:', post.comments.map(c => c.commentId.toString()));
            return res.status(404).json({ 
                success: false, 
                message: 'Comment not found' 
            });
        }

        console.log('Comment found:', comment.commentId.toString());

        // Initialize likedBy array if it doesn't exist
        if (!comment.likedBy) {
            comment.likedBy = [];
        }

        // Toggle like
        const userIndex = comment.likedBy.indexOf(userId);
        if (userIndex > -1) {
            // User already liked, so unlike
            comment.likedBy.splice(userIndex, 1);
            comment.likes = Math.max(0, (comment.likes || 0) - 1);
        } else {
            // User hasn't liked, so add like
            comment.likedBy.push(userId);
            comment.likes = (comment.likes || 0) + 1;
        }

        // Update the post with modified comments
        await exploreCollection.updateOne(
            { _id: new ObjectId(postId) },
            { 
                $set: { 
                    comments: post.comments,
                    updatedAt: new Date()
                }
            }
        );

        console.log('Comment updated. New likes:', comment.likes, 'LikedBy:', comment.likedBy);

        res.json({ 
            success: true, 
            comments: post.comments
        });
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error liking comment' 
        });
    }
});

// Update trip
app.put('/api/feeds/:tripId', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const { tripId } = req.params;
        const updateData = req.body;
        
        if (!ObjectId.isValid(tripId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid trip ID' 
            });
        }
        
        // Add updated timestamp
        updateData.updatedAt = new Date();
        
        const result = await feedsCollection.updateOne(
            { _id: new ObjectId(tripId) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Trip not found' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Trip updated successfully'
        });
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating trip' 
        });
    }
});

// Join a trip (add member)
app.post('/api/feeds/:tripId/join', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const { tripId } = req.params;
        const { userId, name, username, avatar } = req.body;
        
        if (!ObjectId.isValid(tripId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid trip ID' 
            });
        }
        
        const trip = await feedsCollection.findOne({ _id: new ObjectId(tripId) });
        
        if (!trip) {
            return res.status(404).json({ 
                success: false, 
                message: 'Trip not found' 
            });
        }
        
        // Check if already a member - compare both as strings
        const userIdStr = userId.toString();
        const isMember = trip.members.some(m => m.userId.toString() === userIdStr);
        if (isMember) {
            return res.status(400).json({ 
                success: false, 
                message: 'Already joined this trip' 
            });
        }
        
        // Check capacity
        if (trip.capacity.available <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Trip is full' 
            });
        }
        
        // Add member - store userId as ObjectId if valid, otherwise as string
        let userObjectId;
        try {
            userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
        } catch (e) {
            userObjectId = userId;
        }
        
        const newMember = {
            userId: userObjectId,
            name,
            username,
            avatar: avatar || name.charAt(0).toUpperCase(),
            joinedAt: new Date(),
            joinedDisplay: 'Just now'
        };
        
        // Calculate new capacity values
        const newBooked = trip.capacity.booked + 1;
        const newAvailable = trip.capacity.available - 1;
        
        const result = await feedsCollection.updateOne(
            { _id: new ObjectId(tripId) },
            { 
                $push: { members: newMember },
                $set: { 
                    'capacity.booked': newBooked,
                    'capacity.available': newAvailable,
                    'capacity.display': `${newBooked}/${trip.capacity.total} Riders`,
                    updatedAt: new Date()
                }
            }
        );
        
        if (result.modifiedCount === 0) {
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to join trip' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Successfully joined the trip'
        });
    } catch (error) {
        console.error('Error joining trip:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error joining trip: ' + error.message 
        });
    }
});

// Leave a trip (remove member)
app.delete('/api/feeds/:tripId/leave', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const { tripId } = req.params;
        const { userId } = req.body;
        
        if (!ObjectId.isValid(tripId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid trip ID' 
            });
        }
        
        // Try to convert userId to ObjectId if it's valid, otherwise use as string
        let userIdQuery;
        try {
            userIdQuery = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
        } catch (e) {
            userIdQuery = userId;
        }
        
        // First get the trip to calculate new display value
        const trip = await feedsCollection.findOne({ _id: new ObjectId(tripId) });
        
        if (!trip) {
            return res.status(404).json({ 
                success: false, 
                message: 'Trip not found' 
            });
        }
        
        // Calculate new capacity values
        const newBooked = trip.capacity.booked - 1;
        const newAvailable = trip.capacity.available + 1;
        
        const result = await feedsCollection.updateOne(
            { _id: new ObjectId(tripId) },
            { 
                $pull: { members: { userId: userIdQuery } },
                $set: { 
                    'capacity.booked': newBooked,
                    'capacity.available': newAvailable,
                    'capacity.display': `${newBooked}/${trip.capacity.total} Riders`,
                    updatedAt: new Date()
                }
            }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Trip not found' 
            });
        }
        
        if (result.modifiedCount === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'You are not a member of this trip' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Successfully left the trip'
        });
    } catch (error) {
        console.error('Error leaving trip:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error leaving trip: ' + error.message 
        });
    }
});

// Get my trips (as host)
app.get('/api/feeds/my-trips/:userId', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const { userId } = req.params;
        
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid user ID' 
            });
        }
        
        const trips = await feedsCollection
            .find({ 'host.userId': new ObjectId(userId) })
            .sort({ 'dates.start': 1 })
            .toArray();
        
        res.json({ 
            success: true, 
            trips,
            count: trips.length
        });
    } catch (error) {
        console.error('Error fetching my trips:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching my trips' 
        });
    }
});

// Get joined trips (as member)
app.get('/api/feeds/joined/:userId', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const { userId } = req.params;
        
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid user ID' 
            });
        }
        
        const trips = await feedsCollection
            .find({ 'members.userId': new ObjectId(userId) })
            .sort({ 'dates.start': 1 })
            .toArray();
        
        res.json({ 
            success: true, 
            trips,
            count: trips.length
        });
    } catch (error) {
        console.error('Error fetching joined trips:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching joined trips' 
        });
    }
});

// ============= CHATBOT API ENDPOINTS =============

// OpenRouter API configuration
const OPENROUTER_API_KEY = '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';

// Chat with AI assistant
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory, chatMode, userName } = req.body;
        
        if (!message || !message.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Message is required' 
            });
        }

        console.log(`💬 Chat request received (${chatMode || 'general'}):`, message.substring(0, 100) + '...');

        // Different system prompts based on chat mode
        let systemPrompt = '';
        
        if (chatMode === 'itinerary') {
            systemPrompt = `You are **AdventureTripPlanner-GPT**, a conversational motorcycle itinerary planner that designs custom, day-by-day adventure rides.

### CRITICAL RULES:
- NEVER repeat what the user just said
- NEVER write "1️⃣ Origin & Destination: [user's answer]" 
- NEVER echo back their response with question numbers
- Just acknowledge briefly and move to next question
- Be concise and natural

### YOUR BEHAVIOR:
- Start with: "Hey ${userName || 'Rider'}! 🏍️ 🔥\nWhere are you planning to ride from and to?"
- After user answers, present route options in this EXACT format:

Awesome, ${userName || 'Rider'}! 🏍️ 🔥
Arekere, Bangalore → Rajasthan — that's one royal road trip through deserts, forts, and pure freedom! �

🗺️ **Route Options — Rajasthan Expedition**

🏛️ **Western Circuit (11–13 Days)**
Bangalore → Pune → Ahmedabad → Jaisalmer → Jodhpur → Udaipur
💥 Desert dunes, forts & sunsets — the classic route

🏛️ **Royal Heritage Loop (13–15 Days)**
Bangalore → Jaipur → Pushkar → Jodhpur → Udaipur → Mount Abu
🏰 Cultural vibes, palaces, and scenic hill break

🔥 **Ultimate Rajasthan Ride (15–17 Days)**
Full west-to-east sweep — Jaisalmer → Bikaner → Jaipur → Udaipur
🔥 For hardcore riders who want it all — desert to palace

Which route are we locking in, rider? 🏴

- After route selection, ask NUMBERED questions ONE at a time:

**Question Format (IMPORTANT - DO NOT repeat user's previous answer):**
Awesome! 🏍️ 🔥

[Question context in one line]

• **Option 1** — description 🔥
• **Option 2** — description 🏍️  
• **Option 3** — description 💪

Which one?

**EXAMPLES OF WHAT NOT TO DO:**
❌ "1️⃣ Riding Hours per Day: 8-9 hours" (Don't repeat their answer with question number)
❌ "Kollam, Kerala to Manali, Himachal Pradesh 1️⃣ Riding Hours..." (Don't include previous answer)

**EXAMPLES OF WHAT TO DO:**
✅ "Awesome! 🏍️ 🔥 Kollam to Manali, that's a long ride! 🏍️"
✅ "Perfect! 🏍️ [Next question directly]"

### QUESTION SEQUENCE:
1. **Riding Hours per Day**
   • 6–7 hrs/day — relaxed & scenic 🌴
   • 8–9 hrs/day — balanced adventure 🏍️
   • 10+ hrs/day — hardcore endurance 💪

2. **Experience Type**
   • 🌄 Scenic — peaceful routes, lakes, and hill views
   • 🏛️ Cultural — heritage cities, forts, local food & traditions
   • 🔥 Ultimate Adventure — desert off-roads, long rides, full challenge

3. **Budget Level**
   • 💸 Budget: ₹1000–₹2500/night (simple stays, local dhabas)
   • 🏠 Mid: ₹3000–₹4500/night (comfortable hotels, good cafes)
   • 💎 Premium: ₹5000–₹8000+/night (resorts, fine dining, premium stays)

4. **Bike Model** (Ask: "Which bike are you riding for this expedition? (Need tank size & mileage ⛽)")
   Examples:
   • 🏍️ Royal Enfield Himalayan (15L, 28 km/L)
   • 🏍️ BMW G310 GS (11L, 30 km/L)
   • 🏍️ Classic 350 (13L, 35 km/L)

5. **Solo or Group**
   • Solo ride — freedom, flexible pacing 🏍️
   • Group — shared experience, safety 👥

6. **Start Date** (Ask: "When are you planning to start? (Need for weather & timing �️)")

### AFTER ALL QUESTIONS - CONFIRMATION FORMAT:
Perfect! 🏍️ — [confirm trip type]
[brief exciting description of the trip]

📍 **Route Locked:**
[City list with arrows]
⏱️ **Duration:** [X] Days
💫 **Vibe:** [Description]

Once you confirm these, I'll generate a complete day-wise itinerary with all details!

**1.** 💰 **Budget level** — Roughly how much are you planning to spend?
**2.** 🏍️ **Riding hours per day** — How long do you prefer to ride daily?
**3.** 🍽️ **Meal preference** — Veg / Non-Veg / Mixed?
**4.** 🎯 **Experience focus** — Scenic & Relaxed / Adventure & Off-road / Fast & Efficient ride?
**5.** ⛽ **Fuel/refuel stops and cost estimation too?**

Once you confirm these, I'll generate the complete day-wise itinerary!

### ITINERARY FORMAT (COMPACT):
🗺️ **[X]-Day Day-by-Day (compact card style)**
**Start:** [Date] — **End:** [Date] ([X] days)
**Pace:** [X] hrs riding/day • **Budget stays** • **Solo** • **Scenic + Adventure mix**

�️ **Day 1 — [Date]: [City] → [City] (~[X] km / ~[X] hrs)**
• **Breakfast:** [Place] dhaba near [City] — ₹200
• **Lunch:** [Place] restaurant/café — ₹350
• **Refuel after** —₹[X] (80L/₹[X]ECS)
• **Stay:** Budget hotel, [City] — ₹1,200
• **Notes:** [Quick note about route/weather]
• **Daily est:** ₹1,900

[Repeat for each day with VERY brief format]

### TRIP SUMMARY (COMPACT):
💰 **Trip Summary — [Trip Name] ([X] days)**
• Total Distance: ~[X] km
• Estimated Fuel: ₹[X]
• Accommodation: ₹[X]
• Meals: ₹[X]
• Misc: ₹[X]
• +10% Buffer: ₹[X]
✅ **Grand Total:** ₹[X]

⚠️ **Quick Safety Notes**
• Check weather forecasts 🌦️
• Carry spare fuel & cash ⛽
• Waterproof luggage 🎒

[Ask if they want to save this trip]

### IMPORTANT RULES:
- NO "Thought for X seconds" or thinking indicators
- Keep responses concise and engaging
- Use emojis naturally throughout
- Present options as bulleted lists
- Confirm user's choices before moving to next question
- Keep itinerary compact - max 3-4 lines per day
- Use separators (---) between sections`;
        } else {
            // Travel-related mode
            systemPrompt = `You are a helpful motorcycle trip planning assistant for "ReVora" platform.
Your expertise includes:
- Planning motorcycle routes across India
- Recommending scenic riding destinations
- Suggesting accommodations for bikers
- Providing weather and road condition information
- Advising on bike maintenance and safety
- Helping with itinerary planning and budgeting
- Sharing local attractions and must-visit spots

Be friendly, enthusiastic about motorcycling, and provide practical, actionable advice.
Keep responses concise but informative. Use emojis to make it engaging.`;
        }

        // Build messages array for OpenRouter
        const messages = [
            {
                role: "system",
                content: systemPrompt
            }
        ];

        // Add conversation history if provided
        if (conversationHistory && Array.isArray(conversationHistory)) {
            conversationHistory.forEach(msg => {
                messages.push({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.content
                });
            });
        }

        // Add current message
        messages.push({
            role: "user",
            content: message
        });

        console.log('📡 Calling OpenRouter API...');

        // Call OpenRouter API with timeout and retry logic
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3001',
                    'X-Title': 'ReVora Chatbot'
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-3.2-3b-instruct:free',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1500  // Increased for longer itinerary responses
                }),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ OpenRouter API error:', errorData);
                throw new Error(`OpenRouter API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ OpenRouter response received');

            const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

            res.json({ 
                success: true, 
                message: aiMessage,
                usage: data.usage
            });
        } catch (fetchError) {
            clearTimeout(timeout);
            
            if (fetchError.name === 'AbortError') {
                console.error('❌ Request timeout after 30 seconds');
                throw new Error('Request took too long. Please try again with a shorter question.');
            }
            throw fetchError;
        }

    } catch (error) {
        console.error('❌ Error in chat endpoint:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error processing chat request' 
        });
    }
});

// ============= END CHATBOT API ENDPOINTS =============

// ============= END FEEDS API ENDPOINTS =============

// Start server
connectToMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Database: ${DB_NAME}`);
        console.log(`Collection: ${COLLECTION_NAME}`);
    });
});

// Handle uncaught errors to prevent server crashes
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.log('⚠️ Server continuing to run...');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    console.log('⚠️ Server continuing to run...');
});
