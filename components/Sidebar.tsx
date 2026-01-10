
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Learn', icon: '🏠' },
    { id: AppView.REVIEW, label: 'Review', icon: '📝' },
    { id: AppView.CHAT, label: 'Chatbot', icon: '🤖' },
    { id: AppView.PROFILE, label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-around md:relative md:w-24 md:flex-col md:border-t-0 md:border-r md:h-screen md:justify-center md:gap-8 z-50">
      <div className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2">
        <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-yellow-200 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
          🐒
        </div>
      </div>
      
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
            currentView === item.id 
              ? 'text-yellow-600 md:bg-yellow-50 md:scale-110' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="text-2xl mb-1">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
