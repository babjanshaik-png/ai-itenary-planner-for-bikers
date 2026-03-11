const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'login';

async function checkItinerary() {
    const client = new MongoClient(MONGO_URI);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        
        const db = client.db(DB_NAME);
        const feedsCollection = db.collection('feeds');
        
        const trip = await feedsCollection.findOne({ title: "Himalayan Dawn Run 🏔️" });
        
        if (!trip) {
            console.log('❌ Trip not found');
            return;
        }
        
        console.log(`📊 Trip ID: ${trip._id}`);
        console.log(`📊 Total Days: ${trip.itinerary.length}\n`);
        
        // Show Day 1 details
        const day1 = trip.itinerary[0];
        console.log('📅 Day 1 Details:');
        console.log(`   Title: ${day1.title}`);
        console.log(`   Activities:`);
        day1.activities.forEach(act => console.log(`     ${act}`));
        console.log(`   Breakfast: ${day1.meals.breakfast.venue} - ₹${day1.meals.breakfast.cost}`);
        console.log(`   Lunch: ${day1.meals.lunch.venue} - ₹${day1.meals.lunch.cost}`);
        console.log(`   Dinner: ${day1.meals.dinner.venue} - ₹${day1.meals.dinner.cost}`);
        console.log(`   Fuel: ${day1.fuel.location} - ${day1.fuel.liters}L × ₹103 = ₹${day1.fuel.cost}`);
        console.log(`   Stay: ${day1.accommodation.type} - ₹${day1.accommodation.cost}`);
        console.log(`   Daily Total: ₹${day1.dailyTotal}\n`);
        
        // Show Day 6 activities
        const day6 = trip.itinerary[5];
        console.log('📅 Day 6 Activities:');
        day6.activities.forEach(act => console.log(`   ${act}`));
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

checkItinerary();
