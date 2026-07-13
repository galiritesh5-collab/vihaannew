import React, { useState, useEffect } from 'react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { Save } from 'lucide-react';

export default function Settings() {
  const db = useDB();
  const [formData, setFormData] = useState({
    heroTitle: '',
    heroSubtitle: '',
    contactEmail: '',
    contactPhone: ''
  });

  useEffect(() => {
    if (db.websiteContent) {
      setFormData(db.websiteContent);
    }
  }, [db.websiteContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const currentDB = MockDB.get();
    currentDB.websiteContent = formData;
    MockDB.set(currentDB);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Platform Settings</h2>
          <p className="text-slate-500 text-sm mt-1">Configure global platform options and website content.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-[#1763B6] hover:bg-[#277EDC] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Website Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Title</label>
            <input
              type="text"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              className="w-full text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Hero Subtitle</label>
            <textarea
              name="heroSubtitle"
              value={formData.heroSubtitle}
              onChange={handleChange}
              rows={3}
              className="w-full text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full text-sm border border-slate-200 outline-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1763B6]/20 focus:border-[#1763B6]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
