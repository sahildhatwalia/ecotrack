import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Trophy, Medal, Star, Target, Zap, ShieldCheck, ChevronRight, ArrowUpLeft, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Leaderboard = () => {
    const { api, user } = useContext(AuthContext);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/leaderboard');
                setLeaderboard(Array.isArray(res.data.data) ? res.data.data : []);
            } catch (err) {
                toast.error("Failed to sync global ranks.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, [api]);

    const topThree = leaderboard.slice(0, 3);
    const remaining = leaderboard.slice(3);

    if (isLoading) {
      return (
        <div className="space-y-8 animate-pulse pt-10">
          <div className="grid grid-cols-3 gap-8 mb-12">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl" />)}
          </div>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}
          </div>
        </div>
      );
    }

    return (
        <div className="pb-20 pt-8">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Global Sustainability Index</h1>
                <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                   <ShieldCheck size={14} /> AI-Verified sustainability contributions
                </p>
            </div>

            {leaderboard.length === 0 ? (
                <div className="saas-card p-20 flex flex-col items-center text-center">
                    <Trophy className="text-slate-200 mb-6" size={48} />
                    <h3 className="text-xl font-bold text-slate-900">Catalogue Initializing</h3>
                    <p className="text-slate-500 italic max-w-xs">Connecting to the global verified contribution node. This won't take long.</p>
                </div>
            ) : (
                <div className="space-y-16">
                    {/* Podium Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
                        {/* 2nd Place */}
                        {topThree[1] && (
                            <motion.div 
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="saas-card p-8 bg-white border-slate-100 flex flex-col items-center relative order-2 md:order-1 h-64 group cursor-default"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                   <Medal size={80} className="text-slate-400" />
                                </div>
                                <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-black text-xs border-4 border-white shadow-sm mb-4">2nd</div>
                                <h3 className="font-bold text-slate-900 mb-1">{topThree[1].username}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{topThree[1].points} PTS</p>
                                <div className="mt-auto p-2 px-3 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black">SILVER TIER</div>
                            </motion.div>
                        )}

                        {/* 1st Place */}
                        {topThree[0] && (
                            <motion.div 
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="saas-card p-10 bg-slate-900 text-white flex flex-col items-center relative order-1 md:order-2 h-80 shadow-2xl group cursor-default"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent group-hover:from-amber-500/20 transition-all duration-700" />
                                <div className="absolute top-[-20px] bg-gradient-to-br from-amber-400 to-amber-600 text-amber-900 w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/20 border-4 border-[#0f172a] z-10 transition-transform group-hover:rotate-12">
                                    <Trophy size={28} />
                                </div>
                                <div className="w-20 h-20 bg-white/10 rounded-[2rem] mt-4 mb-4 flex items-center justify-center text-2xl font-black text-amber-400 border border-white/10 shadow-inner">
                                    {topThree[0].username[0]}
                                </div>
                                <h3 className="font-black text-xl mb-1 text-center">{topThree[0].username}</h3>
                                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-10">WORLD LEADER</p>
                                <p className="text-2xl font-black tracking-tighter text-white">{topThree[0].points} <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">pts</span></p>
                            </motion.div>
                        )}

                        {/* 3rd Place */}
                        {topThree[2] && (
                            <motion.div 
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="saas-card p-8 bg-white border-slate-100 flex flex-col items-center relative order-3 h-56 group cursor-default"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                   <Zap size={80} className="text-orange-900" />
                                </div>
                                <div className="w-12 h-12 bg-orange-50 text-orange-700 rounded-full flex items-center justify-center font-black text-xs border-4 border-white shadow-sm mb-4">3rd</div>
                                <h3 className="font-bold text-slate-900 mb-1">{topThree[2].username}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{topThree[2].points} PTS</p>
                                <div className="mt-auto p-2 px-3 bg-orange-50 text-orange-700 rounded-lg text-[10px] font-black">BRONZE TIER</div>
                            </motion.div>
                        )}
                    </div>

                    {/* Rankings Table */}
                    <div className="saas-card bg-white p-0 overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-slate-50 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                           <div className="col-span-1">Rank</div>
                           <div className="col-span-5 md:col-span-6">Contributor</div>
                           <div className="col-span-3 md:col-span-2 text-right">Points</div>
                           <div className="col-span-3 text-right">Impact</div>
                        </div>
                        
                        <div className="divide-y divide-slate-50">
                            {remaining.map((r, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={r._id}
                                    className={`grid grid-cols-12 gap-4 px-8 py-5 items-center transition-colors hover:bg-slate-50/50 ${user?.username === r.username ? 'bg-green-50/30 ring-1 ring-inset ring-green-100' : ''}`}
                                >
                                   <div className="col-span-1 font-black text-slate-400 text-xs">#{i + 4}</div>
                                   <div className="col-span-5 md:col-span-6 flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-black flex items-center justify-center border border-slate-100">
                                         {r.username[0]}
                                      </div>
                                      <div>
                                         <p className="text-sm font-bold text-slate-900">{r.username}</p>
                                         {user?.username === r.username && <span className="text-[9px] font-black text-green-600 bg-green-100 px-1.5 py-0.5 rounded uppercase">Your Rank</span>}
                                      </div>
                                   </div>
                                   <div className="col-span-3 md:col-span-2 text-right text-sm font-black text-slate-900 tracking-tight">{r.points}</div>
                                   <div className="col-span-3 text-right text-sm font-black text-green-600">
                                      {r.carbonFootprint.toFixed(1)} <span className="text-[9px] text-slate-400 font-bold uppercase ml-0.5 tracking-widest">Kg Saved</span>
                                   </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        {remaining.length === 0 && (
                            <div className="p-10 text-center">
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Syncing more contributors...</p>
                            </div>
                        )}
                    </div>

                    {/* Stats Footer Overlay */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="saas-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                           <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-green-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                           <h4 className="text-xs font-black uppercase tracking-widest text-green-400 mb-6 flex items-center gap-2">
                             <TrendingUp size={16} /> Global Milestone
                           </h4>
                           <h3 className="text-3xl font-black mb-2">4.82M Kg</h3>
                           <p className="text-sm text-slate-400 font-medium leading-relaxed">Verified carbon displacement across all connected users. Target: 5.0M for next tier unlocked.</p>
                       </div>

                       <div className="saas-card p-10 bg-white border-slate-100 flex flex-col justify-center">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                             <Star size={16} className="text-amber-500" /> Season One: "Genesis"
                          </h4>
                          <p className="text-slate-600 font-medium leading-relaxed">
                             End of season in <span className="text-slate-900 font-black">12 Days</span>. Top 10 users qualify for the "Zero Emission Elite" badge.
                          </p>
                          <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest mt-6 flex items-center gap-1 hover:underline">
                             View seasonal rules <ChevronRight size={10} />
                          </button>
                       </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
