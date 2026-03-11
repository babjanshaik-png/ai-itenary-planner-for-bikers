const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDUBB2KJLlE5r6POLpXCCWTJYLfwJlIX_c');

async function testGemini() {
  try {
    console.log('🤖 Testing Gemini API...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Extract the following data from this trip description and return ONLY a JSON object:\n\nTrip: Himalayan Dawn Run\nDuration: 10 days\nPrice: ₹38,471\n\nReturn format:\n{\"duration\": {\"days\": 10}, \"price\": 38471}\n\nJSON:";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Response received!');
    console.log('Raw response:', text);
    
    // Try to parse JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    
    console.log('✅ JSON parsed successfully!');
    console.log('Parsed data:', parsed);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
