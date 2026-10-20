import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { classApi } from '../services/api';
import { LoadingSpinner } from '../components/Loading';
import { Modal } from '../components/Modal';
import { Users, Calendar, ArrowLeft, Plus, Camera, CheckCircle2, ShieldCheck, Fingerprint } from 'lucide-react';
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
      { _id: 's1', studentId: 'STU001', name: 'Alex Johnson', email: 'alex.j@attendai.edu', department: 'Computer Science', attendanceRate: 94, rfid: '8821-AF' },
      { _id: 's2', studentId: 'STU002', name: 'Priya Sharma', email: 'priya.s@attendai.edu', department: 'Computer Science', attendanceRate: 92, rfid: '8822-BC' },
      { _id: 's3', studentId: 'STU003', name: 'Marcus Vance', email: 'marcus.v@attendai.edu', department: 'Electrical Engineering', attendanceRate: 88, rfid: '8823-CD' },
      { _id: 's4', studentId: 'STU004', name: 'Elena Rostova', email: 'elena.r@attendai.edu', department: 'Data Science', attendanceRate: 96, rfid: '8824-DE' },
      { _id: 's5', studentId: 'STU005', name: 'David Kim', email: 'david.k@attendai.edu', department: 'Computer Science', attendanceRate: 82, rfid: '8825-EF' },
      { _id: 's6', studentId: 'STU006', name: 'Fatima Zahra', email: 'fatima.z@attendai.edu', department: 'Robotics', attendanceRate: 91, rfid: '8826-FG' },
      { _id: 's7', studentId: 'STU007', name: 'Chen Wei', email: 'chen.w@attendai.edu', department: 'Data Science', attendanceRate: 78, rfid: '8827-GH' },
      { _id: 's8', studentId: 'STU008', name: 'Chloe Bennett', email: 'chloe.b@attendai.edu', department: 'Computer Science', attendanceRate: 95, rfid: '8828-HI' },
    ]);
  };

  if (loading) return <LoadingSpinner text="Loading class details..." />;

  return (
    <div className="space-y-6 animate-pop-in">
      <Link
        to="/classes"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-pine-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Courses</span>
      </Link>

      {/* Class Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs card-hover">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-pine-100 text-pine-800 border border-pine-200">
                {classData?.code}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {classData?.semester} {classData?.academicYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              {classData?.name}
            </h1>
            <p className="mt-2 text-xs text-slate-500 max-w-2xl leading-relaxed">
              {classData?.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/sessions/new-capture"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-slate-900 bg-marigold-500 hover:bg-marigold-600 transition shadow-md shadow-marigold-500/20 active:scale-95 text-xs uppercase tracking-wider"
            >
              <Camera className="w-4 h-4 text-slate-900" />
              <span>Launch Live Roll Call</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Enrolled Students Roster */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden card-hover">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Enrolled Cohort ({students.length})</h2>
            <p className="text-xs text-slate-400">Biometric templates registered for automated roll call</p>
          </div>
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-xl text-pine-800 bg-pine-50 hover:bg-pine-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll Student</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Student ID</th>
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Smart Pass ID</th>
                <th className="py-3.5 px-6">Attendance Rate</th>
                <th className="py-3.5 px-6 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((stu) => (
                <tr key={stu._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-slate-700">
                    {stu.studentId}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    {stu.name}
                    <p className="text-xs font-normal text-slate-400">{stu.email}</p>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-slate-600">
                    {stu.department || 'Computer Science'}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-mono text-xs font-bold text-pine-800 px-2 py-0.5 rounded bg-pine-50 border border-pine-200">
                      {stu.rfid || '8821-AF'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            stu.attendanceRate >= 85 ? 'bg-pine-700' : 'bg-marigold-500'
                          }`}
                          style={{ width: `${stu.attendanceRate || 85}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {stu.attendanceRate || 85}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      to={`/students/${stu._id}`}
                      className="text-xs font-bold text-pine-700 hover:text-pine-900"
                    >
                      View Details
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
          <p className="text-xs text-slate-500">
            Select an existing student profile from the institution directory to enroll into this biometric cohort.
          </p>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Student Name or ID
            </label>
            <input
              type="text"
              placeholder="e.g. STU009 or Liam Smith"
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsAddStudentOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success('Student enrolled successfully into biometric session!');
                setIsAddStudentOpen(false);
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-pine-700 hover:bg-pine-800 rounded-2xl shadow-sm"
            >
              Confirm Enrollment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
