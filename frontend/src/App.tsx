import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { message } from 'antd';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection/HeroSection';
import RecognitionStrip from './components/RecognitionStrip';
import UrgencySection from './components/UrgencySection';
import MissionSection from './components/MissionSection';
import AboutSection from './components/AboutSection';
import EventsSection from './components/EventsSection/EventsSection';
import LegacySection from './components/LegacySection';
import FounderSection from './components/FounderSection';
import CollegeSection from './components/CollegeSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';

import { registrationService } from './services/registrationService';

import AdminLogin from './components/Admin/AdminLogin';
import AdminProtectedRoute from './components/Admin/AdminProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';

function LandingPage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');

  useEffect(() => {
    // Fetch welcome message from backend
    registrationService.getWelcomeMessage()
      .then((res) => {
        message.success({
          content: res.message,
          style: {
            marginTop: '20px',
          },
        });
      })
      .catch((err) => {
        console.error('Failed to load welcome message from backend:', err);
      });
  }, []);

  const openRegister = (eventName = '') => {
    setSelectedEvent(eventName);
    setIsRegisterOpen(true);
  };

  const closeRegister = () => {
    setIsRegisterOpen(false);
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white/20 selection:text-white">
      <Navbar onRegisterClick={() => openRegister()} />
      <main>
        <HeroSection onRegisterClick={() => openRegister()} />
        <RecognitionStrip />
        <UrgencySection />
        <MissionSection />
        <AboutSection />
        <LegacySection />
        <FounderSection />
        <EventsSection onRegisterClick={(eventName) => openRegister(eventName)} />
        <CollegeSection />
        <CTASection onRegisterClick={() => openRegister()} />
      </main>
      <Footer />

      {/* Global Registration Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeRegister}
        initialEventName={selectedEvent}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/home" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
