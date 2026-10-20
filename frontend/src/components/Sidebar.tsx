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
    { name: 'Security & Audit Logs', path: '/audit', icon: ShieldCheck },
    { name: 'System Status', path: '/status', icon: Activity },
  ];

  const studentNavItems = [
    { name: 'My Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'System Status', path: '/status', icon: Activity },
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-charcoal-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-charcoal-100">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl text-primary-600">AttendAI</span>
            <span className="text-xs px-2 py-0.5 font-bold uppercase rounded bg-primary-100 text-primary-800">
              v1.0
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
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
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900'
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
