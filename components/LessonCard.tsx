
import React, { useState } from 'react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
  onShowGrammar: (e: React.MouseEvent) => void;
  onPracticeVocab: (e: React.MouseEvent) => void;
  onRate?: (id: string, rating: number) => void;
  languageName?: string;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick, onShowGrammar, onPracticeVocab, onRate, languageName }) => {
  const [showSummary, setShowSummary] = useState(false);
  const [showGrammarDetail, setShowGrammarDetail] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const difficultyColors = {
    Beginner: 'bg-emerald-100 text-emerald-700',
    Intermediate: 'bg-sky-100 text-sky-700',
    Advanced: 'bg-violet-100 text-violet-700'
  };

  const isComplete = lesson.progress === 100;

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(lesson.title);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-[2rem] border-2 transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden ${
        lesson.needsReview ? 'border-red-300 bg-red-50/20' : 'border-transparent hover:border-yellow-400'
      }`}
    >
      {/* Visual Indicator: Review Due Tag */}
      {lesson.needsReview && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1 rounded-full shadow-lg shadow-red-200/50 animate-pulse">
          <span className="text-[14px]">⏳</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Review Due</span>
        </div>
      )}

      <div className="flex flex-col items-start text-left p-6 w-full">
        <div className="flex justify-between w-full mb-6 items-start">
          <div className="relative">
            {/* Prominent Progress Ring */}
            <svg className="absolute -inset-3 w-[5.5rem] h-[5.5rem] -rotate-90">
              <circle
                cx="44"
                cy="44"
                r="38"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-100"
              />
              <circle
                cx="44"
                cy="44"
                r="38"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={238.64}
                strokeDashoffset={238.64 - (238.64 * lesson.progress) / 100}
                className={`${lesson.needsReview ? 'text-red-400' : 'text-yellow-400'} transition-all duration-1000 stroke-round`}
                strokeLinecap="round"
              />
            </svg>
            <div 
              onClick={onClick}
              className={`relative z-10 w-16 h-16 ${lesson.color} rounded-2xl flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer`}
            >
              {lesson.icon}
              {isComplete && !lesson.needsReview && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-[10px] font-black">✓</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${difficultyColors[lesson.difficulty]}`}>
              {lesson.difficulty}
            </span>
            
            {/* Action Buttons: Clearly Visible */}
            <div className="flex gap-2">
              <button 
                onClick={handlePronounce}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all border-2 shadow-sm ${isSpeaking ? 'bg-yellow-400 border-yellow-400 text-yellow-900 animate-pulse' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-yellow-600 hover:border-yellow-200'}`}
                title="Hear Pronunciation"
              >
                🔊
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPracticeVocab(e);
                }}
                className="w-10 h-10 bg-orange-50 hover:bg-orange-500 rounded-xl flex items-center justify-center text-lg text-orange-600 hover:text-white transition-all active:scale-90 border-2 border-orange-100 shadow-sm group/btn"
                title="Practice Vocabulary"
              >
                🗂️
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onShowGrammar(e);
                }}
                className="w-10 h-10 bg-blue-50 hover:bg-blue-500 rounded-xl flex items-center justify-center text-lg text-blue-600 hover:text-white transition-all active:scale-90 border-2 border-blue-100 shadow-sm group/btn"
                title="Detailed Grammar"
              >
                📖
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-1 w-full">
          <h3 className="text-xl font-black text-gray-800 font-outfit truncate flex-1 hover:text-yellow-600 cursor-pointer transition-colors" onClick={onClick}>{lesson.title}</h3>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{lesson.category}</p>
          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lesson.vocabulary?.length || 0} Terms</p>
        </div>
        
        <div className="w-full flex items-center gap-4 mt-auto">
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
            <div 
              className={`h-full ${lesson.needsReview ? 'bg-red-400' : 'bg-yellow-400'} rounded-full transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) ${lesson.progress > 0 ? 'shimmer-bar progress-glow' : ''}`}
              style={{ width: `${lesson.progress}%` }}
            />
          </div>
          <span className={`text-[12px] font-black ${lesson.needsReview ? 'text-red-500' : 'text-gray-600'} w-10 text-right`}>
            {lesson.progress}%
          </span>
        </div>
      </div>

      {/* Collapsible Section for Details */}
      {(lesson.progress > 0) && (
        <div className={`px-6 pb-6 border-t border-gray-50 pt-4 ${lesson.needsReview ? 'bg-red-50/30' : 'bg-gray-50/30'}`}>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowSummary(!showSummary)}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${showSummary ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span className={lesson.needsReview ? 'text-red-500 animate-pulse' : 'text-green-500'}>●</span>
              <span>{lesson.needsReview ? 'Review Details' : 'Course Content'}</span>
              <span className={`transition-transform duration-500 ${showSummary ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRate?.(lesson.id, star);
                  }}
                  className={`text-sm transition-all hover:scale-125 ${
                    (lesson.rating || 0) >= star ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200 hover:text-yellow-200'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          {showSummary && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Key Vocabulary</p>
                <div className="flex flex-wrap gap-1.5">
                  {lesson.vocabulary?.map((v, i) => (
                    <button 
                      key={i} 
                      onClick={(e) => {
                        e.stopPropagation();
                        if ('speechSynthesis' in window) {
                          const u = new SpeechSynthesisUtterance(v);
                          window.speechSynthesis.speak(u);
                        }
                      }}
                      className="px-3 py-1.5 bg-white text-gray-700 text-[11px] font-bold rounded-xl border border-gray-100 hover:border-yellow-300 hover:bg-yellow-50 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                    >
                      {v} <span className="text-[10px] opacity-30">🔊</span>
                    </button>
                  ))}
                </div>
              </div>

              {lesson.grammarNotes && (
                <div className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${lesson.needsReview ? 'border-red-100 bg-red-50/50' : 'border-blue-50 bg-white'}`}>
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGrammarDetail(!showGrammarDetail);
                    }}
                    className="w-full flex items-center justify-between p-4 hover:bg-blue-50/20 transition-colors"
                   >
                     <div className="flex items-center gap-2">
                       <span className="text-lg">📖</span>
                       <p className={`text-[10px] font-black ${lesson.needsReview ? 'text-red-500' : 'text-blue-500'} uppercase tracking-widest`}>Grammar Notes</p>
                     </div>
                     <span className={`text-xs transition-transform duration-300 ${showGrammarDetail ? 'rotate-180' : ''}`}>▼</span>
                   </button>
                   
                   {showGrammarDetail && (
                     <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                        <p className={`text-xs ${lesson.needsReview ? 'text-red-900' : 'text-gray-700'} leading-relaxed font-medium italic mb-4`}>
                          {lesson.grammarNotes}
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowGrammar(e);
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-all group/learn"
                        >
                          View Full Breakdown 
                          <span className="group-hover/learn:translate-x-1 transition-transform">→</span>
                        </button>
                     </div>
                   )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Subtle Background Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-all duration-700 select-none transform group-hover:-translate-x-2 group-hover:-translate-y-2">
        <span className="text-9xl">{lesson.icon}</span>
      </div>
    </div>
  );
};

export default LessonCard;
