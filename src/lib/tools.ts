// type Weather = {
//   description: string;
//   tempMinKelvin: number;
//   tempMaxKelvin: number;
// };

export async function getWeather(flightTo: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${flightTo}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
    );
    const data = await response.json();
    if (data) {
      const weather = {
        description: data.weather[0].description,
        tempMinKelvin: data.main.temp_min,
        tempMaxKelvin: data.main.temp_max,
      };
      return JSON.stringify(weather);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// export async function getFlights(travellers, flightFrom, flightTo) {}

// export async function getHotel(travellers, flightTo) {}

export const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'getWeather',
      description:
        'An api call to OpenWeather API that returns the weather description, minimum and maximum temperature in Kelvin.',
      parameters: {
        type: 'object',
        properties: {
          flightTo: {
            type: 'string',
            description: 'The destination, where the travellers are flying to.',
          },
        },
        required: ['flightTo'],
      },
    },
  },
];
