// Script to check explore collection data
const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'login';
const COLLECTION_NAME = 'newexplore';

async function checkExploreData() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // List all databases
    const adminDb = client.db().admin();
    const dbList = await adminDb.listDatabases();
    console.log('\n📚 Available databases:');
    dbList.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    
    // List all collections in 'login' database
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Collections in '${DB_NAME}' database:`);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check explore collection
    const exploreCollection = db.collection(COLLECTION_NAME);
    const count = await exploreCollection.countDocuments();
    console.log(`\n📊 Documents in '${COLLECTION_NAME}' collection: ${count}`);
    
    if (count > 0) {
      console.log('\n📝 All posts in explore collection:');
      const posts = await exploreCollection.find({}).toArray();
      posts.forEach((post, index) => {
        console.log(`\n${index + 1}. ${post.title}`);
        console.log(`   Rider: ${post.riderName}`);
        console.log(`   Rating: ${post.rating} stars`);
        console.log(`   Route: ${post.route}`);
        console.log(`   Likes: ${post.likes.count}`);
      });
    } else {
      console.log('⚠️  No documents found in explore collection');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n👋 Connection closed');
  }
}

checkExploreData();
