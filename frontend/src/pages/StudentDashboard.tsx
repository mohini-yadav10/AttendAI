import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '../components/CircularProgress';
import { Modal } from '../components/Modal';
import {
  Calendar as CalendarIcon,
  Bell,
  Send,
  User as UserIcon,
  ChevronRight,
  Check,
  TrendingUp,
  Award,
  FileText,
  Users,
  Camera,
  BookOpen,
  Clock,
  Sparkles,
  Smartphone,
  Monitor,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  // Modals for the quick-access grid
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);

  // Leave form state
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('Medical');
  const [leaveNote, setLeaveNote] = useState('');

  // Predictor state
  const [futureClasses, setFutureClasses] = useState(5);
  const [predictedAttend, setPredictedAttend] = useState(5);

  // Today's date calculations
  const today = new Date();
  const dayNum = today.getDate();
  const daySuffix = (d: number) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  const weekdayName = today.toLocaleDateString(undefined, { weekday: 'long' });
  const monthYear = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // Weekly Attendance Status
  const weekDays = [
    { label: 'M', day: 'Mon', status: 'present' },
    { label: 'T', day: 'Tue', status: 'present' },
    { label: 'W', day: 'Wed', status: 'present' },
    { label: 'Th', day: 'Thu', status: 'late' },
    { label: 'Fr', day: 'Fri', status: 'upcoming' },
  ];

  // Quick Action Tiles Config
  const quickActions = [
    {
      id: 'leave',
      title: 'Ask Leave',
      icon: CalendarIcon,
      bg: 'bg-indigo-50 text-indigo-600',
      action: () => setIsLeaveModalOpen(true),
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      icon: Award,
      bg: 'bg-amber-50 text-amber-600',
      action: () => setIsLeaderboardOpen(true),
    },
    {
      id: 'news',
      title: 'News & Alerts',
      icon: Bell,
      hasDot: true,
      bg: 'bg-rose-50 text-rose-600',
      action: () => setIsNewsOpen(true),
    },
    {
      id: 'predictor',
      title: 'Predictor',
      icon: TrendingUp,
      bg: 'bg-emerald-50 text-emerald-600',
      action: () => setIsPredictorOpen(true),
    },
    {
      id: 'cohort',
      title: 'Classmates',
      icon: Users,
      bg: 'bg-purple-50 text-purple-600',
      action: () => toast.success('8 Enrolled Cohort Members in CS401'),
    },
    {
      id: 'assignments',
      title: 'Sessions',
      icon: FileText,
      bg: 'bg-sky-50 text-sky-600',
      action: () => toast.success('All past 24 session logs are verified'),
    },
  ];

  // Predictor formula
  const currentAttended = 20;
  const currentTotal = 24;
  const predictedRate = Math.round(
    ((currentAttended + predictedAttend) / (currentTotal + futureClasses)) * 100
  );

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Leave request for ${leaveDate || 'selected date'} submitted to Instructor for review!`);
    setIsLeaveModalOpen(false);
    setLeaveNote('');
  };

  return (
    <div className="space-y-6 animate-pop-in">
      {/* Top Device Switcher Toolbar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Student Experience Hub</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
              Presence UI
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Interactive student portal inspired by modern mobile attendance app architecture
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              deviceMode === 'mobile'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App UI</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              deviceMode === 'desktop'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Wide Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Container - Mobile Phone Frame or Expanded Grid */}
      <div className="flex justify-center">
        <div
          className={`w-full transition-all duration-500 ease-out ${
            deviceMode === 'mobile'
              ? 'max-w-[420px] rounded-[2.5rem] p-3 bg-slate-900 shadow-2xl ring-12 ring-slate-800/60'
              : 'max-w-5xl'
          }`}
        >
          {/* Inner Phone Screen */}
          <div
            className={`bg-gradient-to-b from-indigo-700 via-indigo-600 to-indigo-800 text-white overflow-hidden transition-all duration-300 ${
              deviceMode === 'mobile'
                ? 'rounded-[2.2rem] shadow-inner pb-6'
                : 'rounded-3xl shadow-lg pb-8'
            }`}
          >
            {/* ── Top Bar with Cursive Branding & Actions ── */}
            <div className="px-6 pt-7 pb-4 flex items-center justify-between">
              <div>
                <span className="font-serif italic font-extrabold text-2xl tracking-wide text-white drop-shadow-xs">
                  Presence
                </span>
              </div>
              <div className="flex items-center space-x-3 text-indigo-100">
                <button
                  onClick={() => toast.success('No pending messages from your instructor.')}
                  className="p-2 rounded-full hover:bg-white/10 transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsNewsOpen(true)}
                  className="p-2 rounded-full hover:bg-white/10 transition relative active:scale-95"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-400 ring-2 ring-indigo-600" />
                </button>
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </div>

            {/* ── "Take Attendance Today" Action Banner ── */}
            <div className="px-5 mb-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center justify-between shadow-sm transition hover:bg-white/15">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-white/20 text-white">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white tracking-tight leading-tight">
                      Take attendance today
                    </p>
                    <p className="text-[10px] text-indigo-200">CS401: AI Vision Lecture</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toast.success('Facial verification session opened! Instructor camera verifying...');
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-md active:scale-95 transition-all"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* ── Content Sheet: Overlapping White Curved Body ── */}
            <div className="bg-slate-50 text-slate-800 rounded-t-[2.2rem] px-5 pt-6 pb-6 space-y-6 shadow-2xl">
              {/* 1. Date & Weekday Status Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      {dayNum}
                      <sup className="text-xs font-bold text-indigo-600 ml-0.5">
                        {daySuffix(dayNum)}
                      </sup>{' '}
                      <span className="text-xl font-bold text-slate-800">{weekdayName}</span>
                    </h2>
                    <p className="text-xs font-medium text-slate-400 mt-1">{monthYear}</p>
                  </div>
                  <button
                    onClick={() => toast.success('Next week schedule preview')}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* This Week Status Indicator */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      This Week Status
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600">3/4 Present</span>
                  </div>

                  <div className="flex items-center justify-between px-2">
                    {weekDays.map((wd, idx) => {
                      const isPresent = wd.status === 'present';
                      const isLate = wd.status === 'late';
                      return (
                        <div key={idx} className="flex flex-col items-center space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400">{wd.label}</span>
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-2xs ${
                              isPresent
                                ? 'bg-indigo-600 text-white'
                                : isLate
                                ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-400'
                                : 'border-2 border-slate-200 text-slate-300'
                            }`}
                          >
                            {isPresent ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : isLate ? (
                              <Clock className="w-3.5 h-3.5" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Three Circular Progress Metrics */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-hover">
                <div className="grid grid-cols-3 gap-2">
                  <CircularProgress
                    value={83}
                    displayValue="83%"
                    color="#4f46e5"
                    bgColor="#e0e7ff"
                    label="Attendance"
                    sublabel="Goal > 80%"
                  />
                  <CircularProgress
                    value={30}
                    displayValue="03"
                    color="#f59e0b"
                    bgColor="#fef3c7"
                    label="Leave Taken"
                    sublabel="2 Excused"
                  />
                  <CircularProgress
                    value={92}
                    displayValue="23"
                    color="#0ea5e9"
                    bgColor="#e0f2fe"
                    label="Ongoing Days"
                    sublabel="Semester"
                  />
                </div>
              </div>

              {/* 3. Six Quick Access Feature Tiles */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Quick Access
                  </h3>
                  <span className="text-[11px] font-semibold text-indigo-600 cursor-pointer hover:underline">
                    View All
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {quickActions.map((qa) => {
                    const Icon = qa.icon;
                    return (
                      <button
                        key={qa.id}
                        onClick={qa.action}
                        className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-indigo-300 active:scale-95 group relative"
                      >
                        {qa.hasDot && (
                          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
                        )}
                        <div
                          className={`w-11 h-11 rounded-2xl ${qa.bg} flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 tracking-tight leading-tight">
                          {qa.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Enrolled Courses Summary */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Enrolled Courses
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">92% Average</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">CS401: Intro to AI</p>
                      <p className="text-[10px] text-slate-400">Dr. Sarah Mitchell</p>
                    </div>
                    <span className="text-xs font-black text-indigo-600">95%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">CS201: Data Structures</p>
                      <p className="text-[10px] text-slate-400">Dr. Sarah Mitchell</p>
                    </div>
                    <span className="text-xs font-black text-emerald-600">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Modals ── */}

      {/* 1. Leave Request Modal */}
      <Modal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} title="Request Academic Leave">
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Leave Date
            </label>
            <input
              type="date"
              required
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Excuse Category
            </label>
            <select
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
            >
              <option value="Medical">Medical / Doctor Appointment</option>
              <option value="Family">Family Emergency</option>
              <option value="Academic">Conference / Academic Competition</option>
              <option value="Other">Other Excused Absence</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Explanation & Supporting Note
            </label>
            <textarea
              rows={3}
              value={leaveNote}
              onChange={(e) => setLeaveNote(e.target.value)}
              placeholder="Provide context or doctor receipt notice..."
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              Send Request
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Leaderboard Modal */}
      <Modal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} title="Cohort Attendance Leaderboard">
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Top academic attendees recognized for consistent participation in Fall 2026.
          </p>

          <div className="divide-y divide-slate-100">
            {[
              { rank: 1, name: 'Elena Rostova', rate: '100%', badge: '🥇 1st' },
              { rank: 2, name: 'Alex Johnson (You)', rate: '95%', badge: '🥈 2nd' },
              { rank: 3, name: 'Priya Sharma', rate: '95%', badge: '🥉 3rd' },
              { rank: 4, name: 'Chloe Bennett', rate: '95%', badge: 'Top 5' },
              { rank: 5, name: 'Marcus Vance', rate: '90%', badge: 'Top 5' },
            ].map((st) => (
              <div key={st.rank} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="font-bold text-slate-500 w-5">{st.rank}.</span>
                  <span className="font-semibold text-slate-900">{st.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-emerald-700 font-mono">{st.rate}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                    {st.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* 3. Attendance Predictor Modal */}
      <Modal isOpen={isPredictorOpen} onClose={() => setIsPredictorOpen(false)} title="Attendance Simulator & Predictor">
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Calculate your future attendance percentage based on upcoming lectures you plan to attend.
          </p>

          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
            <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
              Projected Final Rate
            </span>
            <div className="text-3xl font-black text-indigo-700 mt-1">{predictedRate}%</div>
            <p className="text-[11px] text-indigo-500 mt-1">
              {predictedRate >= 85 ? '✅ Exceeds Honors threshold (>85%)' : '⚠️ Below target threshold'}
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Upcoming Classes Remaining: {futureClasses}
            </label>
            <input
              type="range"
              min={1}
              max={15}
              value={futureClasses}
              onChange={(e) => setFutureClasses(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Classes You Will Attend: {predictedAttend}
            </label>
            <input
              type="range"
              min={0}
              max={futureClasses}
              value={predictedAttend}
              onChange={(e) => setPredictedAttend(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="text-right pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsPredictorOpen(false)}
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* 4. News & Alerts Modal */}
      <Modal isOpen={isNewsOpen} onClose={() => setIsNewsOpen(false)} title="Campus & Class Announcements">
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Session 04 Camera Roll Call</span>
              <span className="text-[10px] text-slate-400">10 mins ago</span>
            </div>
            <p className="text-slate-600">
              Dr. Sarah Mitchell will be using automated OpenCV camera detection today in Room 402. Please ensure you are seated by 10:00 AM.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Midterm Attendance Audit</span>
              <span className="text-[10px] text-slate-400">Yesterday</span>
            </div>
            <p className="text-slate-600">
              The dean office confirmed all attendance logs for September have been cryptographically sealed.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
