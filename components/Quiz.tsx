
import React, { useState, useEffect } from 'react';
import { Question, Lesson, Language } from '../types';
import { generateLessonFeedback } from '../services/geminiService';

interface QuizProps {
  questions: any[];
  onComplete: (score: number) => void;
  onClose: () => void;
  reward?: { coins: number, xp: number } | null;
  lesson: Lesson;
  language?: Language;
  languageName?: string; // Kept for backward compat
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onClose, reward, lesson, language, languageName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Multiple Choice / Match State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Text Input State (Translate/FillBlank)
  const [textInput, setTextInput] = useState('');

  // Arrange State
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);

  // General State
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isListening, setIsListening] = useState(false); // For speaking quiz

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    // Initialize specific question states when question changes
    if (currentQuestion.type === 'ARRANGE') {
      setAvailableWords([...(currentQuestion.options || [])]);
      setArrangedWords([]);
    } else if (currentQuestion.type === 'TRANSLATE' || currentQuestion.type === 'FILL_IN_BLANK') {
      setTextInput('');
    } else {
      setSelectedOption(null);
    }
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    if (isFinished && !aiFeedback && !isLoadingFeedback) {
      const getFeedback = async () => {
        setIsLoadingFeedback(true);
        try {
            // Prefer passing the explicit language name if available
          const lang = language ? language.name : (languageName || 'English');
          const feedback = await generateLessonFeedback(score, questions.length, lang);
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
  }, [isFinished, score, questions.length, language, languageName, aiFeedback, isLoadingFeedback]);

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
    setTextInput('');
    setArrangedWords([]);
    setAvailableWords([]);
    setIsAnswered(false);
    setIsCorrect(null);
    setIsListening(false);
  };

  const handleWordClick = (word: string, from: 'pool' | 'arranged') => {
    if (isAnswered) return;

    if (from === 'pool') {
      setAvailableWords(prev => {
        const idx = prev.indexOf(word);
        if (idx === -1) return prev;
        const newArr = [...prev];
        newArr.splice(idx, 1);
        return newArr;
      });
      setArrangedWords(prev => [...prev, word]);
    } else {
      setArrangedWords(prev => {
        const idx = prev.indexOf(word);
        if (idx === -1) return prev;
        const newArr = [...prev];
        newArr.splice(idx, 1);
        return newArr;
      });
      setAvailableWords(prev => [...prev, word]);
    }
  };

  const playAudio = (text: string) => {
      if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(text);
          if (language) u.lang = language.id;
          window.speechSynthesis.speak(u);
      }
  };

  const simulateListening = () => {
      setIsListening(true);
      setTimeout(() => {
          setIsListening(false);
          // Auto-fill correct answer for demo
          setTextInput(currentQuestion.correctAnswer as string);
      }, 1500);
  };

  const checkAnswer = () => {
    let correct = false;

    switch (currentQuestion.type) {
        case 'MULTIPLE_CHOICE':
        case 'TRUE_FALSE':
        case 'LISTENING':
        case 'EMOJI_MATCH':
            correct = selectedOption === currentQuestion.correctAnswer;
            break;
        case 'MATCH':
            correct = true; // Demo simplification
            break;
        case 'TRANSLATE':
        case 'FILL_IN_BLANK':
        case 'SPEAKING':
            correct = textInput.trim().toLowerCase() === (currentQuestion.correctAnswer as string).toLowerCase();
            break;
        case 'ARRANGE':
            correct = arrangedWords.join(' ') === currentQuestion.correctAnswer;
            break;
    }

    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    setIsAnswered(true);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-start p-6 text-center h-full animate-in fade-in scale-in-center duration-500 overflow-y-auto custom-scrollbar">
        <div className="text-6xl mb-4 animate-bounce-short">🎉</div>
        <h2 className="text-2xl font-black text-gray-800 mb-1 font-outfit">Complete!</h2>
        <p className="text-gray-500 text-sm mb-6">Excellent progress!</p>
        
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

        {/* --- LISTENING TYPE --- */}
        {currentQuestion.type === 'LISTENING' && (
            <div className="flex flex-col items-center gap-6 mb-6">
                <button 
                  onClick={() => playAudio(currentQuestion.audioText || currentQuestion.correctAnswer)}
                  className="w-24 h-24 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl shadow-lg transition-all active:scale-95 animate-pulse-slow"
                >
                    🔊
                </button>
                <div className="grid grid-cols-2 gap-3 w-full">
                    {currentQuestion.options.map((option: string) => (
                         <button
                         key={option}
                         disabled={isAnswered}
                         onClick={() => setSelectedOption(option)}
                         className={`p-4 rounded-xl border-2 font-bold transition-all text-sm ${
                           selectedOption === option && !isAnswered ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-50 bg-white'
                         } ${isAnswered && option === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : ''}`}
                       >
                         {option}
                       </button>
                    ))}
                </div>
            </div>
        )}

        {/* --- SPEAKING TYPE --- */}
        {currentQuestion.type === 'SPEAKING' && (
             <div className="flex flex-col items-center gap-8 mb-6 mt-10">
                <div className="text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Tap & Hold to Speak</p>
                    <button 
                    onClick={simulateListening}
                    disabled={isListening || isAnswered}
                    className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl shadow-xl transition-all border-8 ${
                        isListening 
                        ? 'bg-red-500 border-red-200 text-white scale-110' 
                        : isAnswered 
                            ? 'bg-green-500 border-green-200 text-white'
                            : 'bg-white border-gray-100 text-gray-300 hover:border-blue-100 hover:text-blue-400'
                    }`}
                    >
                    {isListening ? '🎤' : isAnswered ? '✓' : '🎙️'}
                    </button>
                </div>
                {textInput && <p className="text-2xl font-bold text-gray-800">"{textInput}"</p>}
             </div>
        )}

        {/* --- MULTIPLE CHOICE / TRUE_FALSE / EMOJI_MATCH --- */}
        {(currentQuestion.type === 'MULTIPLE_CHOICE' || currentQuestion.type === 'TRUE_FALSE' || currentQuestion.type === 'EMOJI_MATCH') && (
          <div className={`grid ${currentQuestion.type === 'EMOJI_MATCH' ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
            {currentQuestion.options ? currentQuestion.options.map((option: string) => {
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
                  ${isWrongOption ? 'border-red-500 bg-red-50 text-red-700' : ''}
                  ${currentQuestion.type === 'EMOJI_MATCH' ? 'text-center text-4xl py-8' : ''}`}
                >
                  <div className={`flex ${currentQuestion.type === 'EMOJI_MATCH' ? 'justify-center' : 'justify-between'} items-center`}>
                    {option}
                    {currentQuestion.type !== 'EMOJI_MATCH' && (
                        <>
                        {isCorrectOption && <span className="text-green-500">✓</span>}
                        {isWrongOption && <span className="text-red-500">✕</span>}
                        </>
                    )}
                  </div>
                </button>
              );
            }) : (
                // Fallback for True/False if options not provided (though generator does)
                ['True', 'False'].map(opt => (
                     <button key={opt} onClick={() => setSelectedOption(opt)} className="p-4 border rounded-xl">{opt}</button>
                ))
            )}
          </div>
        )}

        {/* --- MATCH --- */}
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

        {/* --- TRANSLATE / FILL_IN_BLANK --- */}
        {(currentQuestion.type === 'TRANSLATE' || currentQuestion.type === 'FILL_IN_BLANK') && (
          <div className="space-y-4">
            <input 
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isAnswered}
              placeholder={currentQuestion.type === 'FILL_IN_BLANK' ? "Type the missing word..." : "Type your answer..."}
              className={`w-full p-5 rounded-xl border-2 outline-none font-bold transition-all text-lg ${
                isAnswered 
                  ? isCorrect 
                    ? 'border-green-500 bg-green-50 text-green-800' 
                    : 'border-red-500 bg-red-50 text-red-800'
                  : 'border-gray-200 focus:border-yellow-400 bg-gray-50 focus:bg-white'
              }`}
            />
            {currentQuestion.type === 'FILL_IN_BLANK' && currentQuestion.options && !isAnswered && (
                <div className="flex gap-2 flex-wrap">
                    {currentQuestion.options.map((opt: string) => (
                        <button 
                            key={opt}
                            onClick={() => setTextInput(opt)}
                            className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold hover:bg-gray-200"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
            {isAnswered && !isCorrect && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Correct Answer</p>
                <p className="text-red-700 font-bold">{currentQuestion.correctAnswer}</p>
              </div>
            )}
          </div>
        )}

        {currentQuestion.type === 'ARRANGE' && (
          <div className="space-y-8">
            {/* Answer Area */}
            <div className={`min-h-[80px] p-4 rounded-xl border-2 flex flex-wrap gap-2 items-center content-start transition-all ${
              isAnswered 
                ? isCorrect 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              {arrangedWords.length === 0 && !isAnswered && (
                <span className="text-gray-400 font-medium text-sm italic w-full text-center">Tap words below to arrange</span>
              )}
              {arrangedWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleWordClick(word, 'arranged')}
                  disabled={isAnswered}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg font-bold text-sm shadow-sm hover:border-red-200 transition-all animate-in zoom-in duration-200"
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Word Pool */}
            <div className="flex flex-wrap gap-2 justify-center">
              {availableWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleWordClick(word, 'pool')}
                  disabled={isAnswered}
                  className="px-4 py-3 bg-white border-b-4 border-gray-200 rounded-xl font-bold text-gray-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                  {word}
                </button>
              ))}
            </div>

            {isAnswered && !isCorrect && (
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Correct Order</p>
                <p className="text-gray-800 font-bold">{currentQuestion.correctAnswer}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            disabled={
              ((currentQuestion.type === 'MULTIPLE_CHOICE' || currentQuestion.type === 'TRUE_FALSE' || currentQuestion.type === 'EMOJI_MATCH' || currentQuestion.type === 'LISTENING') && !selectedOption) ||
              ((currentQuestion.type === 'TRANSLATE' || currentQuestion.type === 'FILL_IN_BLANK' || currentQuestion.type === 'SPEAKING') && !textInput.trim()) ||
              (currentQuestion.type === 'ARRANGE' && arrangedWords.length === 0)
            }
            className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:bg-gray-100 transition-all shadow-lg active:scale-95"
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
              {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
