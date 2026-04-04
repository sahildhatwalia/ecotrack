import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Wallet, Tag, ExternalLink, 
  ChevronRight, Sparkles, Gift, Clock,
  ArrowUpRight, Info, Copy, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const Rewards = () => {
    const { api, user, loadUser } = useContext(AuthContext);
    const { searchTerm } = useSearch();
    const [rewards, setRewards] = useState([]);
    const [isRedeeming, setIsRedeeming] = useState(null);
    const [filter, setFilter] = useState('All');
    const [copiedId, setCopiedId] = useState(null);

    const categories = ['All', 'Shopping', 'Food', 'Travel', 'Entertainment'];

    useEffect(() => {
        fetchRewards();
    }, [api]);

    const fetchRewards = async () => {
        try {
            const res = await api.get('/rewards');
            setRewards(res.data.data);
        } catch (err) {
            toast.error("Failed to sync rewards catalogue.");
        }
    };

    const handleRedeem = async (reward) => {
        setIsRedeeming(reward._id);
        try {
            const res = await api.post(`/rewards/${reward._id}/redeem`);
            toast.success(`Redeemed! Code: ${res.data.data.voucherCode}`, { duration: 6000 });
            await loadUser();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Redemption failed.');
        } finally {
            setIsRedeeming(null);
        }
    };

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredRewards = rewards.filter(r => {
        const matchesFilter = filter === 'All' || r.category === filter;
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              r.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="pb-20 pt-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 flex items-center gap-3">
                        Premium Perks <Sparkles className="text-amber-500" />
                    </h1>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                        Your sustainable commitment earns you elite access. Redeem your verified points for exclusive partner rewards.
                    </p>
                </div>
                
                <div className="saas-card bg-slate-900 p-8 text-white min-w-[300px] relative overflow-hidden group">
                   <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-green-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                   <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                         <Wallet size={12} /> Available Balance
                      </p>
                      <div className="flex items-baseline gap-3">
                         <span className="text-4xl font-black tracking-tighter">{user?.points || 0}</span>
                         <span className="text-xs font-bold text-green-400 uppercase tracking-widest">PTS</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${Math.min(100, (user?.points || 0) / 1000 * 100)}%` }}
                           className="h-full bg-green-500"
                         />
                      </div>
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Main Catalogue */}
                <div className="xl:col-span-8 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100 overflow-x-auto no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                        filter === cat 
                                        ? 'bg-white text-slate-900 shadow-md' 
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredRewards.map((reward) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={reward._id} 
                                    className="saas-card p-8 flex flex-col bg-white group"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center p-3 border border-slate-100 group-hover:scale-110 transition-transform">
                                            <Gift className="text-slate-400" />
                                        </div>
                                        <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                            {reward.category}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{reward.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{reward.brand}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8 flex-1">
                                        {reward.description}
                                    </p>

                                    <div className="pt-6 border-t border-slate-50 mt-auto">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Requirement</p>
                                               <p className="text-lg font-black text-slate-900">{reward.pointsRequired} pts</p>
                                            </div>
                                            <div className="text-right">
                                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Stock</p>
                                               <p className="text-[11px] font-bold text-green-600">Verified Available</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleRedeem(reward)}
                                            disabled={!!isRedeeming || (user?.points || 0) < reward.pointsRequired}
                                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all ${
                                                (user?.points || 0) >= reward.pointsRequired
                                                ? 'btn-primary shadow-xl shadow-green-500/10'
                                                : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                            }`}
                                        >
                                            {isRedeeming === reward._id ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (user?.points || 0) >= reward.pointsRequired ? (
                                                <>Claim Reward <ChevronRight size={14} /></>
                                            ) : 'Insufficient Points'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Digital Wallet Sidebar */}
                <div className="xl:col-span-4 space-y-12">
                   <div className="saas-card p-6 bg-slate-50 border-slate-100">
                      <div className="flex items-center justify-between mb-8">
                         <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Tag size={16} className="text-green-500" /> Digital Wallet
                         </h2>
                         <span className="text-[10px] font-bold text-slate-400">{user?.vouchers?.length || 0} Vouchers</span>
                      </div>

                      <div className="space-y-4">
                         {!user?.vouchers || user.vouchers.length === 0 ? (
                            <div className="text-center py-12 px-6">
                               <div className="p-4 bg-white rounded-full w-max mx-auto mb-4 border border-slate-200">
                                  <Wallet size={24} className="text-slate-300" />
                               </div>
                               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Vault Empty</p>
                            </div>
                         ) : (
                            [...user.vouchers].reverse().map((v, i) => (
                               <motion.div 
                                 initial={{ opacity: 0, x: 20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: i * 0.1 }}
                                 key={i} 
                                 className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group overflow-hidden"
                               >
                                  <div className="flex justify-between items-start mb-4">
                                     <div>
                                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{v.rewardName}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                                           <Clock size={10} /> {new Date(v.dateRedeemed).toLocaleDateString()}
                                        </p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <div className="flex-1 bg-slate-900 p-3 rounded-xl flex justify-between items-center group-hover:bg-black transition-colors">
                                        <code className="text-[10px] font-black text-green-400 tracking-[0.2em]">{v.code}</code>
                                        <button 
                                          onClick={() => handleCopy(v.code, i)}
                                          className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors"
                                        >
                                          {copiedId === i ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        </button>
                                     </div>
                                  </div>
                                  {/* Ticket aesthetic */}
                                  <div className="absolute top-1/2 -left-2 w-4 h-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner -translate-y-1/2" />
                                  <div className="absolute top-1/2 -right-2 w-4 h-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner -translate-y-1/2" />
                               </motion.div>
                            ))
                         )}
                      </div>
                   </div>

                   {/* Pro Tip Card */}
                   <div className="saas-card p-8 bg-green-50 aspect-video flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
                      <div className="p-3 bg-white w-max rounded-xl shadow-sm border border-green-100 mb-4">
                         <Trophy className="text-green-600" size={20} />
                      </div>
                      <h4 className="text-sm font-black text-green-900 uppercase tracking-widest mb-2">Pro Member Perk</h4>
                      <p className="text-xs text-green-700 font-medium leading-relaxed">
                         Verified Pro members get early access to "Limited Run" perks from sustainable fashion brands. 
                      </p>
                      <button className="text-[10px] font-black text-green-800 uppercase tracking-widest mt-6 flex items-center gap-2 hover:underline">
                         Check Availability <ArrowUpRight size={12} />
                      </button>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default Rewards;
