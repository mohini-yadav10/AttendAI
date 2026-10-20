import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionApi, classApi } from '../services/api';
import { SessionItem, ClassItem } from '../types';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { Calendar, Plus, Camera, ArrowRight, Clock, ShieldCheck, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        toast.success('Biometric session scheduled successfully!');
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
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Class Lecture Sessions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active biometric roll calls, scheduled lectures, and past multimodal archives
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/sessions/new-capture"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-slate-900 bg-marigold-500 hover:bg-marigold-600 transition shadow-md shadow-marigold-500/20 active:scale-95 text-xs uppercase tracking-wider"
          >
            <Camera className="w-4 h-4 text-slate-900" />
            <span>Launch Live Capture</span>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 text-xs transition"
          >
            <Plus className="w-4 h-4 text-slate-400" />
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
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden card-hover">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Session Title</th>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Sensor Modality</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((sess) => (
                  <tr key={sess._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {sess.title}
                      <p className="text-xs font-normal text-slate-400">
                        CS401: Intro to AI & ML
                      </p>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(sess.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                      {sess.durationMinutes || 60} mins
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-pine-50 text-pine-800 border border-pine-200 capitalize font-bold">
                        {sess.mode}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge status={sess.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/sessions/${sess._id}/capture`}
                        className={`inline-flex items-center space-x-1 text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                          sess.status === 'active'
                            ? 'bg-marigold-500 text-white hover:bg-marigold-600 shadow-xs'
                            : 'bg-pine-50 text-pine-800 hover:bg-pine-100'
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Session Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Session 04: Edge Computing & Facial Localization"
              required
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Class / Course
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-pine-600"
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min={15}
                max={300}
                className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Attendance Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm"
              >
                <option value="automated">Multimodal (BioEnable AI)</option>
                <option value="manual">Manual Entry Only</option>
                <option value="hybrid">Hybrid Verification</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-pine-700 hover:bg-pine-800 rounded-2xl shadow-sm"
            >
              {submitting ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
