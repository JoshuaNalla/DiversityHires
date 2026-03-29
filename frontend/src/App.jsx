import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FaceEmotionReader from './components/FaceEmotionReader';
import ResumeFlow from './components/ResumeFlow';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/emotion" element={<FaceEmotionReader />} />
        <Route path="/resume" element={<ResumeFlow />} />
      </Routes>
    </BrowserRouter>
  );
}
