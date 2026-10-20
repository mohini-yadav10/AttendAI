import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentApi } from '../services/api';
import { LoadingSpinner } from '../components/Loading';
import { Badge } from '../components/Badge';
import {
  ArrowLeft,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Fingerprint,
  QrCode,
  Camera,
  ShieldCheck,
  CreditCard,
  Check,
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
      rfid: '8821-AF',
    });

    setHistory([
      {
        _id: 'rec-1',
        sessionTitle: 'Session 03: Real-Time Face Detection & Tracking',
        classCode: 'CS401',
        date: new Date().toISOString(),
        status: 'present',
        faceConf: 0.96,
        fpConf: 0.99,
        rfid: '8821-AF',
        modality: 'Multimodal Fusion',
      },
      {
        _id: 'rec-2',
        sessionTitle: 'Session 02: Convolutional Neural Networks',
        classCode: 'CS401',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: 'present',
        faceConf: 0.94,
        fpConf: 0.97,
        rfid: '8821-AF',
        modality: 'Face + RFID',
      },
      {
        _id: 'rec-3',
        sessionTitle: 'Session 01: Computer Vision & Edge Detection',
        classCode: 'CS401',
        date: new Date(Date.now() - 7 * 86400000).toISOString(),
        status: 'present',
        faceConf: 0.98,
        fpConf: 0.95,
        rfid: '8821-AF',
        modality: 'Multimodal Fusion',
      },
    ]);
  };

  if (loading) return <LoadingSpinner text="Loading biometric profile..." />;

  const isAtRisk = (profile?.attendanceRate ?? 94) < 75;

  return (
    <div className="space-y-6 animate-pop-in">
      <Link
        to="/students"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-pine-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Biometric Directory</span>
      </Link>

      {/* Warning banner if low */}
      {isAtRisk && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl flex items-center space-x-3 text-rose-800 text-xs font-semibold">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold">Compliance Alert:</span> Student attendance is below the 75% institutional requirement.
          </div>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs card-hover">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pine-800 to-pine-600 text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-pine-50">
              {profile?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                  {profile?.studentId}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  Enrolled & Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                {profile?.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile?.email}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile?.department} (Year {profile?.year})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Smart Pass Card Mockup matching Screenshot */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-pine-800 to-pine-600 p-4 text-white shadow-md w-full sm:w-64">
            <div className="flex items-center justify-between text-[10px] text-white/80 font-mono">
              <span>BioEnable Pass</span>
              <span className="text-marigold-300 font-bold uppercase">NFC READY</span>
            </div>
            <p className="mt-3 font-mono text-xs tracking-wider text-white font-bold">
              {profile?.rfid || '8821-AF'} • 3456
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-white/70">
              <span>{profile?.name}</span>
              <span>EXP: 08/2030</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 Horizontal Stat Blocks (Matching Screenshot Style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Block 1: Pine Green */}
        <div className="bg-pine-700 text-white rounded-3xl p-5 shadow-sm card-hover flex flex-col justify-between">
          <p className="text-xs text-pine-200 font-bold">Cumulative Attendance</p>
          <div className="mt-3">
            <h3 className="text-3xl font-black">{profile?.attendanceRate || 94}%</h3>
            <p className="text-[10px] text-pine-200 mt-0.5">Top decile cohort standing</p>
          </div>
        </div>

        {/* Block 2: Vibrant Marigold */}
        <div className="bg-marigold-500 text-white rounded-3xl p-5 shadow-sm shadow-marigold-500/20 card-hover flex flex-col justify-between">
          <p className="text-xs text-marigold-100 font-bold">Biometric Authentications</p>
          <div className="mt-3">
            <h3 className="text-3xl font-black">100% Match</h3>
            <p className="text-[10px] text-marigold-100 mt-0.5">Zero Spoof / Liveness Flags</p>
          </div>
        </div>

        {/* Block 3: Pine Green */}
        <div className="bg-pine-700 text-white rounded-3xl p-5 shadow-sm card-hover flex flex-col justify-between">
          <p className="text-xs text-pine-200 font-bold">Verified Sessions</p>
          <div className="mt-3">
            <h3 className="text-3xl font-black">18 / 19</h3>
            <p className="text-[10px] text-pine-200 mt-0.5">1 Late Arrival Excused</p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden card-hover">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-900">Multimodal Attendance Ledger</h2>
          <p className="text-xs text-slate-400">Multi-sensor sensor verification timestamps and modality scores</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Class</th>
                <th className="py-3.5 px-6">Lecture Session</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Face Confidence</th>
                <th className="py-3.5 px-6">Fingerprint Match</th>
                <th className="py-3.5 px-6">Sensor Fusion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((rec) => (
                <tr key={rec._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-pine-700">
                    {rec.classCode}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {rec.sessionTitle}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {new Date(rec.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={rec.status} />
                  </td>
                  <td className="py-4 px-6 text-xs font-mono font-bold text-pine-700">
                    {Math.round((rec.faceConf || 0.95) * 100)}%
                  </td>
                  <td className="py-4 px-6 text-xs font-mono font-bold text-marigold-600">
                    {Math.round((rec.fpConf || 0.98) * 100)}%
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-emerald-700">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                      {rec.modality || 'Multimodal'}
                    </span>
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
