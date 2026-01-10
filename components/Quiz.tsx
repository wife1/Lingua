
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

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      // Keep answered state for navigation purposes? Usually quizzes lock answers.
      // For this study app, we'll reset to allow re-trying but we won't deduct score twice.
      resetQuestionState();
    }
  };

  const handleSkip = () => {
    if (!isAnswered && currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
    } else if (!isAnswered && currentIndex === questions.length - 1) {
      setIsFinished(true);
      onComplete(score);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setAiFeedback(null);
    resetQuestionState();
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
      <div className="flex flex-col items-center justify-start p-8 text-center h-full animate-in fade-in zoom-in duration-500 overflow-y-auto custom-scrollbar">
        <div className="text-8xl mb-6 animate-bounce-short">🎉</div>
        <h2 className="text-3xl font-black text-gray-800 mb-2 font-outfit">Lesson Complete!</h2>
        <p className="text-gray-500 mb-8">Excellent progress in {languageName}!</p>
        
        {/* AI Personalized Feedback */}
        <div className="w-full max-w-sm mb-8">
           <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 text-white text-left shadow-lg relative overflow-hidden">
              <div className="absolute top-2 right-4 text-4xl opacity-20">🐒</div>
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Teacher Feedback</p>
              {isLoadingFeedback ? (
                <div className="flex gap-2 items-center py-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
                </div>
              ) : (
                <p className="text-lg font-bold italic leading-tight">
                  {aiFeedback}
                </p>
              )}
           </div>
        </div>

        {/* Completion Summary */}
        <div className="w-full max-w-sm mb-8 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 text-left">
            <h4 className="font-black text-gray-800 mb-4 font-outfit flex items-center gap-2">
              <span>📖</span> Lesson Summary
            </h4>
            <div className="space-y-4">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Key Grammar</p>
                  <p className="text-sm text-gray-600 italic">"{lesson.grammarNotes}"</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vocabulary Mastered</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lesson.vocabulary?.map((v, i) => (
                      <span key={i} className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100">
                        {v}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
          <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 flex flex-col items-center">
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">XP Gained</p>
            <p className="text-3xl font-black text-yellow-600">+{reward?.xp || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col items-center">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Coins</p>
            <p className="text-3xl font-black text-blue-600">+{reward?.coins || 0}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs pb-8">
          <button 
            onClick={onClose}
            className="bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-900 transition-all shadow-xl"
          >
            BACK TO DASHBOARD
          </button>
          <button 
            onClick={handleRetry}
            className="text-gray-500 font-bold py-2 hover:text-gray-800 transition-colors"
          >
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-3xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
          ✕
        </button>
        <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="font-bold text-gray-400 text-sm">{currentIndex + 1}/{questions.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl font-black text-gray-800 mb-8 font-outfit">{currentQuestion.prompt}</h2>

        {currentQuestion.type === 'MULTIPLE_CHOICE' && (
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option: string) => {
              const isCorrectOption = isAnswered && option === currentQuestion.correctAnswer;
              const isWrongOption = isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer;
              
              return (
                <button
                  key={option}
                  disabled={isAnswered}
                  onClick={() => setSelectedOption(option)}
                  className={`p-6 rounded-2xl border-2 text-left font-bold transition-all relative ${
                    selectedOption === option && !isAnswered
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-700' 
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  } ${isCorrectOption ? 'border-green-500 bg-green-50 text-green-700 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : ''}
                  ${isWrongOption ? 'border-red-500 bg-red-50 text-red-700 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}`}
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
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.pairs.map((pair: any, idx: number) => (
              <React.Fragment key={idx}>
                <div className="p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-700 text-center">
                  {pair.key}
                </div>
                <div className="p-4 bg-yellow-50 border-2 border-yellow-100 rounded-xl font-bold text-yellow-700 text-center">
                  {pair.value}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {!isAnswered ? (
          <div className="flex gap-4">
             <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all disabled:opacity-30"
            >
              BACK
            </button>
             <button
              onClick={handleSkip}
              className="px-6 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
            >
              SKIP
            </button>
            <button
              onClick={checkAnswer}
              disabled={!selectedOption && currentQuestion.type === 'MULTIPLE_CHOICE'}
              className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:bg-gray-200 transition-all shadow-xl"
            >
              CHECK ANSWER
            </button>
          </div>
        ) : (
          <div className={`p-4 rounded-2xl flex items-center justify-between animate-bounce-short ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{isCorrect ? '✨' : '😅'}</span>
              <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Awesome! Correct.' : 'Oops! Look above for the correct one.'}
              </span>
            </div>
            <button
              onClick={handleNext}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {currentIndex === questions.length - 1 ? 'FINISH' : 'NEXT'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
