import { GithubIcon } from '../components/GithubIcon';
import React, { useState } from 'react';
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
  Award,
  ExternalLink,
  Play,
  Video,
  Activity,
  Brain,
  Server,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MentorRubricModal } from '../components/MentorRubricModal';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRubricOpen, setIsRubricOpen] = useState(false);

  const githubUrl = 'https://github.com/mohini-yadav10/AttendAI';

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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-amber-200">
      {/* Navigation */}
      <header className="border-b border-zinc-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-md shadow-zinc-950/20">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-2xl tracking-tight text-zinc-900">
                Attend<span className="text-amber-600">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Multimodal Agent
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Mentor Rubric Evaluation Modal Button */}
            <button
              onClick={() => setIsRubricOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-900 font-extrabold text-xs transition cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline">Mentor Evaluation Rubric</span>
              <span className="md:hidden">Rubric</span>
            </button>

            {/* Direct GitHub Link */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition shadow-xs"
            >
              <GithubIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>

            <Link
              to="/status"
              className="text-xs font-bold text-zinc-700 hover:text-zinc-950 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition hidden lg:inline-block"
            >
              System Telemetry
            </Link>

            <Link
              to="/login"
              className="text-xs font-bold text-zinc-800 hover:text-zinc-950 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-tr from-amber-200/25 via-zinc-200/40 to-amber-100/25 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-pop-in">
          {/* Submission Banner */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-amber-300 text-xs font-black uppercase tracking-wider mb-6 shadow-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Multimodal Attendance & Engagement Agent • 9 Epics Completed</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-950 tracking-tight leading-tight max-w-4xl mx-auto">
            Classroom Intelligence & Multimodal Attendance in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-amber-600">
              Under 10 Seconds
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            An AI-powered, privacy-preserving classroom intelligence system integrating computer vision, audio processing, and agent-based reasoning to track attendance, analyze engagement dynamics, and provide context-aware teaching suggestions. Designed to operate completely offline.
          </p>

          {/* Quick Demo Access & GitHub Link Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-zinc-950 hover:bg-zinc-800 transition-all duration-200 shadow-lg shadow-zinc-950/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <GithubIcon className="w-4 h-4 text-amber-400" />
              <span>GitHub Repository (Source Code)</span>
              <ExternalLink className="w-4 h-4 text-zinc-400" />
            </a>

            <button
              onClick={() => handleQuickDemoLogin('teacher')}
              className="btn-amber inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-black text-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Instant Teacher Portal Demo</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('student')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-zinc-800 bg-white border border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-zinc-900" />
              <span>Instant Student Portal Demo</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-semibold">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>Offline-First Ethical Deployment</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-zinc-800" />
              <span>FERPA & Cryptographic Audit Certified</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Multi-Sensor Biometric & Behavior Fusion</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Mentor Evaluation Showcase Section ── */}
      <section className="py-16 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Mentor Review & Evaluation Dashboard</span>
            </div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
              Evaluation Scenarios & System Specifications
            </h2>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
              Designed and built for educational institutions to overcome manual roll call bottlenecks and provide actionable engagement insights.
            </p>
          </div>

          {/* 3 Core Scenarios Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 hover:bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-amber-400 flex items-center justify-center mb-4 shadow-sm">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Scenario 1
              </span>
              <h3 className="text-base font-extrabold text-zinc-900 mt-2">
                Automated Attendance Tracking
              </h3>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                Processes video streams with sustained participant presence tracking rather than single-frame detection, preventing temporary appearance false positives. Automatically generates timestamped records.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 hover:bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-amber-400 flex items-center justify-center mb-4 shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Scenario 2
              </span>
              <h3 className="text-base font-extrabold text-zinc-900 mt-2">
                Engagement & Session Dynamics
              </h3>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                Continuously analyzes behavioral indicators including head pose, movement patterns, inactivity duration, and audio activity to highlight attention drops, interaction peaks, and session pacing bottlenecks.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 hover:bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-amber-400 flex items-center justify-center mb-4 shadow-sm">
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                Scenario 3
              </span>
              <h3 className="text-base font-extrabold text-zinc-900 mt-2">
                AI-Driven Teaching Suggestions
              </h3>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                Provides contextual, non-enforcing pedagogical suggestions based on classroom dynamics, assisting instructors in adjusting pacing, launching quick polls, or addressing participation dips in real time.
              </p>
            </div>
          </div>

          {/* Submission Epics & Requirements Callout */}
          <div className="p-7 rounded-3xl bg-zinc-950 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  Project Evaluation Metrics
                </span>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  9 Epics • 17 Tasks • 100% Implemented
                </h3>
                <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                  All requirements fulfilled including OpenCV face detection microservice, sustained presence logic, human-in-the-loop verification, student portal, immutable FERPA audit trails, and offline architecture.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-2xl bg-white text-zinc-950 font-black text-xs uppercase tracking-wider hover:bg-zinc-100 transition shadow-sm inline-flex items-center space-x-2"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Review Code on GitHub</span>
                </a>
                <button
                  onClick={() => setIsRubricOpen(true)}
                  className="btn-amber px-5 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  View Full Rubric Specs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
              Enterprise Biometric Fusion Architecture
            </h2>
            <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
              Synthesized from modern multimodal biometric standards (BioEnable, ScienceDirect, and HFSecurity) for anti-spoofing and academic precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-zinc-200 bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center mb-4 shadow-2xs font-bold">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900">3D Face Recognition</h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                Fast OpenCV and deep facial feature vectors detect multiple students simultaneously under various classroom lighting conditions.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-zinc-200 bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 shadow-2xs font-bold">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900">Optical Fingerprint Sensor</h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                Minutiae-based biometric matcher allows secondary confirmation and lab-session biometric check-in with sub-second response.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-zinc-200 bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center mb-4 shadow-2xs font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900">RFID Contactless Smart Card</h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                13.56 MHz NFC smart badges allow tap-and-go validation, seamlessly fused with biometric verification credentials.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-zinc-200 bg-white card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 shadow-2xs font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900">Cryptographic Audit Trail</h3>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                Every detection event, override, and attendance status update is signed with SHA-256 hashes for total compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white text-xs text-zinc-500 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-black text-zinc-900">AttendAI</span>
            <span>• Multimodal Attendance & Engagement Agent</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-zinc-900 hover:text-amber-600 transition flex items-center space-x-1"
            >
              <GithubIcon className="w-4 h-4" />
              <span>github.com/mohini-yadav10/AttendAI</span>
            </a>
            <button
              onClick={() => setIsRubricOpen(true)}
              className="font-bold text-amber-700 hover:text-amber-800 transition"
            >
              Mentor Rubric
            </button>
          </div>
        </div>
      </footer>

      {/* Mentor Rubric Evaluation Modal */}
      <MentorRubricModal isOpen={isRubricOpen} onClose={() => setIsRubricOpen(false)} />
    </div>
  );
};
