
import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';

interface VocabPracticeProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (xp: number) => void;
}

const VocabPractice: React.FC<VocabPracticeProps> = ({ lesson, onClose, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'leaving' | 'entering'>('idle');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [totalXp, setTotalXp] = useState(0);

  const vocab = lesson.vocabulary || ['New Word'];

  const handleAssessment = (correct: boolean) => {
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) setTotalXp(prev => prev + 10);
    
    // Brief delay for the visual feedback before moving to next
    setTimeout(() => {
      handleNext();
    }, 600);
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex < vocab.length - 1) {
      setAnimState('leaving');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
        setAnimState('entering');
        setTimeout(() => setAnimState('idle'), 50);
      }, 300);
    } else {
      setCompleted(true);
      onComplete(totalXp + 25); // Bonus for completion
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center animate-in zoom-in duration-500 h-full">
        <div className="text-7xl mb-6 animate-bounce">🏆</div>
        <h2 className="text-3xl font-black text-gray-800 mb-2 font-outfit tracking-tight">Practice Finished!</h2>
        <p className="text-gray-500 text-sm mb-10 font-medium">You reviewed {vocab.length} terms. Mastery grows with every flip!</p>
        <div className="bg-yellow-100 px-6 py-3 rounded-2xl mb-10 border border-yellow-200">
          <p className="text-yellow-700 font-black text-lg">+{totalXp + 25} XP EARNED</p>
        </div>
        <button 
          onClick={onClose}
          className="w-full max-w-xs bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const cardContainerClasses = `
    w-full aspect-[4/5] perspective-1000 cursor-pointer group transition-all duration-300 transform
    ${animState === 'leaving' ? '-translate-x-full opacity-0 rotate-y-12' : ''}
    ${animState === 'entering' ? 'translate-x-full opacity-0 -rotate-y-12' : ''}
    ${animState === 'idle' ? 'translate-x-0 opacity-100 rotate-y-0' : ''}
    ${feedback === 'correct' ? 'ring-8 ring-green-400/50 rounded-[2.5rem]' : ''}
    ${feedback === 'incorrect' ? 'ring-8 ring-red-400/50 rounded-[2.5rem] animate-shake' : ''}
  `;

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto h-full justify-center py-4">
      {/* Header Stats */}
      <div className="w-full flex justify-between items-center mb-10 px-4">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-300 hover:text-red-500 transition-all">✕</button>
        <div className="flex-1 mx-6 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-700"
            style={{ width: `${((currentIndex + 1) / vocab.length) * 100}%` }}
          />
        </div>
        <div className="bg-gray-800 px-3 py-1 rounded-full shadow-md">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{currentIndex + 1} / {vocab.length}</span>
        </div>
      </div>

      {/* 3D Card */}
      <div 
        className={cardContainerClasses}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 preserve-3d shadow-2xl rounded-[2.5rem] ${isFlipped ? 'rotate-y-180' : ''} ease-[cubic-bezier(0.4, 0, 0.2, 1)]`}>
          
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden bg-white border-[3px] border-orange-50 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center shadow-inner">
            <div className="absolute top-8 left-8 text-4xl opacity-10 grayscale">{lesson.icon}</div>
            <div className="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center text-5xl mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
               {lesson.icon}
            </div>
            <h3 className="text-3xl font-black text-gray-800 font-outfit tracking-tighter leading-tight mb-2">
              {vocab[currentIndex]}
            </h3>
            <div className="mt-12 flex flex-col items-center gap-2">
              <span className="w-10 h-1 bg-orange-100 rounded-full"></span>
              <p className="text-[10px] font-black text-orange-300 uppercase tracking-[0.2em] animate-pulse">Tap to Reveal</p>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center rotate-y-180 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%)] opacity-30 pointer-events-none"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-orange-100">Definition / Translation</p>
            <h3 className="text-4xl font-black font-outfit tracking-tighter mb-10 drop-shadow-md">
              {vocab[currentIndex]}
            </h3>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl shadow-lg">
              ✨
            </div>
            
            <div className="mt-12 w-full grid grid-cols-2 gap-3 px-4">
              <button 
                onClick={(e) => { e.stopPropagation(); handleAssessment(false); }}
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Study More
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleAssessment(true); }}
                className="bg-white text-orange-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                I Knew This!
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">
        {isFlipped ? 'Self-Assessment' : 'Memory Challenge'} • {lesson.title}
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 3;
        }
      `}</style>
    </div>
  );
};

export default VocabPractice;
