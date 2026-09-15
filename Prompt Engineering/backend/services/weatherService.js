const axios = require('axios');
const { generateCurrentWeather, generateForecast } = require('../utils/mockWeatherData');

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

// In-memory cache to avoid unnecessary API hits (5 minute TTL)
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached(key) {
  const item = cache.get(key);
  if (item && (Date.now() - item.timestamp < CACHE_TTL_MS)) {
    return item.data;
  }
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch Current Weather for a given city or coords
 */
async function getCurrentWeather(city, lat, lon) {
  const cacheKey = city ? `current:${city.toLowerCase()}` : `current:${lat},${lon}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_api_key')) {
    console.log(`[WeatherService] API Key missing/placeholder. Using mock data for: ${city || `${lat},${lon}`}`);
    const mockData = generateCurrentWeather(city || 'Nagpur');
    setCached(cacheKey, mockData);
    return mockData;
  }

  try {
    let url = `${OPENWEATHER_BASE_URL}/weather?units=metric&appid=${apiKey}`;
    if (city) {
      url += `&q=${encodeURIComponent(city)}`;
    } else if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    } else {
      throw new Error('City or coordinates required');
    }

    const response = await axios.get(url, { timeout: 8000 });
    const data = response.data;

    const formattedData = {
      location: {
        name: data.name,
        state: data.sys?.country ? `${data.sys.country}` : '',
        country: data.sys?.country || '',
        coord: data.coord
      },
      current: {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        condition: data.weather[0]?.main || 'Clear',
        description: data.weather[0]?.description || 'Clear sky',
        icon: data.weather[0]?.icon || '01d',
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        windDirection: getWindDirection(data.wind.deg),
        pressure: data.main.pressure,
        visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
        uvIndex: 6, // OpenWeather basic API doesn't include UV in current weather
        cloudCoverage: data.clouds?.all || 0,
        rainProbability: data.rain ? 80 : (data.clouds?.all || 20),
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      alerts: data.weather[0]?.main === 'Thunderstorm' ? [{
        id: 'alert-storm',
        severity: 'high',
        title: 'Thunderstorm Warning',
        description: 'Severe weather with active electrical activity expected in area.'
      }] : []
    };

    setCached(cacheKey, formattedData);
    return formattedData;
  } catch (error) {
    console.warn(`[WeatherService] API call failed (${error.message}). Falling back to mock generator.`);
    const mockData = generateCurrentWeather(city || 'Nagpur');
    return mockData;
  }
}

/**
 * Fetch Forecast (Hourly + 5-day) for a given city or coords
 */
async function getForecast(city, lat, lon) {
  const cacheKey = city ? `forecast:${city.toLowerCase()}` : `forecast:${lat},${lon}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_api_key')) {
    console.log(`[WeatherService] API Key missing/placeholder. Using mock forecast for: ${city || `${lat},${lon}`}`);
    const mockData = generateForecast(city || 'Nagpur');
    setCached(cacheKey, mockData);
    return mockData;
  }

  try {
    let url = `${OPENWEATHER_BASE_URL}/forecast?units=metric&appid=${apiKey}`;
    if (city) {
      url += `&q=${encodeURIComponent(city)}`;
    } else if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    }

    const response = await axios.get(url, { timeout: 8000 });
    const data = response.data;

    // Process hourly (next 8 items = 24 hours in 3h steps)
    const hourly = data.list.slice(0, 8).map((item, index) => {
      const dt = new Date(item.dt * 1000);
      const hourVal = dt.getHours();
      return {
        time: index === 0 ? 'Now' : dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hour: hourVal,
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        condition: item.weather[0]?.main || 'Clear',
        icon: item.weather[0]?.icon || '01d',
        rainProb: Math.round((item.pop || 0) * 100),
        humidity: item.main.humidity
      };
    });

    // Group by day for 5-day forecast
    const dailyMap = new Map();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    data.list.forEach(item => {
      const dateStr = item.dt_txt.split(' ')[0];
      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, []);
      }
      dailyMap.get(dateStr).push(item);
    });

    const daily = Array.from(dailyMap.entries()).slice(0, 5).map(([dateStr, items], index) => {
      const dateObj = new Date(dateStr);
      const dayName = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : daysOfWeek[dateObj.getDay()];
      const temps = items.map(i => i.main.temp);
      const maxTemp = Math.round(Math.max(...temps));
      const minTemp = Math.round(Math.min(...temps));
      const midItem = items[Math.floor(items.length / 2)];
      const maxPop = Math.round(Math.max(...items.map(i => i.pop || 0)) * 100);

      return {
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        day: dayName,
        tempMax: maxTemp,
        tempMin: minTemp,
        condition: midItem.weather[0]?.main || 'Clear',
        icon: midItem.weather[0]?.icon || '01d',
        rainProb: maxPop,
        humidity: midItem.main.humidity,
        windSpeed: Math.round(midItem.wind.speed * 3.6)
      };
    });

    // Get current weather base details
    const currentWeather = await getCurrentWeather(city, lat, lon);

    const result = {
      ...currentWeather,
      hourly,
      daily
    };

    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`[WeatherService] Forecast API failed (${error.message}). Falling back to mock forecast.`);
    const mockData = generateForecast(city || 'Nagpur');
    return mockData;
  }
}

/**
 * Reverse Geocoding
 */
async function getLocationName(lat, lon) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_api_key')) {
    return { name: 'Nagpur', country: 'IN' };
  }

  try {
    const url = `${GEO_BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    const response = await axios.get(url, { timeout: 5000 });
    if (response.data && response.data.length > 0) {
      return {
        name: response.data[0].name,
        state: response.data[0].state || '',
        country: response.data[0].country || ''
      };
    }
  } catch (err) {
    console.warn('[WeatherService] Reverse geocode failed:', err.message);
  }
  return { name: 'Current Location', country: '' };
}

function getWindDirection(deg) {
  if (!deg) return 'N';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}

module.exports = {
  getCurrentWeather,
  getForecast,
  getLocationName
};
