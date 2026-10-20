import { GithubIcon } from '../components/GithubIcon';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, ShieldCheck, Cpu, Bell, Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MentorRubricModal } from './MentorRubricModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isRubricOpen, setIsRubricOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-2xl text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-amber-400" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black tracking-tight text-zinc-900">Attend</span>
              <span className="text-lg font-black tracking-tight text-amber-600">AI</span>
              <span className="ml-1.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Multimodal
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Mentor Rubric Evaluation Button */}
          <button
            onClick={() => setIsRubricOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-900 font-extrabold text-xs transition cursor-pointer"
            title="Review Project Rubric, Scenarios & Specs"
          >
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden md:inline">Mentor Rubric & Specs</span>
            <span className="md:hidden">Rubric</span>
          </button>

          {/* GitHub Repository Link Button */}
          <a
            href="https://github.com/mohini-yadav10/AttendAI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition shadow-xs"
            title="View Project Source on GitHub"
          >
            <GithubIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>

          {/* Multimodal BioEnable Status Pill */}
          <Link
            to="/status"
            className="hidden xl:flex items-center space-x-2 px-3 py-1.5 text-xs font-bold text-zinc-800 bg-zinc-100 rounded-full border border-zinc-300 hover:bg-zinc-200 transition shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Gateway Active</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-3 border-l border-zinc-200 pl-3 sm:pl-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-black flex items-center justify-center text-xs shadow-xs ring-2 ring-zinc-300">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-extrabold text-zinc-900 leading-tight">{user.name}</p>
                  <span className="text-[10px] uppercase font-black text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-300">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-700 hover:bg-rose-50 transition active:scale-95 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mentor Evaluation Rubric Modal */}
      <MentorRubricModal isOpen={isRubricOpen} onClose={() => setIsRubricOpen(false)} />
    </>
  );
};
