import styles from './LandingPage.module.css';
import cat from '/cat.png';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <img src={cat} width={400} />
      <button className={styles.button}>Let's Begin</button>
    </div>
  );
}
