const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client if API key is provided
let aiClient = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('Gemini AI Client initialized successfully.');
} else {
  console.warn('WARNING: GEMINI_API_KEY is not defined in .env. Falling back to structured mock generation.');
}

/**
 * Generate highly structured dynamic itineraries based on trip details.
 */
const generateSmartItinerary = async (trip, daysCount) => {
  const { destination, budget, transportMode, travelerCount, travelPace, interests } = trip;
  
  if (!aiClient) {
    return getFallbackItinerary(destination, daysCount, budget, transportMode, travelPace, interests);
  }

  try {
    const model = aiClient.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `
      You are an expert AI Travel Planner. Generate a highly customized, extremely realistic daily travel itinerary for a trip to "${destination}".
      
      Trip Parameters:
      - Duration: ${daysCount} days
      - Total Budget: ₹${budget.toLocaleString()} INR
      - Travelers: ${travelerCount} person(s)
      - Primary Transport Mode: ${transportMode}
      - Travel Pace: ${travelPace} (slow = relaxed and fewer items, balanced = normal activity, fast = packed schedule)
      - Interests: ${interests && interests.length > 0 ? interests.join(', ') : 'General exploring, popular landmarks, local culture'}
      
      Instructions:
      1. Create a logical timeline for each of the ${daysCount} days. 
      2. For each day, include a balanced sequence of timeline events: transportation (specifically Day 1), explore/activities, dining/food, lodging/check-in, etc.
      3. Allocate realistic starting times (HH:MM) and durations (e.g. "2h", "1h", "Flexible").
      4. Ensure estimated costs are within the total budget constraint of ₹${budget}.
      5. Generate a comprehensive "budgetBreakdown" dividing the total budget into accommodation, food, transport, activities, and other expenses.
      
      You MUST respond with a strict JSON object that conforms EXACTLY to this schema:
      {
        "itineraryDays": [
          {
            "dayNumber": number,
            "activities": [
              {
                "startTime": "HH:MM",
                "name": "Name of attraction, venue, or event",
                "type": "flight" | "activity" | "lodging" | "dining" | "attractions" | "other" | "transport" | "food" | "explore",
                "cost": number (estimated cost in INR),
                "description": "Short, engaging, high-quality description of the event or tip",
                "duration": "Duration description (e.g. 2h, 45m)"
              }
            ]
          }
        ],
        "budgetBreakdown": {
          "accommodation": number,
          "food": number,
          "transport": number,
          "activities": number,
          "other": number
        }
      }
      Do NOT include any markdown code blocks, comments, or extra text. Return ONLY the raw JSON string.
    `;

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.response.text();
    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.itineraryDays) || parsed.itineraryDays.length === 0) {
      throw new Error('Invalid itinerary format returned by AI: missing itineraryDays array');
    }
    return parsed;
  } catch (error) {
    console.error('Gemini Itinerary Generation Error, falling back to mock:', error);
    return getFallbackItinerary(destination, daysCount, budget, transportMode, travelPace, interests);
  }
};

/**
 * Generate a tailored packing list based on trip properties.
 */
const generateSmartPackingList = async (trip) => {
  const { destination, startDate, endDate, travelPace, interests } = trip;
  
  if (!aiClient) {
    return getFallbackPackingList(destination, interests);
  }

  try {
    const model = aiClient.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const durationDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    
    const prompt = `
      You are a travel packing expert. Generate a highly customized packing list for a trip to "${destination}".
      
      Trip details:
      - Season/Dates: from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()} (${durationDays} days)
      - Activities/Interests: ${interests && interests.length > 0 ? interests.join(', ') : 'General tourism'}
      
      Generate a list of exactly 15-20 essential packing items categorized into sensible groups like "Clothing", "Electronics", "Toiletries", "Documents", "Accessories", "Footwear".
      
      You MUST respond with a strict JSON object that conforms EXACTLY to this schema:
      {
        "items": [
          {
            "name": "Name of packing item",
            "category": "Category name (e.g. Clothing, Toiletries)"
          }
        ]
      }
      Do NOT include any markdown code blocks, comments, or extra text. Return ONLY the raw JSON string.
    `;

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.response.text();
    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.items) || parsed.items.length === 0) {
      throw new Error('Invalid packing list format returned by AI: missing items array');
    }
    return parsed;
  } catch (error) {
    console.error('Gemini Packing Generation Error, falling back to mock:', error);
    return getFallbackPackingList(destination, interests);
  }
};

/**
 * Perform a trip-contextual conversational completion.
 */
