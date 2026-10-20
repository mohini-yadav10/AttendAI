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
import { StatCard } from '../components/StatCard';
import { TrendingUp, Users, AlertTriangle, Award, Calendar } from 'lucide-react';
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

  // Course comparisons
  const courseComparisonData = [
    { name: 'CS401: Intro to AI', rate: 92.5, students: 8 },
    { name: 'CS201: Data Structures', rate: 86.4, students: 5 },
    { name: 'CS301: Computer Architecture', rate: 89.1, students: 12 },
  ];

  // Status breakdown
  const pieData = [
    { name: 'Present', value: 85, color: '#2d7d2d' },
    { name: 'Late', value: 9, color: '#f59e0b' },
    { name: 'Absent', value: 4, color: '#ef4444' },
    { name: 'Excused', value: 2, color: '#0ea5e9' },
  ];

  const atRiskStudents = [
    { id: 's7', studentId: 'STU007', name: 'Chen Wei', rate: 74, absences: 4, dept: 'Data Science' },
    { id: 's5', studentId: 'STU005', name: 'David Kim', rate: 82, absences: 2, dept: 'Computer Science' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Attendance Analytics & Insights</h1>
          <p className="text-sm text-charcoal-500">
            Cohort engagement trends, retention analytics, and performance flags
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-surface p-1 rounded-xl border border-charcoal-200">
          {(['week', 'month', 'semester'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                selectedRange === range
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              This {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Overall Attendance Rate"
          value="91.4%"
          subtitle="Top decile in school"
          icon={TrendingUp}
          color="primary"
          trend={{ value: '2.1% improvement', positive: true }}
        />
        <StatCard
          title="At-Risk Cohort"
          value="1 Student"
          subtitle="Below 75% attendance threshold"
          icon={AlertTriangle}
          color="gold"
        />
        <StatCard
          title="Best Performing Class"
          value="CS401: AI"
          subtitle="92.5% avg presence rate"
          icon={Award}
          color="sage"
        />
        <StatCard
          title="Total Tracked Sessions"
          value="24"
          subtitle="100% verified via AI camera"
          icon={Calendar}
          color="charcoal"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Line Chart */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-charcoal-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-charcoal-900">Attendance Progression</h2>
              <p className="text-xs text-charcoal-500">Session presence timeline vs institutional target (80%)</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ede8" />
                <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} domain={[60, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Attendance']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.75rem',
                    border: '1px solid #e8e5e0',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#2d7d2d"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2d7d2d' }}
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

        {/* Pie Breakdown */}
        <div className="bg-surface rounded-2xl border border-charcoal-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-charcoal-900">Status Distribution</h2>
            <p className="text-xs text-charcoal-500">Aggregate breakdown across all sessions</p>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-charcoal-100 text-xs text-charcoal-500 text-center">
            Target benchmark: &gt; 90% Present
          </div>
        </div>
      </div>

      {/* At-Risk Intervention Panel */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-charcoal-900">Academic Intervention Watchlist</h2>
            <p className="text-xs text-charcoal-500">
              Students falling below minimum requirements who require attendance remediation
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200">
            {atRiskStudents.length} Flagged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-background text-charcoal-500 uppercase text-[11px] font-semibold tracking-wider border-b border-charcoal-200">
                <th className="py-3 px-6">Student ID</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Attendance Rate</th>
                <th className="py-3 px-6">Absences</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {atRiskStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-charcoal-50/50 transition">
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-charcoal-700">
                    {stu.studentId}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-charcoal-900">{stu.name}</td>
                  <td className="py-3.5 px-6 text-xs text-charcoal-600">{stu.dept}</td>
                  <td className="py-3.5 px-6 font-bold text-xs text-rose-600">{stu.rate}%</td>
                  <td className="py-3.5 px-6 text-xs text-charcoal-600">{stu.absences} unexcused</td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      to={`/students/${stu.id}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100"
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
