import styles from './PassengerCounter.module.css';

interface PassengerCounterProps {
  passengers: number;
  onChange: (number: number) => void;
}

export default function PassengerCounter({ passengers, onChange }: PassengerCounterProps) {
  function decrement() {
    if (passengers > 0) {
      onChange(passengers - 1);
    }
  }
  function increment() {
    onChange(passengers + 1);
  }
  return (
    <div className={styles.container}>
      <label>Number of Passengers</label>
      <div className={styles.counter}>
        <button onClick={decrement}>-</button>
        <span>{passengers}</span>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
}
