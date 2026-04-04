import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  LayoutDashboard, Activity, Trophy, Gift, 
  Settings, LogOut, Leaf, ShieldCheck, 
  ChevronRight, Sparkles 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/activities', icon: <Activity size={18} />, label: 'Analytics' }, 
    { to: '/leaderboard', icon: <Trophy size={18} />, label: 'Community' }, 
    { to: '/rewards', icon: <Gift size={18} />, label: 'Rewards' },
    { to: '/profile', icon: <Settings size={18} />, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col z-50">
      {/* Brand */}
      <div className="p-6 mb-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-sm">
          <Leaf size={18} />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">EcoTrack</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
        {navItems.map((item) => (
          <NavLink 
            key={item.to}
            to={item.to} 
            end={item.to === '/'}
            className={({ isActive }) => 
              `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                isActive 
                ? 'bg-green-50 text-green-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            } 
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Pro Badge / Gamification mini card */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer shadow-lg">
          <div className="absolute top-[-10%] right-[-10%] w-16 h-16 bg-green-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Pro Member</span>
          </div>
          <p className="text-xs text-slate-300 font-medium mb-3">Unlock AI-powered insights and sensor sync.</p>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-green-500" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>

      {/* User & Settings */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
             {user?.username ? user.username[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-slate-900 truncate">{user?.username || 'User'}</p>
             <p className="text-[10px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
          <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
        
        <button 
          onClick={logout} 
          className="flex items-center gap-3 w-full py-2 px-3 mt-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
