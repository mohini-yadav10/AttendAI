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
  Fingerprint,
  CreditCard,
  Layers,
  Cpu,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-wine-800 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-wine-900 via-wine-800 to-wine-700 flex items-center justify-center text-white shadow-md shadow-wine-900/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-2xl tracking-tight text-slate-900">
                Attend<span className="text-wine-800">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Multimodal Fusion
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/status"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              System Telemetry
            </Link>
            <Link
              to="/login"
              className="text-xs font-bold text-wine-800 hover:text-wine-900 px-3 py-1.5 rounded-xl hover:bg-wine-50 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-bold text-white bg-wine-800 hover:bg-wine-900 px-4 py-2 rounded-xl transition-all shadow-md shadow-wine-800/20 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-tr from-wine-300/25 via-amber-200/25 to-wine-200/25 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-pop-in">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-wine-50 border border-wine-200/80 text-wine-900 text-xs font-bold mb-6 shadow-2xs">
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>BioEnable Multimodal Attendance & Biometric Identity Verification</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Automate Multimodal Attendance in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-wine-800 via-wine-700 to-amber-600">
              Under 10 Seconds
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AttendAI seamlessly unifies high-speed facial recognition, optical fingerprint scanning, and contactless RFID smart cards with human-in-the-loop review and real-time academic analytics.
          </p>

          {/* Quick Demo Access Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleQuickDemoLogin('teacher')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-wine-800 hover:bg-wine-900 transition-all duration-200 shadow-lg shadow-wine-800/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Instant Teacher Portal Demo</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
            <button
              onClick={() => handleQuickDemoLogin('student')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 hover:border-wine-300 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-wine-800" />
              <span>Instant Student Web Portal</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>BioEnable & HFSecurity Ready</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-wine-800" />
              <span>FERPA & Cryptographic Audit Certified</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Multi-Sensor Biometric Fusion</span>
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Enterprise Biometric Fusion Architecture
            </h2>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Synthesized from modern multimodal biometric standards (BioEnable, ScienceDirect, and HFSecurity) for anti-spoofing and academic precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-wine-100 text-wine-800 flex items-center justify-center mb-4 shadow-2xs">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">3D Face Recognition</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Fast OpenCV and 128-d deep facial feature vectors detect multiple students simultaneously under various classroom lighting conditions.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 shadow-2xs">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Optical Fingerprint Sensor</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Minutiae-based biometric matcher allows secondary confirmation and lab-session biometric check-in with sub-second response.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-wine-100 text-wine-800 flex items-center justify-center mb-4 shadow-2xs">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">RFID Contactless Smart Card</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                13.56 MHz NFC smart badges allow tap-and-go validation, seamlessly fused with biometric verification credentials.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/80 bg-slate-50/50 hover:bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Cryptographic Audit Trail</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Every detection event, override, and attendance status update is signed with SHA-256 hashes for total compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-50 text-center text-xs text-slate-400 border-t border-slate-200">
        <p>© 2026 AttendAI Platform • Multimodal Biometric Fusion Architecture. Built with React, TypeScript, Express, MongoDB, and FastAPI.</p>
      </footer>
    </div>
  );
};
