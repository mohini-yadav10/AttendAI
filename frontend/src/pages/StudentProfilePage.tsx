import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentApi } from '../services/api';
import { LoadingSpinner } from '../components/Loading';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import {
  ArrowLeft,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      if (id) {
        const res = await studentApi.getById(id);
        if (res.success && res.data) {
          setProfile(res.data);
        } else {
          fallback();
        }
      } else {
        fallback();
      }
    } catch {
      fallback();
    } finally {
      setLoading(false);
    }
  };

  const fallback = () => {
    setProfile({
      _id: id || 's1',
      studentId: 'STU001',
      name: 'Alex Johnson',
      email: 'alex.j@attendai.edu',
      department: 'Computer Science',
      year: 3,
      attendanceRate: 94,
    });

    setHistory([
      {
        _id: 'rec-1',
        sessionTitle: 'Session 03: Real-Time Face Detection & Tracking',
        classCode: 'CS401',
        date: new Date().toISOString(),
        status: 'present',
        confidence: 0.96,
        source: 'ai_detected',
      },
      {
        _id: 'rec-2',
        sessionTitle: 'Session 02: Convolutional Neural Networks',
        classCode: 'CS401',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: 'present',
        confidence: 0.94,
        source: 'ai_detected',
      },
      {
        _id: 'rec-3',
        sessionTitle: 'Session 01: Computer Vision & Edge Detection',
        classCode: 'CS401',
        date: new Date(Date.now() - 7 * 86400000).toISOString(),
        status: 'present',
        confidence: 0.98,
        source: 'ai_detected',
      },
    ]);
  };

  if (loading) return <LoadingSpinner text="Loading student profile..." />;

  const isAtRisk = (profile?.attendanceRate ?? 94) < 75;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Link
        to="/students"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Roster</span>
      </Link>

      {/* Warning banner if attendance is low */}
      {isAtRisk && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold">Academic Alert:</span> Student attendance is below the 75% institutional compliance requirement.
          </div>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white font-bold text-3xl flex items-center justify-center shadow-md">
            {profile?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-charcoal-100 text-charcoal-800 font-mono">
                {profile?.studentId}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                Active Student
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1">
              {profile?.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-charcoal-600">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-charcoal-400" />
                <span>{profile?.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-charcoal-400" />
                <span>{profile?.department} (Year {profile?.year})</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Rate"
          value={`${profile?.attendanceRate || 94}%`}
          subtitle="Semester-to-date"
          icon={CheckCircle}
          color="primary"
          trend={{ value: 'Good Standing', positive: true }}
        />
        <StatCard
          title="Sessions Attended"
          value="18"
          subtitle="Out of 19 recorded sessions"
          icon={Calendar}
          color="sage"
        />
        <StatCard
          title="Late Arrivals"
          value="1"
          subtitle="Within grace period"
          icon={Clock}
          color="gold"
        />
        <StatCard
          title="Unexcused Absences"
          value="0"
          subtitle="No disciplinary flags"
          icon={XCircle}
          color="charcoal"
        />
      </div>

      {/* Session History Table */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-charcoal-100">
          <h2 className="text-base font-bold text-charcoal-900">Session Attendance History</h2>
          <p className="text-xs text-charcoal-500">Chronological attendance and AI confidence logs</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-background/80 text-charcoal-500 uppercase text-[11px] font-semibold tracking-wider border-b border-charcoal-200">
                <th className="py-3 px-6">Class</th>
                <th className="py-3 px-6">Session Title</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">AI Confidence</th>
                <th className="py-3 px-6">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {history.map((rec) => (
                <tr key={rec._id} className="hover:bg-charcoal-50/60 transition">
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-primary-700">
                    {rec.classCode}
                  </td>
                  <td className="py-4 px-6 font-medium text-charcoal-900">
                    {rec.sessionTitle}
                  </td>
                  <td className="py-4 px-6 text-xs text-charcoal-600">
                    {new Date(rec.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={rec.status} />
                  </td>
                  <td className="py-4 px-6 text-xs font-mono font-semibold text-emerald-700">
                    {Math.round((rec.confidence || 0.95) * 100)}%
                  </td>
                  <td className="py-4 px-6 text-xs text-charcoal-500 capitalize">
                    {rec.source?.replace('_', ' ') || 'AI Detected'}
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
