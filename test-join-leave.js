const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';
const TRIP_ID = '6905cf346870492811fa65c2';
const TEST_USER = {
    userId: '68f3571d34b544fec4a59759', // Shyamnandhan SP
    name: 'Shyamnandhan SP',
    username: 'shyam',
    avatar: 'S'
};

async function testJoinTrip() {
    console.log('\n🔵 Testing JOIN Trip...');
    console.log('User:', TEST_USER.name, '(@' + TEST_USER.username + ')');
    
    const response = await fetch(`${API_BASE}/feeds/${TRIP_ID}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER)
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (data.success) {
        console.log('✅ Successfully joined!');
    } else {
        console.log('❌ Failed:', data.message);
    }
    
    return data.success;
}

async function testLeaveTrip() {
    console.log('\n🔴 Testing LEAVE Trip...');
    console.log('User:', TEST_USER.name, '(@' + TEST_USER.username + ')');
    
    const response = await fetch(`${API_BASE}/feeds/${TRIP_ID}/leave`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: TEST_USER.userId })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (data.success) {
        console.log('✅ Successfully left!');
    } else {
        console.log('❌ Failed:', data.message);
    }
    
    return data.success;
}

async function getTripDetails() {
    console.log('\n📊 Fetching Trip Details...');
    
    const response = await fetch(`${API_BASE}/feeds/${TRIP_ID}`);
    const data = await response.json();
    
    if (data.success) {
        const trip = data.trip;
        console.log('Title:', trip.title);
        console.log('Capacity:', `${trip.capacity.booked}/${trip.capacity.total} (${trip.capacity.available} available)`);
        console.log('Members:', trip.members.length);
        
        const isMember = trip.members.some(m => 
            m.userId.toString() === TEST_USER.userId.toString()
        );
        console.log(`${TEST_USER.name} is member:`, isMember ? '✅ YES' : '❌ NO');
        
        return { trip, isMember };
    }
    
    return null;
}

async function runTests() {
    console.log('═══════════════════════════════════════');
    console.log('🧪 Testing Join/Leave Trip Functionality');
    console.log('═══════════════════════════════════════');
    
    try {
        // Step 1: Check initial state
        const initial = await getTripDetails();
        
        if (!initial) {
            console.log('❌ Failed to fetch trip details');
            return;
        }
        
        // Step 2: If already a member, leave first
        if (initial.isMember) {
            console.log('\n⚠️ User is already a member, leaving first...');
            await testLeaveTrip();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Step 3: Join the trip
        await testJoinTrip();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 4: Verify joined
        const afterJoin = await getTripDetails();
        
        // Step 5: Try joining again (should fail)
        console.log('\n⚠️ Attempting to join again (should fail)...');
        await testJoinTrip();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 6: Leave the trip
        await testLeaveTrip();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 7: Verify left
        const afterLeave = await getTripDetails();
        
        // Step 8: Try leaving again (should fail)
        console.log('\n⚠️ Attempting to leave again (should fail)...');
        await testLeaveTrip();
        
        console.log('\n═══════════════════════════════════════');
        console.log('✅ All tests completed!');
        console.log('═══════════════════════════════════════');
        
    } catch (error) {
        console.error('\n❌ Test error:', error.message);
    }
}

// Add node-fetch if not installed
const hasNodeFetch = (() => {
    try {
        require('node-fetch');
        return true;
    } catch (e) {
        return false;
    }
})();

if (!hasNodeFetch) {
    console.log('⚠️ node-fetch not found. Installing...');
    require('child_process').execSync('npm install node-fetch@2', { stdio: 'inherit' });
}

runTests();
