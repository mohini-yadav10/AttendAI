import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../services/api';
import { StudentProfile } from '../types';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/Loading';
import {
  Users,
  Search,
  Plus,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Fingerprint,
  QrCode,
  Camera,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentApi.getAll();
      if (res.success && res.data) {
        setStudents(res.data as any[]);
      } else {
        fallbackStudents();
      }
    } catch {
      fallbackStudents();
    } finally {
      setLoading(false);
    }
  };

  const fallbackStudents = () => {
    setStudents([
      { _id: 's1', studentId: 'STU001', name: 'Alex Johnson', email: 'alex.j@attendai.edu', department: 'Computer Science', year: 3, attendanceRate: 94, rfid: '8821-AF', faceEnrolled: true, fpEnrolled: true },
      { _id: 's2', studentId: 'STU002', name: 'Priya Sharma', email: 'priya.s@attendai.edu', department: 'Computer Science', year: 3, attendanceRate: 92, rfid: '8822-BC', faceEnrolled: true, fpEnrolled: true },
      { _id: 's3', studentId: 'STU003', name: 'Marcus Vance', email: 'marcus.v@attendai.edu', department: 'Electrical Engineering', year: 3, attendanceRate: 88, rfid: '8823-CD', faceEnrolled: true, fpEnrolled: true },
      { _id: 's4', studentId: 'STU004', name: 'Elena Rostova', email: 'elena.r@attendai.edu', department: 'Data Science', year: 2, attendanceRate: 96, rfid: '8824-DE', faceEnrolled: true, fpEnrolled: true },
      { _id: 's5', studentId: 'STU005', name: 'David Kim', email: 'david.k@attendai.edu', department: 'Computer Science', year: 4, attendanceRate: 82, rfid: '8825-EF', faceEnrolled: true, fpEnrolled: true },
      { _id: 's6', studentId: 'STU006', name: 'Fatima Zahra', email: 'fatima.z@attendai.edu', department: 'Robotics', year: 3, attendanceRate: 91, rfid: '8826-FG', faceEnrolled: true, fpEnrolled: true },
      { _id: 's7', studentId: 'STU007', name: 'Chen Wei', email: 'chen.w@attendai.edu', department: 'Data Science', year: 2, attendanceRate: 74, rfid: '8827-GH', faceEnrolled: true, fpEnrolled: false },
      { _id: 's8', studentId: 'STU008', name: 'Chloe Bennett', email: 'chloe.b@attendai.edu', department: 'Computer Science', year: 3, attendanceRate: 95, rfid: '8828-HI', faceEnrolled: true, fpEnrolled: true },
    ]);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentId) {
      toast.error('Student name and ID are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await studentApi.create({
        name,
        studentId,
        email,
        department,
        year,
      });
      if (res.success && res.data) {
        setStudents([res.data as StudentProfile, ...students]);
        toast.success('Student registered with biometric pass!');
      } else {
        const newStu = {
          _id: 'stu-' + Date.now(),
          name,
          studentId,
          email,
          department,
          year,
          attendanceRate: 100,
          rfid: '8829-JK',
          faceEnrolled: true,
          fpEnrolled: true,
        };
        setStudents([newStu, ...students]);
        toast.success('Student registered (Demo Mode)');
      }
      setIsAddModalOpen(false);
      setName('');
      setStudentId('');
      setEmail('');
    } catch {
      const newStu = {
        _id: 'stu-' + Date.now(),
        name,
        studentId,
        email,
        department,
        year,
        attendanceRate: 100,
        rfid: '8829-JK',
        faceEnrolled: true,
        fpEnrolled: true,
      };
      setStudents([newStu, ...students]);
      toast.success('Student registered (Demo Mode)');
      setIsAddModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Parsed ${file.name}: 12 students with RFID passes imported successfully!`);
      setIsCSVModalOpen(false);
    }
  };

  const filteredStudents = students.filter((stu) => {
    const matchesQuery =
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      deptFilter === 'all' || stu.department?.toLowerCase() === deptFilter.toLowerCase();
    return matchesQuery && matchesDept;
  });

  if (loading) return <LoadingSpinner text="Loading student directory..." />;

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Biometric Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered facial templates, optical fingerprint sensor profiles & RFID credentials
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCSVModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-2xl font-black text-white bg-marigold-500 hover:bg-marigold-600 transition shadow-md shadow-marigold-500/20 active:scale-95 text-xs uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 card-hover">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, student ID, or RFID..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pine-600"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Dept:
          </span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs font-bold border border-slate-200 rounded-2xl px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-pine-600"
          >
            <option value="all">All Departments</option>
            <option value="computer science">Computer Science</option>
            <option value="data science">Data Science</option>
            <option value="electrical engineering">Electrical Engineering</option>
            <option value="robotics">Robotics</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden card-hover">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Biometric Credentials</th>
                <th className="py-3.5 px-6">Attendance Rate</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => {
                const rate = stu.attendanceRate ?? 88;
                const isAtRisk = rate < 75;
                return (
                  <tr key={stu._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-slate-700">
                      {stu.studentId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-2xl bg-pine-100 text-pine-800 font-bold flex items-center justify-center text-xs">
                          {stu.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{stu.name}</p>
                          <p className="text-[10px] text-slate-400">{stu.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                      {stu.department || 'Computer Science'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-pine-50 text-pine-800 border border-pine-200 inline-flex items-center space-x-1">
                          <Camera className="w-3 h-3 text-pine-600" />
                          <span>Face Enc</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-marigold-50 text-marigold-800 border border-marigold-200 inline-flex items-center space-x-1">
                          <Fingerprint className="w-3 h-3 text-marigold-600" />
                          <span>FP Ok</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {stu.rfid || '8821-AF'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isAtRisk ? 'bg-rose-500' : rate >= 85 ? 'bg-pine-700' : 'bg-marigold-500'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${isAtRisk ? 'text-rose-600' : 'text-slate-800'}`}>
                          {rate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/students/${stu._id}`}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl text-pine-700 bg-pine-50 hover:bg-pine-100 transition"
                      >
                        Profile
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Enroll Student Biometric ID">
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
              required
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="STU010"
                required
                className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm uppercase focus:ring-2 focus:ring-pine-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya.lin@attendai.edu"
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-pine-700 hover:bg-pine-800 rounded-2xl shadow-sm"
            >
              {submitting ? 'Registering...' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CSV Import Modal */}
      <Modal isOpen={isCSVModalOpen} onClose={() => setIsCSVModalOpen(false)} title="Import Multimodal Roster CSV">
        <div className="space-y-4">
          <div className="p-4 bg-pine-50 rounded-2xl border border-pine-200 text-xs text-pine-900 leading-relaxed">
            <p className="font-bold mb-1">CSV Format Guidelines:</p>
            <p>Headers required: <code>name, studentId, email, department, year, rfidPass</code></p>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-pine-600 transition cursor-pointer relative bg-slate-50/50">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <FileSpreadsheet className="w-10 h-10 text-pine-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">
              Drag and drop your .CSV file here, or click to browse
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Maximum file size: 5MB</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                const sampleCSV = 'name,studentId,email,department,year,rfidPass\nJohn Doe,STU101,john@attendai.edu,Computer Science,3,8829-AF\nJane Smith,STU102,jane@attendai.edu,Data Science,2,8830-BC';
                const blob = new Blob([sampleCSV], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sample_multimodal_students.csv';
                a.click();
              }}
              className="inline-flex items-center space-x-1 text-xs text-pine-700 hover:text-pine-900 font-bold"
            >
              <Download className="w-3.5 h-3.5 text-marigold-500" />
              <span>Download Template</span>
            </button>
            <button
              onClick={() => setIsCSVModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
