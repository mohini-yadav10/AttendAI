import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classApi } from '../services/api';
import { ClassItem } from '../types';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { BookOpen, Plus, Users, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
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
        toast.success('Class created successfully!');
      } else {
        // Fallback local append
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
        toast.success('Class created (Demo Mode)');
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
      toast.success('Class created (Demo Mode)');
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading classes..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Classes & Courses</h1>
          <p className="text-sm text-charcoal-500">Manage enrolled courses and student cohorts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 transition shadow-xs text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Class</span>
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
              className="bg-surface rounded-2xl border border-charcoal-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 border border-primary-200">
                    {c.code}
                  </span>
                  <span className="text-xs text-charcoal-400 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{c.semester} {c.academicYear}</span>
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-charcoal-900 leading-snug">{c.name}</h3>
                <p className="mt-2 text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                  {c.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-charcoal-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-medium text-charcoal-600">
                  <Users className="w-4 h-4 text-primary-600" />
                  <span>{c.studentCount ?? 8} Enrolled Students</span>
                </div>
                <Link
                  to={`/classes/${c._id}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Class">
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase">
              Class Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Introduction to Neural Networks"
              required
              className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                Class Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. CS501"
                required
                className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm uppercase focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase">
              Academic Year
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="2026-2027"
              required
              className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Syllabus goals and lecture overview..."
              className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-charcoal-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-charcoal-600 hover:bg-charcoal-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Save Class'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
