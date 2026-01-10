
import React, { useState } from 'react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
  onShowGrammar: (e: React.MouseEvent) => void;
  onPracticeVocab: (e: React.MouseEvent) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick, onShowGrammar, onPracticeVocab }) => {
  const [showSummary, setShowSummary] = useState(false);

  const difficultyColors = {
    Beginner: 'bg-emerald-100 text-emerald-700',
    Intermediate: 'bg-sky-100 text-sky-700',
    Advanced: 'bg-violet-100 text-violet-700'
  };

  const isComplete = lesson.progress === 100;

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-[2rem] border-2 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden ${
        lesson.needsReview ? 'border-red-200 bg-red-50/10' : 'border-transparent hover:border-yellow-400'
      }`}
    >
      <button
        onClick={onClick}
        className="flex flex-col items-start text-left p-6 w-full"
      >
        <div className="flex justify-between w-full mb-4 items-start">
          <div className={`relative w-16 h-16 ${lesson.color} rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
            {lesson.icon}
            {isComplete && !lesson.needsReview && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-md animate-in zoom-in duration-500">
                <span className="text-[10px] font-black">✓</span>
              </div>
            )}
            {lesson.needsReview && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-md animate-pulse">
                <span className="text-[12px] font-black">!</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${difficultyColors[lesson.difficulty]}`}>
              {lesson.difficulty}
            </span>
            {lesson.needsReview && (
              <span className="text-[8px] font-black px-2 py-0.5 bg-red-500 text-white rounded-full uppercase tracking-tighter">
                Review Due
              </span>
            )}
            <div className="flex gap-2 mt-1">
              {lesson.vocabulary && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPracticeVocab(e);
                  }}
                  className="w-9 h-9 bg-orange-50 hover:bg-orange-100 rounded-xl flex items-center justify-center text-lg text-orange-600 transition-all active:scale-95 shadow-sm border border-orange-100"
                  title="Practice Vocabulary"
                >
                  🗂️
                </button>
              )}
              {lesson.grammarNotes && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowGrammar(e);
                  }}
                  className="w-9 h-9 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-center text-lg text-blue-600 transition-all active:scale-95 shadow-sm border border-blue-100"
                  title="Grammar Notes"
                >
                  📖
                </button>
              )}
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-black text-gray-800 mb-1 font-outfit truncate w-full">{lesson.title}</h3>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-tight mb-4">{lesson.category}</p>
        
        <div className="w-full flex items-center gap-3 mt-auto">
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
            <div 
              className={`h-full bg-yellow-400 rounded-full transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${lesson.progress > 0 ? 'shimmer-bar progress-glow' : ''}`}
              style={{ width: `${lesson.progress}%` }}
            />
          </div>
          <span className="text-xs font-black text-gray-500 w-8 text-right">
            {lesson.progress}%
          </span>
        </div>
      </button>

      {isComplete && (
        <div className="px-6 pb-6 border-t border-gray-50 pt-4 bg-gray-50/30">
          <button 
            onClick={() => setShowSummary(!showSummary)}
            className="w-full flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
          >
            <div className="flex items-center gap-1.5">
               <span className="text-green-500 font-bold">●</span>
               <span>Mastery Summary</span>
            </div>
            <span className="text-lg">{showSummary ? '−' : '+'}</span>
          </button>
          
          {showSummary && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Vocabulary Learned</p>
                <div className="flex flex-wrap gap-1.5">
                  {lesson.vocabulary?.map((v, i) => (
                    <span key={i} className="px-2 py-1 bg-white text-gray-600 text-[10px] font-bold rounded-lg border border-gray-100 shadow-xs">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              {lesson.grammarNotes && (
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100/50">
                   <p className="text-[9px] font-black text-yellow-600 uppercase tracking-widest mb-1">Grammar Point</p>
                   <p className="text-xs text-yellow-800 leading-tight italic line-clamp-3">{lesson.grammarNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-500 select-none">
        <span className="text-[120px]">{lesson.icon}</span>
      </div>
    </div>
  );
};

export default LessonCard;
