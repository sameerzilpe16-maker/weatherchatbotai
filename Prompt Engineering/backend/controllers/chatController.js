const { processMessageContext } = require('../utils/intentParser');
const weatherService = require('../services/weatherService');
const aiService = require('../services/aiService');

/**
 * POST /api/chat
 * Body: { message: "...", conversationId: "..." }
 */
async function handleChatMessage(req, res) {
  try {
    const { message, conversationId = 'default-session' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    // 1. Extract intent, location & timeframe with context memory
    const { intent, location, timeframe } = processMessageContext(conversationId, message);

    // 2. Fetch full forecast weather data for the location
    const weatherData = await weatherService.getForecast(location);

    // 3. Generate natural language response
    const reply = await aiService.generateChatResponse({
      message,
      intent,
      location: weatherData.location?.name || location,
      timeframe,
      weatherData
    });

    // 4. Return structured response to client
    return res.json({
      reply,
      location: weatherData.location?.name || location,
      intent,
      timeframe,
      weatherData
    });
  } catch (error) {
    console.error('Error in handleChatMessage:', error);
    return res.status(500).json({
      reply: "Sorry, I couldn't process your request right now. Please check your network connection or try asking again.",
      error: error.message
    });
  }
}

module.exports = {
  handleChatMessage
};
