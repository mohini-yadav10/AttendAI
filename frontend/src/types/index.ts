export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
}

export interface StudentProfile {
  _id: string;
  name: string;
  studentId: string;
  email?: string;
  phone?: string;
  department?: string;
  year?: number;
  isActive: boolean;
  notes?: string;
  attendanceRate?: number;
  totalSessions?: number;
  attendedSessions?: number;
}

export interface ClassItem {
  _id: string;
  name: string;
  code: string;
  description?: string;
  academicYear: string;
  semester?: string;
  archived?: boolean;
  studentCount?: number;
  createdAt?: string;
}

export type SessionMode = 'automated' | 'manual' | 'hybrid';
export type SessionStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface SessionItem {
  _id: string;
  class: string | ClassItem;
  teacher: string | User;
  title: string;
  date: string;
  durationMinutes: number;
  mode: SessionMode;
  status: SessionStatus;
  notes?: string;
  attendanceSummary?: {
    totalEnrolled: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
  };
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecordItem {
  _id: string;
  session: string | SessionItem;
  class: string | ClassItem;
  student: StudentProfile;
  status: AttendanceStatus;
  aiConfidence?: number;
  markedAt?: string;
  confirmedBy?: string | User;
  notes?: string;
  source?: 'ai_detected' | 'manual_override' | 'manual_entry';
}

export interface AuditLogItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  success: boolean;
  createdAt: string;
}

export interface DetectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface DetectionResponse {
  success: boolean;
  face_count: number;
  faces: DetectionBox[];
  processing_time_ms: number;
  is_mock: boolean;
  mock_disclaimer?: string;
  image_width?: number;
  image_height?: number;
}
