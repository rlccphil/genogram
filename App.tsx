/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Download, Users, Share2, Heart, Activity, UserPlus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2pdf from 'html2pdf.js';
import { FamilyMember, Relationship, Gender, Status, RelationshipType, EmotionalDynamic } from './types';
import GenogramVisualizer from './components/GenogramVisualizer';
import { cn } from './lib/utils';

export default function App() {
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'John Doe', gender: 'male', status: 'alive' },
    { id: '2', name: 'Jane Smith', gender: 'female', status: 'alive' },
  ]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  
  const [newMember, setNewMember] = useState<{ name: string; gender: Gender; status: Status }>({
    name: '',
    gender: 'male',
    status: 'alive',
  });

  const [newRel, setNewRel] = useState<{ personA: string; personB: string; type: RelationshipType; dynamic: EmotionalDynamic }>({
    personA: '',
    personB: '',
    type: 'marriage',
    dynamic: 'connected',
  });

  const addMember = () => {
    if (!newMember.name) return;
    const id = Math.random().toString(36).substr(2, 9);
    setMembers([...members, { ...newMember, id }]);
    setNewMember({ name: '', gender: 'male', status: 'alive' });
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    setRelationships(relationships.filter(r => r.personA !== id && r.personB !== id));
  };

  const addRelationship = () => {
    if (!newRel.personA || !newRel.personB || newRel.personA === newRel.personB) return;
    const id = Math.random().toString(36).substr(2, 9);
    setRelationships([...relationships, { ...newRel, id }]);
    setNewRel({ personA: '', personB: '', type: 'marriage', dynamic: 'connected' });
  };

  const removeRelationship = (id: string) => {
    setRelationships(relationships.filter(r => r.id !== id));
  };

  const downloadPDF = () => {
    const element = document.getElementById('genogram-canvas');
    if (!element) return;

    const opt = {
      margin: 1,
      filename: 'genogram.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const shareEmail = () => {
    const subject = encodeURIComponent("My Genogram");
    const body = encodeURIComponent("Check out the genogram I created using RLCC Genogram Maker!");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
            <Users className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">RLCC Genogram Maker</h1>
            <p className="text-xs text-slate-500 font-medium">Family History Visualizer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg border border-slate-200 transition-all shadow-sm font-medium text-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={shareEmail}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-100 font-medium text-sm cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-96 bg-white border-r border-slate-200 overflow-y-auto p-6 flex flex-col gap-8">
          {/* Members Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-slate-800">Family Members</h2>
            </div>
            
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter name..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                  <select
                    value={newMember.gender}
                    onChange={(e) => setNewMember({ ...newMember, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <select
                    value={newMember.status}
                    onChange={(e) => setNewMember({ ...newMember, status: e.target.value as Status })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="alive">Alive</option>
                    <option value="deceased">Deceased</option>
                  </select>
                </div>
              </div>

              <button
                onClick={addMember}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
              <AnimatePresence>
                {members.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-lg group hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        m.gender === 'male' ? 'bg-blue-400' : m.gender === 'female' ? 'bg-pink-400' : 'bg-slate-400'
                      )} />
                      <span className="text-sm font-medium text-slate-700">{m.name}</span>
                      {m.status === 'deceased' && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">RIP</span>}
                    </div>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Relationships Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-rose-500" />
              <h2 className="font-semibold text-slate-800">Relationships</h2>
            </div>

            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Person A</label>
                  <select
                    value={newRel.personA}
                    onChange={(e) => setNewRel({ ...newRel, personA: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="">Select...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Person B</label>
                  <select
                    value={newRel.personB}
                    onChange={(e) => setNewRel({ ...newRel, personB: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  >
                    <option value="">Select...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bond Type</label>
                <select
                  value={newRel.type}
                  onChange={(e) => setNewRel({ ...newRel, type: e.target.value as RelationshipType })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                >
                  <option value="marriage">Marriage</option>
                  <option value="unmarried">Unmarried / Mistress</option>
                  <option value="parent-child">Parent-Child</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emotional Dynamic</label>
                <select
                  value={newRel.dynamic}
                  onChange={(e) => setNewRel({ ...newRel, dynamic: e.target.value as EmotionalDynamic })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                >
                  <option value="connected">Connected (Solid)</option>
                  <option value="distant">Distant (Dashed)</option>
                  <option value="hostile">Hostile (Zigzag)</option>
                  <option value="cutoff">Cut-off (Interrupted)</option>
                </select>
              </div>

              <button
                onClick={addRelationship}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Relationship
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
              <AnimatePresence>
                {relationships.map((r) => {
                  const pA = members.find(m => m.id === r.personA)?.name;
                  const pB = members.find(m => m.id === r.personB)?.name;
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-lg group hover:border-rose-200 transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-700">{pA} & {pB}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{r.type} • {r.dynamic}</span>
                      </div>
                      <button
                        onClick={() => removeRelationship(r.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl flex gap-3 items-start">
              <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Drag nodes to rearrange. Use the mouse wheel to zoom. Standard genogram symbols are used for gender and status.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-slate-50 relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-800">Visualizer</h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {members.length} Members
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                {relationships.length} Relationships
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <GenogramVisualizer members={members} relationships={relationships} />
          </div>
        </div>
      </main>
    </div>
  );
}

