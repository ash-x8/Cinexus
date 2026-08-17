import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Search, Bookmark, User } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { currentUser, watchlist } = useMovies();

  // Hide on admin route
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Search', path: '/search', icon: Search },
    {
      label: 'My List',
      path: '/my-list',
      icon: Bookmark,
      badge: watchlist.length > 0 ? watchlist.length : undefined,
    },
    {
      label: currentUser ? 'Profile' : 'Sign In',
      path: currentUser ? '/profile' : '/login',
      icon: User,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0E]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#FF0E25] font-extrabold'
                  : 'text-[#9E9EA0] hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-[#FF0E25] text-white text-[9px] font-black shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#FF0E25] shadow-[0_0_8px_#FF0E25]" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
