require('dotenv').config();
const ai = require('./utils/ai');

async function testGeminiConnection() {
  console.log('Testing Gemini API Integration...');
  console.log('Key Present:', !!process.env.GEMINI_API_KEY);
  
  const dummyTrip = {
    destination: 'Venice, Italy',
    budget: 60000,
    transportMode: 'train',
    travelerCount: 2,
    travelPace: 'slow',
    interests: ['Culture', 'Food']
  };

  try {
    console.log('\nSending test itinerary query for Venice...');
    const startTime = Date.now();
    const result = await ai.generateSmartItinerary(dummyTrip, 2);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`\nConnection Succeeded in ${duration}s!`);
    console.log('\nGenerated Budget Breakdown:', JSON.stringify(result.budgetBreakdown, null, 2));
    console.log(`\nDays generated: ${result.itineraryDays.length}`);
    console.log('Sample Activity from Day 1:', JSON.stringify(result.itineraryDays[0].activities[0], null, 2));
    console.log('\nTest passed successfully!');
  } catch (err) {
    console.error('\nTest failed:', err.message);
  }
}

testGeminiConnection();
