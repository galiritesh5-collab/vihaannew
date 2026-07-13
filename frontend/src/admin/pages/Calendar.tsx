import React, { useState } from 'react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { Plus, Edit2, Trash2, X, Calendar as CalendarIcon, Clock, Users, MonitorPlay } from 'lucide-react';

export default function Calendar() {
  const db = useDB();
  const [editingEvent, setEditingEvent] = useState<any>(null);
  
  // Create a combined list of events + live classes from batches
  const combinedEvents = [
    ...(db.events || []),
    ...db.batches.flatMap(b => (b.sessions || []).map((s: any) => ({
      ...s,
      type: 'Live Class',
      batch: b.name,
      _isSession: true,
      _batchId: b.id
    })))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent.id) {
      MockDB.updateItem('events', editingEvent.id, editingEvent);
    } else {
      MockDB.addItem('events', editingEvent);
    }
    setEditingEvent(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      MockDB.deleteItem('events', id);
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Live Class': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Holiday': return 'bg-green-100 text-green-700 border-green-200';
      case 'Batch Start': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Batch End': return 'bg-red-100 text-red-700 border-red-200';
      case 'Meeting': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Master Calendar</h2>
          <p className="text-slate-500 text-sm mt-1">Manage events and view batch schedules.</p>
        </div>
        <button 
          onClick={() => setEditingEvent({ title: '', type: 'Meeting', date: new Date().toISOString().split('T')[0], time: '10:00', duration: '60', target: 'Everyone' })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {combinedEvents.map((ev, i) => (
            <div key={ev.id || `session-${i}`} className={`p-4 rounded-xl border ${getTypeColor(ev.type)} bg-opacity-50 flex flex-col justify-between`}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{ev.type}</span>
                  {ev.target && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/50">{ev.target}</span>}
                  {ev.batch && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/50 text-orange-800">{ev.batch}</span>}
                </div>
                <h4 className="font-bold text-sm mb-1">{ev.title || ev.topic}</h4>
                <div className="space-y-1 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium opacity-80">
                    <CalendarIcon className="w-3.5 h-3.5" /> {ev.date}
                  </div>
                  {(ev.time || ev.time) && (
                     <div className="flex items-center gap-1.5 text-xs font-medium opacity-80">
                       <Clock className="w-3.5 h-3.5" /> {ev.time} ({ev.duration} mins)
                     </div>
                  )}
                </div>
              </div>
              
              {!ev._isSession && (
                <div className="mt-4 flex gap-2 justify-end">
                  <button onClick={() => setEditingEvent(ev)} className="p-1.5 rounded-md bg-white/50 hover:bg-white transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(ev.id)} className="p-1.5 rounded-md bg-white/50 hover:bg-white text-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {combinedEvents.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-500">
                No events found in the calendar.
             </div>
          )}
        </div>
      </div>

      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-display font-bold text-xl text-slate-800">{editingEvent.id ? 'Edit Event' : 'New Event'}</h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Event Title</label>
                <input required type="text" value={editingEvent.title || ''} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Type</label>
                  <select value={editingEvent.type || 'Meeting'} onChange={e => setEditingEvent({...editingEvent, type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Holiday">Holiday</option>
                    <option value="Batch Start">Batch Start</option>
                    <option value="Batch End">Batch End</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Placement Event">Placement Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Audience</label>
                  <select value={editingEvent.target || 'Everyone'} onChange={e => setEditingEvent({...editingEvent, target: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Everyone">Everyone</option>
                    <option value="Students">All Students</option>
                    <option value="Mentors">All Mentors</option>
                    <option disabled className="text-slate-400">Specific Batch (Coming Soon)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Date</label>
                  <input required type="date" value={editingEvent.date || ''} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Time</label>
                  <input required type="time" value={editingEvent.time || ''} onChange={e => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setEditingEvent(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
