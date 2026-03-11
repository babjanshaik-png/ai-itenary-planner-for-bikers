const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'login';

// Mock user data
const mockUsers = [
    { id: 'user1', name: 'Arjun Sharma', username: 'arjun_rides', initial: 'A', color: '#FF6B35' },
    { id: 'user2', name: 'Priya Patel', username: 'priya_wanderer', initial: 'P', color: '#4ECDC4' },
    { id: 'user3', name: 'Vikram Singh', username: 'vikram_royal', initial: 'V', color: '#95E1D3' },
    { id: 'user4', name: 'Ananya Reddy', username: 'ananya_explorer', initial: 'A', color: '#F38181' },
    { id: 'user5', name: 'Rajesh Kumar', username: 'rajesh_nomad', initial: 'R', color: '#AA96DA' },
    { id: 'user6', name: 'Sneha Gupta', username: 'sneha_adventure', initial: 'S', color: '#FCBAD3' },
    { id: 'user7', name: 'Karthik Iyer', username: 'karthik_coastal', initial: 'K', color: '#A8D8EA' },
    { id: 'user8', name: 'Meera Nair', username: 'meera_mountains', initial: 'M', color: '#FFD3B6' },
    { id: 'user9', name: 'Aditya Verma', username: 'aditya_highway', initial: 'A', color: '#FFAAA5' },
    { id: 'user10', name: 'Divya Menon', username: 'divya_trails', initial: 'D', color: '#FF8B94' },
];

