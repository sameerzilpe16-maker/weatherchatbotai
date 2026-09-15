// Fallback Mock Weather Generator for WeatherAI
// Provides high-quality, realistic weather data for any requested city when API key is missing or unavailable.

const CITIES_DB = {
  nagpur: { name: 'Nagpur', state: 'Maharashtra', country: 'IN', baseTemp: 31, condition: 'Partly Cloudy', icon: '02d', humidity: 64, windSpeed: 14, uv: 7, pressure: 1012, visibility: 8, rainProb: 35 },
  mumbai: { name: 'Mumbai', state: 'Maharashtra', country: 'IN', baseTemp: 30, condition: 'Humid & Clear', icon: '01d', humidity: 78, windSpeed: 18, uv: 8, pressure: 1009, visibility: 10, rainProb: 20 },
  pune: { name: 'Pune', state: 'Maharashtra', country: 'IN', baseTemp: 28, condition: 'Pleasant Breeze', icon: '02d', humidity: 58, windSpeed: 16, uv: 6, pressure: 1014, visibility: 10, rainProb: 15 },
  delhi: { name: 'Delhi', state: 'Delhi', country: 'IN', baseTemp: 34, condition: 'Hazy Sun', icon: '50d', humidity: 52, windSpeed: 12, uv: 9, pressure: 1008, visibility: 6, rainProb: 10 },
  bangalore: { name: 'Bangalore', state: 'Karnataka', country: 'IN', baseTemp: 26, condition: 'Scattered Showers', icon: '10d', humidity: 72, windSpeed: 15, uv: 5, pressure: 1015, visibility: 9, rainProb: 65 },
  hyderabad: { name: 'Hyderabad', state: 'Telangana', country: 'IN', baseTemp: 32, condition: 'Sunny', icon: '01d', humidity: 50, windSpeed: 13, uv: 8, pressure: 1011, visibility: 10, rainProb: 5 },
  kolkata: { name: 'Kolkata', state: 'West Bengal', country: 'IN', baseTemp: 33, condition: 'Thunderstorm Warning', icon: '11d', humidity: 82, windSpeed: 24, uv: 6, pressure: 1005, visibility: 5, rainProb: 85 }
};

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getCityBase(cityName) {
  const normalized = cityName.trim().toLowerCase();
  if (CITIES_DB[normalized]) {
    return CITIES_DB[normalized];
  }

  // Deterministically generate attributes for unknown cities
  const hash = hashString(normalized);
  const baseTemp = 18 + (hash % 18); // 18 - 36 °C
  const conditions = [
    { condition: 'Sunny', icon: '01d', humidity: 45, rainProb: 5 },
    { condition: 'Partly Cloudy', icon: '02d', humidity: 62, rainProb: 25 },
    { condition: 'Cloudy', icon: '04d', humidity: 70, rainProb: 40 },
    { condition: 'Light Rain', icon: '10d', humidity: 80, rainProb: 70 },
    { condition: 'Thunderstorm', icon: '11d', humidity: 88, rainProb: 90 }
  ];
  const cond = conditions[hash % conditions.length];

  // Capitalize city name nicely
  const formattedName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  return {
    name: formattedName,
    state: '',
    country: '',
    baseTemp,
    condition: cond.condition,
    icon: cond.icon,
    humidity: cond.humidity,
    windSpeed: 10 + (hash % 15),
    uv: 3 + (hash % 7),
    pressure: 1008 + (hash % 12),
    visibility: 7 + (hash % 4),
    rainProb: cond.rainProb
  };
}

