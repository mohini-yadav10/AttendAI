import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, ShieldCheck, Cpu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-2xl text-slate-600 hover:bg-wine-50 hover:text-wine-800 lg:hidden transition"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-wine-900 to-wine-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Cpu className="w-4 h-4 text-amber-300" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-black tracking-tight text-slate-900">Attend</span>
            <span className="text-lg font-black tracking-tight text-wine-800">AI</span>
            <span className="ml-1.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Multimodal
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Multimodal BioEnable Status Pill */}
        <Link
          to="/status"
          className="hidden md:flex items-center space-x-1.5 px-3 py-1 text-xs font-bold text-wine-900 bg-wine-50 rounded-full border border-wine-200 hover:bg-wine-100 transition shadow-2xs"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Biometric Fusion Gateway Active</span>
        </Link>

        {user && (
          <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-wine-800 text-white font-bold flex items-center justify-center text-xs shadow-xs ring-2 ring-wine-100">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                <span className="text-[10px] uppercase font-extrabold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition active:scale-95"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
