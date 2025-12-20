import { useEffect, useState } from 'react';
import TravellerCounter from '../../components/TravellerCounter/TravellerCounter';
import styles from './PlanningPage.module.css';

export default function PlanningPage() {
  const [travellers, setTravellers] = useState<number>(0);
  const [flyingFrom, setFlyingFrom] = useState<string>('');
  const [flyingTo, setFlyingTo] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string | undefined>(undefined);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [budget, setBudget] = useState<string>('');

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
