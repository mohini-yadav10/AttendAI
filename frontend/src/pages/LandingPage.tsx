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
  Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemoLogin = (role: 'teacher' | 'student') => {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900">
              Attend<span className="text-indigo-600">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/status"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              System Health
            </Link>
            <Link
              to="/login"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-200 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-300/30 to-purple-300/30 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-pop-in">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6 shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI-Powered Computer Vision & Classroom Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Automate Classroom Attendance in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
              Under 10 Seconds
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AttendAI pairs fast OpenCV facial detection with human-in-the-loop instructor verification, real-time analytics, and a modern student mobile portal.
          </p>

          {/* Quick Demo Access Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleQuickDemoLogin('teacher')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95"
            >
              <span>Instant Teacher Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleQuickDemoLogin('student')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>Instant Student Mobile UI</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Hardware Setup Required</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>FERPA & Biometric Consent Safe</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Complete Mock Vision Engine</span>
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Engineered for Academic Precision
            </h2>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Designed from ground up with real-world teacher workflows, security audits, and transparent AI detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white card-hover">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 shadow-2xs">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Computer Vision Capture</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Detect 50+ students in one photo frame or live camera stream using FastAPI and OpenCV.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white card-hover">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 shadow-2xs">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Teacher Confirmation</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Human-in-the-loop review interface prevents AI false positives and allows instant status tweaks.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white card-hover">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-2xs">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Attendance Analytics</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Detailed charts for attendance trends, day-of-week averages, and at-risk student warnings.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white card-hover">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Immutable Audit Logs</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Every attendance change and detection event is timestamped and recorded for FERPA compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-50 text-center text-xs text-slate-400 border-t border-slate-200">
        <p>© 2026 AttendAI Platform. Built with React, TypeScript, Express, MongoDB, and FastAPI.</p>
      </footer>
    </div>
  );
};
