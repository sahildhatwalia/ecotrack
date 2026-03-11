import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Trophy, Gift, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Home' },
    { to: '/activities', icon: <Activity size={20} />, label: 'Activities' },
    { to: '/rewards', icon: <Gift size={20} />, label: 'Rewards' },
    { to: '/leaderboard', icon: <Trophy size={20} />, label: 'Leaders' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${
                isActive ? 'text-green-600 font-semibold' : 'text-gray-500 hover:text-green-500'
              }`
            }
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
