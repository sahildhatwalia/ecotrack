import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Activity, Trophy, Gift, User, LogOut, Leaf } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} className="mr-3" />, label: 'Dashboard' },
    { to: '/activities', icon: <Activity size={20} className="mr-3" />, label: 'Analytics' }, // Relabelling activities to analytics based on image
    { to: '/leaderboard', icon: <Trophy size={20} className="mr-3" />, label: 'Community' }, // Relabelling leaderboard to community
    { to: '/rewards', icon: <Gift size={20} className="mr-3" />, label: 'Rewards' },
    { to: '/profile', icon: <User size={20} className="mr-3" />, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col pt-6 pb-4">
      {/* Logo Area */}
      <div className="px-6 mb-8 flex items-center text-green-600">
        <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
        <span className="text-2xl font-bold tracking-tight text-gray-800">EcoTrack</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
            <NavLink 
                key={item.to}
                to={item.to} 
                className={({ isActive }) => 
                    `flex items-center py-3 px-4 rounded-xl transition duration-200 font-medium ${
                        isActive 
                        ? 'bg-green-500 text-white shadow-sm shadow-green-200' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`
                } 
                end={item.to === '/'}
            >
                {item.icon}
                {item.label}
            </NavLink>
        ))}
      </nav>

      {/* Daily Challenge Widget */}
      <div className="px-4 mt-auto mb-4">
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-200 rounded-full opacity-50 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Leaf size={16} className="text-emerald-500" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Daily Challenge</span>
          </div>
          <p className="text-sm font-medium text-emerald-900 relative z-10">
            Go Meatless today to cut 2.5kg of CO2! 🌱
          </p>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 pb-2">
        <button 
            onClick={handleLogout} 
            className="flex items-center w-full py-3 px-4 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 font-medium transition duration-200"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
