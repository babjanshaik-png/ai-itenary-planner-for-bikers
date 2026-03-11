const { MongoClient, ObjectId } = require('mongodb');

async function checkTripData() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    try {
        const db = client.db('login');
        const trip = await db.collection('feeds').findOne({ 
            _id: new ObjectId('6905cf346870492811fa65c2') 
        });
        
        if (!trip) {
            console.log('❌ Trip not found');
            return;
        }
        
        console.log('\n📍 Trip Data:');
        console.log('Title:', trip.title);
        console.log('\n👥 Capacity:');
        console.log('  Total:', trip.capacity.total);
        console.log('  Booked:', trip.capacity.booked);
        console.log('  Available:', trip.capacity.available);
        console.log('\n👤 Members (', trip.members.length, '):');
        trip.members.forEach((m, i) => {
            console.log(`  ${i + 1}. ${m.name} (@${m.username}) - userId: ${m.userId}`);
        });
        
    } finally {
        await client.close();
    }
}

checkTripData().catch(console.error);
