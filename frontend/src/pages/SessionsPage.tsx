import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionApi, classApi } from '../services/api';
import { SessionItem, ClassItem } from '../types';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { Calendar, Plus, Camera, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New session state
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [mode, setMode] = useState<'automated' | 'manual' | 'hybrid'>('automated');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const [sessRes, classRes] = await Promise.all([
        sessionApi.getAll(),
        classApi.getAll(),
      ]);

      if (classRes.success && classRes.data) {
        setClasses(classRes.data as ClassItem[]);
        if ((classRes.data as ClassItem[]).length > 0) {
          setClassId((classRes.data as ClassItem[])[0]._id);
        }
      }

      if (sessRes.success && sessRes.data) {
        setSessions(sessRes.data as unknown as SessionItem[]);
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
    setSessions([
      {
        _id: 'sess-101',
        title: 'Session 03: Real-Time Face Detection & Tracking',
        class: 'class-1',
        teacher: 'teacher-1',
        date: new Date().toISOString(),
        durationMinutes: 60,
        mode: 'automated',
        status: 'active',
      },
      {
        _id: 'sess-102',
        title: 'Session 02: Convolutional Neural Networks',
        class: 'class-1',
        teacher: 'teacher-1',
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        durationMinutes: 75,
        mode: 'automated',
        status: 'completed',
      },
      {
        _id: 'sess-103',
        title: 'Session 01: Computer Vision & Edge Detection',
        class: 'class-1',
        teacher: 'teacher-1',
        date: new Date(Date.now() - 7 * 86400000).toISOString(),
        durationMinutes: 60,
        mode: 'automated',
        status: 'completed',
      },
    ]);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error('Session title is required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await sessionApi.create({
        title,
        classId: classId || 'class-1',
        date: new Date().toISOString(),
        durationMinutes,
        mode,
      });

      if (res.success && res.data) {
        setSessions([res.data as any, ...sessions]);
        toast.success('Session scheduled successfully!');
      } else {
        const newSess: SessionItem = {
          _id: 'sess-' + Date.now(),
          title,
          class: classId,
          teacher: 'teacher-1',
          date: new Date().toISOString(),
          durationMinutes,
          mode,
          status: 'active',
        };
        setSessions([newSess, ...sessions]);
        toast.success('Session created (Demo Mode)');
      }
      setIsModalOpen(false);
      setTitle('');
    } catch {
      const newSess: SessionItem = {
        _id: 'sess-' + Date.now(),
        title,
        class: classId,
        teacher: 'teacher-1',
        date: new Date().toISOString(),
        durationMinutes,
        mode,
        status: 'active',
      };
      setSessions([newSess, ...sessions]);
      toast.success('Session created (Demo Mode)');
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading session schedule..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Class Sessions</h1>
          <p className="text-sm text-charcoal-500">
            Lecture periods, active attendance calls, and past session archives
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/sessions/new-capture"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 transition shadow-xs text-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Instant Face Capture</span>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-charcoal-300 font-semibold text-charcoal-700 hover:bg-charcoal-50 text-sm transition"
          >
            <Plus className="w-4 h-4 text-charcoal-500" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          title="No sessions scheduled"
          description="Schedule a class session to begin taking facial or manual attendance."
          icon={Calendar}
          actionText="Schedule Session"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-surface rounded-2xl border border-charcoal-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-background/80 text-charcoal-500 uppercase text-[11px] font-semibold tracking-wider border-b border-charcoal-200">
                  <th className="py-3 px-6">Session Title</th>
                  <th className="py-3 px-6">Date & Time</th>
                  <th className="py-3 px-6">Duration</th>
                  <th className="py-3 px-6">Mode</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {sessions.map((sess) => (
                  <tr key={sess._id} className="hover:bg-charcoal-50/60 transition">
                    <td className="py-4 px-6 font-semibold text-charcoal-900">
                      {sess.title}
                      <p className="text-xs font-normal text-charcoal-500">
                        CS401: Intro to AI & ML
                      </p>
                    </td>
                    <td className="py-4 px-6 text-xs text-charcoal-600">
                      {new Date(sess.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-xs text-charcoal-600">
                      {sess.durationMinutes || 60} mins
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs px-2.5 py-0.5 rounded bg-sage-50 text-sage-700 border border-sage-200 capitalize font-medium">
                        {sess.mode}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={sess.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/sessions/${sess._id}/capture`}
                        className={`inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                          sess.status === 'active'
                            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-xs'
                            : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                        }`}
                      >
                        <span>{sess.status === 'active' ? 'Capture' : 'Review'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Session Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Session">
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase">
              Session Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Session 04: Transformers & Attention Mechanisms"
              required
              className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase">
              Class
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm"
            >
              {classes.length > 0 ? (
                classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.code}: {c.name}
                  </option>
                ))
              ) : (
                <option value="class-1">CS401: Intro to AI & Machine Learning</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min={15}
                max={300}
                className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                Attendance Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="mt-1 w-full px-3 py-2 border border-charcoal-300 rounded-xl text-sm"
              >
                <option value="automated">Automated (AI Face Vision)</option>
                <option value="manual">Manual Entry Only</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-charcoal-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-charcoal-600 hover:bg-charcoal-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
            >
              {submitting ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
