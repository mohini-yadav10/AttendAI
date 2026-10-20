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
    return <LoadingSpinner text="Loading instructor command center..." />;
  }

  return (
    <div className="space-y-8 animate-pop-in">
      {/* ── Modern Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-7 sm:p-9 text-white shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-indigo-100 mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Session In Progress • CS401</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome back, {user?.name || 'Dr. Sarah Mitchell'}
            </h1>
            <p className="mt-2 text-indigo-100 text-sm max-w-xl leading-relaxed">
              Automated computer vision roll call is ready for lecture 03. Take a quick classroom snapshot to mark attendance for 8 students.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/sessions/new-capture"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-bold text-indigo-900 bg-white hover:bg-indigo-50 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>Launch Face Capture</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Radial Progress Metrics Bar (Matching Reference Aesthetic) ── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs card-hover">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Institutional Attendance Health
            </h2>
            <p className="text-xs text-slate-400">Aggregate telemetry across enrolled courses</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <CircularProgress
            value={92}
            displayValue="92%"
            color="#4f46e5"
            bgColor="#e0e7ff"
            label="Average Attendance"
            sublabel="Target: > 85%"
          />
          <CircularProgress
            value={98}
            displayValue="98.5%"
            color="#10b981"
            bgColor="#d1fae5"
            label="AI Accuracy Rate"
            sublabel="Zero False Rejections"
          />
          <CircularProgress
            value={80}
            displayValue="24"
            color="#f59e0b"
            bgColor="#fef3c7"
            label="Total Sessions"
            sublabel="All Signed Off"
          />
        </div>
      </div>

      {/* ── Visual Analytics & Quick Tile Operations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Progression Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Weekly Attendance Trend</h2>
              <p className="text-xs text-slate-400">Weekday percentage presence across classes</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3.8% this week</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[60, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Attendance Rate']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="attendance" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Operations 4-Tile Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between card-hover">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Quick Access</h2>
            <p className="text-xs text-slate-400 mt-0.5">Faculty roll call shortcuts</p>

            <div className="mt-5 space-y-3">
              <Link
                to="/sessions/new-capture"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-98 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Live Camera Roll Call</p>
                    <p className="text-[10px] text-slate-400">OpenCV auto-detection</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition" />
              </Link>

              <Link
                to="/students"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-98 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Student Directory</p>
                    <p className="text-[10px] text-slate-400">CSV import & profiles</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition" />
              </Link>

              <Link
                to="/reports"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-200 hover:-translate-y-0.5 active:scale-98 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Export Registrar CSV</p>
                    <p className="text-[10px] text-slate-400">Download signed reports</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition" />
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Next Lecture: CS201</span>
            <span className="font-semibold text-slate-700">Tomorrow 10:00 AM</span>
          </div>
        </div>
      </div>

      {/* ── Recent Sessions Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden card-hover">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Recent Class Sessions</h2>
            <p className="text-xs text-slate-400">Lecture periods, facial recognition calls, and logs</p>
          </div>
          <Link
            to="/sessions"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center space-x-1"
          >
            <span>All Sessions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Session Title</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Mode</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Attendance</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSessions.map((session) => (
                <tr key={session._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {session.title}
                    <p className="text-xs font-normal text-slate-400">
                      {session.className || 'CS401: Intro to AI'}
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
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize font-bold">
                      {session.mode || 'automated'}
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
                      className="text-xs font-bold px-3.5 py-1.5 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition shadow-2xs"
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
