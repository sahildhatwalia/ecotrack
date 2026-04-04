import React, { useContext, useState, useEffect, useRef } from 'react';
import { Bell, User, Leaf, Heart, Sun, Search, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const { searchTerm, setSearchTerm, isSearchActive, setIsSearchActive } = useSearch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const motivationalThoughts = [
    { id: 1, icon: <Leaf className="text-emerald-500 w-4 h-4" />, title: "Pattern Analysis", text: "AI verified your last 5 activities as authentic. +50 Trust Bonus!" },
    { id: 2, icon: <ShieldCheck className="text-blue-500 w-4 h-4" />, title: "Anti-Fraud Active", text: "Global shield is protecting your rewards from simulation attacks." },
    { id: 3, icon: <Sun className="text-amber-500 w-4 h-4" />, title: "Daily Goal", text: "You are 2km away from unlocking the Starbucks voucher!" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 h-20 flex items-center justify-between px-10 shrink-0 z-40 w-full relative">
      <div className="flex items-center gap-8 flex-1">
        {/* Mobile Branding */}
        <div className="flex md:hidden items-center text-emerald-600">
           <Leaf size={24} className="mr-2" />
           <span className="text-xl font-black tracking-tighter text-neutral-900">EcoTrack</span>
        </div>

        {/* Search Bar - Functional */}
        <div className="relative" ref={searchRef}>
          <div className="hidden md:flex items-center bg-neutral-50/50 backdrop-blur-sm border border-neutral-100 px-5 py-2.5 rounded-[1.5rem] w-96 group focus-within:border-emerald-400 focus-within:bg-white focus-within:shadow-[0_10px_40px_rgba(16,185,129,0.1)] transition-all duration-300">
              <Search size={18} className="text-neutral-300 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                  type="text" 
                  placeholder="Search rewards, actions or intel..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowResults(e.target.value.length > 0);
                  }}
                  onFocus={() => searchTerm.length > 0 && setShowResults(true)}
                  className="bg-transparent border-none outline-none text-sm ml-3 w-full font-semibold text-neutral-700 placeholder:text-neutral-300"
              />
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-3 w-full bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-neutral-100 z-50 overflow-hidden"
              >
                <div className="p-6">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">Search Intel</p>
                  <div className="space-y-2">
                    {['Rewards', 'Activities', 'Community'].map((item) => (
                      <button 
                        key={item}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 group/item transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xs group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                            {item[0]}
                          </div>
                          <span className="text-sm font-bold text-neutral-600 group-hover/item:text-neutral-900">{item}</span>
                        </div>
                        <ChevronRight size={14} className="text-neutral-300 group-hover/item:text-emerald-500" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-neutral-400">Press ENTER for global search</p>
                  <Search size={12} className="text-neutral-300" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex items-center space-x-6 ml-auto">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-2xl transition-all"
          >
            <Bell size={22} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-neutral-100 z-50 overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-neutral-50 flex items-center justify-between">
                  <h3 className="font-black text-neutral-900 text-lg tracking-tight">System Intel</h3>
                  <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Mark all read</button>
                </div>
                <div className="flex flex-col max-h-[400px] overflow-y-auto no-scrollbar">
                  {motivationalThoughts.map((thought) => (
                    <div key={thought.id} className="p-6 border-b border-neutral-50 hover:bg-neutral-50 transition-all flex gap-4 items-start group">
                      <div className="bg-white p-2.5 text-neutral-800 rounded-xl shadow-sm border border-neutral-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                        {thought.icon}
                      </div>
                      <div>
                        <p className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-1">{thought.title}</p>
                        <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                            {thought.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-neutral-900 px-8 py-4 text-center">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <ShieldCheck size={12} /> Secure Cloud Sync Active
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-[1px] bg-neutral-100"></div>

        <div className="flex items-center gap-4 group cursor-pointer">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-neutral-900 leading-none mb-1">{user?.username || 'Eco User'}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Pro Member</p>
            </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-900 text-white flex items-center justify-center font-black text-lg shadow-lg border-2 border-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
            {user?.username ? user.username[0].toUpperCase() : <User size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
