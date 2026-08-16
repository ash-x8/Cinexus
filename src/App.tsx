import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { MovieProvider } from './context/MovieContext';
import { LanguageProvider } from './context/LanguageContext';
import { PlayerProvider } from './context/PlayerContext';
import { FloatingMiniPlayer } from './components/FloatingMiniPlayer';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { AdminPage } from './pages/AdminPage';
import { LegalPage } from './pages/LegalPage';

// Helper component to check window location for /admin, /#admin, or /?route=admin
const AdminRouteInterceptor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fullUrl = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    const routeParam = searchParams.get('route');

    if (
      window.location.pathname === '/admin' ||
      window.location.hash === '#admin' ||
      routeParam === 'admin'
    ) {
      if (location.pathname !== '/admin') {
        navigate('/admin', { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08090c] text-gray-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <AdminRouteInterceptor />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about-us" element={<LegalPage type="about" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/contact" element={<LegalPage type="contact" />} />
          <Route path="/faq" element={<LegalPage type="faq" />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <FloatingMiniPlayer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MovieProvider>
      <LanguageProvider>
        <PlayerProvider>
          <Router>
            <AppContent />
            <Analytics />
          </Router>
        </PlayerProvider>
      </LanguageProvider>
    </MovieProvider>
  );
};

export default App;
