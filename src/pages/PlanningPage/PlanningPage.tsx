import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import openai from '../../lib/config';
import { getFlights, getHotels, tools } from '../../lib/tools';
import TravelerCounter from '../../components/TravelerCounter/TravelerCounter';
import styles from './PlanningPage.module.css';
import { getWeather } from '../../lib/tools';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export default function PlanningPage() {
  const [travelers, settravelers] = useState<number>(1);
  const [flyingFrom, setFlyingFrom] = useState<string>('');
  const [flyingTo, setFlyingTo] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [budget, setBudget] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    function getCurrentDate() {
      setCurrentDate(new Date().toISOString().split('T')[0]);
    }
    getCurrentDate();
  }, []);

  function handleFlyingFrom(e: React.ChangeEvent<HTMLInputElement>) {
    setFlyingFrom(e.target.value);
  }
  function handleFlyingTo(e: React.ChangeEvent<HTMLInputElement>) {
    setFlyingTo(e.target.value);
  }
  function handleFromDate(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value > toDate && fromDate) {
      setToDate(e.target.value);
    }
    setFromDate(e.target.value);
  }
  function handleToDate(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value > fromDate) {
      setToDate(e.target.value);
    } else {
      setToDate(fromDate);
    }
  }
  function handleBudget(e: React.ChangeEvent<HTMLInputElement>) {
    setBudget(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a helpful feline travel agent who likes to end every sentence with ", meow.".
                  You will use functions to get the flying from, flying to, from date, to date and budget.
                  You will then craft one sentence responses in JSON format about the weather, flights and hotels.
                  Make sure that when I pull the content from the message that I can run the command JSON.parse() on my end.

                  JSON format (with example responses): {
                    weather: 'You can expect the weather to be foggy. Low will be 30ºC/F and high will be 35ºC/F, meow.',
                    flights: 'The best option for you is with Delta Airlines with a layover in Oslo, meow.',
                    hotels: 'We recommend you stay at the Premiere Inn hotel in central Paris, meow.'
                  }
                  
                  Just stick to one sentence answers. Do not ask for extra details in your responses.
        `,
      },
      {
        role: 'user',
        content: `
          Travelers: ${travelers}
          Flying From: ${flyingFrom},
          Flying To: ${flyingTo},
          From Date: ${fromDate},
          To Date: ${toDate},
          Budget: £ ${budget}
        `,
      },
    ];

    navigate('/loading', { replace: true });

    const MAX_ITERATIONS = 3;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-5-nano',
          messages,
          tools,
        });

        const { message, finish_reason: finishReason } = response.choices[0];
        const { tool_calls: toolCalls } = message;

        console.log(`Message: ${message}`);
        messages.push(message);

        if (finishReason === 'tool_calls' && toolCalls) {
          for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            console.log(`ToolCall: ${toolCall}`);

            if (functionName === 'getWeather') {
              const weatherResult = await getWeather(functionArgs.flyingTo);
              messages.push({
                tool_call_id: toolCall.id,
                role: 'tool',
                name: functionName,
                content: weatherResult,
              });
            }
            if (functionName === 'getFlights') {
              const flightsResult = await getFlights(
                functionArgs.travelers,
                functionArgs.flyingFrom,
                functionArgs.flyingTo
              );
              messages.push({
                tool_call_id: toolCall.id,
                role: 'tool',
                name: functionName,
                content: flightsResult,
              });
            }
            if (functionName === 'getHotels') {
              const hootelsResult = await getHotels(functionArgs.travelers, functionArgs.flyingTo);
              messages.push({
                tool_call_id: toolCall.id,
                role: 'tool',
                name: functionName,
                content: hootelsResult,
              });
            }
          }
        } else {
          const aiResponse = message.content;
          if (aiResponse) {
            console.log(JSON.parse(aiResponse));
          }
          const tripData = {
            travelers,
            flyingFrom,
            flyingTo,
            fromDate,
            toDate,
            budget,
            aiResponse,
          };
          navigate('/summary', { state: tripData });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <TravelerCounter travelers={travelers} onChange={settravelers} />
      <div className={styles.inputGroupContainer}>
        <div className={styles.inputContainer}>
          <label>Flying from</label>
          <input
            type='text'
            placeholder='London'
            onChange={handleFlyingFrom}
            value={flyingFrom}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputContainer}>
          <label>Flying to</label>
          <input
            type='text'
            placeholder='Paris'
            onChange={handleFlyingTo}
            value={flyingTo}
            className={styles.input}
            required
          />
        </div>
      </div>

      <div className={styles.inputGroupContainer}>
        <div className={styles.inputContainer}>
          <label>From Date</label>
          <input
            type='date'
            min={currentDate}
            placeholder='London'
            onChange={handleFromDate}
            value={fromDate}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputContainer}>
          <label>To Date</label>
          <input
            type='date'
            min={currentDate}
            placeholder='Paris'
            onChange={handleToDate}
            value={toDate}
            className={styles.input}
            required
          />
        </div>
      </div>

      <div className={styles.inputContainer}>
        <label>Budget (£)</label>
        <input
          type='number'
          placeholder='1000'
          onChange={handleBudget}
          value={budget}
          className={styles.input}
        />
      </div>
      <button className={styles.button}>Plan My Trip!</button>
    </form>
  );
}
