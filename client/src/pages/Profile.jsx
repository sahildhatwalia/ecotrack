import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Award, Leaf, Ticket, ShieldCheck, ShieldAlert, ZapIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import AdBanner from '../components/AdBanner';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fbfa]">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const userTrustScore = user.trustScore ?? 100;
  const isHighTrust = userTrustScore >= 80;

  const stats = [
    { label: 'CO2 Displaced', value: `${user.carbonFootprint.toFixed(1)} kg`, icon: <Leaf className="text-emerald-500" />, color: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-900' },
    { label: 'Accumulated Points', value: user.points, icon: <Award className="text-yellow-500" />, color: 'bg-yellow-50 border-yellow-100', text: 'text-yellow-900' },
    { label: 'AI Verification Score', value: `${userTrustScore}%`, icon: isHighTrust ? <ShieldCheck className="text-blue-500" /> : <ShieldAlert className="text-rose-500" />, color: isHighTrust ? 'bg-blue-50 border-blue-100' : 'bg-rose-50 border-rose-100', text: isHighTrust ? 'text-blue-900' : 'text-rose-900' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fbfa] p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="mb-8">
            <h1 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-4">
                Operative Profile
                {isHighTrust && <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={14} /> AI Verified</span>}
            </h1>
            <p className="text-neutral-500 mt-2 text-sm font-medium">Manage your EcoTrack credentials and review your environmental impact.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-neutral-100 relative group"
        >
          {/* Cover Header */}
          <div className="h-64 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black relative overflow-hidden">
             <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
             
             <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                 <ZapIcon size={14} className="text-yellow-400" /> EcoTrack Global ID: #{(user._id || 'ET-PRO').substring(0, 8).toUpperCase()}
             </div>

             <div className="absolute -bottom-20 left-12 z-20">
                <div className="w-40 h-40 bg-white rounded-[2rem] p-2.5 shadow-2xl relative">
                   <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-[1.5rem] flex items-center justify-center text-6xl text-neutral-800 font-black uppercase shadow-inner">
                     {user.username.substring(0, 1)}
                   </div>
                   {!isHighTrust && (
                       <div className="absolute -top-3 -right-3 bg-rose-500 text-white p-2 rounded-xl shadow-lg border-4 border-white" title="Account Flagged">
                           <ShieldAlert size={20} />
                       </div>
                   )}
                </div>
             </div>
          </div>

          <div className="pt-28 px-12 pb-14 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight leading-none mb-3">{user.username}</h1>
                <div className="flex flex-wrap gap-4 text-sm font-bold text-neutral-500">
                  <p className="flex items-center bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
                    <Mail size={16} className="mr-2 text-neutral-400" /> {user.email}
                  </p>
                  <p className="flex items-center bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
                    <Calendar size={14} className="mr-2 text-neutral-400" /> Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Link 
                  to="/rewards" 
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black tracking-wide uppercase transition-all shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-1 flex items-center gap-3"
                >
                  <Ticket size={20} /> Access Rewards
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className={`${stat.color} p-8 rounded-[2rem] border flex flex-col relative overflow-hidden group/stat transition-transform hover:-translate-y-1`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-[40px] -mr-10 -mt-10 group-hover/stat:scale-150 transition-transform duration-700"></div>
                  
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10">
                    {React.cloneElement(stat.icon, { size: 28 })}
                  </div>
                  <span className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">{stat.label}</span>
                  <span className={`text-4xl font-black ${stat.text} tracking-tight relative z-10`}>{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Recent Vouchers Section */}
            {user.vouchers && user.vouchers.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-black text-neutral-900 mb-8 tracking-tight flex items-center gap-3">
                    <Ticket className="text-emerald-500" /> Redeemed Vouchers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.vouchers.slice(-4).reverse().map((voucher, idx) => (
                    <div key={idx} className="p-6 rounded-[2rem] border-2 border-dashed border-neutral-200 bg-neutral-50 hover:bg-white flex items-center justify-between transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm font-bold border border-neutral-100 group-hover:scale-110 transition-transform">
                          🎫
                        </div>
                        <div>
                          <p className="font-black text-neutral-900 text-lg tracking-tight mb-1">{voucher.rewardName}</p>
                          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{new Date(voucher.dateRedeemed).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="bg-neutral-900 text-white px-4 py-2 rounded-xl border border-neutral-800 shadow-inner flex items-center gap-3">
                        <code className="text-sm font-mono font-bold tracking-widest">
                            {voucher.code}
                        </code>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sponsor Banner */}
        <AdBanner className="mt-12" />
        
      </div>
    </div>
  );
};

export default Profile;
