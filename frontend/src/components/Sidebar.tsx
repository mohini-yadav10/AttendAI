import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Camera,
  BarChart3,
  FileText,
  ShieldCheck,
  Activity,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isTeacher } = useAuth();

  const teacherNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Classes & Courses', path: '/classes', icon: BookOpen },
    { name: 'Student Roster', path: '/students', icon: Users },
    { name: 'Class Sessions', path: '/sessions', icon: Calendar },
    { name: 'Live Face Capture', path: '/sessions/new-capture', icon: Camera },
    { name: 'Analytics & Insights', path: '/analytics', icon: BarChart3 },
    { name: 'Attendance Reports', path: '/reports', icon: FileText },
    { name: 'Security & Audit', path: '/audit', icon: ShieldCheck },
    { name: 'System Status', path: '/status', icon: Activity },
  ];

  const studentNavItems = [
    { name: 'Presence Hub', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'System Status', path: '/status', icon: Activity },
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 transition-all duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">
              Attend<span className="text-indigo-600">AI</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 font-extrabold uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              v1.0
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
};