function generateCurrentWeather(cityName) {
  const base = getCityBase(cityName);
  const now = new Date();
  
  // Format sunrise / sunset
  const sunrise = new Date(now);
  sunrise.setHours(6, 12, 0);
  const sunset = new Date(now);
  sunset.setHours(18, 42, 0);

  const feelsLike = Math.round(base.baseTemp + (base.humidity > 70 ? 3 : 1));

  let alerts = [];
  if (base.rainProb >= 75) {
    alerts.push({
      id: 'alert-rain',
      severity: 'high',
      title: 'Heavy Rain Warning',
      description: `Heavy rainfall expected in ${base.name} with probabilities exceeding ${base.rainProb}%. Stay indoors if possible.`
    });
  } else if (base.baseTemp >= 35) {
    alerts.push({
      id: 'alert-heat',
      severity: 'medium',
      title: 'High Temperature Advisory',
      description: `Temperature is reaching ${base.baseTemp}°C. Stay hydrated and avoid direct sunlight during peak hours.`
    });
  } else if (base.windSpeed >= 20) {
    alerts.push({
      id: 'alert-wind',
      severity: 'medium',
      title: 'Strong Winds Advisory',
      description: `Wind gusts up to ${base.windSpeed + 10} km/h expected in coastal/open areas.`
    });
  }

  return {
    location: {
      name: base.name,
      state: base.state,
      country: base.country,
      coord: { lat: 21.1458, lon: 79.0882 }
    },
    current: {
      temp: base.baseTemp,
      feelsLike: feelsLike,
      tempMin: base.baseTemp - 3,
      tempMax: base.baseTemp + 4,
      condition: base.condition,
      description: `${base.condition.toLowerCase()} with gentle breeze`,
      icon: base.icon,
      humidity: base.humidity,
      windSpeed: base.windSpeed,
      windDirection: 'NE (45°)',
      pressure: base.pressure,
      visibility: base.visibility,
      uvIndex: base.uv,
      cloudCoverage: base.rainProb > 40 ? 65 : 25,
      rainProbability: base.rainProb,
      sunrise: sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sunset: sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    alerts
  };
}

function generateForecast(cityName) {
  const current = generateCurrentWeather(cityName);
  const base = current.current;
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();

  // 24-Hour Forecast (Hourly)
  const hourly = [];
  const startHour = new Date().getHours();
  for (let i = 0; i < 24; i++) {
    const hourVal = (startHour + i) % 24;
    const timeLabel = i === 0 ? 'Now' : `${hourVal % 12 === 0 ? 12 : hourVal % 12} ${hourVal >= 12 ? 'PM' : 'AM'}`;
    
    // Simulate diurnal temperature variation
    const tempDelta = Math.sin((hourVal - 6) * Math.PI / 12) * 4;
    const hourTemp = Math.round(base.temp + tempDelta);
    const hourRainProb = Math.min(100, Math.max(5, Math.round(base.rainProbability + (Math.cos(i) * 15))));
    const hourHumidity = Math.min(95, Math.max(30, Math.round(base.humidity - (tempDelta * 2))));

    let icon = base.icon;
    if (hourVal < 6 || hourVal > 19) {
      icon = icon.replace('d', 'n');
    }

    hourly.push({
      time: timeLabel,
      hour: hourVal,
      temp: hourTemp,
      feelsLike: hourTemp + 1,
      condition: base.condition,
      icon,
      rainProb: hourRainProb,
      humidity: hourHumidity
    });
  }

  // 5-Day Forecast
  const daily = [];
  for (let i = 0; i < 5; i++) {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() + i);
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysOfWeek[(todayIndex + i) % 7];
    const dateFormatted = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const maxTemp = base.tempMax + (i % 2 === 0 ? 1 : -1);
    const minTemp = base.tempMin + (i % 2 === 0 ? -1 : 1);
    const dayRainProb = Math.min(95, Math.max(10, base.rainProbability + (i * 7) % 35));

    let dayCondition = base.condition;
    let dayIcon = base.icon;

    if (dayRainProb > 60) {
      dayCondition = 'Rain Showers';
      dayIcon = '10d';
    } else if (dayRainProb > 40) {
      dayCondition = 'Partly Cloudy';
      dayIcon = '02d';
    } else {
      dayCondition = 'Mostly Sunny';
      dayIcon = '01d';
    }

    daily.push({
      date: dateFormatted,
      day: dayName,
      tempMax: maxTemp,
      tempMin: minTemp,
      condition: dayCondition,
      icon: dayIcon,
      rainProb: dayRainProb,
      humidity: Math.min(90, base.humidity + (i * 3) % 20),
      windSpeed: base.windSpeed + (i % 3)
    });
  }

  return {
    ...current,
    hourly,
    daily
  };
}

module.exports = {
  generateCurrentWeather,
  generateForecast
};
