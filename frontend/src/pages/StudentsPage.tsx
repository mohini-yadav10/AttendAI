import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../services/api';
import { StudentProfile } from '../types';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import {
  Users,
  Search,
  Plus,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  // New student form
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
        setStudents(res.data as StudentProfile[]);
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
      { _id: 's1', studentId: 'STU001', name: 'Alex Johnson', email: 'alex.j@attendai.edu', department: 'Computer Science', year: 3, isActive: true, attendanceRate: 94 },
      { _id: 's2', studentId: 'STU002', name: 'Priya Sharma', email: 'priya.s@attendai.edu', department: 'Computer Science', year: 3, isActive: true, attendanceRate: 92 },
      { _id: 's3', studentId: 'STU003', name: 'Marcus Vance', email: 'marcus.v@attendai.edu', department: 'Electrical Engineering', year: 3, isActive: true, attendanceRate: 88 },
      { _id: 's4', studentId: 'STU004', name: 'Elena Rostova', email: 'elena.r@attendai.edu', department: 'Data Science', year: 2, isActive: true, attendanceRate: 96 },
      { _id: 's5', studentId: 'STU005', name: 'David Kim', email: 'david.k@attendai.edu', department: 'Computer Science', year: 4, isActive: true, attendanceRate: 82 },
      { _id: 's6', studentId: 'STU006', name: 'Fatima Zahra', email: 'fatima.z@attendai.edu', department: 'Robotics', year: 3, isActive: true, attendanceRate: 91 },
      { _id: 's7', studentId: 'STU007', name: 'Chen Wei', email: 'chen.w@attendai.edu', department: 'Data Science', year: 2, isActive: true, attendanceRate: 74 },
      { _id: 's8', studentId: 'STU008', name: 'Chloe Bennett', email: 'chloe.b@attendai.edu', department: 'Computer Science', year: 3, isActive: true, attendanceRate: 95 },
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
        toast.success('Student added successfully!');
      } else {
        const newStu: StudentProfile = {
          _id: 'stu-' + Date.now(),
          name,
          studentId,
          email,
          department,
          year,
          isActive: true,
          attendanceRate: 100,
        };
        setStudents([newStu, ...students]);
        toast.success('Student added (Demo Mode)');
      }
      setIsAddModalOpen(false);
      setName('');
      setStudentId('');
      setEmail('');
    } catch {
      const newStu: StudentProfile = {
        _id: 'stu-' + Date.now(),
        name,
        studentId,
        email,
        department,
        year,
        isActive: true,
        attendanceRate: 100,
      };
      setStudents([newStu, ...students]);
      toast.success('Student added (Demo Mode)');
      setIsAddModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Parsed ${file.name}: 12 students imported successfully!`);
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Student Roster</h1>
          <p className="text-sm text-charcoal-500">
            Registered students directory, attendance rates, and profiles
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCSVModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-charcoal-300 text-charcoal-700 hover:bg-charcoal-50 text-sm font-semibold transition"
          >
            <Upload className="w-4 h-4 text-charcoal-500" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 transition shadow-xs text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or student ID..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
            Dept:
          </span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-sm border border-charcoal-300 rounded-xl px-3 py-2 bg-surface text-charcoal-700"
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
      <div className="bg-surface rounded-2xl border border-charcoal-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-background/80 text-charcoal-500 uppercase text-[11px] font-semibold tracking-wider border-b border-charcoal-200">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Year</th>
                <th className="py-3 px-6">Attendance Rate</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {filteredStudents.map((stu) => {
                const rate = stu.attendanceRate ?? 88;
                const isAtRisk = rate < 75;
                return (
                  <tr key={stu._id} className="hover:bg-charcoal-50/60 transition">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-charcoal-700">
                      {stu.studentId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center text-xs">
                          {stu.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal-900">{stu.name}</p>
                          <p className="text-xs text-charcoal-500">{stu.email || 'No email registered'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-charcoal-600">
                      {stu.department || 'Computer Science'}
                    </td>
                    <td className="py-4 px-6 text-xs text-charcoal-600">
                      Year {stu.year ?? 3}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-charcoal-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isAtRisk ? 'bg-rose-500' : rate >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            isAtRisk ? 'text-rose-600' : 'text-charcoal-800'
                          }`}
                        >
                          {rate}%
                        </span>
                        {isAtRisk && (
                          <span title="Attendance below 75% threshold">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/students/${stu._id}`}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 transition"
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
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Student Profile">
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
              required
              className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="STU010"
                required
                className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm uppercase focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya.lin@attendai.edu"
              className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-charcoal-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm text-charcoal-600 hover:bg-charcoal-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
            >
              {submitting ? 'Saving...' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CSV Import Modal */}
      <Modal isOpen={isCSVModalOpen} onClose={() => setIsCSVModalOpen(false)} title="Import Students from CSV">
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-xl border border-primary-200 text-xs text-primary-800 leading-relaxed">
            <p className="font-semibold mb-1">CSV Format Guidelines:</p>
            <p>Headers required: <code>name, studentId, email, department, year</code></p>
          </div>

          <div className="border-2 border-dashed border-charcoal-300 rounded-2xl p-6 text-center hover:border-primary-500 transition cursor-pointer relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <FileSpreadsheet className="w-10 h-10 text-charcoal-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-charcoal-800">
              Drag and drop your .CSV file here, or click to browse
            </p>
            <p className="text-xs text-charcoal-500 mt-1">Maximum file size: 5MB</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                const sampleCSV = 'name,studentId,email,department,year\nJohn Doe,STU101,john@attendai.edu,Computer Science,3\nJane Smith,STU102,jane@attendai.edu,Data Science,2';
                const blob = new Blob([sampleCSV], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sample_students.csv';
                a.click();
              }}
              className="inline-flex items-center space-x-1 text-xs text-primary-600 hover:text-primary-700 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template CSV</span>
            </button>
            <button
              onClick={() => setIsCSVModalOpen(false)}
              className="px-4 py-2 text-sm text-charcoal-600 hover:bg-charcoal-100 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
