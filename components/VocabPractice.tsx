
import React, { useState } from 'react';
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

  const vocab = lesson.vocabulary || ['New Word'];

  const handleNext = () => {
    if (currentIndex < vocab.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
      onComplete(vocab.length * 5); // 5 XP per word practiced
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center animate-in zoom-in duration-500">
        <div className="text-6xl mb-6 animate-bounce-short">✨</div>
        <h2 className="text-2xl font-black text-gray-800 mb-2 font-outfit">Mastered!</h2>
        <p className="text-gray-500 text-sm mb-8 font-medium">Reviewed {vocab.length} terms from {lesson.title}.</p>
        <button 
          onClick={onClose}
          className="w-full max-w-xs bg-gray-800 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
        >
          FINISH
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto h-full justify-center py-4">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        <div className="flex-1 mx-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-400 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / vocab.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{currentIndex + 1}/{vocab.length}</span>
      </div>

      <div 
        className={`w-full aspect-[4/5] perspective-1000 cursor-pointer group`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-700 preserve-3d shadow-xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-orange-100 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
               {lesson.icon}
            </div>
            <h3 className="text-2xl font-black text-gray-800 font-outfit tracking-tighter mb-2">
              {vocab[currentIndex]}
            </h3>
            <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mt-6 animate-pulse">Tap to see translation</p>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden bg-orange-500 text-white rounded-3xl flex flex-col items-center justify-center p-8 text-center rotate-y-180">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Meaning</p>
            <h3 className="text-2xl font-black font-outfit tracking-tighter mb-8">
              Concept {currentIndex + 1}
            </h3>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">💡</div>
            <p className="text-[9px] font-black uppercase tracking-widest mt-8 opacity-50">Tap to flip</p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full flex gap-3">
        <button 
          onClick={handleNext}
          className="flex-1 bg-gray-800 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-black transition-all active:scale-95"
        >
          {currentIndex === vocab.length - 1 ? 'FINISH' : 'NEXT'}
        </button>
      </div>
    </div>
  );
};

export default VocabPractice;
