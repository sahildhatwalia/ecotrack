import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Activity, MapPin, Zap, RefreshCcw, Navigation, 
  TrendingUp, CheckCircle, Lightbulb, ShieldCheck, 
  Cpu, ArrowRight, Table as TableIcon, LayoutGrid, Clock, Plus
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import toast from 'react-hot-toast';

const activityOptions = [
  { type: 'Walking', icon: <TrendingUp size={20} />, color: 'bg-green-500', fact: "Walking instead of driving saves around 0.16kg of CO2 per km." },
  { type: 'Running', icon: <Activity size={20} />, color: 'bg-rose-500', fact: "Running is a high-intensity eco-action! It burns calories and saves 0.18kg of CO2 per km." },
  { type: 'Cycling', icon: <Activity size={20} />, color: 'bg-teal-500', fact: "Cycling is zero-emission transport! It saves roughly 0.21kg of CO2 per km." },
  { type: 'Public Transport', icon: <Navigation size={20} />, color: 'bg-blue-600', fact: "Taking a bus or train reduces your carbon footprint significantly." },
  { type: 'EV Trip', icon: <Zap size={20} />, color: 'bg-indigo-500', fact: "Electric Vehicles save ~0.06kg of CO2 per km compared to fossil-fuel cars." },
  { type: 'Recycling', icon: <RefreshCcw size={20} />, color: 'bg-lime-500', fact: "Recycling a plastic bottle can power a 60W bulb for 6 hours!" },
];

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0]);
  const [distance, setDistance] = useState('');
  const [weatherSim, setWeatherSim] = useState('Clear');
  const [userActivities, setUserActivities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const { api, user } = useContext(AuthContext);
  const { searchTerm } = useSearch();

  useEffect(() => {
    fetchActivities();
  }, [api]);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setUserActivities(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      toast.error("Failed to sync activity ledger.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const simulatedMetadata = {
        gpsAccuracy: Math.floor(Math.random() * 40) + 5,
        isMockLocation: false,
        weather: weatherSim,
        topSpeed: selectedActivity.type === 'Walking' ? 6 : (selectedActivity.type === 'Cycling' ? 22 : 60),
        stepCount: selectedActivity.type === 'Walking' ? (distance ? parseFloat(distance) * 1300 : Math.random() * 2000) : 0,
      };

      const res = await api.post('/activities', {
        activityType: selectedActivity.type,
        distance: distance ? parseFloat(distance) : null,
        metadata: simulatedMetadata
      });

      const { co2Saved, points } = res.data.data;
      toast.success(`Logged! Saved ${co2Saved}kg CO2 and earned ${points} pts`);
      
      setDistance('');
      fetchActivities();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#22c55e', '#0f172a'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredHistory = userActivities.filter(a => 
    a.activityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requiresDistance = ['Walking', 'Public Transport', 'Cycling'].includes(selectedActivity.type);

  return (
    <div className="pb-20 pt-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Telemetry Engine</h1>
        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
           <Cpu size={14} /> AI-assisted activity verification enabled
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Selector & Tool */}
        <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">
          {/* Activity Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {activityOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setSelectedActivity(option)}
                className={`flex flex-col items-center justify-center p-6 saas-card transition-all group ${
                  selectedActivity.type === option.type 
                  ? 'ring-2 ring-green-500 bg-green-50/30' 
                  : 'hover:bg-white'
                }`}
              >
                <div className={`p-3 rounded-xl mb-3 shadow-sm group-hover:scale-110 transition-transform ${
                  selectedActivity.type === option.type ? option.color + ' text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {option.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest text-center ${
                   selectedActivity.type === option.type ? 'text-green-700' : 'text-slate-400'
                }`}>{option.type}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Log Form */}
             <div className="saas-card p-10 bg-white">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Log Entry</h3>
                   <div className="p-1 px-3 bg-green-50 text-green-700 text-[10px] font-black rounded-full border border-green-100 flex items-center gap-2">
                      <ShieldCheck size={12} /> SECURE
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                   {requiresDistance ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Distance (Kilometers)</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={distance}
                              onChange={(e) => setDistance(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-green-500 rounded-2xl p-6 text-3xl font-black outline-none transition-all pr-16"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold">KM</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Climate Context</label>
                          <div className="grid grid-cols-3 gap-2">
                             {['Clear', 'Rain', 'Snow'].map(w => (
                               <button 
                                 key={w} 
                                 type="button"
                                 onClick={() => setWeatherSim(w)}
                                 className={`p-3 rounded-xl border text-[11px] font-bold transition-all ${
                                   weatherSim === w ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                                 }`}
                               >
                                 {w}
                               </button>
                             ))}
                          </div>
                        </div>
                      </div>
                   ) : (
                      <div className="py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                         <CheckCircle className="text-green-500 mb-3" size={32} />
                         <p className="text-sm font-bold text-slate-900">Instant Verification Ready</p>
                         <p className="text-[10px] text-slate-400 font-medium">No distance metrics required for {selectedActivity.type}.</p>
                      </div>
                   )}

                   <button 
                     disabled={isSubmitting}
                     type="submit"
                     className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg"
                   >
                     {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Log ${selectedActivity.type}`}
                     {!isSubmitting && <ArrowRight size={20} />}
                   </button>
                </form>
             </div>

             {/* Dynamic insight card */}
             <div className="flex flex-col gap-8">
                <div className="saas-card p-8 bg-green-500 text-white flex-1 relative overflow-hidden group">
                  <div className="absolute top-[-20%] left-[-20%] w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <Lightbulb size={32} className="mb-6 text-green-200" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-green-100 mb-2">Contextual Insight</h4>
                  <p className="text-lg font-bold leading-tight mb-6">{selectedActivity.fact}</p>
                  <div className="p-4 bg-white/10 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="text-green-300" /> 2x Point Multiplier Active
                  </div>
                </div>

                <div className="saas-card p-8 bg-white border-slate-100">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                     <Clock size={12} /> Recent History
                   </h4>
                   <div className="space-y-4">
                      {filteredHistory.slice(0, 3).map(a => (
                        <div key={a._id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                             <div className="p-1.5 bg-white rounded text-slate-400 shadow-sm"><Activity size={14} /></div>
                             <p className="text-xs font-bold text-slate-900">{a.activityType}</p>
                          </div>
                          <span className="text-[10px] font-black text-green-600">+{a.points}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Full Ledger Section */}
        <div className="lg:col-span-12 mt-12">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Activity Ledger</h2>
                 <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}><LayoutGrid size={16} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}><TableIcon size={16} /></button>
                 </div>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {filteredHistory.length} results</div>
           </div>

           {filteredHistory.length === 0 ? (
              <div className="saas-card p-20 flex flex-col items-center text-center">
                 <div className="p-6 bg-slate-50 rounded-full mb-6"><Plus className="text-slate-300" size={32} /></div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">No entries matched.</h3>
                 <p className="text-slate-500 text-sm italic">Try searching for something else or log your first activity.</p>
              </div>
           ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
                 {filteredHistory.map((a, i) => (
                   viewMode === 'grid' ? (
                     <motion.div 
                       key={a._id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.05 }}
                       className="saas-card p-6 flex flex-col group cursor-default"
                     >
                       <div className="flex justify-between items-start mb-6">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{a.activityType}</span>
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                       </div>
                       <div className="flex-1 flex flex-col justify-end">
                          <div className="flex items-baseline gap-1 mb-4">
                             <span className="text-3xl font-black text-slate-900 tracking-tighter">{a.co2Saved.toFixed(1)}</span>
                             <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Kg Saved</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                             <span className="text-[10px] font-black text-green-600 uppercase">+{a.points} PTS</span>
                             <span className="text-[9px] font-bold text-slate-400 italic">{new Date(a.createdAt).toLocaleDateString([], {month: 'short', day: 'numeric'})}</span>
                          </div>
                       </div>
                     </motion.div>
                   ) : (
                     <motion.div 
                       key={a._id}
                       className="saas-card p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                     >
                        <div className="flex items-center gap-4 flex-1">
                           <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Activity size={16} /></div>
                           <div>
                              <p className="text-sm font-bold text-slate-900">{a.activityType}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">{new Date(a.createdAt).toLocaleString()}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-10">
                           <div className="text-right">
                              <p className="text-sm font-black text-slate-900">{a.co2Saved.toFixed(2)} kg</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase">Reduction</p>
                           </div>
                           <div className="text-right min-w-[80px]">
                              <p className="text-sm font-black text-green-600">+{a.points} PTS</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase italic">Earned</p>
                           </div>
                        </div>
                     </motion.div>
                   )
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
