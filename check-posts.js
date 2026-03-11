const { MongoClient } = require('mongodb');

async function checkPosts() {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    try {
        const db = client.db('login');
        const posts = await db.collection('newexplore').find({}).toArray();
        
        console.log('\n📊 Posts in newexplore collection:', posts.length);
        
        posts.forEach((p, i) => {
            console.log(`\n${i+1}. ${p.title}`);
            console.log(`   Route: ${p.route}`);
            console.log(`   By: ${p.riderName}`);
            console.log(`   Rating: ${p.rating} ⭐`);
            console.log(`   Likes: ${p.likes.count} 👍`);
        });
        
    } finally {
        await client.close();
    }
}

checkPosts().catch(console.error);
