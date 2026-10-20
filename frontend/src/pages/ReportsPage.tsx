import React, { useState } from 'react';
import { Download, Printer, FileSpreadsheet, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('CS401');

  const reportData = [
    { studentId: 'STU001', name: 'Alex Johnson', sessionsTotal: 20, attended: 19, late: 1, rate: 95, rfid: '8821-AF' },
    { studentId: 'STU002', name: 'Priya Sharma', sessionsTotal: 20, attended: 19, late: 0, rate: 95, rfid: '8822-BC' },
    { studentId: 'STU003', name: 'Marcus Vance', sessionsTotal: 20, attended: 18, late: 1, rate: 90, rfid: '8823-CD' },
    { studentId: 'STU004', name: 'Elena Rostova', sessionsTotal: 20, attended: 20, late: 0, rate: 100, rfid: '8824-DE' },
    { studentId: 'STU005', name: 'David Kim', sessionsTotal: 20, attended: 17, late: 1, rate: 85, rfid: '8825-EF' },
    { studentId: 'STU006', name: 'Fatima Zahra', sessionsTotal: 20, attended: 18, late: 2, rate: 90, rfid: '8826-FG' },
    { studentId: 'STU007', name: 'Chen Wei', sessionsTotal: 20, attended: 15, late: 1, rate: 75, rfid: '8827-GH' },
    { studentId: 'STU008', name: 'Chloe Bennett', sessionsTotal: 20, attended: 19, late: 0, rate: 95, rfid: '8828-HI' },
  ];

  const handleExport = () => {
    const headers = ['Student ID', 'Student Name', 'Smart RFID Pass', 'Total Sessions', 'Attended', 'Late', 'Attendance Rate (%)'];
    const rows = reportData.map((row) => [
      row.studentId,
      `"${row.name}"`,
      row.rfid,
      row.sessionsTotal,
      row.attended,
      row.late,
      row.rate,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BioEnable_Attendance_Report_${selectedClass}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Official Multimodal Attendance Report exported to CSV!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Institutional Attendance Reports & CSV Export
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically signed biometric roll call summaries for academic registrars
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print</span>
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-2xl font-black text-white bg-marigold-500 hover:bg-marigold-600 transition shadow-md shadow-marigold-500/25 active:scale-95 text-xs uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 card-hover">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-2xl px-3.5 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-pine-600"
            >
              <option value="CS401">CS401: Intro to AI & Machine Learning</option>
              <option value="CS201">CS201: Data Structures & Algorithms</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Academic Term
            </label>
            <select className="text-xs font-bold border border-slate-200 rounded-2xl px-3.5 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-pine-600">
              <option>Fall 2026 (Active)</option>
              <option>Spring 2026</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-pine-800 bg-pine-50 px-3.5 py-2 rounded-2xl border border-pine-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Multimodal verification signatures certified</span>
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden card-hover">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Official Class Roster Record: {selectedClass}
            </h2>
            <p className="text-xs text-slate-400">Includes biometric token hashes and compliance rates</p>
          </div>
          <FileSpreadsheet className="w-5 h-5 text-pine-600" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Student ID</th>
                <th className="py-3.5 px-6">Full Name</th>
                <th className="py-3.5 px-6">RFID Badge</th>
                <th className="py-3.5 px-6">Sessions</th>
                <th className="py-3.5 px-6">Attended</th>
                <th className="py-3.5 px-6">Tardy</th>
                <th className="py-3.5 px-6">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.map((row) => (
                <tr key={row.studentId} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-slate-700">
                    {row.studentId}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{row.name}</td>
                  <td className="py-3.5 px-6 font-mono text-xs text-pine-700 font-bold">{row.rfid}</td>
                  <td className="py-3.5 px-6 text-xs text-slate-600">{row.sessionsTotal}</td>
                  <td className="py-3.5 px-6 text-xs font-bold text-pine-700">{row.attended}</td>
                  <td className="py-3.5 px-6 text-xs text-marigold-600 font-bold">{row.late}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`font-black text-xs ${
                        row.rate < 80 ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {row.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
