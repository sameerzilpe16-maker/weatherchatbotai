require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'WeatherAI Backend API',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(` ☀️ WeatherAI Server running on port ${PORT}`);
    console.log(` 🌐 Health: http://localhost:${PORT}/api/health`);
    console.log(`=================================`);
  });
}

module.exports = app;

