
import React, { useState, useEffect } from 'react';
import { Question, Lesson } from '../types';
import { generateLessonFeedback } from '../services/geminiService';

interface QuizProps {
  questions: any[];
  onComplete: (score: number) => void;
  onClose: () => void;
  reward?: { coins: number, xp: number } | null;
  lesson: Lesson;
  languageName: string;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onClose, reward, lesson, languageName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (isFinished && !aiFeedback && !isLoadingFeedback) {
      const getFeedback = async () => {
        setIsLoadingFeedback(true);
        try {
          const feedback = await generateLessonFeedback(score, questions.length, languageName);
          setAiFeedback(feedback || "Great job!");
        } catch (error) {
          console.error("Feedback failed:", error);
          setAiFeedback("Great attempt! Keep practicing.");
        } finally {
          setIsLoadingFeedback(false);
        }
      };
      getFeedback();
    }
  }, [isFinished, score, questions.length, languageName, aiFeedback, isLoadingFeedback]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      setIsFinished(true);
      onComplete(score);
    }
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (currentQuestion.type === 'MULTIPLE_CHOICE') {
      const correct = selectedOption === currentQuestion.correctAnswer;
      setIsCorrect(correct);
      if (correct) setScore(s => s + 1);
      setIsAnswered(true);
    } else if (currentQuestion.type === 'MATCH') {
       setIsCorrect(true);
       setScore(s => s + 1);
       setIsAnswered(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-start p-6 text-center h-full animate-in fade-in scale-in-center duration-500 overflow-y-auto custom-scrollbar">
        <div className="text-6xl mb-4 animate-bounce-short">🎉</div>
        <h2 className="text-2xl font-black text-gray-800 mb-1 font-outfit">Complete!</h2>
        <p className="text-gray-500 text-sm mb-6">Excellent progress in {languageName}!</p>
        
        <div className="w-full max-w-sm mb-6">
           <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-5 text-white text-left shadow-md relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Teacher Feedback</p>
              {isLoadingFeedback ? (
                <div className="flex gap-2 items-center py-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-300"></div>
                </div>
              ) : (
                <p className="text-base font-bold italic leading-tight">{aiFeedback}</p>
              )}
           </div>
        </div>

        <div className="w-full max-w-sm mb-6 space-y-3">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 text-left">
            <h4 className="font-bold text-gray-800 mb-3 font-outfit text-sm flex items-center gap-2">Summary</h4>
            <div className="space-y-3">
               <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Key Grammar</p>
                  <p className="text-xs text-gray-600 italic">"{lesson.grammarNotes}"</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Vocabulary</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {lesson.vocabulary?.map((v, i) => (
                      <span key={i} className="px-2.5 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded-lg border border-yellow-100">
                        {v}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 flex flex-col items-center">
            <p className="text-[10px] font-bold text-yellow-600 uppercase mb-1">XP</p>
            <p className="text-2xl font-black text-yellow-600">+{reward?.xp || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex flex-col items-center">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Coins</p>
            <p className="text-2xl font-black text-blue-600">+{reward?.coins || 0}</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full max-w-xs bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all shadow-lg"
        >
          CONTINUE
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-2xl overflow-hidden relative border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400">✕</button>
        <div className="flex-1 mx-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="font-bold text-gray-400 text-xs">{currentIndex + 1}/{questions.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-black text-gray-800 mb-6 font-outfit">{currentQuestion.prompt}</h2>

        {currentQuestion.type === 'MULTIPLE_CHOICE' && (
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option: string) => {
              const isCorrectOption = isAnswered && option === currentQuestion.correctAnswer;
              const isWrongOption = isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer;
              return (
                <button
                  key={option}
                  disabled={isAnswered}
                  onClick={() => setSelectedOption(option)}
                  className={`p-5 rounded-xl border-2 text-left font-bold transition-all text-sm ${
                    selectedOption === option && !isAnswered ? 'border-yellow-400 bg-yellow-50 text-yellow-700' : 'border-gray-50 bg-white'
                  } ${isCorrectOption ? 'border-green-500 bg-green-50 text-green-700' : ''}
                  ${isWrongOption ? 'border-red-500 bg-red-50 text-red-700' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    {option}
                    {isCorrectOption && <span className="text-green-500">✓</span>}
                    {isWrongOption && <span className="text-red-500">✕</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'MATCH' && (
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.pairs.map((pair: any, idx: number) => (
              <React.Fragment key={idx}>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg font-bold text-gray-700 text-center text-sm">{pair.key}</div>
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg font-bold text-yellow-700 text-center text-sm">{pair.value}</div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            disabled={!selectedOption && currentQuestion.type === 'MULTIPLE_CHOICE'}
            className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:bg-gray-100 transition-all shadow-lg"
          >
            Check
          </button>
        ) : (
          <div className={`p-4 rounded-xl flex items-center justify-between animate-in zoom-in duration-300 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{isCorrect ? '✨' : '😅'}</span>
              <span className={`text-sm font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{isCorrect ? 'Correct!' : 'Try again!'}</span>
            </div>
            <button
              onClick={handleNext}
              className={`px-6 py-2 rounded-lg font-bold text-white shadow-md ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
