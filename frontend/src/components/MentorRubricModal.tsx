import { GithubIcon } from '../components/GithubIcon';
import React from 'react';
import {
  X,
  ExternalLink,
  Play,
  CheckCircle2,
  Award,
  Layers,
  Cpu,
  Brain,
  Video,
  Activity,
  Sparkles,
  Server,
  FileCode,
} from 'lucide-react';

interface MentorRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MentorRubricModal: React.FC<MentorRubricModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const githubUrl = 'https://github.com/mohini-yadav10/AttendAI';
  const liveWebsiteUrl = 'https://mohini-yadav10.github.io/AttendAI/';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-zinc-200 overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="bg-zinc-950 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Mentor Evaluation & Project Rubric</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Multimodal Attendance & Engagement Agent
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                AI-powered, privacy-preserving classroom intelligence & biometric attendance system
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Buttons for Mentor */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs uppercase tracking-wider transition shadow-sm"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <a
              href={liveWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Live Website Demo</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </a>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Submission Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Category
              </span>
              <p className="text-sm font-black text-zinc-900 mt-0.5">Education</p>
              <span className="text-[10px] font-semibold text-amber-700">Individual Project</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Total Epics
              </span>
              <p className="text-xl font-black text-zinc-900 mt-0.5">9 / 9</p>
              <span className="text-[10px] font-semibold text-amber-700">100% Completed</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Tasks & Stories
              </span>
              <p className="text-xl font-black text-zinc-900 mt-0.5">17 / 17</p>
              <span className="text-[10px] font-semibold text-amber-700">All Subtasks Done</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Execution Mode
              </span>
              <p className="text-sm font-black text-zinc-900 mt-0.5">Offline-First</p>
              <span className="text-[10px] font-semibold text-amber-700">Privacy Preserved</span>
            </div>
          </div>

          {/* 3 Core Evaluation Scenarios */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Project Scenarios & Functional Demonstrations</span>
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center space-x-2 text-zinc-900 font-bold text-xs sm:text-sm">
                  <Video className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Scenario 1: Automated Attendance Tracking</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Processes live or recorded video feed to detect and track participants with sustained presence tracking rather than single-frame detection, preventing temporary false positives. Automatically generates immutable timestamped logs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center space-x-2 text-zinc-900 font-bold text-xs sm:text-sm">
                  <Activity className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Scenario 2: Engagement and Session Dynamics Analysis</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Continuously analyzes behavioral indicators (head pose, movement patterns, inactivity duration, and audio activity). Fuses multimodal signals to generate time-interval engagement curves for instructors to identify attention drops.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center space-x-2 text-zinc-900 font-bold text-xs sm:text-sm">
                  <Brain className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Scenario 3: AI-Driven Teaching Suggestions</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Provides context-aware pedagogical suggestions based on classroom dynamics, assisting instructors in adjusting pacing, introducing interactive questions, or addressing participation challenges without enforcing rigid automated decisions.
                </p>
              </div>
            </div>
          </div>

          {/* System Requirements & Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center space-x-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5 text-zinc-900" />
                <span>Hardware Specifications</span>
              </h4>
              <ul className="text-xs text-zinc-600 space-y-1">
                <li>• <strong>Processor:</strong> Intel Core i5 (8th Gen+) / AMD Ryzen 5</li>
                <li>• <strong>RAM:</strong> 8 GB minimum (16 GB recommended)</li>
                <li>• <strong>Storage:</strong> 256 GB SSD / 500 GB HDD</li>
                <li>• <strong>Network:</strong> 10-20 Mbps high-speed connection</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center space-x-1.5 mb-2">
                <Server className="w-3.5 h-3.5 text-zinc-900" />
                <span>Software & Technologies</span>
              </h4>
              <ul className="text-xs text-zinc-600 space-y-1">
                <li>• <strong>AI & CV:</strong> Python 3.8+, OpenCV, FastAPI</li>
                <li>• <strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS</li>
                <li>• <strong>Backend:</strong> Node.js, Express, MongoDB Mongoose</li>
                <li>• <strong>VCS:</strong> Git (`https://github.com/mohini-yadav10/AttendAI`)</li>
              </ul>
            </div>
          </div>

          {/* Direct Verification Links Card */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-amber-950">
                Official Submission Links for Review
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5 font-mono">
                Repository: github.com/mohini-yadav10/AttendAI
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition"
              >
                Open GitHub
              </a>
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition cursor-pointer"
              >
                Close Rubric
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