const chatSmartAssistant = async (trip, history, message) => {
  const { destination, budget, travelerCount, transportMode } = trip;

  if (!aiClient) {
    return "I am currently running in Offline/Fallback Mode because the GEMINI_API_KEY is not defined in the environment. Please add GEMINI_API_KEY=your_key in your backend .env file to enable live conversations. In the meantime, enjoy your beautifully organized Traveloop trip!";
  }

  try {
    const model = aiClient.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Structure conversation history for Gemini
    const contents = history.map(h => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));
    
    // Append system prompt instruction as part of system instruction parameter
    const systemPrompt = `
      You are the "Traveloop Elite AI Assistant". You are helping a traveler plan their trip to "${destination}".
      
      Trip Details:
      - Destination: ${destination}
      - Total Budget: ₹${budget}
      - Traveler Count: ${travelerCount}
      - Primary Transport Mode: ${transportMode}
      
      Instructions:
      - Be extremely helpful, knowledgeable, professional, and friendly.
      - Keep answers relatively concise and highly specific to the trip's destination (${destination}).
      - If requested, provide restaurant names, weather, cultural norms, packing tips, or currency insights.
      - Feel free to suggest timeline event ideas.
    `;

    // Add the user's latest query
    contents.push({ role: 'user', parts: [{ text: message }] });

    const chat = await model.generateContent({
      contents,
      systemInstruction: systemPrompt
    });

    return chat.response.text();
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    return "I apologize, but I encountered an error communicating with the neural travel model. Please try again in a few moments.";
  }
};

// --- MOCK FALLBACK DATA GENERATION ---

function getFallbackItinerary(destination, daysCount, budget, transportMode, pace, interests) {
  console.log(`Generating mock itinerary for ${destination} (${daysCount} days)...`);
  
  const itineraries = [];
  const transFactor = transportMode === 'flight' ? 0.35 : transportMode === 'train' ? 0.15 : 0.10;
  const transportCost = Math.floor(budget * transFactor);
  
  const mockActivities = [
    { name: `Explore ${destination} Landmarks`, type: 'explore', cost: 0, startTime: '09:30', duration: '3h', description: 'Scenic walking tour of key architectural sites.' },
    { name: 'Traditional Cultural Workshop', type: 'activity', cost: Math.floor(budget * 0.05), startTime: '13:00', duration: '2.5h', description: 'Interactive session exploring local crafts and history.' },
    { name: 'Local Gastronomy Tasting', type: 'food', cost: Math.floor(budget * 0.03), startTime: '19:00', duration: '2h', description: 'Curated tasting session of signature regional dishes.' },
    { name: 'Sunset Panoramic Viewpoint', type: 'explore', cost: 500, startTime: '17:00', duration: '1h', description: 'Panoramic birds-eye view from the city\'s highest observatory deck.' }
  ];

  for (let i = 0; i < daysCount; i++) {
    const dayActs = [];
    
    // Inject Travel/Flight on Day 1
    if (i === 0) {
      dayActs.push({
        name: `${transportMode.charAt(0).toUpperCase() + transportMode.slice(1)} arrival in ${destination}`,
        type: 'flight',
        cost: transportCost,
        startTime: '07:00',
        duration: 'Flexible',
        description: `Checked baggage, customs clearance, and primary logistics.`
      });
      dayActs.push({
        name: 'Hotel Check-In',
        type: 'lodging',
        cost: Math.floor(budget * 0.10),
        startTime: '14:00',
        duration: '1h',
        description: 'Unload luggage and settle into rooms.'
      });
    }

    // Add activities based on pace
    const activityLimit = pace === 'slow' ? 2 : pace === 'fast' ? 4 : 3;
    for (let k = 0; k < activityLimit; k++) {
      const actIdx = (i * activityLimit + k) % mockActivities.length;
      const act = mockActivities[actIdx];
      // Shift times a bit so they don't overlap
      let startTime = '10:00';
      if (k === 1) startTime = '14:30';
      if (k === 2) startTime = '17:30';
      if (k === 3) startTime = '20:30';

      dayActs.push({
        ...act,
        startTime
      });
    }

    itineraries.push({
      dayNumber: i + 1,
      activities: dayActs
    });
  }

  const budgetBreakdown = {
    accommodation: Math.floor(budget * 0.35),
    food: Math.floor(budget * 0.25),
    transport: transportCost,
    activities: Math.floor(budget * 0.20),
    other: Math.floor(budget * (1 - 0.35 - 0.25 - transFactor - 0.20))
  };

  return {
    itineraryDays: itineraries,
    budgetBreakdown
  };
}

function getFallbackPackingList(destination, interests) {
  const genericItems = [
    { name: 'Passport & Travel Documents', category: 'Documents' },
    { name: 'Universal Travel Power Adapter', category: 'Electronics' },
    { name: 'Comfortable Sneakers / Walking Shoes', category: 'Footwear' },
    { name: 'Toiletry Bag & Travel Sized Soap', category: 'Toiletries' },
    { name: 'Reusable Water Bottle', category: 'Accessories' },
    { name: 'Comfortable Daily Wear Apparel', category: 'Clothing' },
    { name: 'Power Bank Charger', category: 'Electronics' },
    { name: 'Emergency Medications & First-Aid', category: 'Toiletries' },
    { name: 'Sunglasses & UV Sunscreen', category: 'Accessories' },
    { name: 'Local Currency & Credit Cards', category: 'Documents' }
  ];

  if (interests && interests.includes('Adventure')) {
    genericItems.push(
      { name: 'Breathable Dry-fit Outerwear', category: 'Clothing' },
      { name: 'Compact Waterproof Raincoat', category: 'Clothing' }
    );
  }

  if (interests && interests.includes('Culture')) {
    genericItems.push(
      { name: 'Respectful Cover-up Shawl/Pants', category: 'Clothing' }
    );
  }

  return { items: genericItems };
}

module.exports = {
  generateSmartItinerary,
  generateSmartPackingList,
  chatSmartAssistant
};
