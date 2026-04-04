import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-inter">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar aria-label="Main Navigation" />
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-64 h-full bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 z-40">
           <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-500 rounded text-white shadow-sm">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight">EcoTrack</span>
           </div>
           <button 
             onClick={() => setIsMobileMenuOpen(true)}
             className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
           >
             <Menu size={24} />
           </button>
        </div>

        {/* Global Topbar for Search & AI Alerts */}
        <Topbar />

        <main className="flex-1 overflow-y-auto relative p-4 md:p-8 lg:p-10 hide-scrollbar bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