// Trip data with full descriptions
const tripData = [
    {
        title: "Epic Leh-Ladakh Expedition",
        fromLocation: "Manali, Himachal Pradesh, India",
        toLocation: "Leh, Ladakh, India",
        days: "12",
        totalRiders: 6,
        rating: 5,
        description: "Just completed the most incredible 12-day journey from Manali to Leh! The high-altitude passes were breathtaking - Khardung La, Chang La, and Tanglang La offered views that pictures can't capture. Must-visit: Pangong Lake at sunrise (absolutely magical!), Nubra Valley for the double-humped camels, and Magnetic Hill. Don't miss staying in a homestay at Turtuk for authentic Balti culture. Skip the overpriced cafes in Leh market - local dhabas have better food! Avoid traveling in monsoon (July-August). Best time: June or September for clear roads and stunning landscapes."
    },
    {
        title: "Coastal Paradise: Goa to Gokarna",
        fromLocation: "Goa, India",
        toLocation: "Gokarna, Karnataka, India",
        days: "5",
        totalRiders: 4,
        rating: 4,
        description: "What a refreshing coastal ride! Started from North Goa and cruised through scenic coastal highways to Gokarna. The beaches here are pristine - Om Beach, Half Moon Beach, and Paradise Beach are must-visits for sunset. Try the fresh seafood at Namaste Cafe. Don't miss the early morning trek to Paradise Beach, it's worth every step! Skip the crowded Kudle Beach during weekends. The shacks there are overpriced anyway. Best visited between October and March when the weather is perfect. Rode mostly on my Royal Enfield and the roads were smooth throughout!"
    },
    {
        title: "Spiti Valley Winter Adventure",
        fromLocation: "Shimla, Himachal Pradesh, India",
        toLocation: "Kaza, Spiti Valley, India",
        days: "10",
        totalRiders: 5,
        rating: 5,
        description: "Conquered the frozen Spiti Valley in January! This winter ride tested our limits but rewarded us with unmatched beauty. Key Monastery covered in snow was surreal. Must-visit: Chandratal Lake (frozen solid!), Dhankar Monastery, and Tabo Monastery. Stay at Kaza for acclimatization. Try the local thukpa and momos - they're lifesavers in the cold! Skip Chicham Bridge if you're not comfortable with heights. Roads are treacherous, carry tire chains! Avoid if you're not an experienced winter rider. Best for adventure junkies seeking ultimate challenge. The clear night skies with millions of stars made every cold night worth it!"
    },
    {
        title: "Northeast Discovery: Meghalaya",
        fromLocation: "Guwahati, Assam, India",
        toLocation: "Cherrapunji, Meghalaya, India",
        days: "7",
        totalRiders: 8,
        rating: 5,
        description: "Meghalaya lived up to its name as 'Abode of Clouds'! Our 7-day expedition through the wettest place on earth was absolutely magical. Must-see: Double Decker Living Root Bridge (hiking down is tough but incredible!), Nohkalikai Falls, and Mawlynnong - Asia's cleanest village. The crystal-clear Dawki River was mind-blowing! Try the local Jadoh rice and pork dishes. Skip the overcrowded viewpoints near Shillong city center. Don't miss exploring the caves - Mawsmai Cave is beginner-friendly. Best time: October to May for clear views. Monsoon makes it mystical but roads become dangerous!"
    },
    {
        title: "Rajasthan Desert Trail",
        fromLocation: "Jaipur, Rajasthan, India",
        toLocation: "Jaisalmer, Rajasthan, India",
        days: "6",
        totalRiders: 7,
        rating: 4,
        description: "Royal Rajasthan never disappoints! Our desert trail from Pink City to Golden City was filled with forts, palaces, and endless sand dunes. Must-visit: Jaisalmer Fort (still inhabited!), Sam Sand Dunes for sunset camel safari, and Kuldhara abandoned village. Try the Dal Baati Churma and Ker Sangri - authentic Rajasthani flavors! Skip the touristy laser shows at Amer Fort - overpriced and underwhelming. Don't miss shopping for leather goods in Jodhpur. Best time: November to February - summers are brutal here. The desert night stay under stars was unforgettable!"
    },
    {
        title: "South India Temple Circuit",
        fromLocation: "Chennai, Tamil Nadu, India",
        toLocation: "Madurai, Tamil Nadu, India",
        days: "8",
        totalRiders: 5,
        rating: 4,
        description: "Spiritual journey through Tamil Nadu's magnificent temples! Visited Mahabalipuram shore temples, Chidambaram, Thanjavur, and finally the breathtaking Meenakshi Temple in Madurai. The architecture is mind-boggling! Must-experience: Evening aarti at Madurai temple, Bharatanatyam performance at Chidambaram, and UNESCO sites at Mahabalipuram. Try authentic Chettinad cuisine - fiery and delicious! Skip the expensive temple guides, locals are friendly and helpful. Don't miss the Brihadeeswarar Temple at Thanjavur. Best visited during temple festivals (check dates). The 1000-pillar hall was absolutely stunning!"
    },
    {
        title: "Western Ghats Monsoon Ride",
        fromLocation: "Mumbai, Maharashtra, India",
        toLocation: "Goa, India",
        days: "4",
        totalRiders: 6,
        rating: 5,
        description: "Rode through the monsoon-drenched Western Ghats and it was phenomenal! Every turn revealed a new waterfall. The Nh66 coastal route was slippery but stunning. Must-stop: Malvan for authentic seafood, Sindhudurg Fort, and countless hidden waterfalls along the way. Try the solkadhi drink - perfect for hot weather! Skip riding during heavy downpours, roads become very dangerous. Don't miss the sunrise at Ratnagiri beach. Best during early monsoon (June) or just after (September). Make sure your bike has good tires! The lush greenery made every wet moment worthwhile. Absolutely thrilling experience!"
    },
    {
        title: "Konkan Coast Exploration",
        fromLocation: "Mumbai, Maharashtra, India",
        toLocation: "Mangalore, Karnataka, India",
        days: "7",
        totalRiders: 4,
        rating: 4,
        description: "The Konkan coastline is India's best-kept secret! 600km of pristine beaches, coconut groves, and amazing seafood. Must-visit: Ganapatipule Beach (clean and serene), Vengurla's rocky beaches, and Murudeshwar temple with massive Shiva statue. Try the fresh kokum sherbet and fish thali everywhere! Skip the overhyped Tarkarli beach - neighboring beaches are better and less crowded. Don't miss the backwaters boat ride near Kumta. Best time: October to March. Roads are excellent throughout. The route is perfect for relaxed cruising with numerous food stops!"
    },
    {
        title: "Himalayan High: Manali to Spiti",
        fromLocation: "Manali, Himachal Pradesh, India",
        toLocation: "Spiti Valley, India",
        days: "9",
        totalRiders: 6,
        rating: 5,
        description: "Challenging but incredibly rewarding route through high Himalayas! Crossed Rohtang Pass, visited Losar, Kaza, and explored remote villages. Must-do: Langza village for fossil hunting, Pin Valley for wildlife spotting, and Komic - world's highest motorable village with monastery. Try the local barley bread and butter tea! Skip Gramphu to Batal stretch if bike isn't adventure-ready - it's extremely rough. Carry oxygen cylinders for altitude sickness. Best in July-August when roads are clear. The barren beauty of Spiti is unlike anywhere in India. Life-changing experience!"
    },
    {
        title: "Golden Triangle with Twist",
        fromLocation: "Delhi, India",
        toLocation: "Udaipur, Rajasthan, India",
        days: "6",
        totalRiders: 8,
        rating: 4,
        description: "Classic Delhi-Agra-Jaipur route with a royal twist to Udaipur! Taj Mahal at sunrise is mandatory, Amer Fort in Jaipur was spectacular. But Udaipur stole the show - City Palace, Lake Pichola boat ride, and rooftop dining were magical! Must-try: Laal Maas in Jaipur, chaat in Agra, and Rajasthani thali in Udaipur. Skip the commercial camel rides in Jaipur - they're sad. Don't miss the Fatehpur Sikri detour from Agra. Best time: October to March. Roads are excellent with great highway options. Perfect first-time long-distance ride!"
    },
    {
        title: "Uttarakhand Hill Paradise",
        fromLocation: "Dehradun, Uttarakhand, India",
        toLocation: "Nainital, Uttarakhand, India",
        days: "5",
        totalRiders: 5,
        rating: 4,
        description: "Serene journey through Uttarakhand's beautiful hill stations! Visited Mussoorie, Dhanaulti, Bhimtal, and Nainital. The lakes, valleys, and mountain views were refreshing. Must-visit: Kempty Falls, Snow View Point in Nainital, and Eco Cave Gardens. Try the local Bal Mithai and Singori sweets - delicious! Skip the Mall Road shopping in peak season - too crowded. Don't miss boating in Naini Lake early morning. Best time: April-June or September-November. Roads have good ghats but watch for traffic jams during weekends. Perfect weekend getaway from Delhi!"
    },
    {
        title: "Karnataka Coffee Country Ride",
        fromLocation: "Bangalore, Karnataka, India",
        toLocation: "Coorg, Karnataka, India",
        days: "4",
        totalRiders: 4,
        rating: 5,
        description: "Escaped to the coffee paradise of Coorg! Rode through endless coffee plantations, spice gardens, and misty hills. The aroma of fresh coffee everywhere was intoxicating! Must-visit: Abbey Falls, Raja's Seat for sunset, and Dubare Elephant Camp. Try the Pandi Curry (pork) and fresh coffee at estate homestays - absolutely divine! Skip the commercial coffee factory tours - homestay owners give better insights. Don't miss trekking to Tadiandamol peak. Best during monsoon (July-September) or winter. Roads are smooth and scenic. This short trip was incredibly rejuvenating!"
    },
    {
        title: "Sikkim Silk Route Adventure",
        fromLocation: "Gangtok, Sikkim, India",
        toLocation: "Zuluk, Sikkim, India",
        days: "6",
        totalRiders: 5,
        rating: 5,
        description: "Conquered the legendary Silk Route of Sikkim! The zigzag roads with 32+ hairpin bends were thrilling. Sunrise over Kanchenjunga from Thambi View Point was spectacular! Must-see: Nathang Valley (Ladakh of East India), Tsomgo Lake, and Baba Harbhajan Singh Temple. Try the momos and thukpa at local homes! Skip the crowded MG Marg in Gangtok - explore local markets instead. Don't miss staying overnight at Zuluk for the sunrise. Best time: April-May or October-November. Carry permits in advance. The views from every hairpin bend were postcard-perfect!"
    },
    {
        title: "Rann of Kutch White Desert",
        fromLocation: "Ahmedabad, Gujarat, India",
        toLocation: "Rann of Kutch, Gujarat, India",
        days: "5",
        totalRiders: 6,
        rating: 4,
        description: "Witnessed the surreal white desert of Kutch during Rann Utsav! The vast expanse of white salt desert under full moon was otherworldly. Must-experience: Sunset at White Rann, visiting Kala Dungar (Black Hill), and exploring Bhuj's museums. Try the Gujarati thali and local sweets - they're amazing! Skip the expensive tent city packages - nearby villages have better authentic stays. Don't miss shopping for Kutchi embroidery work. Best during Rann Utsav (November-February). Roads are straight and easy. The cultural programs in the evening were fantastic!"
    },
    {
        title: "Kerala Backwaters & Hills",
        fromLocation: "Kochi, Kerala, India",
        toLocation: "Munnar, Kerala, India",
        days: "6",
        totalRiders: 4,
        rating: 5,
        description: "God's Own Country lived up to its reputation! From backwaters of Kochi to tea gardens of Munnar - pure bliss. Must-visit: Athirapally Falls, Tata Tea Museum, Mattupetty Dam, and Echo Point in Munnar. Try the appam with stew, Kerala fish curry, and fresh toddy! Skip the crowded houseboats in Alleppey - opt for smaller canoe rides instead. Don't miss the sunrise at Top Station. Best time: September-May for pleasant weather. Roads through tea plantations are smooth and scenic. The cool climate and greenery were so refreshing! Absolutely loved every moment of this trip."
    }
];


