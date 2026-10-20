import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, Sparkles, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/90 backdrop-blur-md border-b border-charcoal-200 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-charcoal-600 hover:bg-charcoal-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold tracking-tight text-charcoal-900">Attend</span>
            <span className="text-lg font-bold tracking-tight text-primary-600">AI</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Status link */}
        <Link
          to="/status"
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200 hover:bg-emerald-100 transition"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Vision Engine Active</span>
        </Link>

        {user && (
          <div className="flex items-center space-x-3 border-l border-charcoal-200 pl-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-charcoal-800 leading-tight">{user.name}</p>
                <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-1.5 py-0.2 rounded border border-primary-200">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
