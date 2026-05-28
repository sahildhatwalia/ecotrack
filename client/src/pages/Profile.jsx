import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  User, Mail, Calendar, Award, Leaf, 
  Ticket, ShieldCheck, ShieldAlert, Zap, 
  ExternalLink, Copy, Check, Fingerprint, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [copiedId, setCopiedId] = useState(null);
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("Voucher code copied.");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleShareProfile = () => {
        const profileUrl = `${window.location.origin}/profile/${user?.username || 'operative'}`;
        navigator.clipboard.writeText(profileUrl);
        toast.success("Operative share link copied to clipboard!");
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-green-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const userTrustScore = user.trustScore ?? 100;
    const isHighTrust = userTrustScore >= 80;

    const metrics = [
        { label: 'CO2 Displaced', value: `${user.carbonFootprint.toFixed(1)} kg`, icon: <Leaf size={24} className="text-green-500" /> },
        { label: 'Earned Points', value: user.points, icon: <Award size={24} className="text-amber-500" /> },
        { label: 'Auth Multiplier', value: '1.2x', icon: <Zap size={24} className="text-blue-500" /> },
    ];

    return (
        <div className="pb-20 pt-8">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Command Center</h1>
                <p className="text-slate-600 font-semibold text-sm flex items-center gap-2">
                   <Fingerprint size={15} className="text-green-500" /> Encrypted profile management
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                    {/* Main Identity Card */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="saas-card overflow-hidden bg-white group hover-shimmer"
                    >
                        <div className="h-48 bg-slate-900 relative overflow-hidden">
                           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                           <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-green-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                           <div className="absolute bottom-4 right-6 p-2 px-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
                               <ShieldCheck size={12} className="text-green-400" /> {isHighTrust ? 'Verified Operative' : 'Evaluation Mode'}
                           </div>
                        </div>

                        <div className="px-10 pb-10 relative">
                            <div className="absolute -top-16 left-10">
                               <div className="w-32 h-32 bg-white rounded-3xl p-2 shadow-2xl border border-slate-200/80 relative">
                                  <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-4xl font-black text-slate-500 uppercase">
                                     {user.username[0]}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 p-2 bg-green-500 text-white rounded-xl shadow-lg border-2 border-white">
                                     <Check size={16} strokeWidth={4} />
                                  </div>
                               </div>
                            </div>

                            <div className="pt-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{user.username}</h2>
                                    <div className="flex flex-wrap gap-4 items-center mt-3">
                                       <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-widest bg-slate-50 p-2 px-3 rounded-lg border border-slate-100">
                                          <Mail size={12} className="text-slate-500" /> {user.email}
                                       </div>
                                       <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-widest bg-slate-50 p-2 px-3 rounded-lg border border-slate-100">
                                          <Calendar size={12} className="text-slate-500" /> Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                       </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                   <button onClick={handleShareProfile} className="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-black transition-colors hover-shiver" title="Share Profile"><ExternalLink size={18} /></button>
                                   <Link to="/activities" className="btn-primary hover-shimmer py-3 px-6 text-xs flex items-center gap-2">Log Activity <Activity size={16} /></Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {metrics.map((m, i) => (
                           <div key={i} className="saas-card p-8 bg-white border-slate-100 group transition-all hover:-translate-y-1 hover-shimmer">
                              <div className="p-3 bg-slate-50 w-max rounded-xl mb-6 shadow-sm border border-slate-200/50 group-hover:scale-110 transition-transform">
                                 {m.icon}
                              </div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                              <p className="text-2xl font-black text-slate-900 tracking-tighter">{m.value}</p>
                           </div>
                       ))}
                    </div>

                    {/* Recent Vouchers */}
                    {user.vouchers?.length > 0 && (
                        <div className="space-y-6">
                           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                             <Ticket size={16} className="text-green-500 animate-pulse" /> Active Voucher Ledger
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {user.vouchers.slice(-4).reverse().map((v, i) => (
                                  <div key={i} className="saas-card p-5 bg-white border-slate-100 flex items-center justify-between group overflow-hidden">
                                     <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500"><Ticket size={18} /></div>
                                        <div>
                                           <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{v.rewardName}</p>
                                           <p className="text-[9px] text-slate-500 font-bold">{new Date(v.dateRedeemed).toLocaleDateString()}</p>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-2">
                                        <code className="text-[10px] font-black text-green-600 bg-green-50 p-1.5 px-2 rounded-lg border border-green-100">{v.code}</code>
                                        <button 
                                          onClick={() => handleCopy(v.code, i)}
                                          className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
                                        >
                                          {copiedId === i ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        </button>
                                     </div>
                                  </div>
                              ))}
                           </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Stats */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                   <div className="saas-card p-8 bg-slate-50 border-slate-200/80">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">AI SECURITY SCORE</h4>
                      <div className="flex flex-col items-center py-6">
                         <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                               <circle 
                                 cx="80" cy="80" r="70" 
                                 fill="none" strokeWidth="12" 
                                 stroke="currentColor" className="text-slate-200" 
                               />
                               <circle 
                                 cx="80" cy="80" r="70" 
                                 fill="none" strokeWidth="12" 
                                 stroke="currentColor" className="text-green-500 transition-all duration-1000" 
                                 strokeDasharray="440" strokeDashoffset={440 - (440 * userTrustScore / 100)} 
                               />
                            </svg>
                            <div className="text-center z-10">
                               <span className="text-4xl font-black text-slate-900 tracking-tighter">{userTrustScore}%</span>
                               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Trust Rating</p>
                            </div>
                         </div>
                         <div className="mt-8 text-center">
                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                               {isHighTrust ? <ShieldCheck size={14} className="text-green-500 animate-pulse" /> : <ShieldAlert size={14} className="text-amber-500" />}
                               {isHighTrust ? 'Elite Contribution Status' : 'Under Observation'}
                            </h5>
                            <p className="text-[10px] text-slate-600 font-semibold leading-relaxed italic">
                               Maintain a score over 85% to qualify for exclusive partner discounts and higher point multipliers.
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="saas-card p-8 bg-slate-900 text-white relative overflow-hidden group hover-shimmer">
                      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-green-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      <div className="relative z-10">
                         <h4 className="text-xs font-black uppercase tracking-widest text-green-400 mb-6">Tier Breakdown</h4>
                         <div className="space-y-4">
                            {[
                                { t: 'Bronze', p: '0 - 500', a: user?.points < 500 },
                                { t: 'Silver', p: '501 - 2500', a: user?.points >= 500 && user?.points < 2500 },
                                { t: 'Gold', p: '2501 - 10k', a: user?.points >= 2500 && user?.points < 10000 },
                                { t: 'Elite', p: '10k+', a: user?.points >= 10000 },
                            ].map((row, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[11px] font-bold">
                                   <span className={row.a ? 'text-white' : 'text-slate-500'}>{row.t} Level</span>
                                   <span className={row.a ? 'text-green-400 font-black' : 'text-slate-600'}>{row.p} PTS</span>
                                </div>
                            ))}
                         </div>
                         <button onClick={() => setIsTierModalOpen(true)} className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
                            Learn more about tiers <ChevronRight size={10} />
                         </button>
                      </div>
                   </div>
                </div>
            </div>

            {/* Premium Tiers Detail Modal */}
            <AnimatePresence>
               {isTierModalOpen && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsTierModalOpen(false)} />
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative saas-card bg-white p-8 max-w-md w-full shadow-2xl z-10">
                          <button onClick={() => setIsTierModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-2"><X size={20} className="text-slate-400" /></button>
                          <div className="flex items-center gap-3 mb-6">
                             <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center"><Award size={20} /></div>
                             <h3 className="text-xl font-bold text-slate-900 tracking-tight">EcoTrack Tier Perks</h3>
                          </div>
                          <div className="space-y-4 text-slate-600 text-sm font-semibold">
                             <div className="space-y-3">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                   <div>
                                      <p className="text-xs font-black text-slate-900 uppercase">Bronze Rank</p>
                                      <p className="text-[10px] text-slate-500 font-bold">1.0x Point Multiplier</p>
                                   </div>
                                   <span className="text-[10px] bg-slate-200 text-slate-700 font-black px-2 py-0.5 rounded">0-500 PTS</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                   <div>
                                      <p className="text-xs font-black text-slate-900 uppercase">Silver Rank</p>
                                      <p className="text-[10px] text-slate-500 font-bold">1.1x Point Multiplier + Standard Vouchers</p>
                                   </div>
                                   <span className="text-[10px] bg-green-100 text-green-700 font-black px-2 py-0.5 rounded">501-2500 PTS</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                   <div>
                                      <p className="text-xs font-black text-slate-900 uppercase">Gold Rank</p>
                                      <p className="text-[10px] text-slate-500 font-bold">1.2x Point Multiplier + Exclusive Rewards</p>
                                   </div>
                                   <span className="text-[10px] bg-amber-100 text-amber-700 font-black px-2 py-0.5 rounded">2501-10k PTS</span>
                                </div>
                                <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                                   <div>
                                      <p className="text-xs font-black uppercase text-green-400">Elite Rank</p>
                                      <p className="text-[10px] text-slate-400 font-medium">1.5x Multiplier + Custom Plaque & Badge</p>
                                   </div>
                                   <span className="text-[10px] bg-green-500 text-white font-black px-2 py-0.5 rounded">10k+ PTS</span>
                                </div>
                             </div>
                          </div>
                          <button onClick={() => setIsTierModalOpen(false)} className="btn-primary w-full py-3.5 mt-8 text-xs font-bold uppercase tracking-wider">Acknowledge Perks</button>
                      </motion.div>
                  </div>
               )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
