import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const Rewards = () => {
  const { api, user, loadUser } = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(null);

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

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 mb-10 shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Eco Rewards</h1>
            <p className="text-emerald-50 opacity-90 mb-6">Redeem your hard-earned points for exclusive eco-friendly vouchers.</p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
              <span className="text-sm font-medium mr-2">Available Points:</span>
              <span className="text-2xl font-bold">{user?.points || 0}</span>
              <div className="ml-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-yellow-900 font-bold text-xs">P</span>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>
        </div>

        {message && (
          <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-8 flex items-center animate-bounce-subtle">
            <span className="mr-3 text-xl">🎉</span>
            <div>
              <p className="font-bold">Redeemed Successfully!</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-rose-100 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-8 flex items-center">
            <span className="mr-3 text-xl">⚠️</span>
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Rewards List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mr-3 text-sm">🎁</span>
              Available Rewards
            </h2>
            
            {rewards.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-neutral-200 text-neutral-400">
                <p>No rewards available yet. Keep checking back!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewards.map((reward) => (
                  <div key={reward._id} className="group bg-white p-1 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-2xl">🌿</span>
                      </div>
                      <h3 className="text-xl font-bold text-neutral-800 mb-2">{reward.name}</h3>
                      <p className="text-neutral-500 text-sm mb-6 line-clamp-2">{reward.description}</p>
                      
                      <div className="flex items-center justify-between mb-6 bg-neutral-50 p-3 rounded-2xl">
                        <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Cost</span>
                        <span className="text-lg font-bold text-emerald-600">{reward.pointsRequired} pts</span>
                      </div>

                      <button
                        onClick={() => handleRedeem(reward._id)}
                        disabled={!!isRedeeming || (user?.points || 0) < reward.pointsRequired}
                        className={`w-full py-4 px-6 rounded-2xl font-bold transition-all transform active:scale-95 ${
                          (user?.points || 0) >= reward.pointsRequired
                            ? (isRedeeming === reward._id ? 'bg-neutral-800' : 'bg-neutral-900 shadow-lg shadow-neutral-200 hover:bg-neutral-800') + ' text-white'
                            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        }`}
                      >
                        {isRedeeming === reward._id ? 'Processing...' : (user?.points || 0) >= reward.pointsRequired ? 'Redeem Reward' : `Need ${reward.pointsRequired - (user?.points || 0)} more pts`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Vouchers Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3 text-sm">🎫</span>
              My Vouchers
            </h2>
            
            <div className="space-y-4">
              {!user?.vouchers || user.vouchers.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-neutral-100 text-center shadow-sm">
                  <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl grayscale opacity-50">🎫</span>
                  </div>
                  <p className="text-neutral-400 text-sm font-medium">You haven't redeemed any vouchers yet.</p>
                </div>
              ) : (
                [...user.vouchers].reverse().map((voucher, idx) => (
                  <div key={idx} className="bg-white border-l-4 border-teal-500 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-neutral-800 text-sm">{voucher.rewardName}</h4>
                      <span className="text-[10px] text-neutral-400 uppercase font-bold">{new Date(voucher.dateRedeemed).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-dashed border border-dashed border-teal-200 bg-teal-50 p-2 rounded-xl flex justify-between items-center group-hover:bg-teal-100 transition-colors">
                      <code className="text-teal-700 font-mono font-bold text-sm tracking-widest">{voucher.code}</code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(voucher.code)}
                        className="text-[10px] bg-white text-teal-600 px-2 py-1 rounded-lg font-bold shadow-sm hover:shadow-md active:scale-95 transition-all"
                      >
                        COPY
                      </button>
                    </div>
                    <div className="absolute top-1/2 right-[-8px] -translate-y-1/2 w-4 h-4 bg-neutral-50 rounded-full border border-neutral-100"></div>
                    <div className="absolute top-1/2 left-[-8px] -translate-y-1/2 w-4 h-4 bg-neutral-50 rounded-full border border-neutral-100"></div>
                  </div>
                ))
              )}
            </div>

            {/* Hint Box */}
            <div className="mt-8 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 p-6 rounded-3xl">
              <h4 className="text-sm font-bold text-yellow-800 mb-2 flex items-center">
                <span className="mr-2">💡</span> Pro Tip
              </h4>
              <p className="text-xs text-yellow-700 leading-relaxed">
                Complete more activities to earn points! Vouchers can be redeemed at our partner ecological shops.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        .bg-dashed {
          background-image: radial-gradient(circle, #f0fdfa 1px, transparent 1px);
          background-size: 4px 4px;
        }
      `}</style>
    </div>
  );
};

export default Rewards;
