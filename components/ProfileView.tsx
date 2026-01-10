
import React from 'react';
import { Badge } from '../types';

interface ProfileViewProps {
  xp: number;
  coins: number;
  completedLessonsCount: number;
  studiedLanguagesCount: number;
  badges: Badge[];
}

const ProfileView: React.FC<ProfileViewProps> = ({
  xp,
  coins,
  completedLessonsCount,
  studiedLanguagesCount,
  badges
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 text-center relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl border-4 border-white shadow-xl relative z-10 transition-transform hover:scale-105">
          👤
        </div>
        <h2 className="text-2xl font-black text-gray-800 font-outfit relative z-10 tracking-tight">Linguistic Explorer</h2>
        <p className="text-gray-400 font-bold mb-10 relative z-10 uppercase tracking-[0.2em] text-[10px]">Level {Math.floor(xp / 1000) || 1} • Path to Polyglot</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
          {[
            { label: 'Total XP', val: xp.toLocaleString(), icon: '⚡' },
            { label: 'Wallet', val: coins.toLocaleString(), icon: '💎' },
            { label: 'Modules', val: completedLessonsCount, icon: '📚' },
            { label: 'Langs', val: studiedLanguagesCount, icon: '🌍' }
          ].map((stat, i) => (
            <div key={i} className="bg-gray-50/50 p-4 sm:p-6 rounded-2xl text-left border border-gray-100 transition-all hover:bg-white hover:shadow-lg group">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[9px] font-black text-gray-400 uppercase">{stat.label}</p>
                <span className="text-xs group-hover:scale-110 transition-transform">{stat.icon}</span>
              </div>
              <p className="text-xl font-black text-gray-800 tracking-tight">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-left">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-gray-800 font-outfit uppercase tracking-widest text-[10px] flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Hall of Mastery
            </h3>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              {badges.filter(b => b.unlocked).length} / {badges.length} Unlocked
            </span>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
            {badges.filter(b => b.unlocked).map(badge => (
              <div key={badge.id} className="group flex flex-col items-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl flex items-center justify-center text-3xl mb-2 shadow-sm border border-yellow-100 group-hover:scale-110 group-hover:rotate-3 transition-all cursor-help">
                  {badge.icon}
                </div>
                <p className="text-[9px] font-black text-gray-800 uppercase text-center leading-tight px-1">{badge.name}</p>
                
                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-all bg-gray-900 text-white text-[9px] p-3 rounded-xl pointer-events-none -top-16 z-20 w-40 text-center shadow-2xl border border-gray-700 translate-y-2 group-hover:translate-y-0">
                  <p className="font-bold mb-1">{badge.name}</p>
                  <p className="opacity-70 font-medium">{badge.description}</p>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900"></div>
                </div>
              </div>
            ))}
            {badges.filter(b => !b.unlocked).map(badge => (
              <div key={badge.id} className="flex flex-col items-center opacity-30 grayscale cursor-not-allowed">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mb-2 border border-gray-200">
                  🔒
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase text-center leading-tight">Locked</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
