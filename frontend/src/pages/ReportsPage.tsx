import React, { useState } from 'react';
import { Download, Printer, Filter, FileSpreadsheet, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('CS401');
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const reportData = [
    { studentId: 'STU001', name: 'Alex Johnson', sessionsTotal: 20, attended: 19, late: 1, rate: 95 },
    { studentId: 'STU002', name: 'Priya Sharma', sessionsTotal: 20, attended: 19, late: 0, rate: 95 },
    { studentId: 'STU003', name: 'Marcus Vance', sessionsTotal: 20, attended: 18, late: 1, rate: 90 },
    { studentId: 'STU004', name: 'Elena Rostova', sessionsTotal: 20, attended: 20, late: 0, rate: 100 },
    { studentId: 'STU005', name: 'David Kim', sessionsTotal: 20, attended: 17, late: 1, rate: 85 },
    { studentId: 'STU006', name: 'Fatima Zahra', sessionsTotal: 20, attended: 18, late: 2, rate: 90 },
    { studentId: 'STU007', name: 'Chen Wei', sessionsTotal: 20, attended: 15, late: 1, rate: 75 },
    { studentId: 'STU008', name: 'Chloe Bennett', sessionsTotal: 20, attended: 19, late: 0, rate: 95 },
  ];

  const handleExport = () => {
    // Generate CSV content
    const headers = ['Student ID', 'Student Name', 'Total Sessions', 'Attended', 'Late', 'Attendance Rate (%)'];
    const rows = reportData.map((row) => [
      row.studentId,
      `"${row.name}"`,
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
    link.setAttribute('download', `AttendAI_Report_${selectedClass}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendance report exported to CSV successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Attendance Reports & Exports</h1>
          <p className="text-sm text-charcoal-500">
            Generate official academic records, export CSVs, and audit summaries
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-charcoal-300 text-charcoal-700 hover:bg-charcoal-50 text-sm font-semibold transition"
          >
            <Printer className="w-4 h-4 text-charcoal-500" />
            <span>Print</span>
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 transition shadow-xs text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
              Select Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-sm border border-charcoal-300 rounded-xl px-3 py-2 bg-surface text-charcoal-800"
            >
              <option value="CS401">CS401: Intro to AI & Machine Learning</option>
              <option value="CS201">CS201: Data Structures & Algorithms</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
              Academic Term
            </label>
            <select className="text-sm border border-charcoal-300 rounded-xl px-3 py-2 bg-surface text-charcoal-800">
              <option>Fall 2026 (Active)</option>
              <option>Spring 2026</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
          <CheckCircle className="w-4 h-4" />
          <span>All 20 sessions verified by instructor signature</span>
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="bg-surface rounded-2xl border border-charcoal-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-charcoal-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-charcoal-900">
              Official Class Roster Record: {selectedClass}
            </h2>
            <p className="text-xs text-charcoal-500">Includes biometric confirmation timestamps and rate</p>
          </div>
          <FileSpreadsheet className="w-5 h-5 text-charcoal-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-background text-charcoal-500 uppercase text-[11px] font-semibold tracking-wider border-b border-charcoal-200">
                <th className="py-3 px-6">Student ID</th>
                <th className="py-3 px-6">Full Name</th>
                <th className="py-3 px-6">Total Sessions</th>
                <th className="py-3 px-6">Attended</th>
                <th className="py-3 px-6">Tardy</th>
                <th className="py-3 px-6">Compliance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100">
              {reportData.map((row) => (
                <tr key={row.studentId} className="hover:bg-charcoal-50/50 transition">
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-charcoal-700">
                    {row.studentId}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-charcoal-900">{row.name}</td>
                  <td className="py-3.5 px-6 text-xs text-charcoal-600">{row.sessionsTotal}</td>
                  <td className="py-3.5 px-6 text-xs font-semibold text-emerald-700">{row.attended}</td>
                  <td className="py-3.5 px-6 text-xs text-amber-700">{row.late}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`font-bold text-xs ${
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
