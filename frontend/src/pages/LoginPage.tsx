import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Sparkles, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const data = res.data as any;
        login(data.token, data.user);
        toast.success(`Welcome back, ${data.user?.name || 'User'}!`);
        navigate(data.user?.role === 'teacher' ? '/dashboard' : '/student/dashboard');
      } else {
        toast.error(res.error || 'Invalid email or password.');
      }
    } catch {
      // In offline / fallback mode, permit login if matching demo accounts
      if (email === 'teacher@attendai.edu' || email.includes('teacher')) {
        login('mock-jwt-teacher-token', {
          id: '60c72b2f9b1d8b2bad6838a1',
          name: 'Dr. Sarah Mitchell',
          email,
          role: 'teacher',
        });
        toast.success('Logged in as Teacher (Offline Demo Mode)');
        navigate('/dashboard');
      } else if (email === 'student@attendai.edu' || email.includes('student')) {
        login('mock-jwt-student-token', {
          id: '60c72b2f9b1d8b2bad6838b2',
          name: 'Alex Johnson',
          email,
          role: 'student',
        });
        toast.success('Logged in as Student (Offline Demo Mode)');
        navigate('/student/dashboard');
      } else {
        toast.error('Unable to reach server. Please use quick demo buttons below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: 'teacher' | 'student') => {
    if (role === 'teacher') {
      setEmail('teacher@attendai.edu');
      setPassword('Password123!');
    } else {
      setEmail('student@attendai.edu');
      setPassword('Password123!');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-charcoal-900">
            Attend<span className="text-primary-600">AI</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-charcoal-900">Sign in to your account</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          Or{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            register for a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-surface py-8 px-6 shadow-sm border border-charcoal-200 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                Email address
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@attendai.edu"
                  required
                  className="block w-full pl-9 pr-3 py-2.5 border border-charcoal-300 rounded-xl text-sm placeholder-charcoal-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="block w-full pl-9 pr-3 py-2.5 border border-charcoal-300 rounded-xl text-sm placeholder-charcoal-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Autofill section */}
          <div className="mt-6 pt-6 border-t border-charcoal-200">
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider text-center mb-3">
              One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('teacher')}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 border border-charcoal-200 rounded-lg text-xs font-medium text-charcoal-700 bg-charcoal-50 hover:bg-charcoal-100 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-primary-600" />
                <span>Fill Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('student')}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 border border-charcoal-200 rounded-lg text-xs font-medium text-charcoal-700 bg-charcoal-50 hover:bg-charcoal-100 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-sage-600" />
                <span>Fill Student</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
