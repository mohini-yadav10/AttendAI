import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classApi } from '../services/api';
import { ClassItem } from '../types';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { BookOpen, Plus, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [semester, setSemester] = useState('Fall');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await classApi.getAll();
      if (res.success && res.data) {
        setClasses(res.data as ClassItem[]);
      } else {
        fallbackClasses();
      }
    } catch {
      fallbackClasses();
    } finally {
      setLoading(false);
    }
  };

  const fallbackClasses = () => {
    setClasses([
      {
        _id: 'class-1',
        name: 'CS401: Artificial Intelligence & Machine Learning',
        code: 'CS401',
        description: 'Foundations of intelligent agents, computer vision, and deep learning architectures.',
        academicYear: '2026-2027',
        semester: 'Fall',
        studentCount: 8,
      },
      {
        _id: 'class-2',
        name: 'CS201: Data Structures & Algorithms',
        code: 'CS201',
        description: 'Advanced algorithms, graph theory, trees, and complexity analysis.',
        academicYear: '2026-2027',
        semester: 'Fall',
        studentCount: 5,
      },
    ]);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      toast.error('Class name and code are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await classApi.create({
        name,
        code,
        description,
        academicYear,
        semester,
      });
      if (res.success && res.data) {
        setClasses([res.data as ClassItem, ...classes]);
        toast.success('Course created successfully!');
      } else {
        const newClass: ClassItem = {
          _id: 'class-' + Date.now(),
          name,
          code,
          description,
          academicYear,
          semester,
          studentCount: 0,
        };
        setClasses([newClass, ...classes]);
        toast.success('Course added (Demo Mode)');
      }
      setIsModalOpen(false);
      setName('');
      setCode('');
      setDescription('');
    } catch {
      const newClass: ClassItem = {
        _id: 'class-' + Date.now(),
        name,
        code,
        description,
        academicYear,
        semester,
        studentCount: 0,
      };
      setClasses([newClass, ...classes]);
      toast.success('Course added (Demo Mode)');
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading courses..." />;

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Academic Courses & Classes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage biometric cohorts, lecture periods, and student rosters
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-white bg-marigold-500 hover:bg-marigold-600 transition shadow-md shadow-marigold-500/20 active:scale-95 text-xs uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {classes.length === 0 ? (
        <EmptyState
          title="No classes created yet"
          description="Create your first academic class to start recording attendance sessions."
          icon={BookOpen}
          actionText="Create Class"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-pine-50 text-pine-800 border border-pine-200">
                    {c.code}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-marigold-500" />
                    <span>{c.semester} {c.academicYear}</span>
                  </span>
                </div>
                <h3 className="mt-3.5 text-lg font-black text-slate-900 leading-snug">{c.name}</h3>
                <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {c.description || 'Foundational syllabus with computer vision attendance tracking.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                  <Users className="w-4 h-4 text-pine-700" />
                  <span>{c.studentCount ?? 8} Enrolled Students</span>
                </div>
                <Link
                  to={`/classes/${c._id}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-pine-700 hover:text-pine-900 group"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Course">
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Course Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Computer Vision & Neural Networks"
              required
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Course Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. CS501"
                required
                className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm uppercase focus:ring-2 focus:ring-pine-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
              >
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Academic Year
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="2026-2027"
              required
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Curriculum outline and roll call protocol..."
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-black text-white bg-pine-700 hover:bg-pine-800 rounded-2xl transition shadow-sm active:scale-95"
            >
              {submitting ? 'Creating...' : 'Save Course'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
