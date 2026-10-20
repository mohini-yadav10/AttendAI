import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TeacherDashboard } from '../pages/TeacherDashboard';
import { ClassesPage } from '../pages/ClassesPage';
import { ClassDetailPage } from '../pages/ClassDetailPage';
import { StudentsPage } from '../pages/StudentsPage';
import { StudentProfilePage } from '../pages/StudentProfilePage';
import { SessionsPage } from '../pages/SessionsPage';
import { AttendanceCapturePage } from '../pages/AttendanceCapturePage';
import { AttendanceReviewPage } from '../pages/AttendanceReviewPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { StudentDashboard } from '../pages/StudentDashboard';
import { SystemStatusPage } from '../pages/SystemStatusPage';

// Guard for protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode; teacherOnly?: boolean }> = ({
  children,
  teacherOnly = false,
}) => {
  const { isAuthenticated, isTeacher, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (teacherOnly && !isTeacher) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected App Routes under Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Teacher Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute teacherOnly>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <ProtectedRoute teacherOnly>
              <ClassesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classes/:id"
          element={
            <ProtectedRoute teacherOnly>
              <ClassDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute teacherOnly>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute teacherOnly>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute teacherOnly>
              <SessionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions/new-capture"
          element={
            <ProtectedRoute teacherOnly>
              <AttendanceCapturePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions/:id/capture"
          element={
            <ProtectedRoute teacherOnly>
              <AttendanceCapturePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions/:id/review"
          element={
            <ProtectedRoute teacherOnly>
              <AttendanceReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute teacherOnly>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute teacherOnly>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit"
          element={
            <ProtectedRoute teacherOnly>
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Common System Health Route */}
        <Route path="/status" element={<SystemStatusPage />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
