import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Bell,
  Star,
  Check,
  CheckCircle2,
  Calendar,
  CreditCard,
  Fingerprint,
  QrCode,
  ShieldCheck,
  Award,
  Sparkles,
  Smartphone,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeScreen, setActiveScreen] = useState<'profile' | 'card' | 'success'>('profile');
  const [selectedDuration, setSelectedDuration] = useState('15 Days');
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Biometric'>('Card');

  // Subjects / Courses Selection
  const [subjects, setSubjects] = useState([
    { name: 'Computer Science (CS401)', fee: '$140', rate: '96%', selected: true },
    { name: 'Data Structures (CS201)', fee: '$120', rate: '92%', selected: true },
    { name: 'Machine Learning Lab', fee: '$130', rate: '90%', selected: false },
  ]);

  const toggleSubject = (index: number) => {
    const updated = [...subjects];
    updated[index].selected = !updated[index].selected;
    setSubjects(updated);
  };

  const handleConfirmVerification = () => {
    setActiveScreen('success');
    toast.success('Biometric session authenticated successfully!');
  };

  return (
    <div className="space-y-6 animate-pop-in">
      {/* Top Header & Screen Switcher Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>BioEnable Multimodal Student Portal</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-marigold-100 text-marigold-800 font-extrabold uppercase border border-marigold-200">
              Biometric ID Pass
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Facial recognition, RFID contactless smart card, and attendance authorization
          </p>
        </div>

        {/* Screen switcher tabs matching the 3-panel UI */}
        <div className="flex items-center space-x-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setActiveScreen('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeScreen === 'profile'
                ? 'bg-pine-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Biometric Profile
          </button>
          <button
            onClick={() => setActiveScreen('card')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeScreen === 'card'
                ? 'bg-pine-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Smart ID Card
          </button>
          <button
            onClick={() => setActiveScreen('success')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeScreen === 'success'
                ? 'bg-marigold-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Verification State
          </button>
        </div>
      </div>

      {/* Main Container: Mobile Frame Display matching Screenshot */}
      <div className="flex justify-center py-4">
        <div className="w-full max-w-[390px] rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl ring-12 ring-slate-800/60 transition-all duration-300">
          <div className="rounded-[2.2rem] overflow-hidden bg-pine-700 text-white shadow-inner min-h-[660px] flex flex-col justify-between">
            {/* ── Screen 1: Biometric Profile (Left Screen in Image) ── */}
            {activeScreen === 'profile' && (
              <div className="animate-pop-in">
                {/* Pine Green Top Header */}
                <div className="px-5 pt-6 pb-4 flex items-center justify-between">
                  <button
                    onClick={() => toast.success('Navigation menu')}
                    className="p-1 rounded-full text-white/90 hover:bg-white/10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-extrabold tracking-tight text-white">
                    Details of Student
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-white/90 hover:text-white">
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* White Rounded Card Body */}
                <div className="bg-white text-slate-800 rounded-t-[2rem] px-5 pt-5 pb-6 space-y-4 shadow-xl">
                  {/* Profile Header Block */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pine-700 to-pine-500 text-white font-extrabold text-lg flex items-center justify-center shadow-md ring-2 ring-pine-100">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                          {user?.name || 'Alex Johnson'}
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-400">
                          Computer Science • Artificial Intelligence
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-marigold-500 font-bold text-xs bg-marigold-50 px-2 py-1 rounded-xl">
                      <Star className="w-3.5 h-3.5 fill-marigold-500" />
                      <span>96%</span>
                    </div>
                  </div>

                  {/* ── 3 Horizontal Stat Blocks (Exact Match to Screenshot) ── */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* 1. Pine Green Block */}
                    <div className="bg-pine-700 text-white rounded-2xl p-3 shadow-xs card-pill-stat flex flex-col justify-between">
                      <p className="text-[10px] text-pine-200 font-semibold leading-tight">
                        Year of Study
                      </p>
                      <h4 className="text-xl font-black mt-1">3rd</h4>
                    </div>

                    {/* 2. Vibrant Marigold Block */}
                    <div className="bg-marigold-500 text-white rounded-2xl p-3 shadow-xs card-pill-stat flex flex-col justify-between">
                      <p className="text-[10px] text-marigold-100 font-semibold leading-tight">
                        Biometric Status
                      </p>
                      <h4 className="text-sm font-black mt-1 uppercase">Valid</h4>
                    </div>

                    {/* 3. Pine Green Block */}
                    <div className="bg-pine-700 text-white rounded-2xl p-3 shadow-xs card-pill-stat flex flex-col justify-between">
                      <p className="text-[10px] text-pine-200 font-semibold leading-tight">
                        Institution
                      </p>
                      <h4 className="text-xs font-black mt-1 truncate">BioEnable U</h4>
                    </div>
                  </div>

                  {/* ── Subject Exp. / Attendance Roster Checkbox Card ── */}
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-1">
                      <span>Course Module</span>
                      <span>Attendance</span>
                    </div>

                    {subjects.map((sub, idx) => (
                      <div
                        key={sub.name}
                        onClick={() => toggleSubject(idx)}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                          sub.selected
                            ? 'bg-white border-pine-600/40 shadow-2xs'
                            : 'bg-transparent border-transparent text-slate-500'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                              sub.selected
                                ? 'bg-marigold-500 text-white'
                                : 'border-2 border-slate-300'
                            }`}
                          >
                            {sub.selected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`font-semibold ${
                              sub.selected ? 'text-slate-900' : 'text-slate-500'
                            }`}
                          >
                            {sub.name}
                          </span>
                        </div>
                        <span className="font-bold text-pine-700 font-mono">{sub.rate}</span>
                      </div>
                    ))}
                  </div>

                  {/* ── Selection Duration Pills (15 Days, 20 Days, 30 Days) ── */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-2">Verification Validity</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['15 Days', '20 Days', '30 Days'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDuration(d)}
                          className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all ${
                            selectedDuration === d
                              ? 'bg-marigold-500 text-white shadow-md shadow-marigold-500/25'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Proceed to Card Button */}
                  <button
                    onClick={() => setActiveScreen('card')}
                    className="w-full mt-2 py-3 rounded-2xl font-bold text-white bg-pine-700 hover:bg-pine-800 transition-all shadow-sm active:scale-95 text-xs uppercase tracking-wider"
                  >
                    View Biometric Smart Pass →
                  </button>
                </div>
              </div>
            )}

            {/* ── Screen 2: Smart Card & Payment Pass (Center Screen in Image) ── */}
            {activeScreen === 'card' && (
              <div className="animate-pop-in">
                {/* Pine Green Top Header */}
                <div className="px-5 pt-6 pb-4 flex items-center justify-between">
                  <button
                    onClick={() => setActiveScreen('profile')}
                    className="p-1 rounded-full text-white/90 hover:bg-white/10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-extrabold tracking-tight text-white">
                    Smart Biometric Pass
                  </h2>
                  <Bell className="w-4 h-4 text-white/90" />
                </div>

                {/* White Rounded Card Body */}
                <div className="bg-white text-slate-800 rounded-t-[2rem] px-5 pt-5 pb-6 space-y-4 shadow-xl">
                  {/* Method Toggle: Card vs Biometric */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800">Pass Method</span>
                    <div className="flex items-center p-0.5 bg-slate-100 rounded-xl">
                      <button
                        onClick={() => setPaymentMethod('Card')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          paymentMethod === 'Card'
                            ? 'bg-marigold-500 text-white shadow-2xs'
                            : 'text-slate-500'
                        }`}
                      >
                        RFID Pass
                      </button>
                      <button
                        onClick={() => setPaymentMethod('Biometric')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          paymentMethod === 'Biometric'
                            ? 'bg-marigold-500 text-white shadow-2xs'
                            : 'text-slate-500'
                        }`}
                      >
                        Biometrics
                      </button>
                    </div>
                  </div>

                  {/* ── Pine Green Bank / Student Smart Card Mockup ── */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-pine-800 via-pine-700 to-pine-600 p-5 text-white shadow-xl card-hover">
                    {/* Organic wave art overlay */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none">
                      <svg viewBox="0 0 400 240" fill="none" className="w-full h-full">
                        <path
                          d="M-50 180 C 120 120, 220 220, 450 140"
                          stroke="white"
                          strokeWidth="24"
                        />
                        <path
                          d="M-30 80 C 150 20, 240 180, 450 60"
                          stroke="white"
                          strokeWidth="16"
                        />
                      </svg>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      {/* Chip icon circles */}
                      <div className="flex items-center -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-white/70" />
                        <div className="w-6 h-6 rounded-full bg-white/40" />
                      </div>
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    </div>

                    <div className="relative z-10 mt-6">
                      <h4 className="text-sm font-bold tracking-wide text-white/95">
                        {user?.name || 'Joan Gamell'}
                      </h4>
                      <p className="font-mono text-xs tracking-widest text-white/80 mt-1">
                        1234 •••• •••• 3456
                      </p>
                    </div>

                    <div className="relative z-10 mt-4 flex items-center justify-between text-[10px] text-white/70 font-mono">
                      <span>EXP: 08/2030</span>
                      <span className="uppercase text-marigold-300 font-bold">NFC READY</span>
                    </div>
                  </div>

                  {/* Card Detail Form Fields */}
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                    <p className="text-[11px] font-extrabold uppercase text-slate-500">
                      Credentials Detail
                    </p>
                    <input
                      type="text"
                      readOnly
                      value="STU-001 • RFID 8829-AF"
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        readOnly
                        value="Validity: 30 Days"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                      />
                      <input
                        type="text"
                        readOnly
                        value="PIN: Verified"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-emerald-700 font-bold"
                      />
                    </div>
                  </div>

                  {/* Dual Action Buttons: Cancel (Pine) & Confirm (Marigold) */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setActiveScreen('profile')}
                      className="py-3 px-4 rounded-2xl font-bold text-white bg-pine-700 hover:bg-pine-800 transition active:scale-95 text-xs text-center"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmVerification}
                      className="py-3 px-4 rounded-2xl font-bold text-white bg-marigold-500 hover:bg-marigold-600 transition active:scale-95 text-xs text-center shadow-md shadow-marigold-500/25"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Screen 3: Success Screen (Right Screen in Image) ── */}
            {activeScreen === 'success' && (
              <div className="animate-pop-in h-full flex flex-col justify-between">
                {/* Pine Green Top Header */}
                <div className="px-5 pt-6 pb-4 flex items-center justify-between">
                  <button
                    onClick={() => setActiveScreen('profile')}
                    className="p-1 rounded-full text-white/90 hover:bg-white/10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-extrabold tracking-tight text-white">
                    Verification
                  </h2>
                  <Bell className="w-4 h-4 text-white/90" />
                </div>

                {/* White Rounded Card Body */}
                <div className="bg-white text-slate-800 rounded-t-[2rem] px-6 pt-12 pb-10 flex-1 flex flex-col items-center justify-between shadow-xl text-center">
                  <div className="flex flex-col items-center space-y-5">
                    {/* Concentric Golden Checkmark Circle */}
                    <div className="relative flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-marigold-100/60 animate-ping absolute" />
                      <div className="w-20 h-20 rounded-full bg-marigold-100 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-marigold-500 text-white flex items-center justify-center shadow-lg shadow-marigold-500/30">
                          <Check className="w-8 h-8 stroke-[3]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        Successfully!
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-[220px] leading-relaxed">
                        Your Multimodal Attendance Verification is Successfully authenticated.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-pine-50 border border-pine-200 text-pine-800 text-xs font-semibold flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Fingerprint & Face Token Signed</span>
                    </div>
                  </div>

                  {/* Golden Yellow "Done" Button */}
                  <button
                    onClick={() => setActiveScreen('profile')}
                    className="w-full py-3.5 rounded-2xl font-black text-sm text-white bg-marigold-500 hover:bg-marigold-600 transition-all duration-150 shadow-md shadow-marigold-500/30 active:scale-95"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
