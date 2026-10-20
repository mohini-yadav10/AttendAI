import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import {
  BookOpen,
  CheckCircle,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Award,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const enrolledClasses = [
    {
      code: 'CS401',
      name: 'Artificial Intelligence & Machine Learning',
      instructor: 'Dr. Sarah Mitchell',
      attendanceRate: 95,
      sessionsAttended: 19,
      totalSessions: 20,
    },
    {
      code: 'CS201',
      name: 'Data Structures & Algorithms',
      instructor: 'Dr. Sarah Mitchell',
      attendanceRate: 92,
      sessionsAttended: 23,
      totalSessions: 25,
    },
  ];

  const recentSessions = [
    {
      title: 'Session 03: Real-Time Face Detection & Tracking',
      class: 'CS401',
      date: new Date().toISOString(),
      status: 'present',
      confidence: 0.96,
    },
    {
      title: 'Session 02: Convolutional Neural Networks',
      class: 'CS401',
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      status: 'present',
      confidence: 0.94,
    },
    {
      title: 'Session 01: Computer Vision & Edge Detection',
      class: 'CS401',
      date: new Date(Date.now() - 7 * 86400000).toISOString(),
      status: 'present',
      confidence: 0.98,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sage-800 to-primary-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/90 mb-3 backdrop-blur-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Academic Good Standing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Student'}!
          </h1>
          <p className="mt-1 text-white/80 text-sm max-w-xl">
            Your cumulative attendance is 93.5% across all courses. Keep up the consistent presence!
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl sm:text-4xl font-black text-white">93.5%</span>
          <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">
            Overall Rate
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Attended"
          value="42 / 45"
          subtitle="93.5% overall attendance"
          icon={CheckCircle}
          color="primary"
          trend={{ value: 'Compliant with dean honors', positive: true }}
        />
        <StatCard
          title="Enrolled Courses"
          value="2 Classes"
          subtitle="All classes in good standing"
          icon={BookOpen}
          color="sage"
        />
        <StatCard
          title="Tardies"
          value="1 Session"
          subtitle="Within allowed grace window"
          icon={Clock}
          color="gold"
        />
      </div>

      {/* Enrolled Courses Progress */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-charcoal-900 mb-4">My Enrolled Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledClasses.map((c) => (
            <div
              key={c.code}
              className="p-5 rounded-xl border border-charcoal-200 bg-background/50 hover:bg-background transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                  {c.code}
                </span>
                <span className="text-sm font-extrabold text-emerald-700">
                  {c.attendanceRate}%
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-charcoal-900">{c.name}</h3>
              <p className="text-xs text-charcoal-500 mt-0.5">Instructor: {c.instructor}</p>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-charcoal-600 mb-1">
                  <span>Attendance Progress</span>
                  <span>{c.sessionsAttended} / {c.totalSessions} Sessions</span>
                </div>
                <div className="w-full bg-charcoal-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-600"
                    style={{ width: `${c.attendanceRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attendance Log Table */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-charcoal-100">
          <h2 className="text-base font-bold text-charcoal-900">Recent Session Verifications</h2>
          <p className="text-xs text-charcoal-500">Live facial recognition logs for your account</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-background text-charcoal-500 uppercase text-[11px] font-semibold tracking-wider border-b border-charcoal-200">
                <th className="py-3 px-6">Class</th>
                <th className="py-3 px-6">Lecture Title</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Biometric Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {recentSessions.map((rec, i) => (
                <tr key={i} className="hover:bg-charcoal-50/50 transition">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-primary-700">
                    {rec.class}
                  </td>
                  <td className="py-4 px-6 font-medium text-charcoal-900">{rec.title}</td>
                  <td className="py-4 px-6 text-xs text-charcoal-600">
                    {new Date(rec.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <Badge status={rec.status} />
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-xs font-semibold text-emerald-700">
                    {Math.round(rec.confidence * 100)}%
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
