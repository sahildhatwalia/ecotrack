import React, { useContext, useState, useEffect, useRef } from 'react';
import { Bell, User, Leaf, Heart, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const Topbar = () => {
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const motivationalThoughts = [
    { id: 1, icon: <Leaf className="text-emerald-500 w-4 h-4" />, text: "Every small step counts. Your eco-efforts today shape a greener tomorrow!" },
    { id: 2, icon: <Heart className="text-rose-500 w-4 h-4" />, text: "Mother Earth thanks you for your commitment to sustainability." },
    { id: 3, icon: <Sun className="text-amber-500 w-4 h-4" />, text: "Brighten the world by reducing your carbon footprint today." },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-10 w-full relative">
      <div className="flex items-center md:hidden">
        {/* Mobile Branding */}
        <div className="flex items-center text-green-600">
           <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
           <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-700">EcoTrack</span>
        </div>
      </div>
      
      {/* Desktop empty spacer for layout flow, and right-aligned icons */}
      <div className="hidden md:flex flex-1"></div>

      <div className="flex items-center space-x-4 ml-auto">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 overflow-hidden"
              >
                <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
                  <h3 className="font-bold text-emerald-900 text-sm">Daily Eco Inspiration</h3>
                  <span className="bg-emerald-200 text-emerald-800 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">New</span>
                </div>
                <div className="flex flex-col max-h-[300px] overflow-y-auto">
                  {motivationalThoughts.map((thought) => (
                    <div key={thought.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 items-start">
                      <div className="bg-white p-2 text-gray-800 rounded-full shadow-sm border border-gray-100 flex-shrink-0">
                        {thought.icon}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {thought.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3 text-emerald-500" /> Keep tracking for a healthy Earth!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
            {user?.username ? user.username[0].toUpperCase() : <User size={16} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
