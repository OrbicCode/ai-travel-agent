import openai from './config';

export async function getWeather(flyingTo: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${flyingTo}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
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

export async function getFlights(travelers: number, flyingFrom: string, flyingTo: string) {
  console.log(
    `getFlights Args: Travellers ${travelers}, flyingFrom: ${flyingFrom}, flyingTo: ${flyingTo}`
  );
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: 'system',
          content: `You are a helpful travel agent.
          You will be given the number of travelers, where they are flying from and where they are flying to.

          Craft a one sentence response recommending the best flight option for them.

          Example: The best option for you is with Delta Airlines with a layover in Oslo.
        `,
        },
        {
          role: 'user',
          content: `
          Travelers: ${travelers},
          Flying From: ${flyingFrom}
          Flying to: ${flyingTo}
        `,
        },
      ],
    });
    console.log(`getFlights Response: ${response.choices[0].message.content}`);
    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getHotels(travelers: number, flyingTo: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: 'system',
          content: `You are a helpful travel agent.
          You will be given the number of travelers and where they are flying to.

          Craft a one sentence response recommending the best Hotel option for them.

          Example: We recommend you stay at the Premiere Inn hotel in central Paris.
        `,
        },
        {
          role: 'user',
          content: `
          Travelers: ${travelers},
          Flying to: ${flyingTo}
        `,
        },
      ],
    });
    console.log(`getHotels Response: ${response.choices[0].message.content}`);
    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const tools = [
  {
    type: 'function',
    function: {
      name: 'getWeather',
      description:
        'An api call to OpenWeather API that returns the weather description, minimum and maximum temperature in Kelvin.',
      parameters: {
        type: 'object',
        properties: {
          flyingTo: {
            type: 'string',
            description: 'The destination, where the travelers are flying to.',
          },
        },
        required: ['flyingTo'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getFlights',
      description: 'An api call to get a flight recommendation',
      parameters: {
        type: 'object',
        properties: {
          travelers: {
            type: 'string',
            description: 'The number of travelers.',
          },
          flyingFrom: {
            type: 'string',
            description: 'The destination, where the travelers are flying from.',
          },
          flyingTo: {
            type: 'string',
            description: 'The destination, where the travelers are flying to.',
          },
        },
        required: ['travelers', 'flyingFrom', 'flyingTo'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getHotels',
      description: 'An api call to get a Hotel recommendation',
      parameters: {
        type: 'object',
        properties: {
          travelers: {
            type: 'string',
            description: 'The number of travelers.',
          },
          flyingTo: {
            type: 'string',
            description: 'The destination, where the travelers are flying to.',
          },
        },
        required: ['travelers', 'flyingTo'],
      },
    },
  },
];