// Generate comments for a post
function generateComments(tripData, postAuthor) {
    const commentTemplates = [
        { text: "Wow! This looks absolutely stunning! 😍", likes: Math.floor(Math.random() * 15) },
        { text: "Added to my bucket list! Thanks for sharing 🏍️", likes: Math.floor(Math.random() * 20) },
        { text: "What bike did you ride?", likes: Math.floor(Math.random() * 8) },
        { text: "The photos are incredible! Must have been an amazing experience 🔥", likes: Math.floor(Math.random() * 12) },
        { text: "How were the road conditions?", likes: Math.floor(Math.random() * 6) },
        { text: "This is my dream trip! Hope to do it next year 🙌", likes: Math.floor(Math.random() * 18) },
        { text: "Thanks for the recommendations! Very helpful 👍", likes: Math.floor(Math.random() * 10) },
        { text: "Looks epic! Count me in for the next one! 🤘", likes: Math.floor(Math.random() * 14) },
    ];

    const numComments = Math.floor(Math.random() * 5) + 2; // 2-6 comments
    const selectedComments = [];
    
    for (let i = 0; i < numComments; i++) {
        const template = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
        const commenter = mockUsers.filter(u => u.id !== postAuthor.id)[Math.floor(Math.random() * 9)];
        
        selectedComments.push({
            commentId: new ObjectId().toString(),
            userId: commenter.id,
            userName: commenter.name,
            userInitial: commenter.initial,
            text: template.text,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within last 7 days
            likes: template.likes
        });
    }
    
    return selectedComments;
}

