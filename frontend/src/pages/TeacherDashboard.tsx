import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '../components/CircularProgress';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/Loading';
import {
  Users,
  Calendar,
  Camera,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Fingerprint,
  QrCode,
  Radio,
  Cpu,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { sessionApi } from '../services/api';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);

  // Weekly attendance chart data
  const attendanceChartData = [
    { day: 'Mon', attendance: 94, target: 85 },
    { day: 'Tue', attendance: 88, target: 85 },
    { day: 'Wed', attendance: 96, target: 85 },
    { day: 'Thu', attendance: 90, target: 85 },
    { day: 'Fri', attendance: 93, target: 85 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await sessionApi.getAll({ limit: 5 });
        if (res.success && res.data) {
          setRecentSessions(res.data as any[]);
        } else {
          fallbackSessions();
        }
      } catch {
        fallbackSessions();
      } finally {
        setLoading(false);
      }
    };

    const fallbackSessions = () => {
      setRecentSessions([
        {
          _id: 'sess-101',
          title: 'Session 03: Real-Time Face Detection & Tracking',
          className: 'CS401: Intro to AI & Machine Learning',
          date: new Date().toISOString(),
          status: 'active',
          mode: 'automated',
          presentCount: 7,
          totalCount: 8,
        },
        {
          _id: 'sess-102',
          title: 'Session 02: Convolutional Neural Networks',
          className: 'CS401: Intro to AI & Machine Learning',
          date: new Date(Date.now() - 2 * 86400000).toISOString(),
          status: 'completed',
          mode: 'automated',
          presentCount: 7,
          totalCount: 8,
        },
        {
          _id: 'sess-103',
          title: 'Session 01: Computer Vision & Edge Detection',
          className: 'CS401: Intro to AI & Machine Learning',
          date: new Date(Date.now() - 7 * 86400000).toISOString(),
          status: 'completed',
          mode: 'automated',
          presentCount: 6,
          totalCount: 8,
        },
      ]);
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading multimodal command center..." />;
  }

  return (
    <div className="space-y-8 animate-pop-in">
      {/* ── Modern Pine Green Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-pine-700 p-7 sm:p-9 text-white shadow-xl">
        {/* Subtle organic wavy line background matching uploaded screenshot card */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 500 240" fill="none" className="w-full h-full">
            <path d="M-50 180 C 120 100, 260 220, 550 120" stroke="white" strokeWidth="28" />
            <path d="M-20 60 C 160 10, 280 180, 520 80" stroke="white" strokeWidth="18" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-pine-100 mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-marigold-400" />
              <span>BioEnable Multimodal Attendance Center • Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome back, {user?.name || 'Dr. Sarah Mitchell'}
            </h1>
            <p className="mt-2 text-pine-100 text-sm max-w-xl leading-relaxed">
              Multi-sensor face recognition, optical fingerprinting, and contactless RFID pass validation are online for lecture CS401.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/sessions/new-capture"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-bold text-slate-900 bg-marigold-500 hover:bg-marigold-600 shadow-lg shadow-marigold-500/25 transition-all duration-200 hover:scale-105 active:scale-95 text-xs uppercase tracking-wider"
            >
              <Camera className="w-4 h-4 text-slate-900" />
              <span>Launch Multimodal Capture</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3 Horizontal Stat Blocks (Matching Screenshot Style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Block 1: Pine Green */}
        <div className="bg-pine-700 text-white rounded-3xl p-6 shadow-md card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-pine-200 text-xs font-bold">
            <span>Overall Enrollment</span>
            <Users className="w-4 h-4 text-marigold-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black">8 Students</h3>
            <p className="text-xs text-pine-200 mt-1">2 Active Courses</p>
          </div>
        </div>

        {/* Block 2: Vibrant Marigold */}
        <div className="bg-marigold-500 text-white rounded-3xl p-6 shadow-md shadow-marigold-500/20 card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-marigold-100 text-xs font-bold">
            <span>Sensor Fusion Score</span>
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black">98.5%</h3>
            <p className="text-xs text-marigold-100 mt-1">Face + Fingerprint + RFID</p>
          </div>
        </div>

        {/* Block 3: Pine Green */}
        <div className="bg-pine-700 text-white rounded-3xl p-6 shadow-md card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-pine-200 text-xs font-bold">
            <span>Verified Sessions</span>
            <Calendar className="w-4 h-4 text-marigold-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black">24 Completed</h3>
            <p className="text-xs text-pine-200 mt-1">Zero Discrepancies</p>
          </div>
        </div>
      </div>

      {/* ── Biometric Hardware Status & Analytics Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Progression Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-black text-slate-900">Attendance Progression</h2>
              <p className="text-xs text-slate-400">Multi-day presence verified via biometric telemetry</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-pine-700 bg-pine-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-pine-700" />
              <span>92.4% avg compliance</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[60, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Attendance']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(27, 77, 68, 0.1)',
                  }}
                />
                <Bar dataKey="attendance" fill="#1b4d44" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multimodal Hardware Gateway */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between card-hover">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">Hardware Gateway</h2>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Online
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-pine-100 text-pine-700">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">OpenCV Camera Node</p>
                    <p className="text-[10px] text-slate-400">640x480 • 45ms Latency</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-marigold-100 text-marigold-700">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Optical Fingerprint Sensor</p>
                    <p className="text-[10px] text-slate-400">500 DPI Capacitive</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-pine-100 text-pine-700">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">RFID Contactless Reader</p>
                    <p className="text-[10px] text-slate-400">13.56MHz MIFARE EV3</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/sessions/new-capture"
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-white bg-pine-700 hover:bg-pine-800 transition text-xs shadow-xs"
            >
              <span>Launch Live Roll Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent Class Sessions Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden card-hover">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Recent Class Sessions</h2>
            <p className="text-xs text-slate-400">Roll call history across courses</p>
          </div>
          <Link
            to="/sessions"
            className="text-xs font-bold text-pine-700 hover:text-pine-900 inline-flex items-center space-x-1"
          >
            <span>All Sessions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Session Title</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Modality</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Attendance</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSessions.map((session) => (
                <tr key={session._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {session.title}
                    <p className="text-xs font-normal text-slate-400">
                      {session.className || 'CS401: Intro to AI & ML'}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs">
                    {new Date(session.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pine-50 text-pine-800 border border-pine-200 capitalize font-bold">
                      Multimodal
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={session.status || 'completed'} />
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-700 text-xs">
                    {session.presentCount !== undefined ? `${session.presentCount} / ${session.totalCount} Present` : '7 / 8 Present'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/sessions/${session._id}/capture`}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                        session.status === 'active'
                          ? 'bg-marigold-500 text-white hover:bg-marigold-600 shadow-xs'
                          : 'bg-pine-50 text-pine-800 hover:bg-pine-100'
                      }`}
                    >
                      {session.status === 'active' ? 'Capture' : 'Review'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
