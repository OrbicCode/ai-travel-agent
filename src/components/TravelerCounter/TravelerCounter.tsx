import styles from './TravelerCounter.module.css';

interface TravelerCounterProps {
  travelers: number;
  onChange: (number: number) => void;
}

export default function TravelerCounter({ travelers, onChange }: TravelerCounterProps) {
  function decrement() {
    if (travelers > 0) {
      onChange(travelers - 1);
    }
  }
  function increment() {
    onChange(travelers + 1);
  }
  return (
    <div className={styles.container}>
      <label>Number of travelers</label>
      <div className={styles.counter}>
        <button type='button' onClick={decrement}>
          -
        </button>
        <span>{travelers}</span>
        <button type='button' onClick={increment}>
          +
        </button>
      </div>
    </div>
  );
}
