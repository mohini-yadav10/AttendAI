import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Camera,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = (role: 'teacher' | 'student') => {
    // Instant mock token login for quick demonstration without manual typing
    if (role === 'teacher') {
      login('demo-teacher-token', {
        id: '60c72b2f9b1d8b2bad6838a1',
        name: 'Dr. Sarah Mitchell',
        email: 'teacher@attendai.edu',
        role: 'teacher',
      });
      toast.success('Logged in as Teacher (Dr. Sarah Mitchell)');
      navigate('/dashboard');
    } else {
      login('demo-student-token', {
        id: '60c72b2f9b1d8b2bad6838b2',
        name: 'Alex Johnson',
        email: 'student@attendai.edu',
        role: 'student',
      });
      toast.success('Logged in as Student (Alex Johnson)');
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background text-charcoal-900">
      {/* Navigation */}
      <header className="border-b border-charcoal-200/80 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-charcoal-900">
              Attend<span className="text-primary-600">AI</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/status"
              className="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 px-3 py-1.5"
            >
              System Health
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-primary-700 hover:text-primary-800 px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition shadow-xs"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>AI-Powered Computer Vision & Classroom Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-charcoal-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Automate Classroom Attendance in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-sage-600">
              Under 10 Seconds
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-charcoal-600 max-w-2xl mx-auto">
            AttendAI pairs fast OpenCV face detection with intelligent teacher confirmation, real-time analytics, and role-based student engagement.
          </p>

          {/* Quick Demo Access Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleQuickDemoLogin('teacher')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 transition shadow-sm"
            >
              <span>Instant Teacher Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleQuickDemoLogin('student')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-base font-semibold text-charcoal-700 bg-surface border border-charcoal-300 hover:bg-charcoal-50 transition"
            >
              <span>Instant Student Demo</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-charcoal-500">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No credit card required</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Privacy & consent safe</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Full mock mode ready</span>
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-surface border-y border-charcoal-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-charcoal-900">Engineered for Academic Precision</h2>
            <p className="mt-3 text-charcoal-600">
              Designed from ground up with real-world teacher workflows, security audits, and transparent AI detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-charcoal-200 bg-background/50 hover:bg-background transition">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">Computer Vision Capture</h3>
              <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">
                Detect 50+ students in one photo frame or live camera stream using FastAPI and OpenCV.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-charcoal-200 bg-background/50 hover:bg-background transition">
              <div className="w-12 h-12 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">Teacher Confirmation</h3>
              <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">
                Human-in-the-loop review interface prevents AI false positives and allows instant status tweaks.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-charcoal-200 bg-background/50 hover:bg-background transition">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">Attendance Analytics</h3>
              <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">
                Detailed charts for attendance trends, day-of-week averages, and at-risk student warnings.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-charcoal-200 bg-background/50 hover:bg-background transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900">Immutable Audit Logs</h3>
              <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">
                Every attendance change and detection event is timestamped and recorded for FERPA compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-surface text-center text-xs text-charcoal-500 border-t border-charcoal-200">
        <p>© 2026 AttendAI Platform. Built with React, TypeScript, Express, MongoDB, and FastAPI.</p>
      </footer>
    </div>
  );
};
