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
  Fingerprint,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isTeacher } = useAuth();

  interface NavItem {
    name: string;
    path: string;
    icon: any;
    highlight?: boolean;
  }

  const teacherNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Multimodal Capture', path: '/sessions/new-capture', icon: Camera, highlight: true },
    { name: 'Classes & Courses', path: '/classes', icon: BookOpen },
    { name: 'Student Roster', path: '/students', icon: Users },
    { name: 'Class Sessions', path: '/sessions', icon: Calendar },
    { name: 'Analytics & Insights', path: '/analytics', icon: BarChart3 },
    { name: 'Reports & Export', path: '/reports', icon: FileText },
    { name: 'Security & Audit', path: '/audit', icon: ShieldCheck },
    { name: 'System Telemetry', path: '/status', icon: Activity },
  ];

  const studentNavItems: NavItem[] = [
    { name: 'My Biometric Portal', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'System Health', path: '/status', icon: Activity },
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-pine-950/50 backdrop-blur-xs lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 transition-all duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-2xl bg-pine-700 flex items-center justify-center text-white shadow-xs">
              <Fingerprint className="w-4 h-4 text-marigold-400" />
            </div>
            <div>
              <span className="font-black text-lg text-slate-900 tracking-tight">
                Attend<span className="text-pine-700">AI</span>
              </span>
              <p className="text-[9px] uppercase tracking-wider font-extrabold text-marigold-600 leading-none">
                Bio-Metric v2.5
              </p>
            </div>
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
            Navigation Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-pine-700 text-white shadow-md shadow-pine-700/20'
                      : 'text-slate-600 hover:bg-pine-50 hover:text-pine-800 hover:translate-x-1'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.highlight && (
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-marigold-500 text-white font-extrabold shadow-2xs">
                    Live
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Hardware Hub Mini-Card */}
        <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-pine-50/70 border border-pine-200/60 rounded-2xl">
          <div className="flex items-center space-x-2 text-pine-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>BioEnable Fusion</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 leading-snug">
            Multi-sensor face, fingerprint & RFID smart card verified.
          </p>
        </div>
      </aside>
    </>
  );
};
