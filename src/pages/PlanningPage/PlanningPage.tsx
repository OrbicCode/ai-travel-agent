import { useState } from 'react';
import PassengerCounter from '../../components/PassengerCounter/PassengerCounter';

export default function PlanningPage() {
  const [passengers, setPassengers] = useState<number>(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <PassengerCounter passengers={passengers} onChange={setPassengers} />
      <button>Plan My Trip!</button>
    </form>
  );
}
