const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  const modelsToTest = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest"
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`\n🤖 Testing model: ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent("Say 'Hello'");
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`Response: ${text.substring(0, 50)}`);
      
    } catch (error) {
      console.error(`❌ ${modelName} failed:`, error.message.substring(0, 150));
    }
  }
}

testModels();
