const weatherService = require('../services/weatherService');

/**
 * GET /api/weather/current
 * Query params: ?city=Nagpur OR ?lat=21.14&lon=79.08
 */
async function getCurrentWeather(req, res) {
  try {
    const { city, lat, lon } = req.query;
    if (!city && (!lat || !lon)) {
      return res.status(400).json({ error: 'City name or lat/lon coordinates required' });
    }

    const weatherData = await weatherService.getCurrentWeather(city, lat, lon);
    res.json(weatherData);
  } catch (error) {
    console.error('Error in getCurrentWeather:', error);
    res.status(500).json({ error: 'Failed to fetch current weather data' });
  }
}

/**
 * GET /api/weather/forecast
 * Query params: ?city=Nagpur OR ?lat=21.14&lon=79.08
 */
async function getForecast(req, res) {
  try {
    const { city, lat, lon } = req.query;
    if (!city && (!lat || !lon)) {
      return res.status(400).json({ error: 'City name or lat/lon coordinates required' });
    }

    const forecastData = await weatherService.getForecast(city, lat, lon);
    res.json(forecastData);
  } catch (error) {
    console.error('Error in getForecast:', error);
    res.status(500).json({ error: 'Failed to fetch weather forecast data' });
  }
}

/**
 * GET /api/weather/location
 * Query params: ?lat=21.14&lon=79.08
 */
async function getLocation(req, res) {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Lat and lon coordinates required' });
    }

    const locationData = await weatherService.getLocationName(lat, lon);
    res.json(locationData);
  } catch (error) {
    console.error('Error in getLocation:', error);
    res.status(500).json({ error: 'Failed to reverse geocode location' });
  }
}

module.exports = {
  getCurrentWeather,
  getForecast,
  getLocation
};
