import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Search, User, Menu, X, ChevronRight, Star, TrendingUp, Download, CreditCard, Check, Filter } from 'lucide-react';
import { authAPI } from '../services/api';

const LoginPage = ({ setUserRole, setCurrentView }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const name = e.target.name?.value || '';
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword?.value || '';

    try {
      let data;

      if (isSignup) {
        // basic validation
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (authAPI && typeof authAPI.signup === 'function') {
          data = await authAPI.signup({ name, email, password });
        } else {
          const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Signup failed');
        }
      } else {
        if (authAPI && typeof authAPI.login === 'function') {
          data = await authAPI.login({ email, password });
        } else {
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Login failed');
        }
      }

      // success (for both signup and login)
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      setUserRole(data.user.role);
      setCurrentView('home');

      // For signup, show success message and stay on login page
      if (isSignup) {
        setErrorMsg('Account created successfully! Please log in with your credentials.');
        setIsSignup(false); // Switch to login mode
        return; // Don't proceed to home
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMsg(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4 bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl shadow-professional-lg p-4 w-full max-w-md border border-gray-600">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-gray-300 text-sm">
            {isSignup ? 'Sign up to book amazing events' : 'Login to continue booking'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" aria-live="polite">
          {isSignup && (
            <div>
              <label className="form-label">Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="form-input"
                required
              />
            </div>
          )}

          <div>
            <label className="form-label">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          {isSignup && (
            <div>
              <label className="form-label">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>
          )}

          {errorMsg && (
            <div className="text-red-400 bg-red-900 p-4 rounded-xl border border-red-700 font-medium" role="alert">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-400 to-blue-600 text-white hover:from-blue-500 hover:to-blue-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
          >
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {!isSignup && (
          <div className="mt-6 pt-6 border-t border-gray-600 text-center">
            <button
              onClick={() => setCurrentView('forgot-password')}
              className="text-sm text-blue-400 hover:text-blue-500 font-medium hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentView('home')}
            className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
