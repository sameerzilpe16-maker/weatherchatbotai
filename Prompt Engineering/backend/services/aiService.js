const axios = require('axios');

/**
 * Generate intelligent weather response.
 * Uses Gemini API / OpenAI if AI_API_KEY is configured,
 * otherwise falls back to a high-quality Rule-Based Response Generator.
 */
async function generateChatResponse({ message, intent, location, timeframe, weatherData }) {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your_ai_api_key')) {
    try {
      const aiResponse = await callLLM(apiKey, message, intent, location, timeframe, weatherData);
      if (aiResponse) return aiResponse;
    } catch (err) {
      console.warn('[AIService] LLM API call failed, falling back to rule-based engine:', err.message);
    }
  }

  // Fallback to Rule-Based Engine
  return generateRuleBasedResponse({ message, intent, location, timeframe, weatherData });
}

/**
 * Gemini / LLM API Handler
 */
async function callLLM(apiKey, userMessage, intent, location, timeframe, weatherData) {
  const current = weatherData.current;
  const prompt = `You are WeatherAI, a friendly and intelligent weather assistant.
User asked: "${userMessage}"
Detected Intent: ${intent}
Location: ${location}
Timeframe: ${timeframe}

Current Weather Data for ${location}:
- Temp: ${current.temp}°C (Feels like ${current.feelsLike}°C)
- Condition: ${current.condition} (${current.description})
- Rain Probability: ${current.rainProbability}%
- Humidity: ${current.humidity}%
- Wind: ${current.windSpeed} km/h (${current.windDirection})
- UV Index: ${current.uvIndex}
- Sunrise: ${current.sunrise}, Sunset: ${current.sunset}

Formatting guidelines:
1. Provide a direct, friendly 1-2 sentence answer first.
2. Include key weather metrics formatted with weather emoji bullets (e.g. 🌧️ Rain probability: X%, 🌡️ Temp: Y°C, 💨 Wind: Z km/h).
3. End with a helpful, practical recommendation (e.g. umbrella, clothing, outdoor plans).
Keep the total response concise under 120 words. Do not make up facts outside the provided data.`;

  // Attempt Google Gemini REST API (gemini-1.5-flash / gemini-2.0-flash endpoint)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }]
  }, { timeout: 8000 });

  if (response.data && response.data.candidates && response.data.candidates[0]?.content?.parts[0]?.text) {
    return response.data.candidates[0].content.parts[0].text.trim();
  }

  return null;
}

/**
 * Rule-Based Natural Language Response Generator
 */
