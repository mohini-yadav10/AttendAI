import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Lock, Mail, ArrowRight, UserCheck, Fingerprint } from 'lucide-react';
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
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-11 h-11 rounded-3xl bg-pine-700 flex items-center justify-center text-white shadow-md shadow-pine-700/20">
            <Fingerprint className="w-6 h-6 text-marigold-400" />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900">
            Attend<span className="text-pine-700">AI</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">
          Biometric Gateway Access
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Or{' '}
          <Link to="/register" className="font-bold text-pine-700 hover:text-pine-900">
            register new institution account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-3xl sm:px-10 card-hover">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email address
              </label>
              <div className="mt-1.5 relative rounded-2xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@attendai.edu"
                  required
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs placeholder-slate-400 focus:ring-2 focus:ring-pine-600 focus:border-pine-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1.5 relative rounded-2xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs placeholder-slate-400 focus:ring-2 focus:ring-pine-600 focus:border-pine-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-2xl shadow-md text-xs font-black text-white bg-pine-700 hover:bg-pine-800 transition active:scale-95 uppercase tracking-wider disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('teacher')}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-pine-700" />
                <span>Fill Teacher</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('student')}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-marigold-600" />
                <span>Fill Student</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
