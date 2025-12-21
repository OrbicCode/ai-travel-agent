import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import LandingPage from './pages/LandingPage/LandingPage';
import PlanningPage from './pages/PlanningPage/PlanningPage';
import LoadingPage from './pages/LoadingPage/LoadingPage';
import SummaryPage from './pages/SummaryPage/SummaryPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='planning' element={<PlanningPage />} />
        <Route path='loading' element={<LoadingPage />} />
        <Route path='summary' element={<SummaryPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
