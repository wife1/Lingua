
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
      className={`group relative flex flex-col bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden ${
        lesson.needsReview ? 'border-red-200 bg-red-50/10' : 'border-transparent hover:border-yellow-400'
      }`}
    >
      <button
        onClick={onClick}
        className="flex flex-col items-start text-left p-5 w-full"
      >
        <div className="flex justify-between w-full mb-4 items-start">
          <div className={`relative w-14 h-14 ${lesson.color} rounded-xl flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
            {lesson.icon}
            {isComplete && !lesson.needsReview && (
              <div className="absolute -top-1.5 -right-1.5 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-in zoom-in duration-500">
                <span className="text-[9px] font-black">✓</span>
              </div>
            )}
            {lesson.needsReview && (
              <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                <span className="text-[10px] font-black">!</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${difficultyColors[lesson.difficulty]}`}>
              {lesson.difficulty}
            </span>
            <div className="flex gap-1.5 mt-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPracticeVocab(e);
                }}
                className="w-8 h-8 bg-orange-50 hover:bg-orange-100 rounded-lg flex items-center justify-center text-sm text-orange-600 transition-all active:scale-90 border border-orange-100"
                title="Practice Vocabulary"
              >
                🗂️
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onShowGrammar(e);
                }}
                className="w-8 h-8 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center text-sm text-blue-600 transition-all active:scale-90 border border-blue-100"
                title="Grammar Notes"
              >
                📖
              </button>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-0.5 font-outfit truncate w-full">{lesson.title}</h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{lesson.category}</p>
        
        <div className="w-full flex items-center gap-3 mt-auto">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative">
            <div 
              className={`h-full bg-yellow-400 rounded-full transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${lesson.progress > 0 ? 'shimmer-bar progress-glow' : ''}`}
              style={{ width: `${lesson.progress}%` }}
            />
          </div>
          <span className="text-[10px] font-black text-gray-500 w-7 text-right">
            {lesson.progress}%
          </span>
        </div>
      </button>

      {isComplete && (
        <div className="px-5 pb-5 border-t border-gray-50 pt-3 bg-gray-50/30">
          <button 
            onClick={() => setShowSummary(!showSummary)}
            className="w-full flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
          >
            <div className="flex items-center gap-1.5">
               <span className="text-green-500">●</span>
               <span>Mastery Details</span>
            </div>
            <span>{showSummary ? '−' : '+'}</span>
          </button>
          
          {showSummary && (
            <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="space-y-1.5">
                <p className="text-[8px] font-black text-gray-400 uppercase">Vocab</p>
                <div className="flex flex-wrap gap-1">
                  {lesson.vocabulary?.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white text-gray-600 text-[10px] font-medium rounded border border-gray-100">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
              {lesson.grammarNotes && (
                <div className="p-2.5 bg-yellow-50 rounded-xl border border-yellow-100/50">
                   <p className="text-xs text-yellow-800 leading-tight italic">{lesson.grammarNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="absolute -right-2 -bottom-2 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-500 select-none">
        <span className="text-8xl">{lesson.icon}</span>
      </div>
    </div>
  );
};

export default LessonCard;