function generateRuleBasedResponse({ message, intent, location, timeframe, weatherData }) {
  const current = weatherData.current;
  const hourly = weatherData.hourly || [];
  const daily = weatherData.daily || [];

  const tomorrowData = daily.length > 1 ? daily[1] : daily[0];

  switch (intent) {
    case 'RAIN_FORECAST': {
      if (timeframe === 'tomorrow' && tomorrowData) {
        const prob = tomorrowData.rainProb;
        if (prob >= 50) {
          return `Yes, rain is likely in ${location} tomorrow (${tomorrowData.day}).

🌧️ Rain probability: ${prob}%
🌡️ Temperature: ${tomorrowData.tempMin}–${tomorrowData.tempMax}°C
💨 Wind speed: ${tomorrowData.windSpeed} km/h

💡 **Recommendation:** Carrying an umbrella or raincoat would be a smart move if you're stepping outdoors tomorrow afternoon.`;
        } else {
          return `Rain is unlikely in ${location} tomorrow. Expect mostly ${tomorrowData.condition.toLowerCase()} weather.

🌧️ Rain probability: ${prob}%
🌡️ Temperature: ${tomorrowData.tempMin}–${tomorrowData.tempMax}°C
☀️ Condition: ${tomorrowData.condition}

💡 **Recommendation:** You probably won't need an umbrella tomorrow! Great day for outdoor errands.`;
        }
      } else {
        const prob = current.rainProbability;
        if (prob >= 50) {
          return `Rain is expected today in ${location}. Currently experiencing ${current.condition.toLowerCase()}.

🌧️ Rain probability: ${prob}%
🌡️ Current Temp: ${current.temp}°C (Feels like ${current.feelsLike}°C)
💧 Humidity: ${current.humidity}%

💡 **Recommendation:** Don't forget your umbrella today! Roads may be wet during peak travel hours.`;
        } else {
          return `There is only a low chance of rain (${prob}%) in ${location} today.

☀️ Condition: ${current.condition}
🌡️ Current Temp: ${current.temp}°C
💨 Wind: ${current.windSpeed} km/h ${current.windDirection}

💡 **Recommendation:** Skies look mostly safe from heavy downpours today.`;
        }
      }
    }

    case 'TEMPERATURE': {
      if (timeframe === 'tomorrow' && tomorrowData) {
        return `Tomorrow in ${location}, temperatures will range from a low of ${tomorrowData.tempMin}°C to a high of ${tomorrowData.tempMax}°C.

🌡️ Expected Range: ${tomorrowData.tempMin}°C – ${tomorrowData.tempMax}°C
☀️ Condition: ${tomorrowData.condition}
💧 Humidity: ${tomorrowData.humidity}%

💡 **Recommendation:** Dress comfortably for ${tomorrowData.tempMax > 30 ? 'warm' : 'mild'} conditions throughout the day.`;
      }
      return `The current temperature in ${location} is **${current.temp}°C**, but it feels like **${current.feelsLike}°C**.

🌡️ Current Temp: ${current.temp}°C
🌡️ Today's High / Low: ${current.tempMax}°C / ${current.tempMin}°C
💧 Humidity: ${current.humidity}%

💡 **Recommendation:** ${current.temp > 32 ? 'It is quite warm outside. Stay hydrated!' : current.temp < 18 ? 'A light jacket is recommended.' : 'Weather is pleasant and comfortable.'}`;
    }

    case 'FORECAST': {
      let overview = `Here is the 5-day weather forecast for **${location}**:\n\n`;
      daily.forEach(d => {
        overview += `• **${d.day} (${d.date})**: ${d.condition}, ${d.tempMin}°C to ${d.tempMax}°C | 🌧️ ${d.rainProb}%\n`;
      });
      overview += `\n💡 **Recommendation:** ${daily.some(d => d.rainProb > 60) ? 'Rain is expected on some days. Plan outdoor trips accordingly.' : 'Overall fair weather expected over the next 5 days.'}`;
      return overview;
    }

    case 'WEATHER_COMPARISON': {
      if (tomorrowData) {
        const tempDiff = tomorrowData.tempMax - current.tempMax;
        const diffText = tempDiff > 0 ? `${tempDiff}°C warmer` : tempDiff < 0 ? `${Math.abs(tempDiff)}°C cooler` : 'about the same temperature';
        return `Comparing today and tomorrow in **${location}**:

• **Today**: ${current.temp}°C (${current.condition}), Rain probability: ${current.rainProbability}%
• **Tomorrow**: High of ${tomorrowData.tempMax}°C (${tomorrowData.condition}), Rain probability: ${tomorrowData.rainProb}%

Tomorrow will be **${diffText}** compared to today.

💡 **Recommendation:** ${tomorrowData.rainProb > current.rainProbability ? 'Tomorrow carries a higher chance of rain than today.' : 'Tomorrow will be clearer than today.'}`;
      }
      return `Today in ${location} is ${current.temp}°C with ${current.condition.toLowerCase()}. Tomorrow is expected to remain similarly comfortable.`;
    }

    case 'TRAVEL_ADVICE': {
      const isGood = current.rainProbability < 40 && current.windSpeed < 25 && current.visibility >= 6;
      return `${isGood ? '✈️ Yes! It is a great time to travel to' : '⚠️ Travel caution advised for'} **${location}**.

🌡️ Temperature: ${current.temp}°C
☀️ Condition: ${current.condition}
👁️ Visibility: ${current.visibility} km
💨 Wind: ${current.windSpeed} km/h

💡 **Recommendation:** ${isGood ? 'Flight and road travel conditions look clear and safe.' : 'Keep an eye out for potential rain or visibility changes during your journey.'}`;
    }

    case 'OUTDOOR_ACTIVITY': {
      const isGoodForJog = current.temp <= 32 && current.rainProbability < 40 && current.uvIndex <= 8;
      return `${isGoodForJog ? '🏃‍♂️ Great conditions for outdoor activities' : '⚠️ Moderate outdoor conditions'} in **${location}**.

🌡️ Temp: ${current.temp}°C (Feels like ${current.feelsLike}°C)
🌧️ Rain chance: ${current.rainProbability}%
☀️ UV Index: ${current.uvIndex}

💡 **Recommendation:** ${isGoodForJog ? 'Ideal time for a jog, sports, or washing your vehicle! Early morning or evening is best.' : 'It might be too hot or rainy for prolonged outdoor sports. Hydrate well if heading out.'}`;
    }

    case 'WIND': {
      return `The current wind speed in **${location}** is **${current.windSpeed} km/h** coming from the **${current.windDirection}**.

💨 Wind Speed: ${current.windSpeed} km/h
🧭 Direction: ${current.windDirection}
☁️ Pressure: ${current.pressure} hPa

💡 **Recommendation:** ${current.windSpeed > 25 ? 'Breezy to windy conditions. Secure outdoor loose items.' : 'Gentle to light breeze today.'}`;
    }

    case 'HUMIDITY': {
      return `The humidity in **${location}** is currently **${current.humidity}%**.

💧 Humidity: ${current.humidity}%
🌡️ Temp: ${current.temp}°C (Feels like ${current.feelsLike}°C)

💡 **Recommendation:** ${current.humidity > 75 ? 'High humidity makes it feel warmer than actual temperature. Drink plenty of water.' : 'Humidity is at a comfortable level.'}`;
    }

    case 'WEATHER_ALERT': {
      if (weatherData.alerts && weatherData.alerts.length > 0) {
        const a = weatherData.alerts[0];
        return `⚠️ **${a.title}** for **${location}**

${a.description}

🌡️ Current Temp: ${current.temp}°C
🌧️ Rain Probability: ${current.rainProbability}%
💨 Wind Speed: ${current.windSpeed} km/h

💡 **Recommendation:** Stay updated on weather advisories and avoid unnecessary outdoor travel.`;
      }
      return `No severe weather warnings are active for **${location}** right now. Conditions are normal (${current.condition}, ${current.temp}°C).`;
    }

    case 'CURRENT_WEATHER':
    case 'LOCATION_WEATHER':
    default: {
      return `${location} is currently **${current.temp}°C** and **${current.condition.toLowerCase()}**.

🌡️ Temp: ${current.temp}°C (Feels like ${current.feelsLike}°C)
💧 Humidity: ${current.humidity}% | 💨 Wind: ${current.windSpeed} km/h
🌅 Sunrise: ${current.sunrise} | 🌇 Sunset: ${current.sunset}

💡 **Recommendation:** ${current.rainProbability > 50 ? 'Keep an umbrella handy.' : 'Pleasant weather for your daily routines.'}`;
    }
  }
}

module.exports = {
  generateChatResponse
};
