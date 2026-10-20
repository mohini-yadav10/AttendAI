// API service — centralised Axios instance for AttendAI
import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT token ──────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ─────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Typed API helpers ──────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: { total: number; page: number; limit: number; totalPages: number };
}

async function request<T>(method: string, url: string, data?: unknown, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
  const res = await api.request<ApiResponse<T>>({ method, url, data, params });
  return res.data;
}

// ── Auth ───────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    request<{ user: any; token: string }>('POST', '/auth/register', data),
  login: (data: { email: string; password: string }) =>
    request<{ user: any; token: string }>('POST', '/auth/login', data),
  logout: () => request('POST', '/auth/logout'),
  me: () => request<{ user: User }>('GET', '/auth/me'),
};

// ── Classes ────────────────────────────────────────────────
export const classApi = {
  list: (params?: Record<string, unknown>) => request<Class[]>('GET', '/classes', undefined, params),
  getAll: (params?: Record<string, unknown>) => request<Class[]>('GET', '/classes', undefined, params),
  create: (data: Partial<Class>) => request<Class>('POST', '/classes', data),
  getById: (id: string) => request<Class & { enrollmentCount: number }>('GET', `/classes/${id}`),
  update: (id: string, data: Partial<Class>) => request<Class>('PATCH', `/classes/${id}`, data),
  archive: (id: string) => request('DELETE', `/classes/${id}`),
};

// ── Students ───────────────────────────────────────────────
export const studentApi = {
  list: (params?: Record<string, unknown>) => request<Student[]>('GET', '/students', undefined, params),
  getAll: (params?: Record<string, unknown>) => request<Student[]>('GET', '/students', undefined, params),
  create: (data: Partial<Student> & { classId?: string }) => request<Student>('POST', '/students', data),
  getById: (id: string) => request<{ student: Student; enrollments: Enrollment[] }>('GET', `/students/${id}`),
  update: (id: string, data: Partial<Student>) => request<Student>('PATCH', `/students/${id}`, data),
  getAttendance: (id: string, params?: Record<string, unknown>) =>
    request<{ records: AttendanceRecord[]; summary: AttendanceSummary }>('GET', `/students/${id}/attendance`, undefined, params),
  importCSV: (rows: unknown[], classId?: string) =>
    request<{ imported: number; skipped: number; errors: string[] }>('POST', '/students/import', { rows, classId }),
};

// ── Sessions ───────────────────────────────────────────────
export const sessionApi = {
  list: (params?: Record<string, unknown>) => request<Session[]>('GET', '/sessions', undefined, params),
  getAll: (params?: Record<string, unknown>) => request<Session[]>('GET', '/sessions', undefined, params),
  create: (data: Partial<Session> & { classId: string; durationMinutes?: number; mode?: string }) => request<Session>('POST', '/sessions', data),
  getById: (id: string) => request<SessionDetail>('GET', `/sessions/${id}`),
  update: (id: string, data: Partial<Session>) => request<Session>('PATCH', `/sessions/${id}`, data),
  getAttendance: (id: string) => request<AttendanceDetail>('GET', `/sessions/${id}/attendance`),
  submitManual: (id: string, records: ManualAttendanceRecord[]) =>
    request('POST', `/sessions/${id}/attendance/manual`, { records }),
  reviewAttendance: (id: string, records: ReviewAttendanceRecord[]) =>
    request('POST', `/sessions/${id}/attendance/review`, { records }),
};

// ── Attendance ─────────────────────────────────────────────
export const attendanceApi = {
  reports: (params?: Record<string, unknown>) =>
    request<AttendanceRecord[]>('GET', '/attendance/reports', undefined, params),
  update: (id: string, data: { status: string; reason?: string }) =>
    request<AttendanceRecord>('PATCH', `/attendance/${id}`, data),
  confirmReview: (sessionId: string, data: { records: any[] }) =>
    request('POST', `/sessions/${sessionId}/attendance/review`, data),
};

// ── Analytics ──────────────────────────────────────────────
export const analyticsApi = {
  overview: (params?: Record<string, unknown>) =>
    request<OverviewData>('GET', '/analytics/overview', undefined, params),
  trends: (params?: Record<string, unknown>) =>
    request<TrendData[]>('GET', '/analytics/trends', undefined, params),
  participation: (params?: Record<string, unknown>) =>
    request<ParticipationData>('GET', '/analytics/participation', undefined, params),
  classComparison: () =>
    request<ClassComparisonData[]>('GET', '/analytics/class-comparison'),
};

// ── Courses ────────────────────────────────────────────────
export const courseApi = {
  list: (params?: Record<string, unknown>) => request<Course[]>('GET', '/courses', undefined, params),
  create: (data: Partial<Course>) => request<Course>('POST', '/courses', data),
  getById: (id: string) => request<Course>('GET', `/courses/${id}`),
  update: (id: string, data: Partial<Course>) => request<Course>('PATCH', `/courses/${id}`, data),
  delete: (id: string) => request('DELETE', `/courses/${id}`),
};

