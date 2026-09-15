// Intent & Entity Parser with Context Memory for WeatherAI

// In-memory conversation context storage
const conversationContext = new Map();

const KNOWN_CITIES = [
  'nagpur', 'mumbai', 'pune', 'delhi', 'bangalore', 'bengaluru', 'hyderabad',
  'kolkata', 'chennai', 'ahmedabad', 'jaipur', 'surat', 'lucknow', 'kanpur',
  'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna', 'vadodara', 'ghaziabad',
  'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'varanasi',
  'srinagar', 'aurangabad', 'amritsar', 'navi mumbai', 'ranchi', 'howrah',
  'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai',
  'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur', 'hubballi', 'bareilly',
  'moradabad', 'mysore', 'gurgaon', 'gurugram', 'noida', 'shimla', 'manali',
  'goa', 'london', 'new york', 'tokyo', 'paris', 'sydney', 'dubai', 'singapore'
];

function extractLocation(message, previousLocation = 'Nagpur') {
  const lowerMsg = message.toLowerCase();

  // 1. Direct match with KNOWN_CITIES list
  for (const city of KNOWN_CITIES) {
    // Regex boundary check to avoid partial matching (e.g. "go" matching "goa")
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(lowerMsg)) {
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }

  // 2. Preposition patterns: "in <City>", "for <City>", "at <City>", "weather of <City>"
  const prepRegex = /\b(?:in|for|at|near|of)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/i;
  const match = message.match(prepRegex);
  if (match && match[1]) {
    const candidate = match[1].trim();
    // Exclude common temporal/intent words
    const exclude = ['today', 'tomorrow', 'morning', 'evening', 'afternoon', 'night', 'this', 'the', 'now', 'weekend'];
    if (!exclude.includes(candidate.toLowerCase())) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  // 3. Fallback to previous conversation location if no location mentioned
  return previousLocation || 'Nagpur';
}

function extractTimeframe(message) {
  const lower = message.toLowerCase();
  if (lower.includes('tomorrow')) return 'tomorrow';
  if (lower.includes('this evening') || lower.includes('tonight') || lower.includes('evening')) return 'evening';
  if (lower.includes('this morning') || lower.includes('morning')) return 'morning';
  if (lower.includes('5 day') || lower.includes('5-day') || lower.includes('weekly') || lower.includes('week forecast') || lower.includes('next 5 days')) return '5day';
  if (lower.includes('hourly') || lower.includes('today')) return 'today';
  return 'today';
}

function parseIntent(message) {
  const lower = message.toLowerCase();

  // Rain / Umbrella queries
  if (lower.includes('rain') || lower.includes('umbrella') || lower.includes('shower') || lower.includes('precipitation') || lower.includes('drizzle') || lower.includes('storm') || lower.includes('downpour')) {
    return 'RAIN_FORECAST';
  }

  // Travel / Jogging / Outdoor activity queries
  if (lower.includes('travel') || lower.includes('trip') || lower.includes('flight') || lower.includes('road trip') || lower.includes('tour')) {
    return 'TRAVEL_ADVICE';
  }
  if (lower.includes('jog') || lower.includes('run') || lower.includes('walk') || lower.includes('outdoor') || lower.includes('bike') || lower.includes('wash my bike') || lower.includes('wash car') || lower.includes('cricket') || lower.includes('football') || lower.includes('match') || lower.includes('picnic')) {
    return 'OUTDOOR_ACTIVITY';
  }

  // Forecast / Multi-day queries
  if (lower.includes('forecast') || lower.includes('5-day') || lower.includes('5 day') || lower.includes('weekly') || lower.includes('upcoming days') || lower.includes('next few days')) {
    return 'FORECAST';
  }

  // Weather comparison (e.g. "compare today with tomorrow", "compare today's weather with tomorrow's")
  if (lower.includes('compare') || lower.includes('versus') || lower.includes('vs') || (lower.includes('today') && lower.includes('tomorrow'))) {
    return 'WEATHER_COMPARISON';
  }

  // Temperature / Hot / Cold queries
  if (lower.includes('temp') || lower.includes('temperature') || lower.includes('hot') || lower.includes('cold') || lower.includes('heat') || lower.includes('warm') || lower.includes('chilly') || lower.includes('degrees') || lower.includes('°c') || lower.includes('°f')) {
    return 'TEMPERATURE';
  }

  // Humidity / Moisture
  if (lower.includes('humid') || lower.includes('moisture') || lower.includes('sticky')) {
    return 'HUMIDITY';
  }

  // Wind / Breeze / Wind speed
  if (lower.includes('wind') || lower.includes('breeze') || lower.includes('gust') || lower.includes('windy')) {
    return 'WIND';
  }

  // Severe weather alert check
  if (lower.includes('alert') || lower.includes('warning') || lower.includes('severe') || lower.includes('cyclone') || lower.includes('safe') || lower.includes('danger')) {
    return 'WEATHER_ALERT';
  }

  // Explicit location query (e.g. "What about Pune?")
  if (lower.startsWith('what about') || lower.startsWith('how about')) {
    return 'LOCATION_WEATHER';
  }

  // Default to CURRENT_WEATHER
  return 'CURRENT_WEATHER';
}

function processMessageContext(conversationId, message) {
  const context = conversationContext.get(conversationId) || { lastLocation: 'Nagpur', history: [] };
  
  const intent = parseIntent(message);
  const location = extractLocation(message, context.lastLocation);
  const timeframe = extractTimeframe(message);

  // Update stored context
  context.lastLocation = location;
  context.history.push({ message, intent, location, timeframe, timestamp: Date.now() });
  
  // Keep only last 10 messages in memory per conversationId
  if (context.history.length > 10) context.history.shift();
  conversationContext.set(conversationId, context);

  return {
    intent,
    location,
    timeframe,
    previousLocation: context.lastLocation
  };
}

module.exports = {
  parseIntent,
  extractLocation,
  extractTimeframe,
  processMessageContext
};
