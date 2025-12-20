import { useState } from 'react';
import TravellerCounter from '../../components/TravellerCounter/TravellerCounter';
import styles from './PlanningPage.module.css';

export default function PlanningPage() {
  const [travellers, setTravellers] = useState<number>(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <TravellerCounter travellers={travellers} onChange={setTravellers} />
      <div className={styles.destinationsContainer}>
        <div className={styles.inputContainer}>
          <label>Flying from</label>
          <input type='text' placeholder='London' className={styles.input} />
        </div>
        <div className={styles.inputContainer}>
          <label>Flying to</label>
          <input type='text' placeholder='Paris' className={styles.input} />
        </div>
      </div>
      <button className={styles.button}>Plan My Trip!</button>
    </form>
  );
}
