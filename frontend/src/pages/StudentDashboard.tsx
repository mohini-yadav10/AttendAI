import { GithubIcon } from '../components/GithubIcon';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
  QrCode,
  Fingerprint,
  CreditCard,
  Camera,
  Layers,
  ChevronRight,
  TrendingUp,
  Download,
  Send,
  X,
  Radio,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MentorRubricModal } from '../components/MentorRubricModal';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // State for attendance predictor simulator
  const [classesToMiss, setClassesToMiss] = useState<number>(1);

  // Leave request modal state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveSubject, setLeaveSubject] = useState('Computer Science (CS401)');

  // Biometric verification modal state
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<'rfid' | 'face' | 'fingerprint'>('face');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRubricOpen, setIsRubricOpen] = useState(false);

  // Student Courses Data
  const [courses] = useState([
    {
      code: 'CS401',
      name: 'Computer Science & Software Architecture',
      instructor: 'Dr. Sarah Mitchell',
      attended: 28,
      total: 30,
      rate: 93.3,
      schedule: 'Mon & Wed 10:00 AM',
      room: 'Hall 301',
      status: 'Excellent',
    },
    {
      code: 'CS201',
      name: 'Data Structures & Algorithms',
      instructor: 'Prof. Alan Walker',
      attended: 22,
      total: 24,
      rate: 91.6,
      schedule: 'Tue & Thu 02:00 PM',
      room: 'Lab 4',
      status: 'Excellent',
    },
    {
      code: 'AI305',
      name: 'Machine Learning & Neural Networks',
      instructor: 'Dr. Evelyn Reed',
      attended: 18,
      total: 18,
      rate: 100.0,
      schedule: 'Friday 09:30 AM',
      room: 'AI Center',
      status: 'Perfect',
    },
    {
      code: 'DB102',
      name: 'Database Management Systems',
      instructor: 'Prof. David Chen',
      attended: 19,
      total: 22,
      rate: 86.4,
      schedule: 'Wed & Fri 01:00 PM',
      room: 'Lab 2',
      status: 'Good',
    },
  ]);

  // Multimodal Attendance Log
  const [recentLogs] = useState([
    {
      id: 'LOG-9821',
      time: 'Today, 10:02 AM',
      course: 'Computer Science (CS401)',
      method: 'Facial Recognition',
      terminal: 'BioEnable Gate Terminal A',
      status: 'Verified',
      confidence: '99.4%',
    },
    {
      id: 'LOG-9819',
      time: 'Yesterday, 02:04 PM',
      course: 'Data Structures (CS201)',
      method: 'RFID Smart Tap',
      terminal: 'Lab 4 NFC Reader',
      status: 'Verified',
      confidence: '100%',
    },
    {
      id: 'LOG-9804',
      time: 'May 16, 09:31 AM',
      course: 'Machine Learning (AI305)',
      method: 'Optical Fingerprint',
      terminal: 'Biometric Scanner 02',
      status: 'Verified',
      confidence: '98.9%',
    },
    {
      id: 'LOG-9788',
      time: 'May 15, 01:03 PM',
      course: 'Database Systems (DB102)',
      method: 'Facial Recognition',
      terminal: 'BioEnable Gate Terminal B',
      status: 'Verified',
      confidence: '99.1%',
    },
  ]);

  // Total stats
  const totalAttended = courses.reduce((sum, c) => sum + c.attended, 0);
  const totalSessions = courses.reduce((sum, c) => sum + c.total, 0);
  const overallRate = ((totalAttended / totalSessions) * 100).toFixed(1);

  // Predictor formula: if student misses next N classes
  const predictedRate = (
    (totalAttended / (totalSessions + Number(classesToMiss || 0))) *
    100
  ).toFixed(1);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate || !leaveReason) {
      toast.error('Please fill in both the date and reason.');
      return;
    }
    toast.success(`Leave request for ${leaveSubject} on ${leaveDate} submitted to instructor!`);
    setIsLeaveModalOpen(false);
    setLeaveReason('');
    setLeaveDate('');
  };

  const handleSimulateAuthentication = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsBiometricModalOpen(false);
      toast.success(
        `Multimodal authentication successful! Sensor: ${selectedSensor.toUpperCase()}`
      );
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ── Top Hero Banner (Modern Onyx & Warm Gold Gradient) ── */}
      <div className="onyx-hero-gradient relative overflow-hidden rounded-3xl p-7 sm:p-9 shadow-2xl border border-zinc-800">
        {/* Subtle decorative glowing gold & charcoal spheres */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-zinc-700/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider backdrop-blur-xs shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>BioEnable Multimodal Student Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-sm">
              Welcome back, {user?.name || 'Alex Johnson'}!
            </h1>
            <p className="text-sm text-zinc-300 font-medium max-w-2xl leading-relaxed">
              Enrolled in Computer Science & Artificial Intelligence • Student ID:{' '}
              <span className="font-mono text-amber-400 font-black px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700">
                STU-2026-8829
              </span>{' '}
              • Semester VI
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/mohini-yadav10/AttendAI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
            >
              <GithubIcon className="w-4 h-4 text-amber-400" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>

            <button
              onClick={() => setIsRubricOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <Award className="w-4 h-4" />
              <span>Mentor Rubric</span>
            </button>

            <button
              onClick={() => setIsBiometricModalOpen(true)}
              className="btn-amber inline-flex items-center space-x-2 px-5 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-white" />
              <span>Test Biometric ID</span>
            </button>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-xs"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Request Leave</span>
            </button>
          </div>
        </div>

        {/* Status bar pills with high contrast */}
        <div className="relative z-10 mt-7 pt-5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-white">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center space-x-2 bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-zinc-700/80">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-zinc-200">RFID Smart Pass: Active</span>
            </div>
            <div className="flex items-center space-x-2 bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-zinc-700/80">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-zinc-200">Facial Token: 3D Enrolled</span>
            </div>
            <div className="flex items-center space-x-2 bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-zinc-700/80">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-zinc-200">Optical Fingerprint: Verified</span>
            </div>
          </div>
          <div className="text-amber-400 font-mono text-xs bg-zinc-900/90 px-4 py-1.5 rounded-full border border-amber-500/40 font-bold">
            Term Attendance: <span className="text-white font-black">{overallRate}%</span> (Min Req: 75%)
          </div>
        </div>
      </div>

      {/* ── 4 Key Performance Cards (Full-width grid) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Attendance Rate */}
        <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
              Overall Rate
            </span>
            <div className="w-9 h-9 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-black text-zinc-900 font-mono">{overallRate}%</h3>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
              On Track
            </span>
          </div>
          <div className="mt-3 w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallRate}%` }}
            />
          </div>
          <p className="text-[11px] font-semibold text-zinc-400 mt-2">
            {totalAttended} of {totalSessions} total sessions attended
          </p>
        </div>

        {/* Card 2: Biometric Credentials */}
        <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
              Smart Pass ID
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-zinc-900 font-mono">8829-AF</h3>
            <span className="text-xs font-extrabold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-300">
              NFC Tap
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-700 mt-3 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Multi-Factor Biometrics Active</span>
          </p>
          <p className="text-[11px] font-semibold text-zinc-400 mt-1">
            Expires: Aug 2030 • Encrypted Token
          </p>
        </div>

        {/* Card 3: Excused Leaves */}
        <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
              Leaves & Absences
            </span>
            <div className="w-9 h-9 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-black text-zinc-900 font-mono">
              {totalSessions - totalAttended}
            </h3>
            <span className="text-xs font-semibold text-zinc-400">sessions total</span>
          </div>
          <p className="text-xs font-bold text-zinc-700 mt-3 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>2 Medical Excused • 1 Unexcused</span>
          </p>
          <p className="text-[11px] font-semibold text-zinc-400 mt-1">
            Permitted leaves remaining: 4
          </p>
        </div>

        {/* Card 4: Academic Standing */}
        <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
              Examination Eligibility
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-amber-700 font-mono">Eligible</h3>
            <span className="text-xs font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-300">
              Clear
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-700 mt-3 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Honor Roll Standing</span>
          </p>
          <p className="text-[11px] font-semibold text-zinc-400 mt-1">
            Threshold: 75.0% • Buffer: +19.8%
          </p>
        </div>
      </div>

      {/* ── Main Responsive Content Grid (2 Columns: 8-col Left, 4-col Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Enrolled Courses + Simulator + Attendance Log */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Enrolled Courses & Attendance Breakdown */}
          <div id="courses" className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-black text-zinc-900 tracking-tight flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-zinc-900" />
                  <span>Enrolled Course Modules</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Real-time biometric attendance tracking across all active courses
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs font-extrabold px-3 py-1 rounded-xl bg-zinc-100 text-zinc-800 border border-zinc-200">
                4 Active Courses
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {courses.map((course) => (
                <div
                  key={course.code}
                  className="p-4 sm:p-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-400 hover:shadow-card transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                        {course.code}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-zinc-900 leading-snug">
                          {course.name}
                        </h3>
                        <p className="text-xs text-zinc-500 font-medium">
                          {course.instructor} • {course.schedule} • {course.room}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-lg font-black font-mono text-zinc-900">
                          {course.rate.toFixed(1)}%
                        </span>
                        <p className="text-[11px] font-semibold text-zinc-400">
                          {course.attended}/{course.total} classes
                        </p>
                      </div>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                        {course.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${course.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Multimodal Verification Activity Log */}
          <div id="logs" className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200 shadow-card">
            <div className="flex items-center justify-between pb-5 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-black text-zinc-900 tracking-tight flex items-center space-x-2">
                  <Fingerprint className="w-5 h-5 text-zinc-900" />
                  <span>Biometric Access & Verification Log</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Live multimodal authentication events from classroom sensors
                </p>
              </div>
              <button
                onClick={() => toast.success('Telemetry log refreshed')}
                className="text-xs font-bold text-zinc-900 hover:text-amber-700 hover:underline cursor-pointer"
              >
                Refresh Log
              </button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-[11px] font-extrabold uppercase text-zinc-400">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Course / Session</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Hardware Terminal</th>
                    <th className="py-2.5 px-3 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-zinc-600 whitespace-nowrap">
                        {log.time}
                      </td>
                      <td className="py-3 px-3 font-bold text-zinc-900">{log.course}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-900 font-bold border border-zinc-200">
                          {log.method === 'Facial Recognition' ? (
                            <Camera className="w-3.5 h-3.5 text-zinc-800" />
                          ) : log.method === 'RFID Smart Tap' ? (
                            <CreditCard className="w-3.5 h-3.5 text-zinc-800" />
                          ) : (
                            <Fingerprint className="w-3.5 h-3.5 text-zinc-800" />
                          )}
                          <span>{log.method}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">
                        {log.terminal}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-amber-700">
                        {log.confidence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Smart Attendance Predictor & Target Simulator */}
          <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-card">
            <div className="flex items-center space-x-3 pb-4 border-b border-amber-200/50">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-zinc-900">
                  Attendance Predictor & Safe-Leave Simulator
                </h3>
                <p className="text-xs text-zinc-500">
                  Simulate your future attendance rate before missing any class or taking leave
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-extrabold text-zinc-700 block mb-1.5 uppercase tracking-wider">
                    If I miss upcoming classes:
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setClassesToMiss(num)}
                        className={`w-10 h-10 rounded-xl font-black text-sm transition-all cursor-pointer ${
                          classesToMiss === num
                            ? 'bg-zinc-900 text-white shadow-md shadow-zinc-900/25 scale-105'
                            : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  Anticipating {classesToMiss} absence(s) across your registered courses will adjust
                  your overall attendance from{' '}
                  <span className="font-bold text-zinc-900">{overallRate}%</span> to{' '}
                  <span className="font-black text-zinc-900">{predictedRate}%</span>.
                </p>
              </div>

              {/* Simulation Result Card */}
              <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                    Simulated Projected Attendance
                  </span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <h4 className="text-3xl font-black font-mono text-zinc-900">
                      {predictedRate}%
                    </h4>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        Number(predictedRate) >= 75
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {Number(predictedRate) >= 75 ? 'Safe (> 75% min)' : 'Warning (< 75%)'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>Threshold Requirement</span>
                  <span className="font-mono font-bold text-zinc-800">75.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Smart Biometric Pass Card + Quick Tools */}
        <div className="lg:col-span-4 space-y-8">
          {/* ── Visual Biometric Student Smart Pass (RFID / NFC Digital Pass) ── */}
          <div id="pass" className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-700">
                Digital Biometric Pass
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Contactless NFC
              </span>
            </div>

            {/* Smart Pass Card Container */}
            <div className="onyx-smart-card relative overflow-hidden rounded-3xl text-white p-6 shadow-2xl border border-zinc-800">
              {/* Card visual elements */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-zinc-950 font-black flex items-center justify-center text-xs shadow-md">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-wider uppercase text-white">
                      AttendAI Student Pass
                    </h4>
                    <p className="text-[9px] text-amber-300 font-bold uppercase tracking-widest">
                      BioEnable Fusion
                    </p>
                  </div>
                </div>
                <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>

              {/* Chip & NFC symbol */}
              <div className="mt-6 flex items-center justify-between">
                <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-100/70 shadow-xs flex items-center justify-center">
                  <div className="w-7 h-5 border border-amber-700/40 rounded-xs" />
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono uppercase text-amber-300 font-black tracking-widest">
                    NFC VERIFIED
                  </span>
                </div>
              </div>

              {/* Student Details on Card */}
              <div className="mt-6">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  Student Holder
                </p>
                <h5 className="text-lg font-black tracking-wide text-white">
                  {user?.name || 'Alex Johnson'}
                </h5>
                <p className="font-mono text-xs text-amber-300 font-bold tracking-wider mt-0.5">
                  STU-2026-8829-AF
                </p>
              </div>

              {/* Expiration and Status footer */}
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-300">
                <div>
                  <span className="text-[9px] block text-zinc-500 font-sans uppercase font-bold">
                    Validity
                  </span>
                  <span>EXP: 08/2030</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] block text-zinc-500 font-sans uppercase font-bold">Status</span>
                  <span className="text-amber-400 font-black uppercase">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Card Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsBiometricModalOpen(true)}
                className="py-2.5 px-3 rounded-2xl bg-white border border-zinc-200 text-zinc-800 hover:text-zinc-950 hover:border-zinc-400 font-bold text-xs transition-all text-center cursor-pointer shadow-xs"
              >
                Sync Biometrics
              </button>
              <button
                onClick={() =>
                  toast.success('Official Attendance Certificate downloaded as PDF!')
                }
                className="btn-onyx py-2.5 px-3 rounded-2xl text-white font-bold text-xs transition-all text-center cursor-pointer"
              >
                Export Pass
              </button>
            </div>
          </div>

          {/* Multimodal Hardware Status Widget */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-card space-y-4">
            <h3 className="text-sm font-black text-zinc-900 tracking-tight flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-zinc-900" />
              <span>Registered Authentication Modes</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 text-zinc-900 flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">3D Face Mesh</p>
                    <p className="text-[10px] text-zinc-400 font-medium">128-d Vector Template</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Enrolled
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Optical Fingerprint</p>
                    <p className="text-[10px] text-zinc-400 font-medium">Minutiae Map v2</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Enrolled
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-200 text-zinc-900 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">MIFARE Smart RFID</p>
                    <p className="text-[10px] text-zinc-400 font-medium">13.56 MHz High-Freq</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Department Announcements Card */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-card space-y-3">
            <h3 className="text-sm font-black text-zinc-900 tracking-tight">
              Class Announcements
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-bold text-amber-800 block">Today • Dr. Sarah Mitchell</span>
                <p className="text-zinc-800 font-semibold mt-0.5">
                  Final Software Architecture review session will record attendance via multimodal gate.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] font-bold text-zinc-500 block">Yesterday • Academic Affairs</span>
                <p className="text-zinc-800 font-semibold mt-0.5">
                  Semester attendance cutoff is approaching. Submit pending medical slips by Friday.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Leave Application Form ── */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-zinc-200 animate-pop-in">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">Request Leave of Absence</h3>
                  <p className="text-xs text-zinc-500">Official leave notification for instructors</p>
                </div>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase">
                  Select Course / Session
                </label>
                <select
                  value={leaveSubject}
                  onChange={(e) => setLeaveSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-800"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                  <option value="All Classes Today">All Classes Today</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase">
                  Leave Date
                </label>
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase">
                  Reason for Absence
                </label>
                <textarea
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="e.g. Medical appointment, university event, or bereavement..."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-onyx px-5 py-2.5 rounded-2xl text-white text-xs font-black active:scale-95 cursor-pointer"
                >
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Biometric Sensor Verification Test ── */}
      {isBiometricModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-zinc-200 animate-pop-in">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">Biometric Verification Test</h3>
                  <p className="text-xs text-zinc-500">Test live terminal sensor authentication</p>
                </div>
              </div>
              <button
                onClick={() => setIsBiometricModalOpen(false)}
                className="p-1 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSensor('face')}
                  className={`p-3 rounded-2xl border flex flex-col items-center space-y-1.5 transition-all cursor-pointer ${
                    selectedSensor === 'face'
                      ? 'border-zinc-900 bg-zinc-100 text-zinc-950 shadow-2xs font-bold'
                      : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[11px] font-bold">Face 3D</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSensor('fingerprint')}
                  className={`p-3 rounded-2xl border flex flex-col items-center space-y-1.5 transition-all cursor-pointer ${
                    selectedSensor === 'fingerprint'
                      ? 'border-zinc-900 bg-zinc-100 text-zinc-950 shadow-2xs font-bold'
                      : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                  }`}
                >
                  <Fingerprint className="w-5 h-5" />
                  <span className="text-[11px] font-bold">Fingerprint</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSensor('rfid')}
                  className={`p-3 rounded-2xl border flex flex-col items-center space-y-1.5 transition-all cursor-pointer ${
                    selectedSensor === 'rfid'
                      ? 'border-zinc-900 bg-zinc-100 text-zinc-950 shadow-2xs font-bold'
                      : 'border-zinc-200 hover:bg-zinc-50 text-zinc-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[11px] font-bold">RFID Card</span>
                </button>
              </div>

              {/* Sensor graphic animation */}
              <div className="p-8 rounded-2xl bg-zinc-950 text-white flex flex-col items-center justify-center space-y-3 text-center border border-zinc-800">
                <div className="relative">
                  {isAuthenticating && (
                    <div className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-40" />
                  )}
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-lg">
                    {selectedSensor === 'face' ? (
                      <Camera className="w-7 h-7" />
                    ) : selectedSensor === 'fingerprint' ? (
                      <Fingerprint className="w-7 h-7" />
                    ) : (
                      <CreditCard className="w-7 h-7" />
                    )}
                  </div>
                </div>
                <p className="text-xs font-semibold text-zinc-300">
                  {isAuthenticating
                    ? 'Capturing sensor telemetry & cryptographic signing...'
                    : `Ready to scan ${
                        selectedSensor === 'face'
                          ? 'Face'
                          : selectedSensor === 'fingerprint'
                          ? 'Fingerprint'
                          : 'RFID Smart Card'
                      }`}
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBiometricModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={handleSimulateAuthentication}
                  className="btn-amber px-5 py-2.5 rounded-2xl text-white text-xs font-black disabled:opacity-50 cursor-pointer"
                >
                  {isAuthenticating ? 'Authenticating...' : 'Authenticate Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Rubric Evaluation Modal */}
      <MentorRubricModal isOpen={isRubricOpen} onClose={() => setIsRubricOpen(false)} />
    </div>
  );
};
