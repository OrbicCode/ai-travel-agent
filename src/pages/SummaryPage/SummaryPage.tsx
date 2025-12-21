import { useLocation } from 'react-router';
import styles from './SummaryPage.module.css';

export default function SummaryPage() {
  const { state } = useLocation();

  const { flyingFrom, flyingTo, fromDate, toDate, aiResponse } = state;

  const { weather, flights, hotels } = JSON.parse(aiResponse);

  return (
    <div className={styles.container}>
      <h1>Your Trip</h1>

      <div className={styles.dateContainer}>
        <div>
          <span className={styles.arrow}>→</span>
          <span>
            {new Date(fromDate).toLocaleDateString('en-gb', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <div>
          <span>
            {new Date(toDate).toLocaleDateString('en-gb', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className={styles.arrow}>←</span>
        </div>
      </div>

      <div className={styles.locationsContainer}>
        <span>{flyingFrom}</span>
        <span className={styles.arrow}>→</span>
        <span>{flyingTo}</span>
      </div>

      <div>
        <h2>Weather</h2>
        <div className={styles.resultsContainer}>
          <span>{weather}</span>
        </div>
      </div>

      <div>
        <h2>Flights</h2>
        <div className={styles.resultsContainer}>
          <span>{flights}</span>
          <button className={styles.button}>Book</button>
        </div>
      </div>

      <div>
        <h2>Hotels</h2>
        <div className={styles.resultsContainer}>
          <span>{hotels}</span>
          <button className={styles.button}>Book</button>
        </div>
      </div>
    </div>
  );
}
