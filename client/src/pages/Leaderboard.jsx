import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Trophy, Medal, Star, Target, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import AdBanner from '../components/AdBanner';

const Leaderboard = () => {
  const { api, user } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaderboard(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard.");
        setLeaderboard([]);
      }
    };
    fetchLeaderboard();
  }, [api]);

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#f8fbfa] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
            <h1 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-4">
                Global Eco Elite
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={14} /> AI Verified Ranks</span>
            </h1>
            <p className="text-neutral-500 mt-2 text-sm font-medium">Top sustainability contributors ranked by verified carbon displacement.</p>
        </div>

        {/* Global Sponsor Ad */}
        <AdBanner className="mb-12" />

        {error && (
            <div className="bg-rose-50 text-rose-600 border border-rose-200 p-5 rounded-2xl mb-8 font-bold text-sm">
                {error}
            </div>
        )}

        {leaderboard.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-neutral-200 flex flex-col items-center">
             <Trophy size={64} className="text-neutral-200 mb-6" />
             <h3 className="text-2xl font-black text-neutral-400">Database Initializing...</h3>
             <p className="text-neutral-400 mt-2">The global rankings will populate shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Top 3 Podium */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8 relative">
                {/* 2nd Place */}
                {topThree[1] && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2.5rem] p-8 pb-12 shadow-xl border border-neutral-100 flex flex-col items-center relative md:order-1 h-[280px] z-10 transition-transform hover:-translate-y-2">
                        <div className="absolute top-[-20px] bg-slate-200 text-slate-700 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg shadow-slate-200/50 border-4 border-white">2</div>
                        <div className="w-20 h-20 bg-neutral-100 rounded-3xl mt-6 mb-4 flex items-center justify-center text-3xl font-black overflow-hidden shadow-inner">
                            {topThree[1].username[0].toUpperCase()}
                        </div>
                        <h3 className="font-black text-xl tracking-tight text-neutral-900">{topThree[1].username}</h3>
                        <p className="text-emerald-500 font-black tracking-widest mt-auto bg-emerald-50 px-4 py-2 rounded-xl">{topThree[1].points} <span className="text-[10px] text-emerald-600/50">PTS</span></p>
                    </motion.div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-black rounded-[2.5rem] p-10 pb-16 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-neutral-800 flex flex-col items-center relative md:order-2 h-[340px] z-20 group transition-transform hover:-translate-y-4">
                        <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-yellow-400/10 rounded-full blur-[50px] group-hover:bg-yellow-400/20 transition-all"></div>
                        <div className="absolute top-[-24px] bg-gradient-to-b from-yellow-300 to-amber-500 text-amber-900 w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-yellow-500/40 border-4 border-[#1a1a1a]">
                            <Trophy size={28} className="drop-shadow-sm" />
                        </div>
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-[2rem] mt-6 mb-4 flex items-center justify-center text-4xl font-black text-amber-900 shadow-xl overflow-hidden shadow-yellow-500/20 relative z-10">
                            {topThree[0].username[0].toUpperCase()}
                        </div>
                        <h3 className="font-black text-2xl tracking-tight text-white relative z-10">{topThree[0].username}</h3>
                        <p className="text-yellow-400 font-black tracking-widest mt-auto bg-yellow-400/10 px-6 py-3 rounded-2xl border border-yellow-400/20 relative z-10">{topThree[0].points} <span className="text-[10px] text-yellow-500/50">PTS</span></p>
                    </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2.5rem] p-8 pb-10 shadow-lg border border-neutral-100 flex flex-col items-center relative md:order-3 h-[250px] z-0 transition-transform hover:-translate-y-2">
                        <div className="absolute top-[-16px] bg-orange-200 text-orange-800 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg shadow-orange-200/50 border-4 border-white">3</div>
                        <div className="w-16 h-16 bg-neutral-100 rounded-3xl mt-6 mb-4 flex items-center justify-center text-2xl font-black overflow-hidden shadow-inner">
                            {topThree[2].username[0].toUpperCase()}
                        </div>
                        <h3 className="font-black text-lg tracking-tight text-neutral-900">{topThree[2].username}</h3>
                        <p className="text-emerald-500 font-black tracking-widest mt-auto bg-emerald-50 px-3 py-1.5 rounded-xl text-sm">{topThree[2].points} <span className="text-[10px] text-emerald-600/50">PTS</span></p>
                    </motion.div>
                )}
            </div>

            {/* Remaining Ranks List */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-neutral-100 relative overflow-hidden">
                    <div className="flex text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 px-6">
                        <span className="w-12">Rank</span>
                        <span className="flex-1">Operative</span>
                        <span className="w-24 text-right">Points</span>
                        <span className="w-32 text-right">CO2 Displaced</span>
                    </div>

                    <div className="space-y-3">
                        {rest.map((r, index) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={r._id} 
                                className={`flex items-center px-6 py-5 rounded-[2rem] transition-all hover:scale-[1.01] hover:shadow-lg ${user?.username === r.username ? 'bg-emerald-50 border border-emerald-100' : 'bg-neutral-50 border border-transparent hover:bg-white'}`}
                            >
                                <span className="w-12 font-black text-neutral-400">{index + 4}</span>
                                <div className="flex-1 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 text-neutral-600 font-black text-sm flex items-center justify-center uppercase shadow-sm">{r.username.substring(0, 1)}</div>
                                    <span className="font-black text-neutral-700 tracking-tight">{r.username} {user?.username === r.username && <span className="ml-2 bg-emerald-500 text-white text-[8px] uppercase tracking-widest px-2 py-0.5 rounded">You</span>}</span>
                                </div>
                                <span className="w-24 text-right font-black text-neutral-900 text-lg tracking-tighter">{r.points}</span>
                                <div className="w-32 flex justify-end items-baseline gap-1">
                                    <span className="text-xl font-black text-emerald-500 tracking-tighter">{r.carbonFootprint.toFixed(1)}</span>
                                    <span className="text-[10px] font-black text-emerald-600/50 uppercase">KG</span>
                                </div>
                            </motion.div>
                        ))}
                        
                        {rest.length === 0 && (
                            <div className="text-center py-10 text-sm font-bold text-neutral-400 uppercase tracking-widest">End of verified roster.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Side Stats */}
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-gradient-to-br from-[#003d29] to-emerald-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-[-50%] right-[-50%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000"></div>
                    <Target size={32} className="text-emerald-400 mb-6 relative z-10" />
                    <h3 className="text-4xl font-black text-white tracking-tighter leading-none mb-2 relative z-10">4.2M</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-8 relative z-10">Total Kg CO2 Displaced Globally</p>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative z-10">
                        <div className="w-3/4 h-full bg-emerald-400"></div>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-200/50 mt-3 text-right group-hover:text-emerald-400 transition-colors">75% to Weekly Goal</p>
                </div>
                
                <AdBanner type="sidebar" />
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
