import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Award, Leaf, Ticket, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const stats = [
    { label: 'CO2 Saved', value: `${user.carbonFootprint.toFixed(1)} kg`, icon: <Leaf className="text-emerald-500" />, color: 'bg-emerald-50' },
    { label: 'Total Points', value: user.points, icon: <Award className="text-yellow-500" />, color: 'bg-yellow-50' },
    { label: 'Trust Score', value: `${user.trustScore ?? 100}%`, icon: (user.trustScore ?? 100) > 80 ? <ShieldCheck className="text-blue-500" /> : <ShieldAlert className="text-red-500" />, color: (user.trustScore ?? 100) > 80 ? 'bg-blue-50' : 'bg-red-50' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-neutral-200/50 overflow-hidden border border-neutral-100"
        >
          {/* Cover Header */}
          <div className="h-40 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
             <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 bg-white rounded-3xl p-2 shadow-lg">
                   <div className="w-full h-full bg-neutral-100 rounded-2xl flex items-center justify-center text-4xl text-emerald-600 font-bold uppercase">
                     {user.username.substring(0, 1)}
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-20 px-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-neutral-800 mb-1">{user.username}</h1>
                <p className="text-neutral-500 flex items-center">
                  <Mail size={16} className="mr-2" /> {user.email}
                </p>
                <p className="text-neutral-400 text-sm mt-3 flex items-center">
                  <Calendar size={14} className="mr-2" /> Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-3">
                <Link 
                  to="/rewards" 
                  className="px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200 flex items-center gap-2"
                >
                  <Ticket size={18} /> My Rewards
                </Link>
                {(user.trustScore ?? 100) < 70 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-bold border border-red-200">
                    <ShieldAlert size={16} /> Low Trust Score
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {stats.map((stat, idx) => (
                <div key={idx} className={`${stat.color} p-6 rounded-3xl border border-white/50 flex flex-col items-center text-center`}>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    {stat.icon}
                  </div>
                  <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</span>
                  <span className="text-2xl font-black text-neutral-800">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Recent Vouchers Section */}
            {user.vouchers && user.vouchers.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold text-neutral-800 mb-6 px-1">Recent Vouchers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.vouchers.slice(-2).reverse().map((voucher, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm font-bold">
                          🎫
                        </div>
                        <div>
                          <p className="font-bold text-neutral-800 text-sm">{voucher.rewardName}</p>
                          <p className="text-xs text-neutral-400 font-medium">Redeemed on {new Date(voucher.dateRedeemed).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <code className="text-[10px] font-mono font-bold bg-white px-2 py-1 rounded-lg border border-neutral-200 text-neutral-600">
                        {voucher.code}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
