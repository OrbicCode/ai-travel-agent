import { useState } from 'react';
import TravellerCounter from '../../components/TravellerCounter/TravellerCounter';

export default function PlanningPage() {
  const [travellers, setTravellers] = useState<number>(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <TravellerCounter travellers={travellers} onChange={setTravellers} />
      <button>Plan My Trip!</button>
    </form>
  );
}
