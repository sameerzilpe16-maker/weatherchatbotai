# ☀️ WeatherAI - Intelligent Weather Chatbot Application

**"Ask the weather. Get intelligent answers."**

WeatherAI is a full-stack, production-quality AI Weather Chatbot Web Application built with **React**, **Vite**, **Tailwind CSS**, **Recharts**, **Lucide Icons**, and an **Express.js (Node.js)** backend API server.

---

## 🌟 Features

- 💬 **Natural Language Chatbot**: Ask questions like *"What is the weather in Nagpur?"*, *"Will it rain tomorrow in Mumbai?"*, *"Is today good for jogging?"*, or *"Compare today's weather with tomorrow's."*
- 🧠 **Context-Aware Intent Engine**: Remembers conversation location and history for follow-up queries (e.g. asking *"What about tomorrow?"* after asking about Nagpur).
- 🤖 **Dual AI & Rule Engine**: Integrates with Google Gemini / LLM APIs, with an automatic fallback to a built-in Natural Language Intent Parser & generator if no AI key is provided.
- ⛅ **OpenWeatherMap Integration & Fallback**: Fetches live current weather and 5-day forecasts with fallback mock weather generation for 100% offline & keyless reliability out-of-the-box.
- 📊 **Interactive Weather Visualizations**: Built-in **Recharts** analytics for Temperature trends, Rain probability %, and Humidity % over 24 hours.
- 🎙️ **Voice Input (Speech-to-Text)**: Speak directly to the chatbot using Web Speech API integration with microphone feedback.
- 📍 **Geolocation & Saved Locations**: Auto-detect current browser coordinates or pick from saved location quick-access chips (Nagpur, Mumbai, Pune, Delhi, + custom locations).
- ⚠️ **Severe Weather Alerts**: Automatic warnings for heavy rainfall, high UV index, strong winds, or extreme heat.
- 🌙 **Dark Mode & Themes**: Light and dark themes with localStorage preference saving.
- 📱 **Responsive Mobile-First UI**: AgriTech / Modern tech dashboard styling with slide-out mobile navigation drawer and horizontal scroll forecast cards.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite 6
- **Styling**: Tailwind CSS 3 (Custom color palette, glassmorphism, responsive grid)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context (`ThemeContext`, `ChatContext`)
- **Speech**: Browser Web Speech API (`SpeechRecognition`)

### Backend
- **Runtime**: Node.js v22+
- **Framework**: Express.js
- **Services**: OpenWeatherMap API wrapper, Gemini LLM API client, Rule-based NLP Intent Engine
- **Environment Handling**: `dotenv`, `cors`, `axios`

---

## 📁 Folder Structure

```
WeatherAI/
├── backend/
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   ├── weatherRoutes.js
│   │   └── chatRoutes.js
│   ├── controllers/
│   │   ├── weatherController.js
│   │   └── chatController.js
│   ├── services/
│   │   ├── weatherService.js
│   │   └── aiService.js
│   └── utils/
│       ├── intentParser.js
│       └── mockWeatherData.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   ├── ThemeContext.jsx
│       │   └── ChatContext.jsx
│       ├── pages/
│       │   └── Home.jsx
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── ChatWindow.jsx
│       │   ├── ChatMessage.jsx
│       │   ├── ChatInput.jsx
│       │   ├── WelcomeScreen.jsx
│       │   ├── WeatherCard.jsx
│       │   ├── ForecastCard.jsx
│       │   ├── HourlyForecast.jsx
│       │   ├── WeatherChart.jsx
│       │   ├── WeatherAlert.jsx
│       │   ├── SettingsModal.jsx
│       │   └── UI/
│       │       ├── Button.jsx
│       │       ├── Card.jsx
│       │       ├── Badge.jsx
│       │       ├── Tooltip.jsx
│       │       └── WeatherIcon.jsx
│       ├── services/
│       │   ├── weatherApi.js
│       │   └── chatApi.js
│       └── utils/
│           └── speechRecognition.js
└── README.md
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Backend Setup

```bash
cd backend
npm install
```

#### Environment Variables (`backend/.env`)

```env
PORT=5000
WEATHER_API_KEY=your_openweathermap_key_here
AI_API_KEY=your_gemini_or_openai_key_here
```

*Note: If `WEATHER_API_KEY` or `AI_API_KEY` are empty, WeatherAI automatically runs in full fallback mode with realistic mock data and intelligent rule-based responses.*

Start backend server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
# Dev server runs on http://localhost:3000
```

To build for production:
```bash
npm run build
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status check |
| `GET` | `/api/weather/current?city=Nagpur` | Fetch current weather data |
| `GET` | `/api/weather/forecast?city=Nagpur` | Fetch 24h & 5-day forecast |
| `GET` | `/api/weather/location?lat=21.14&lon=79.08` | Reverse geocode coordinates |
| `POST` | `/api/chat` | Natural language chatbot query processing |

---

## 🎯 Example Chatbot Prompts

- *"What is the weather in Nagpur?"*
- *"Will it rain tomorrow in Mumbai?"*
- *"What is the temperature in Delhi?"*
- *"Give me the 5-day forecast for Pune."*
- *"Should I carry an umbrella today?"*
- *"Is it a good day for travel in Bangalore?"*
- *"Is today good for jogging in Kolkata?"*

---

## 🔮 Future Improvements

1. Integration with radar maps and satellite imagery.
2. Web Push Notifications for severe weather warnings.
3. Multi-language localization (Hindi, Marathi, Spanish, French).
