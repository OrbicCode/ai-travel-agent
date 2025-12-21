import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import openai from '../../lib/config';
import { tools } from '../../lib/tools';
import TravellerCounter from '../../components/TravellerCounter/TravellerCounter';
import styles from './PlanningPage.module.css';
import { getWeather } from '../../lib/tools';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export default function PlanningPage() {
  const [travellers, setTravellers] = useState<number>(0);
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
        content:
          'You are a helpful feline travel agent. You are going to get the users travel location and You will then you will give the temperature with the approriate unit of the location provided.',
      },
      {
        role: 'user',
        content: `Flying to: ${flyingTo}`,
      },
    ];

    navigate('/loading');

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

        messages.push(message);

        if (finishReason === 'tool_calls' && toolCalls) {
          for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            if (functionName === 'getWeather') {
              const weatherResult = await getWeather(functionArgs.flightTo);
              messages.push({
                tool_call_id: toolCall.id,
                role: 'tool',
                name: functionName,
                content: weatherResult,
              });
            }
          }
        } else {
          const aiResponse = message.content;
          const tripData = {
            travellers,
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
      <TravellerCounter travellers={travellers} onChange={setTravellers} />
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
