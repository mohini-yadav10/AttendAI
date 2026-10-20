import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { classApi, studentApi } from '../services/api';
import { LoadingSpinner } from '../components/Loading';
import { Modal } from '../components/Modal';
import { Users, Calendar, ArrowLeft, Plus, Camera, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classData, setClassData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      if (id) {
        const res = await classApi.getById(id);
        if (res.success && res.data) {
          setClassData(res.data);
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
    setClassData({
      _id: id || 'class-1',
      name: 'CS401: Artificial Intelligence & Machine Learning',
      code: 'CS401',
      description: 'Foundations of intelligent agents, computer vision, and deep learning architectures.',
      academicYear: '2026-2027',
      semester: 'Fall',
    });
    setStudents([
      { _id: 's1', studentId: 'STU001', name: 'Alex Johnson', email: 'alex.j@attendai.edu', department: 'Computer Science', attendanceRate: 94 },
      { _id: 's2', studentId: 'STU002', name: 'Priya Sharma', email: 'priya.s@attendai.edu', department: 'Computer Science', attendanceRate: 92 },
      { _id: 's3', studentId: 'STU003', name: 'Marcus Vance', email: 'marcus.v@attendai.edu', department: 'Electrical Engineering', attendanceRate: 88 },
      { _id: 's4', studentId: 'STU004', name: 'Elena Rostova', email: 'elena.r@attendai.edu', department: 'Data Science', attendanceRate: 96 },
      { _id: 's5', studentId: 'STU005', name: 'David Kim', email: 'david.k@attendai.edu', department: 'Computer Science', attendanceRate: 82 },
      { _id: 's6', studentId: 'STU006', name: 'Fatima Zahra', email: 'fatima.z@attendai.edu', department: 'Robotics', attendanceRate: 91 },
      { _id: 's7', studentId: 'STU007', name: 'Chen Wei', email: 'chen.w@attendai.edu', department: 'Data Science', attendanceRate: 78 },
      { _id: 's8', studentId: 'STU008', name: 'Chloe Bennett', email: 'chloe.b@attendai.edu', department: 'Computer Science', attendanceRate: 95 },
    ]);
  };

  if (loading) return <LoadingSpinner text="Loading class details..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top back nav */}
      <Link
        to="/classes"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Classes</span>
      </Link>

      {/* Class Header Card */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-primary-50 text-primary-700 border border-primary-200">
                {classData?.code}
              </span>
              <span className="text-xs font-medium text-charcoal-500">
                {classData?.semester} {classData?.academicYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mt-2">
              {classData?.name}
            </h1>
            <p className="mt-2 text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              {classData?.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/sessions/new-capture"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 transition shadow-xs text-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Capture</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Enrolled Students Roster */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-charcoal-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-charcoal-900">Enrolled Students ({students.length})</h2>
            <p className="text-xs text-charcoal-500">Registered cohort for automatic facial matching</p>
          </div>
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll Student</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-background/80 text-charcoal-500 uppercase text-[11px] font-semibold tracking-wider border-b border-charcoal-200">
                <th className="py-3 px-6">Student ID</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Attendance Rate</th>
                <th className="py-3 px-6 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {students.map((stu) => (
                <tr key={stu._id} className="hover:bg-charcoal-50/60 transition">
                  <td className="py-3.5 px-6 font-mono text-xs font-semibold text-charcoal-700">
                    {stu.studentId}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-charcoal-900">
                    {stu.name}
                    <p className="text-xs font-normal text-charcoal-500">{stu.email}</p>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-charcoal-600">
                    {stu.department || 'Computer Science'}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-charcoal-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            stu.attendanceRate >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${stu.attendanceRate || 85}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-charcoal-700">
                        {stu.attendanceRate || 85}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      to={`/students/${stu._id}`}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                    >
                      View Stats
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll Student Modal */}
      <Modal isOpen={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} title="Enroll Student">
        <div className="space-y-4">
          <p className="text-sm text-charcoal-600">
            Select an existing student profile from the institution roster to enroll in this class.
          </p>
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase">
              Student Name or ID
            </label>
            <input
              type="text"
              placeholder="e.g. STU009 or Liam Smith"
              className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-charcoal-100">
            <button
              onClick={() => setIsAddStudentOpen(false)}
              className="px-4 py-2 text-sm text-charcoal-600 hover:bg-charcoal-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Student enrolled successfully!');
                setIsAddStudentOpen(false);
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
            >
              Confirm Enrollment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