// ── Enrollments ────────────────────────────────────────────
export const enrollmentApi = {
  list: (params?: Record<string, unknown>) => request<Enrollment[]>('GET', '/enrollments', undefined, params),
  enroll: (data: { studentId: string; classId: string; courseId?: string }) =>
    request<Enrollment>('POST', '/enrollments', data),
  unenroll: (id: string) => request('PATCH', `/enrollments/${id}`, { status: 'dropped' }),
};

// ── Participation ──────────────────────────────────────────
export const participationApi = {
  record: (data: { studentId: string; sessionId: string; eventType: string; note?: string }) =>
    request('POST', '/participation', data),
  getTimeline: (sessionId: string) =>
    request<ParticipationEvent[]>('GET', `/participation/session/${sessionId}`),
};

// ── AI ─────────────────────────────────────────────────────
export const aiApi = {
  status: () => request<AIStatus>('GET', '/ai/status'),
  getStatus: () => request<AIStatus>('GET', '/ai/status'),
  detectFaces: (payload: { image_base64?: string; image?: string } | string) => {
    const data = typeof payload === 'string' ? { image_base64: payload } : payload;
    return api.post<ApiResponse<DetectionResult>>('/ai/detect-faces', data).then(r => r.data);
  },
};

// ── Export ─────────────────────────────────────────────────
export const exportApi = {
  attendance: async (params: Record<string, string>) => {
    const response = await api.get('/export/attendance', { params, responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};

// ── Audit ──────────────────────────────────────────────────
export const auditApi = {
  list: (params?: Record<string, unknown>) =>
    request<AuditLog[]>('GET', '/audit-logs', undefined, params),
  getAll: (params?: Record<string, unknown>) =>
    request<AuditLog[]>('GET', '/audit', undefined, params),
};

// ── Types ──────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface Class {
  _id: string;
  name: string;
  code: string;
  description?: string;
  teacher: string;
  academicYear: string;
  semester?: string;
  archived: boolean;
  enrollmentCount?: number;
  createdAt: string;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  description?: string;
  class: string | Class;
  teacher: string;
  credits?: number;
  isActive: boolean;
}

export interface Student {
  _id: string;
  name: string;
  studentId: string;
  email?: string;
  phone?: string;
  department?: string;
  year?: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export interface Enrollment {
  _id: string;
  student: string | Student;
  class: string | Class;
  course?: string | Course;
  status: 'active' | 'inactive' | 'graduated' | 'dropped';
  enrolledAt: string;
}

export interface Session {
  _id: string;
  class: string | Class;
  course?: string | Course;
  teacher: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  attendanceCaptured: boolean;
  aiServiceUsed: boolean;
  createdAt: string;
}

export interface SessionDetail {
  session: Session;
  enrollments: Enrollment[];
  attendanceRecords: AttendanceRecord[];
}

export interface AttendanceRecord {
  _id: string;
  student: string | Student;
  session: string | Session;
  class: string | Class;
  status: 'present' | 'absent' | 'late' | 'excused';
  entryMethod: 'manual' | 'ai_assisted' | 'ai_reviewed' | 'bulk_import';
  aiReviewed: boolean;
  aiConfidence?: number;
  confirmedBy?: string | User;
  confirmedAt?: string;
  correctionHistory: CorrectionEntry[];
  notes?: string;
  createdAt: string;
}

export interface CorrectionEntry {
  previousStatus: string;
  newStatus: string;
  correctedBy: string | User;
  correctedAt: string;
  reason?: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  percentage: number;
}

export interface AttendanceDetail {
  records: AttendanceRecord[];
  summary: {
    total: number; present: number; absent: number; late: number; excused: number;
  };
}

export interface ManualAttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface ReviewAttendanceRecord extends ManualAttendanceRecord {
  aiConfidence?: number;
}

export interface OverviewData {
  totalSessions: number;
  completedSessions: number;
  totalEnrolled: number;
  attendanceRate: number;
  overallPresent: number;
  overallTotal: number;
  recentSessions: (Session & { attendance?: { present: number; total: number } })[];
}

export interface TrendData {
  sessionId: string;
  title: string;
  date: string;
  present: number;
  absent: number;
  total: number;
  rate: number;
}

export interface ParticipationData {
  byType: { _id: string; count: number }[];
  bySession: { _id: string; count: number }[];
  disclaimer: string;
}

export interface ClassComparisonData {
  class: Class;
  present: number;
  total: number;
  rate: number;
}

export interface ParticipationEvent {
  _id: string;
  student: string | Student;
  session: string;
  eventType: string;
  note?: string;
  occurredAt: string;
}

export interface AIStatus {
  available: boolean;
  mockMode: boolean;
  url: string;
  message?: string;
}

export interface DetectionResult {
  success: boolean;
  face_count: number;
  faces: { x: number; y: number; width: number; height: number; confidence: number }[];
  processing_time_ms: number;
  is_mock: boolean;
  mock_disclaimer?: string;
}

export interface AuditLog {
  _id: string;
  user: string | User;
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  success: boolean;
  createdAt: string;
}
