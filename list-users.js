const { MongoClient } = require('mongodb');

async function listUsers() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    try {
        const db = client.db('login');
        const users = await db.collection('user').find({}).limit(5).toArray();
        
        console.log('\n👥 Registered Users:');
        users.forEach((u, i) => {
            console.log(`  ${i + 1}. ${u.name} (@${u.username}) - ID: ${u._id}`);
        });
        
    } finally {
        await client.close();
    }
}

listUsers().catch(console.error);
