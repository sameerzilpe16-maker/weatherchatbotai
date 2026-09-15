import axios from 'axios';

const API_BASE = '/api/weather';

export async function fetchCurrentWeather(city, lat, lon) {
  try {
    const params = {};
    if (city) params.city = city;
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get(`${API_BASE}/current`, { params });
    return response.data;
  } catch (error) {
    console.error('fetchCurrentWeather error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch current weather.');
  }
}

export async function fetchForecast(city, lat, lon) {
  try {
    const params = {};
    if (city) params.city = city;
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get(`${API_BASE}/forecast`, { params });
    return response.data;
  } catch (error) {
    console.error('fetchForecast error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch forecast.');
  }
}

export async function fetchReverseGeocode(lat, lon) {
  try {
    const response = await axios.get(`${API_BASE}/location`, {
      params: { lat, lon }
    });
    return response.data;
  } catch (error) {
    console.error('fetchReverseGeocode error:', error);
    return { name: 'Current Location', country: '' };
  }
}