// Main function to generate and insert posts
async function generateMockPosts() {
    const client = await MongoClient.connect(MONGO_URI);
    console.log('Connected to MongoDB\n');
    
    try {
        const db = client.db(DB_NAME);
        const collection = db.collection('newexplore');
        
        // Clear existing posts
        await collection.deleteMany({});
        console.log('✅ Cleared existing posts\n');
        
        const posts = [];
        
        for (let i = 0; i < tripData.length; i++) {
            const trip = tripData[i];
            const author = mockUsers[i % mockUsers.length];
            
            console.log(`[${i + 1}/15] Creating: ${trip.title}`);
            console.log(`   📍 ${trip.fromLocation.split(',')[0]} → ${trip.toLocation.split(',')[0]}`);
            console.log(`   👤 By: ${author.name}`);
            
            // Generate comments
            const comments = generateComments(trip, author);
            
            // Calculate likes
            const likesCount = Math.floor(Math.random() * 50) + 10; // 10-60 likes
            const likedBy = [];
            for (let j = 0; j < likesCount; j++) {
                const liker = mockUsers[Math.floor(Math.random() * mockUsers.length)];
                if (!likedBy.includes(liker.id)) {
                    likedBy.push(liker.id);
                }
            }
            
            const post = {
                riderId: author.id,
                riderName: author.name,
                riderInitial: author.initial,
                riderProfileColor: author.color,
                title: trip.title,
                description: trip.description,
                rating: trip.rating,
                route: `${trip.fromLocation.split(',')[0]} to ${trip.toLocation.split(',')[0]}`,
                fromLocation: trip.fromLocation,
                toLocation: trip.toLocation,
                days: trip.days,
                totalRiders: trip.totalRiders,
                mainPhoto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/gA8A",
                likes: {
                    count: likedBy.length,
                    likedBy: likedBy
                },
                comments: comments,
                tags: ["adventure", "mountains", "scenic"],
                status: "published",
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random within last 30 days
                updatedAt: new Date()
            };
            
            posts.push(post);
            console.log(`   ✅ ${likedBy.length} likes, ${comments.length} comments\n`);
        }
        
        // Insert all posts
        const result = await collection.insertMany(posts);
        console.log(`\n🎉 Successfully inserted ${result.insertedCount} mock posts!\n`);
        
        // Display summary
        console.log('📊 Summary:');
        console.log(`   Total Posts: ${posts.length}`);
        console.log(`   Total Likes: ${posts.reduce((sum, p) => sum + p.likes.count, 0)}`);
        console.log(`   Total Comments: ${posts.reduce((sum, p) => sum + p.comments.length, 0)}`);
        console.log(`   Authors: ${mockUsers.length} unique users`);
        
    } catch (error) {
        console.error('❌ Error generating posts:', error);
    } finally {
        await client.close();
        console.log('\n✅ Database connection closed\n');
    }
}

// Run the script
console.log('🚀 Generating 15 Mock Posts for Revora Explore Page\n');
console.log('=' .repeat(60) + '\n');
generateMockPosts().catch(console.error);
