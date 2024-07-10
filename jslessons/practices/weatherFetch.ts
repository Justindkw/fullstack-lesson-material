import transformData from "./transformWeatherData";

const apiKey = '497271503905d37ca93a3a86038a081d';
const cityCoordAPI = (city:string)=> `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
const weekWeatherAPI = (lat:string, lon:string) => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America%2FLos_Angeles&models=gem_seamless`;
// Weather code descriptions based on Open-Meteo documentation
const weatherCodeDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Drizzle: Light',
  53: 'Drizzle: Moderate',
  55: 'Drizzle: Dense intensity',
  56: 'Freezing Drizzle: Light',
  57: 'Freezing Drizzle: Dense intensity',
  61: 'Rain: Slight',
  63: 'Rain: Moderate',
  65: 'Rain: Heavy intensity',
  66: 'Freezing Rain: Light',
  67: 'Freezing Rain: Heavy intensity',
  71: 'Snow fall: Slight',
  73: 'Snow fall: Moderate',
  75: 'Snow fall: Heavy intensity',
  77: 'Snow grains',
  80: 'Rain showers: Slight',
  81: 'Rain showers: Moderate',
  82: 'Rain showers: Violent',
  85: 'Snow showers slight',
  86: 'Snow showers heavy',
  95: 'Thunderstorm: Slight or moderate',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

interface Coordinate {
  lat: string,
  lon: string,
}

interface WeatherData {
  time: string[],
  weather_code: number[],
  temperature_2m_max: number[],
  temperature_2m_min: number[],
  precipitation_sum: number[]
}
// Function to get the weather forecast
async function getWeeklyWeather(city: string) {
  try {
    const coordResponse = await fetch(cityCoordAPI(city));
    const coordData = await coordResponse.json();
    const {lat, lon} = (coordData as Coordinate[])[0];
    const weatherResponse= await fetch(weekWeatherAPI(lat,lon));
    const weatherData = await weatherResponse.json();
    const weatherInfo = transformData((weatherData as {daily: WeatherData}).daily)
    console.log(`Weather for ${city} for the next 7 days:`)
    weatherInfo.forEach(({time, weather, precip, tempMinMax}) => {
      console.log(`${time}: ${weather}. Temperature: ${tempMinMax}. Precipitation: ${precip}.`);
    })
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
}

// Call the function
getWeeklyWeather("Vancouver");
