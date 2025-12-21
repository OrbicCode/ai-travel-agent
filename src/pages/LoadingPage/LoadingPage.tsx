import cat from '/cat.png';
import styles from './LoadingPage.module.css';
import { useEffect, useState } from 'react';

export default function LoadingPage() {
  const [loadingText, setLoadingText] = useState<string>('');
  useEffect(() => {
    function cycleLoadingText() {
      setLoadingText('Fetching your travel info');

      setTimeout(() => {
        setLoadingText('Meow meow meow meow');
      }, 2000);

      setTimeout(() => {
        setLoadingText('Get ready to flyyyyy!!');
      }, 4000);
    }
    cycleLoadingText();
  }, []);
  return (
    <div className={styles.container}>
      <img src={cat} />
      <span className={styles.loadingText}>{loadingText}</span>
      <span className={styles.loader}></span>
    </div>
  );
}
