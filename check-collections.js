const { MongoClient } = require('mongodb');

async function checkCollections() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    try {
        const db = client.db('login');
        const collections = await db.listCollections().toArray();
        
        console.log('\n Collections in login database:');
        collections.forEach(col => {
            console.log(`  - ${col.name}`);
        });
        
        // Check if newexplore exists
        const newexploreExists = collections.some(col => col.name === 'newexplore');
        console.log(`\n newexplore collection exists: ${newexploreExists}`);
        
        if (newexploreExists) {
            const count = await db.collection('newexplore').countDocuments();
            console.log(` Documents in newexplore: ${count}`);
        }
        
    } finally {
        await client.close();
    }
}

checkCollections().catch(console.error);
