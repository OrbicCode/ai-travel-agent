import { Link } from 'react-router';
import styles from './LandingPage.module.css';
import cat from '/cat.png';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <img src={cat} width={400} />
      <Link to='/planning'>
        <button className={styles.button}>Let's Begin</button>
      </Link>
    </div>
  );
}
