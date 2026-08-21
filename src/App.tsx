import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// Analytics component stub for compatibility
const Analytics: React.FC = () => null;
import { MovieProvider } from './context/MovieContext';
import { LanguageProvider } from './context/LanguageContext';
import { PlayerProvider } from './context/PlayerContext';
import { FloatingMiniPlayer } from './components/FloatingMiniPlayer';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { GenresPage } from './pages/GenresPage';
import { SearchPage } from './pages/SearchPage';
import { MyListPage } from './pages/MyListPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';
import AboutPage from './app/about/page';
import PrivacyPage from './app/privacy/page';
import TermsPage from './app/terms/page';
import FAQPage from './app/faq/page';
import ContactPage from './app/contact/page';

// Helper component to check window location for /admin, /#admin, or /?route=admin
const AdminRouteInterceptor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
    <div className="min-h-screen bg-[#08090c] text-gray-100 flex flex-col font-sans selection:bg-[#FF0E25] selection:text-white pb-16 lg:pb-0">
      <AdminRouteInterceptor />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/genre/:slug" element={<GenresPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
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
