interface WeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

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


const weatherData = {
  time: [
    '2024-07-09',
    '2024-07-10',
    '2024-07-11',
    '2024-07-12',
    '2024-07-13',
    '2024-07-14',
    '2024-07-15'
  ],
  weather_code: [
    0, 0, 2, 0,
    0, 0, 0
  ],
  temperature_2m_max: [
    29.8, 26.3, 22.7,
    23, 20.7, 21.5,
    22
  ],
  temperature_2m_min: [
    15.4, 16.4, 16.2,
    13.7,   14, 15.1,
    15.4
  ],
  precipitation_sum: [
    0, 0, 0, 0,
    0, 0, 0
  ]
} as WeatherData

export default function transformData(data: WeatherData) {
  const {time, weather_code,  temperature_2m_max, temperature_2m_min, precipitation_sum} = weatherData;
  const weatherInfo: WeatherInfo[] = [];
  for (let i = 0; i < time.length; i++) {
    weatherInfo.push({
      time: time[i],
      weather: weatherCodeDescriptions[weather_code[i] as keyof typeof weatherCodeDescriptions],
      tempMinMax: `${Math.round(temperature_2m_min[i])}-${Math.round(temperature_2m_max[i])}`,
      precip: precipitation_sum[i]
    });
  }
  return weatherInfo;
}

interface WeatherInfo {
  time: string;
  weather: string;
  tempMinMax: string;
  precip: number;
}

console.log(transformData(weatherData));
