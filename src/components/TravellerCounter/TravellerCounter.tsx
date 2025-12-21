import styles from './TravellerCounter.module.css';

interface TravellerCounterProps {
  travellers: number;
  onChange: (number: number) => void;
}

export default function TravellerCounter({ travellers, onChange }: TravellerCounterProps) {
  function decrement() {
    if (travellers > 0) {
      onChange(travellers - 1);
    }
  }
  function increment() {
    onChange(travellers + 1);
  }
  return (
    <div className={styles.container}>
      <label>Number of travellers</label>
      <div className={styles.counter}>
        <button type='button' onClick={decrement}>
          -
        </button>
        <span>{travellers}</span>
        <button type='button' onClick={increment}>
          +
        </button>
      </div>
    </div>
  );
}
