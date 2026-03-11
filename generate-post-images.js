const { MongoClient } = require('mongodb');

// Free Unsplash image URLs for different locations
const locationImages = {
  'Leh-Ladakh': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', // Ladakh mountains
  'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', // Goa beach
  'Spiti': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', // Spiti Valley
  'Meghalaya': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80', // Meghalaya waterfalls
  'Rajasthan': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', // Rajasthan desert
  'Tamil Nadu': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', // Tamil Nadu temple
  'Western Ghats': 'https://images.unsplash.com/photo-1580139598839-67cfcdf5e641?w=800&q=80', // Western Ghats
  'Konkan': 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80', // Konkan coast
  'Manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', // Manali mountains
  'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', // Delhi monuments
  'Uttarakhand': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', // Uttarakhand hills
  'Karnataka': 'https://images.unsplash.com/photo-1580408921550-c9f40e4e1b56?w=800&q=80', // Karnataka coffee estates
  'Sikkim': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', // Sikkim mountains
  'Gujarat': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80', // Gujarat Rann
  'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', // Kerala backwaters
};

// Specific high-quality images for each trip
const tripImages = {
  'Epic Leh-Ladakh Expedition': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Coastal Paradise: Goa to Gokarna': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  'Spiti Valley Winter Adventure': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Northeast Discovery: Meghalaya': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80',
  'Rajasthan Desert Trail': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'South India Temple Circuit': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
  'Western Ghats Monsoon Ride': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Konkan Coast Exploration': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  'Himalayan High: Manali to Spiti': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Golden Triangle with Twist': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  'Uttarakhand Hill Paradise': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Karnataka Coffee Country Ride': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
  'Sikkim Silk Route Adventure': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Rann of Kutch White Desert': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80',
  'Kerala Backwaters & Hills': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
};

async function updatePostImages() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('login');
    const collection = db.collection('newexplore');
    
    const posts = await collection.find({}).toArray();
    console.log(`📊 Found ${posts.length} posts to update\n`);
    
    let updatedCount = 0;
    
    for (const post of posts) {
      // Get appropriate image for this post
      let imageUrl = tripImages[post.title];
      
      // If no specific trip image, try to match by location
      if (!imageUrl) {
        for (const [location, url] of Object.entries(locationImages)) {
          if (post.title.includes(location) || post.route.includes(location)) {
            imageUrl = url;
            break;
          }
        }
      }
      
      // Fallback to a generic motorcycle trip image
      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800&q=80';
      }
      
      // Update the post with the new image URL
      await collection.updateOne(
        { _id: post._id },
        { $set: { mainPhoto: imageUrl } }
      );
      
      updatedCount++;
      console.log(`✅ [${updatedCount}/${posts.length}] Updated: ${post.title}`);
      console.log(`   Image: ${imageUrl}\n`);
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} posts with images!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

updatePostImages();
