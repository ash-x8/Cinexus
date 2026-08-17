import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Film } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const { loginUser } = useMovies();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (mode === 'signup' && !username.trim()) {
      setError('Please provide a username.');
      return;
    }

    loginUser(email, mode === 'signup' ? username : undefined);
    navigate('/profile');
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#121620] border border-white/10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">

      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-[#FF0E25] bg-clip-text text-transparent">
          CINEXUS
        </Link>
        <h2 className="text-xl font-bold text-white">
          {mode === 'login' ? 'Welcome Back' : 'Create Your CINEXUS Account'}
        </h2>
        <p className="text-xs text-[#9E9EA0]">
          {mode === 'login'
            ? 'Sign in to access your saved watchlists and favorites.'
            : 'Join thousands of movie fans enjoying Sinhala subbed releases.'}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">

        {mode === 'signup' && (
          <div className="space-y-1">
            <label className="font-bold text-[#9E9EA0]">Username</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 absolute left-3 text-[#9E9EA0]" />
              <input
                type="text"
                placeholder="Cinephile99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0A0A0E] text-white font-bold py-3 pl-10 pr-3 rounded-xl border border-white/10 focus:border-[#FF0E25] focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="font-bold text-[#9E9EA0]">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 absolute left-3 text-[#9E9EA0]" />
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold py-3 pl-10 pr-3 rounded-xl border border-white/10 focus:border-[#FF0E25] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-[#9E9EA0]">Password</label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 absolute left-3 text-[#9E9EA0]" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold py-3 pl-10 pr-3 rounded-xl border border-white/10 focus:border-[#FF0E25] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF0E25]/30 transition-all"
        >
          <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-white/10 text-center text-xs text-[#9E9EA0]">
        {mode === 'login' ? (
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className="text-[#FF0E25] font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="text-[#FF0E25] font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-semibold">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure CINEXUS Authentication Engine
      </div>

    </div>
  );
};
