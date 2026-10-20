import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { TrendingUp, Users, AlertTriangle, Award, Calendar, ShieldCheck, Fingerprint, Camera, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnalyticsPage: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('month');

  // Trend data
  const trendData = [
    { date: 'Oct 01', attendance: 88, threshold: 80 },
    { date: 'Oct 05', attendance: 92, threshold: 80 },
    { date: 'Oct 08', attendance: 95, threshold: 80 },
    { date: 'Oct 12', attendance: 86, threshold: 80 },
    { date: 'Oct 15', attendance: 94, threshold: 80 },
    { date: 'Oct 19', attendance: 91, threshold: 80 },
  ];

  // Multimodal verification breakdown (BioEnable / HFSecurity)
  const modalityData = [
    { name: 'Facial Vision AI', value: 65, color: '#1b4d44' }, // Pine
    { name: 'Optical Fingerprint', value: 20, color: '#f3a826' }, // Marigold
    { name: 'RFID Smart Badge', value: 12, color: '#5a9f8f' },
    { name: 'Manual Override', value: 3, color: '#94a3b8' },
  ];

  const atRiskStudents = [
    { id: 's7', studentId: 'STU007', name: 'Chen Wei', rate: 74, absences: 4, dept: 'Data Science' },
    { id: 's5', studentId: 'STU005', name: 'David Kim', rate: 82, absences: 2, dept: 'Computer Science' },
  ];

  return (
    <div className="space-y-8 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Multimodal Biometric Analytics & Insights
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-sensor verification telemetry, spoof detection, and retention analytics
          </p>
        </div>
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
          {(['week', 'month', 'semester'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                selectedRange === range
                  ? 'bg-pine-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This {range}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3 Horizontal Stat Blocks (Matching Screenshot Style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Block 1: Pine Green */}
        <div className="bg-pine-700 text-white rounded-3xl p-6 shadow-md card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-pine-200 text-xs font-bold">
            <span>Overall Attendance Rate</span>
            <TrendingUp className="w-4 h-4 text-marigold-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black">92.4%</h3>
            <p className="text-xs text-pine-200 mt-1">+3.2% vs previous term</p>
          </div>
        </div>

        {/* Block 2: Vibrant Marigold */}
        <div className="bg-marigold-500 text-white rounded-3xl p-6 shadow-md shadow-marigold-500/20 card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-marigold-100 text-xs font-bold">
            <span>Anti-Spoofing / Liveness</span>
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black">99.8%</h3>
            <p className="text-xs text-marigold-100 mt-1">ScienceDirect Liveness Pass</p>
          </div>
        </div>

        {/* Block 3: Pine Green */}
        <div className="bg-pine-700 text-white rounded-3xl p-6 shadow-md card-hover flex flex-col justify-between">
          <div className="flex items-center justify-between text-pine-200 text-xs font-bold">
            <span>At-Risk Watchlist</span>
            <AlertTriangle className="w-4 h-4 text-marigold-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black">1 Student</h3>
            <p className="text-xs text-pine-200 mt-1">Below 75% threshold</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progression Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs card-hover">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Attendance Progression</h2>
              <p className="text-xs text-slate-400">Recorded sessions vs institutional target (80%)</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[60, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Attendance']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1rem',
                    border: '1px solid #e2e8f0',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#1b4d44"
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: '#f3a826' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Modality Breakdown Pie */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between card-hover">
          <div>
            <h2 className="text-base font-black text-slate-900">Modality Distribution</h2>
            <p className="text-xs text-slate-400">Share of biometric verification channels</p>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modalityData}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {modalityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-bold">
            BioEnable Certified Fusion Protocol
          </div>
        </div>
      </div>

      {/* At-Risk Watchlist */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs card-hover">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-slate-900">Academic Intervention Watchlist</h2>
            <p className="text-xs text-slate-400">
              Students falling below minimum requirements who require attendance remediation
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {atRiskStudents.length} Flagged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3 px-6">Student ID</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Attendance Rate</th>
                <th className="py-3 px-6">Absences</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {atRiskStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-slate-700">
                    {stu.studentId}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{stu.name}</td>
                  <td className="py-3.5 px-6 text-xs text-slate-600">{stu.dept}</td>
                  <td className="py-3.5 px-6 font-bold text-xs text-rose-600">{stu.rate}%</td>
                  <td className="py-3.5 px-6 text-xs text-slate-500">{stu.absences} unexcused</td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      to={`/students/${stu.id}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl text-pine-700 bg-pine-50 hover:bg-pine-100"
                    >
                      Remediate
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
