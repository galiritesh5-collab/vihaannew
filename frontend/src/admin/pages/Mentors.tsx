import React, { useState } from 'react';
import { Search, Plus, X, Edit, Trash2, Mail, Phone, Image as ImageIcon } from 'lucide-react';
import { useDB } from '../../hooks/useDB';
import { MockDB } from '../../services/MockDB';
import { Mentor } from '../../types';
import ImageUploader from '../components/ImageUploader';

export default function Mentors() {
  const db = useDB();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [designation, setDesignation] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [assignedBatchIds, setAssignedBatchIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const filteredMentors = db.mentors?.filter(m =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleOpenModal = (mentor?: Mentor) => {
    if (mentor) {
      setEditingMentor(mentor);
      setName(mentor.name || '');
      setEmail(mentor.email || '');
      setPhone(mentor.phone || '');
      setSpecialization(mentor.specialization || '');
      setQualification(mentor.qualification || '');
      setExperience(mentor.experience || '');
      setDesignation(mentor.designation || '');
      setProfilePhoto(mentor.profilePhoto || '');
      setBio(mentor.bio || '');
      setStatus(mentor.status || 'Active');
      setAssignedBatchIds(mentor.assignedBatchIds || []);
      setNotes(mentor.notes || '');
    } else {
      setEditingMentor(null);
      setName('');
      setEmail('');
      setPhone('');
      setSpecialization('');
      setQualification('');
      setExperience('');
      setDesignation('');
      setProfilePhoto('');
      setBio('');
      setStatus('Active');
      setAssignedBatchIds([]);
      setNotes('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name || !email) {
      alert("Name and Email are required");
      return;
    }

    const mentorData: Partial<Mentor> = {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      designation,
      profilePhoto,
      bio,
      status,
      assignedBatchIds,
      notes
    };

    if (editingMentor) {
      MockDB.updateItem('mentors', editingMentor.id, mentorData);
    } else {
      MockDB.addItem('mentors', {
        ...mentorData,
        id: Date.now().toString(),
        role: 'mentor'
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this mentor?")) {
      MockDB.deleteItem('mentors', id);
    }
  };

  const toggleBatch = (batchId: string) => {
    setAssignedBatchIds(prev => 
      prev.includes(batchId) ? prev.filter(id => id !== batchId) : [...prev, batchId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 tracking-tight">Mentors</h2>
          <p className="text-slate-500 text-sm mt-1">Manage instructors and assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search mentors..." 
              className="w-full sm:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Mentor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map(mentor => (
          <div key={mentor.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                  {mentor.profilePhoto ? (
                    <img src={mentor.profilePhoto} alt={mentor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-indigo-500">{mentor.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  mentor.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {mentor.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{mentor.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{mentor.designation || 'Instructor'}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{mentor.email}</span>
                </div>
                {mentor.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{mentor.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {mentor.assignedBatchIds && mentor.assignedBatchIds.length > 0 ? (
                  mentor.assignedBatchIds.map(id => {
                    const b = db.batches?.find(batch => batch.id === id);
                    return b ? (
                      <span key={id} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
                        {b.name}
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-xs text-slate-400 italic">No batches assigned</span>
                )}
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleOpenModal(mentor)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(mentor.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filteredMentors.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
            No mentors found.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">
                {editingMentor ? 'Edit Mentor' : 'Add New Mentor'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <ImageUploader 
                    label="Profile Image"
                    value={profilePhoto}
                    onChange={(url) => setProfilePhoto(url)}
                    recommendedSize="200 × 200 px"
                    recommendedFormat="Square PNG/JPG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gmail Address *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200" required />
                  <p className="text-xs text-slate-500 mt-1">Used for Google Sign-In access.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                  <input type="text" value={designation} onChange={e => setDesignation(e.target.value)} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200" placeholder="e.g. Senior SAP Consultant" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
                  <input type="text" value={qualification} onChange={e => setQualification(e.target.value)} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                  <input type="text" value={experience} onChange={e => setExperience(e.target.value)} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200" placeholder="e.g. 10 Years" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                  <input type="text" value={specialization} onChange={e => setSpecialization(e.target.value)} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200" placeholder="e.g. SAP FICO, SAP MM" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Assigned Batches</label>
                  <div className="border border-slate-200 rounded-lg p-3 max-h-48 overflow-y-auto bg-slate-50/50">
                    {db.batches?.length === 0 && <p className="text-sm text-slate-500 italic">No batches available.</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {db.batches?.map(batch => (
                        <label key={batch.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={assignedBatchIds.includes(batch.id)}
                            onChange={() => toggleBatch(batch.id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm font-medium text-slate-700">{batch.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Internal Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')} className="w-full rounded-lg border-slate-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
              >
                {editingMentor ? 'Save Changes' : 'Add Mentor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
