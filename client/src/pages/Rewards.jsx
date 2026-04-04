import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import AdBanner from '../components/AdBanner';
import { useSearch } from '../context/SearchContext';
import { motion } from 'framer-motion';

const Rewards = () => {
  const { api, user, loadUser } = useContext(AuthContext);
  const { searchTerm } = useSearch();
  const [rewards, setRewards] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Shopping', 'Food', 'Travel', 'Entertainment'];

  useEffect(() => {
    fetchRewards();
  }, [api]);

  const fetchRewards = async () => {
    try {
      const res = await api.get('/rewards');
      setRewards(res.data.data);
    } catch (err) {
      console.error("Error fetching rewards:", err);
      setError("Failed to load rewards.");
    }
  };

  const handleRedeem = async (rewardId) => {
    setMessage('');
    setError('');
    setIsRedeeming(rewardId);
    try {
      const res = await api.post(`/rewards/${rewardId}/redeem`);
      setMessage(`Success! Voucher Code: ${res.data.data.voucherCode}`);
      await loadUser(); // Refresh user points and vouchers
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to redeem reward.');
    } finally {
      setIsRedeeming(null);
    }
  };

  const filteredRewards = rewards.filter(r => {
    const matchesFilter = filter === 'All' || r.category === filter;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#003d29] via-[#005e41] to-[#008f63] rounded-[2.5rem] p-10 mb-12 shadow-2xl text-white relative overflow-hidden group">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6 group-hover:bg-white/20 transition-all duration-500">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping mr-3"></span>
                <span className="text-xs font-bold tracking-widest uppercase">Verified Eco Partner</span>
              </div>
              <h1 className="text-5xl font-extrabold mb-4 leading-tight">Eco Rewards <br/><span className="text-emerald-400 font-light">& Premium Perks</span></h1>
              <p className="text-emerald-50 opacity-80 mb-8 max-w-md text-lg">Your sustainable actions deserve world-class rewards. Redeem points for exclusive vouchers from global eco-partners.</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="bg-black/20 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center md:items-end group-hover:scale-105 transition-transform duration-700">
                <p className="text-sm font-semibold text-emerald-300 uppercase tracking-[0.2em] mb-2">Current Balance</p>
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-black text-white">{user?.points || 0}</span>
                  <div className="bg-yellow-400 w-12 h-12 rounded-2xl flex items-center justify-center rotate-12 shadow-xl shadow-yellow-400/20">
                    <span className="text-yellow-900 font-black text-xl">P</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, (user?.points || 0) / 10)}%` }}></div>
                </div>
                <p className="text-[10px] text-emerald-200/50 mt-2 font-bold uppercase">Next Tier Locked 🔒</p>
              </div>
            </div>
          </div>
          
          {/* Decorative mesh */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px]"></div>
        </div>

        {/* Global Ads Top */}
        <AdBanner className="mb-12" />

        {/* Action Alerts */}
        <div className="mb-12">
            {message && (
            <div className="bg-emerald-900/90 text-white p-6 rounded-3xl mb-4 flex items-center shadow-lg animate-fade-in border border-emerald-500/30 backdrop-blur-md">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mr-6 text-2xl shadow-inner">🎉</div>
                <div>
                <p className="font-black text-lg">Transaction Authenticated!</p>
                <p className="text-emerald-200 text-sm font-mono">{message}</p>
                </div>
                <button 
                  onClick={() => setMessage('')}
                  className="ml-auto bg-white/10 hover:bg-white/20 p-2 rounded-xl"
                >
                  <span className="text-xl">✕</span>
                </button>
            </div>
            )}
            
            {error && (
            <div className="bg-rose-900/90 text-white p-6 rounded-3xl mb-4 flex items-center shadow-lg border border-rose-500/30 backdrop-blur-md">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center mr-6 text-2xl">⚠️</div>
                <p className="font-bold text-lg">{error}</p>
                 <button 
                  onClick={() => setError('')}
                  className="ml-auto bg-white/10 hover:bg-white/20 p-2 rounded-xl"
                >
                  <span className="text-xl">✕</span>
                </button>
            </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h2 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center">
                    Premium Perks
                    <span className="ml-4 text-xs bg-black text-white px-3 py-1 rounded-full uppercase tracking-widest font-bold">Catalogue</span>
                </h2>
                
                <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-neutral-100 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${filter === cat ? 'bg-neutral-900 text-white shadow-xl' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            
            {filteredRewards.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-neutral-200 flex flex-col items-center">
                <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6 text-5xl">📦</div>
                <h3 className="text-xl font-bold text-neutral-600 mb-2">No rewards found in this category</h3>
                <p className="text-neutral-400">Our team is sourcing exclusive sustainable deals. Check back soon!</p>
                <button onClick={() => setFilter('All')} className="mt-8 text-emerald-600 font-bold hover:underline">View All Directives</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-container">
                {filteredRewards.map((reward) => (
                  <motion.div 
                    layout
                    key={reward._id} 
                    className="group bg-white rounded-[2.5rem] shadow-sm hover-3d transition-all duration-500 border border-neutral-100 overflow-hidden flex flex-col"
                  >
                    <div className="p-8 pb-0">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 bg-neutral-50 rounded-3xl flex items-center justify-center p-3 border border-neutral-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <img src={reward.logo || 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png'} alt={reward.brand} className="w-full h-full object-contain" />
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                            {reward.category || 'Voucher'}
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-neutral-900 mb-2 leading-tight">{reward.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold text-neutral-400 uppercase">{reward.brand || 'EcoTrack Partner'}</span>
                        <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 rounded-md">PROMOTED</span>
                      </div>
                      <p className="text-neutral-500 text-sm leading-relaxed mb-8 line-clamp-2">{reward.description}</p>
                    </div>

                    <div className="mt-auto p-8 pt-0">
                        <div className="flex items-center justify-between mb-8 bg-neutral-50 border border-neutral-100 p-4 rounded-3xl">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Requirement</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-neutral-800">{reward.pointsRequired}</span>
                                    <span className="text-xs font-bold text-emerald-600">PTS</span>
                                </div>
                            </div>
                            {reward.validUntil && (
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Expires In</span>
                                    <span className="text-xs font-bold text-rose-500">{Math.ceil((new Date(reward.validUntil) - new Date()) / (1000 * 60 * 60 * 24))} Days</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => handleRedeem(reward._id)}
                            disabled={!!isRedeeming || (user?.points || 0) < reward.pointsRequired}
                            className={`w-full py-5 px-8 rounded-[2rem] font-black tracking-tight text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                            (user?.points || 0) >= reward.pointsRequired
                                ? (isRedeeming === reward._id ? 'bg-neutral-800 animate-pulse' : 'bg-neutral-900 shadow-xl shadow-neutral-200 hover:bg-black hover:translate-y-[-4px]') + ' text-white'
                                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed grayscale'
                            }`}
                        >
                            {isRedeeming === reward._id ? (
                                <>
                                    <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Processing...
                                </>
                            ) : (user?.points || 0) >= reward.pointsRequired ? 'Claim Now' : 'Insufficient Points'}
                        </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* My Vouchers Sidebar */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h2 className="text-2xl font-black text-neutral-900 mb-8 tracking-tight flex items-center group">
                Digital Wallet
                <span className="ml-3 w-8 h-8 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-sm shadow-sm opacity-50 group-hover:opacity-100 transition-opacity">
                    {user?.vouchers?.length || 0}
                </span>
              </h2>
              
              <div className="space-y-6">
                {!user?.vouchers || user.vouchers.length === 0 ? (
                  <div className="bg-white p-10 rounded-[2rem] border border-neutral-100 text-center shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-6 text-2xl grayscale group-hover:grayscale-0 transition-all duration-500">
                      🎫
                    </div>
                    <p className="text-neutral-500 font-bold mb-1">Vault Empty</p>
                    <p className="text-neutral-400 text-xs font-medium">Your redeemed vouchers will appear here.</p>
                  </div>
                ) : (
                  [...user.vouchers].reverse().map((voucher, idx) => (
                    <div key={idx} className="bg-white border-l-[6px] border-teal-500 rounded-[2rem] p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                            <h4 className="font-extrabold text-neutral-900 group-hover:text-teal-600 transition-colors uppercase text-xs tracking-wider">{voucher.rewardName}</h4>
                            <span className="text-[10px] text-neutral-400 font-black mt-1 uppercase tracking-widest">{new Date(voucher.dateRedeemed).toLocaleDateString()}</span>
                        </div>
                         <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center text-lg">🛍️</div>
                      </div>
                      <div className="bg-neutral-900 p-4 rounded-2xl flex justify-between items-center group-hover:bg-neutral-800 transition-all shadow-inner">
                        <code className="text-emerald-400 font-mono font-black text-xs tracking-[0.2em]">{voucher.code}</code>
                        <button 
                          onClick={() => {
                              navigator.clipboard.writeText(voucher.code);
                              const btn = event.currentTarget;
                              const original = btn.innerText;
                              btn.innerText = 'COPIED!';
                              btn.classList.add('bg-emerald-500', 'text-white');
                              setTimeout(() => {
                                  btn.innerText = original;
                                  btn.classList.remove('bg-emerald-500', 'text-white');
                              }, 2000);
                          }}
                          className="text-[10px] bg-white/10 text-white px-3 py-1.5 rounded-lg font-black tracking-widest shadow-sm hover:bg-white/20 transition-all active:scale-95"
                        >
                          COPY
                        </button>
                      </div>
                      
                      {/* Ticket cut-outs */}
                      <div className="absolute top-1/2 right-[-10px] -translate-y-1/2 w-5 h-5 bg-neutral-50 rounded-full border border-neutral-100 shadow-inner"></div>
                      <div className="absolute top-1/2 left-[-10px] -translate-y-1/2 w-5 h-5 bg-neutral-50 rounded-full border border-neutral-100 shadow-inner"></div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Ad Sidebar */}
            <AdBanner type="sidebar" />

            {/* Pro Tip Box */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl mb-6 shadow-lg rotate-3 group-hover:rotate-12 transition-transform">
                        💡
                    </div>
                    <h4 className="text-white font-black text-lg mb-3 tracking-tight italic">AI INSIGHT</h4>
                    <p className="text-emerald-100/60 text-xs leading-relaxed font-medium">
                        Increasing your activity frequency by <span className="text-emerald-400 font-bold">15%</span> this week could unlock the Silver Tier perks!
                    </p>
                </div>
                <div className="absolute top-[-50%] left-[-50%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Rewards;
