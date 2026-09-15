import axios from 'axios';

const CHAT_API = '/api/chat';

export async function sendChatMessage(message, conversationId) {
  try {
    const response = await axios.post(CHAT_API, {
      message,
      conversationId
    });
    return response.data;
  } catch (error) {
    console.error('sendChatMessage error:', error);
    return {
      reply: "Sorry, I couldn't connect to the WeatherAI service. Please check your internet connection and try again.",
      location: null,
      intent: 'ERROR',
      weatherData: null
    };
  }
}
