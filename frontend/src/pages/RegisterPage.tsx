import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Sparkles, Lock, Mail, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('All fields are required.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password, role });
      if (res.success && res.data) {
        const data = res.data as any;
        login(data.token, data.user);
        toast.success('Registration successful! Welcome to AttendAI.');
        navigate(data.user?.role === 'teacher' ? '/dashboard' : '/student/dashboard');
      } else {
        toast.error(res.error || 'Registration failed.');
      }
    } catch {
      // Offline fallback
      login('mock-registered-token', {
        id: 'user-' + Date.now(),
        name,
        email,
        role,
      });
      toast.success('Registered successfully (Offline Demo)');
      navigate(role === 'teacher' ? '/dashboard' : '/student/dashboard');
    } finally {
      setLoading(false);
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
        <h2 className="mt-4 text-2xl font-bold text-charcoal-900">Create an AttendAI Account</h2>
        <p className="mt-1 text-sm text-charcoal-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-surface py-8 px-6 shadow-sm border border-charcoal-200 rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                Full Name
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prof. Jane Doe"
                  required
                  className="block w-full pl-9 pr-3 py-2.5 border border-charcoal-300 rounded-xl text-sm placeholder-charcoal-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                Academic Email
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@university.edu"
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
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="block w-full pl-9 pr-3 py-2.5 border border-charcoal-300 rounded-xl text-sm placeholder-charcoal-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-2 px-3 text-sm font-semibold rounded-xl border text-center transition ${
                    role === 'teacher'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-charcoal-300 text-charcoal-600 hover:bg-charcoal-50'
                  }`}
                >
                  Instructor / Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 text-sm font-semibold rounded-xl border text-center transition ${
                    role === 'student'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-charcoal-300 text-charcoal-600 hover:bg-charcoal-50'
                  }`}
                >
                  Student
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50"
            >
              <span>{loading ? 'Registering...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
