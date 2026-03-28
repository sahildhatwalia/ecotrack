import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Activity, Trophy, Gift, User, LogOut, Leaf, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/activities', icon: <Activity size={20} />, label: 'Analytics' }, 
    { to: '/leaderboard', icon: <Trophy size={20} />, label: 'Community' }, 
    { to: '/rewards', icon: <Gift size={20} />, label: 'Rewards' },
    { to: '/profile', icon: <User size={20} />, label: 'Settings' },
  ];

  return (
    <div className="w-72 bg-white border-r border-neutral-100 h-full flex flex-col pt-10 pb-6 shadow-[10px_0_40px_rgba(0,0,0,0.02)] relative z-50">
      {/* Premium Logo Area */}
      <div className="px-8 mb-12 flex items-center group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-all duration-500">
            <Leaf size={22} className="text-white" />
        </div>
        <div className="ml-4">
            <span className="text-2xl font-black tracking-tighter text-neutral-900 block">EcoTrack</span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] leading-none">v2.4 Production</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2">
        {navItems.map((item) => (
            <NavLink 
                key={item.to}
                to={item.to} 
                className={({ isActive }) => 
                    `flex items-center py-4 px-5 rounded-2xl transition-all duration-300 font-bold group ${
                        isActive 
                        ? 'bg-neutral-900 text-white shadow-2xl shadow-neutral-200' 
                        : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900'
                    }`
                } 
                end={item.to === '/'}
            >
                <div className={`mr-4 transition-transform group-hover:scale-110`}>
                    {item.icon}
                </div>
                <span className="text-sm tracking-tight">{item.label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]"></div>
                )}
            </NavLink>
        ))}
      </nav>

      {/* AI Trust Indicator (Sidebar mini-version) */}
      <div className="px-6 mb-8 mt-auto">
        <div className="bg-neutral-50 rounded-3xl p-5 border border-neutral-100 relative overflow-hidden flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user?.trustScore >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                <ShieldCheck size={20} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">AI Verified</p>
                <p className="text-xs font-black text-neutral-900">{user?.trustScore || 100}% Trust</p>
            </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-6">
        <button 
            onClick={handleLogout} 
            className="flex items-center w-full py-4 px-5 rounded-2xl text-neutral-400 hover:bg-rose-50 hover:text-rose-600 font-bold transition-all duration-300 group"
        >
          <LogOut size={20} className="mr-4 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm">Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
