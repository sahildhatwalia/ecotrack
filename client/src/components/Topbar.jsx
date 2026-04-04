import React, { useContext, useState, useEffect, useRef } from 'react';
import { 
  Bell, User, Leaf, Search, ShieldCheck, 
  Settings, LogOut, ChevronDown, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { searchTerm, setSearchTerm } = useSearch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = [
    { id: 1, type: 'eco', title: "Efficiency Boost", text: "Your recycling habits improved by 15% this week!" },
    { id: 2, type: 'alert', title: "Daily Milestone", text: "You just crossed 50kg of saved CO₂. Awesome!" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 z-40 sticky top-0">
      <div className="flex-1 flex items-center max-w-xl">
        <div className="flex-1 relative group focus-within:max-w-md transition-all duration-300">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-green-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search analytics, rewards, or community..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50/50 border border-transparent focus:bg-white focus:border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 ml-4" ref={dropdownRef}>
        {/* AI Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-widest">AI Engine Live</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all relative"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 text-sm italic tracking-tight flex items-center gap-2"><Sparkles size={14} className="text-green-500" /> Notifications</h3>
                  <button className="text-[10px] font-bold text-green-600 uppercase tracking-widest hover:underline">Clear all</button>
                </div>
                <div className="flex flex-col max-h-[300px] overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 hover:bg-slate-50 transition-all flex gap-3 cursor-default">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.type === 'eco' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {n.type === 'eco' ? <Leaf size={16} /> : <ShieldCheck size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 mb-0.5">{n.title}</p>
                        <p className="text-[11px] text-slate-500 leading-normal">{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
               {user?.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-2 overflow-hidden"
              >
                <div className="px-3 py-3 border-b border-slate-50 mb-1">
                   <p className="text-sm font-bold text-slate-900 truncate">{user?.username || 'User'}</p>
                   <p className="text-[10px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <User size={16} /> My Account
                </button>
                <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  <Settings size={16} /> Preferences
                </button>
                <div className="h-[1px] bg-slate-100 my-1" />
                <button 
                  onClick={logout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
