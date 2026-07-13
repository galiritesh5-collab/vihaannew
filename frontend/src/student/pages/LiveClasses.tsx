import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDB } from '../../hooks/useDB';
import { MonitorPlay, Calendar, Clock, Video } from 'lucide-react';

export default function LiveClasses() {
  const { studentProfile } = useAuth();
  const db = useDB();

  const myBatches = db.batches?.filter(b => b.studentIds?.includes(studentProfile?.id)) || [];
  const mySessions = db.batchSessions?.filter(s => myBatches.some(b => b.id === s.batchId)) || [];
  const upcomingSessions = mySessions.filter(s => s.status === 'Upcoming' || s.status === 'Live').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Live Classes</h2>
        <p className="text-slate-500 text-sm mt-1">Join your upcoming live sessions.</p>
      </div>

      <div className="space-y-4">
        {upcomingSessions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-500">
            No upcoming live classes scheduled at the moment.
          </div>
        ) : (
          upcomingSessions.map(cls => {
            const batch = db.batches.find(b => b.id === cls.batchId);
            return (
            <div key={cls.id} className={`bg-white p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center ${cls.status === 'Live' ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100'}`}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cls.status === 'Live' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-[#1763B6]'}`}>
                    {cls.status}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {cls.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {cls.time}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{cls.topic}</h3>
                <p className="text-sm text-slate-500 mt-1">{batch?.course} • Mentor: {batch?.mentor}</p>
              </div>
              <div className="w-full sm:w-auto shrink-0">
                {cls.meetingLink ? (
                  <a href={cls.meetingLink} target="_blank" rel="noreferrer" className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${cls.status === 'Live' ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                    <Video className="w-4 h-4" />
                    {cls.status === 'Live' ? 'Join Live Now' : 'Link Available'}
                  </a>
                ) : (
                  <button disabled className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100">
                    <Video className="w-4 h-4" />
                    Link Pending
                  </button>
                )}
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  );
}
