// Test script to verify explore collection integration
// Run this with: node test-explore-integration.js

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001';

// Test data
const testPost = {
  title: "Test Himalayan Ride",
  description: "This is a test post to verify the explore collection integration",
  riderName: "Test Rider",
  riderId: null, // Optional
  fromLocation: "Manali",
  toLocation: "Leh",
  totalRiders: 5,
  days: 7,
  rating: 5,
  imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
};

async function testExploreIntegration() {
  console.log('🧪 Testing Explore Collection Integration\n');
  console.log('=' .repeat(50));

  try {
    // Test 1: Create a new explore post
    console.log('\n📝 Test 1: Creating a new explore post...');
    const createResponse = await fetch(`${API_BASE}/api/explore/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPost)
    });

    const createData = await createResponse.json();
    
    if (createData.success) {
      console.log('✅ Post created successfully!');
      console.log('   Explore ID:', createData.exploreId);
      console.log('   Title:', createData.post.title);
      console.log('   Route:', createData.post.route);
    } else {
      console.log('❌ Failed to create post:', createData.message);
      return;
    }

    // Test 2: Fetch all explore posts
    console.log('\n📋 Test 2: Fetching all explore posts...');
    const fetchResponse = await fetch(`${API_BASE}/api/explore`);
    const fetchData = await fetchResponse.json();

    if (fetchData.success) {
      console.log('✅ Posts fetched successfully!');
      console.log('   Total posts:', fetchData.count);
      console.log('\n   Recent posts:');
      fetchData.posts.slice(0, 3).forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title} (${post.route})`);
      });
    } else {
      console.log('❌ Failed to fetch posts:', fetchData.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Open http://localhost:8082 in your browser');
    console.log('   2. Go to the Explore page');
    console.log('   3. You should see the newly created post');
    console.log('   4. Try creating a post using the "Create Post" button');

  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. MongoDB is running (port 27017)');
    console.log('   2. Backend server is running (port 3001)');
    console.log('   3. Run: cd login && npm start');
  }
}

// Run the test
testExploreIntegration();
