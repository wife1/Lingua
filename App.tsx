
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Language, Lesson, Badge, DailyGoal } from './types';
import { LANGUAGES, MOCK_LESSONS, MOCK_QUIZ_GREETINGS, MOCK_GOALS } from './constants';
import Sidebar from './components/Sidebar';
import LessonCard from './components/LessonCard';
import ChatInterface from './components/ChatInterface';
import Quiz from './components/Quiz';

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'First Word', description: 'Complete your first lesson', icon: '🌱', unlocked: false, requirement: 'lessons:1' },
  { id: 'b2', name: 'Coin Collector', description: 'Earn 3000 coins', icon: '💰', unlocked: false, requirement: 'coins:3000' },
  { id: 'b3', name: 'Streak Master', description: 'Maintain a 10 day streak', icon: '🔥', unlocked: true, requirement: 'streak:10' },
  { id: 'b4', name: 'Perfect Score', description: 'Get 100% on any quiz', icon: '🎯', unlocked: false, requirement: 'perfect:1' },
  { id: 'b5', name: 'Polyglot', description: 'Study 3 different languages', icon: '🌍', unlocked: false, requirement: 'langs:3' },
];

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showLessonDetail, setShowLessonDetail] = useState<Lesson | null>(null);
  const [showGrammarPop, setShowGrammarPop] = useState<Lesson | null>(null);
  const [confirmStart, setConfirmStart] = useState<Lesson | null>(null);
  const [showLanguageBoard, setShowLanguageBoard] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  
  const [streak, setStreak] = useState(12);
  const [coins, setCoins] = useState(2450);
  const [xp, setXp] = useState(12450);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(4);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [studiedLanguages, setStudiedLanguages] = useState<Set<string>>(new Set([LANGUAGES[0].id]));
  const [lastReward, setLastReward] = useState<{ coins: number, xp: number } | null>(null);
  const [newBadgeNotification, setNewBadgeNotification] = useState<Badge | null>(null);

  // Dynamic Lessons State for SRS and progress
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(MOCK_GOALS);

  const categories = useMemo(() => Array.from(new Set(lessons.map(l => l.category))), [lessons]);

  const filteredLessons = useMemo(() => {
    return lessons.filter(l => {
      const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            l.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter ? l.difficulty === difficultyFilter : true;
      const matchesCategory = categoryFilter ? l.category === categoryFilter : true;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [searchTerm, difficultyFilter, categoryFilter, lessons]);

  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter(l => 
      l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase())
    );
  }, [langSearch]);

  useEffect(() => {
    let changed = false;
    const updatedBadges = badges.map(badge => {
      if (badge.unlocked) return badge;
      
      const [type, val] = badge.requirement.split(':');
      const target = parseInt(val);
      let isUnlocked = false;

      switch(type) {
        case 'lessons': isUnlocked = completedLessonsCount >= target; break;
        case 'coins': isUnlocked = coins >= target; break;
        case 'streak': isUnlocked = streak >= target; break;
        case 'langs': isUnlocked = studiedLanguages.size >= target; break;
      }

      if (isUnlocked) {
        changed = true;
        setNewBadgeNotification(badge);
        return { ...badge, unlocked: true };
      }
      return badge;
    });

    if (changed) setBadges(updatedBadges);
  }, [coins, streak, completedLessonsCount, studiedLanguages, badges]);

  const handleLessonComplete = (score: number, total: number) => {
    const earnedCoins = Math.round((score / total) * 50) + 10;
    const earnedXp = Math.round((score / total) * 100) + 20;
    
    setCoins(prev => prev + earnedCoins);
    setXp(prev => prev + earnedXp);
    setCompletedLessonsCount(prev => prev + 1);
    setLastReward({ coins: earnedCoins, xp: earnedXp });

    // Update Lessons State for Progress and SRS
    setLessons(prev => prev.map(l => {
      if (l.id === activeLesson?.id) {
        const newProgress = Math.max(l.progress, Math.round((score / total) * 100));
        return { 
          ...l, 
          progress: newProgress, 
          needsReview: score < total, // Basic Spaced Repetition logic: if not perfect, mark for review
          lastScore: score
        };
      }
      return l;
    }));

    // Update daily goals
    setDailyGoals(prev => prev.map(g => {
      if (g.id === 'g1') return { ...g, current: Math.min(g.target, g.current + 1), completed: g.current + 1 >= g.target };
      if (g.id === 'g3') return { ...g, current: Math.min(g.target, g.current + earnedXp), completed: g.current + earnedXp >= g.target };
      return g;
    }));

    if (score === total) {
      const perfectBadge = badges.find(b => b.id === 'b4');
      if (perfectBadge && !perfectBadge.unlocked) {
        setBadges(prev => prev.map(b => b.id === 'b4' ? { ...b, unlocked: true } : b));
        setNewBadgeNotification(perfectBadge);
      }
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setStudiedLanguages(prev => new Set([...prev, lang.id]));
    setShowLanguageBoard(false);
  };

  const renderContent = () => {
    if (activeLesson) {
      return (
        <div className="h-full max-w-2xl mx-auto py-6">
          <Quiz 
            lesson={activeLesson}
            languageName={selectedLanguage.name}
            questions={MOCK_QUIZ_GREETINGS} 
            onComplete={(score) => handleLessonComplete(score, MOCK_QUIZ_GREETINGS.length)}
            onClose={() => {
              setActiveLesson(null);
              setLastReward(null);
            }} 
            reward={lastReward}
          />
        </div>
      );
    }

    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-colors" onClick={() => setShowLanguageBoard(true)}>
                <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-yellow-200">
                  {selectedLanguage.flag}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800 font-outfit">Learning {selectedLanguage.name}</h2>
                  <p className="text-gray-500 text-sm font-medium">Click to change language</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Streak</span>
                  <span className="text-lg font-black text-orange-600">🔥 {streak}</span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Coins</span>
                  <span className="text-lg font-black text-blue-600">💎 {coins}</span>
                </div>
              </div>
            </div>

            {/* Daily Goals Row */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyGoals.map(goal => (
                <div key={goal.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${goal.completed ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                    {goal.completed ? '✅' : goal.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${goal.completed ? 'text-green-600' : 'text-gray-700'}`}>{goal.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${goal.completed ? 'bg-green-500' : 'bg-yellow-400'}`}
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          />
                       </div>
                       <span className="text-[10px] font-bold text-gray-400">{goal.current}/{goal.target}</span>
                    </div>
                  </div>
                  {goal.completed && <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 text-white flex items-center justify-center text-[10px] font-black rounded-bl-xl">GOAL</div>}
                </div>
              ))}
            </section>

            {/* Courses Section */}
            <section>
              <div className="flex flex-col space-y-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-gray-800 font-outfit">Courses</h3>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-full uppercase">{lessons.length} Modules</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Search title or category..."
                      className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-yellow-400 transition-all w-full sm:w-72 shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center bg-white border border-gray-100 p-1 rounded-full shadow-sm">
                    <button 
                      onClick={() => setDifficultyFilter(null)}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-full transition-all uppercase tracking-widest ${!difficultyFilter ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setDifficultyFilter('Beginner')}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-full transition-all uppercase tracking-widest ${difficultyFilter === 'Beginner' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Beg
                    </button>
                    <button 
                      onClick={() => setDifficultyFilter('Intermediate')}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-full transition-all uppercase tracking-widest ${difficultyFilter === 'Intermediate' ? 'bg-sky-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Int
                    </button>
                    <button 
                      onClick={() => setDifficultyFilter('Advanced')}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-full transition-all uppercase tracking-widest ${difficultyFilter === 'Advanced' ? 'bg-violet-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Adv
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setCategoryFilter(null)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${!categoryFilter ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-100 shadow-sm'}`}
                    >
                      All Categories
                    </button>
                    {categories.slice(0, 10).map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${categoryFilter === cat ? 'bg-yellow-400 text-yellow-900 border-yellow-400 shadow-sm' : 'bg-white text-gray-500 border-gray-100 shadow-sm hover:border-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredLessons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLessons.map(lesson => (
                    <LessonCard 
                      key={lesson.id} 
                      lesson={lesson} 
                      onClick={() => setShowLessonDetail(lesson)} 
                      onShowGrammar={() => setShowGrammarPop(lesson)}
                      onPracticeVocab={() => setConfirmStart(lesson)} // Vocational practice starts same quiz for now
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                   <div className="text-6xl mb-4 opacity-20">🔎</div>
                   <p className="text-gray-400 font-bold">No modules found matching these criteria.</p>
                   <button onClick={() => {setSearchTerm(''); setDifficultyFilter(null); setCategoryFilter(null);}} className="text-yellow-600 text-sm mt-3 font-black uppercase tracking-widest hover:underline">Reset Filters</button>
                </div>
              )}
            </section>
          </div>
        );

      case AppView.REVIEW:
        const completedLessons = lessons.filter(l => l.progress > 0);
        const reviewRequired = lessons.filter(l => l.needsReview);
        
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
            <h2 className="text-3xl font-black text-gray-800 font-outfit">Review Hub</h2>
            
            {reviewRequired.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-red-500 mb-4 font-outfit flex items-center gap-2">
                  <span>⚠️</span> Modules for Spaced Repetition
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reviewRequired.map(l => (
                    <div key={l.id} className="bg-white p-5 rounded-3xl border border-red-100 shadow-sm flex items-center justify-between group hover:border-red-400 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${l.color} rounded-2xl flex items-center justify-center text-3xl shadow-sm`}>{l.icon}</div>
                        <div>
                          <p className="font-black text-gray-800 text-lg leading-tight">{l.title}</p>
                          <p className="text-[10px] text-red-400 uppercase font-black tracking-widest">Needs practice</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setConfirmStart(l)}
                        className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-red-600 transition-all shadow-md active:scale-95 uppercase"
                      >
                        RETRY
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-xl font-bold text-gray-800 mb-6 font-outfit flex items-center gap-2">
                <span>📘</span> Grammar Bank
              </h3>
              {completedLessons.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {completedLessons.map(l => l.grammarNotes ? (
                    <div key={l.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-yellow-200 transition-all group">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{l.icon}</span>
                        <h4 className="font-black text-gray-800 text-lg">{l.title}</h4>
                        <span className="px-2 py-0.5 bg-gray-50 text-gray-300 text-[9px] font-black uppercase ml-auto tracking-widest rounded">Grammar Card</span>
                      </div>
                      <p className="text-gray-600 italic leading-relaxed bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50">
                        {l.grammarNotes}
                      </p>
                    </div>
                  ) : null)}
                </div>
              ) : (
                <div className="bg-gray-50/50 p-16 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-black text-lg">Complete modules to unlock your Grammar Bank!</p>
                  <button onClick={() => setView(AppView.DASHBOARD)} className="mt-4 text-yellow-600 font-bold hover:underline">Go to Learn ➔</button>
                </div>
              )}
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-800 mb-6 font-outfit flex items-center gap-2">
                <span>🗂️</span> Vocabulary Masterlist
              </h3>
              <div className="flex flex-wrap gap-2">
                {completedLessons.flatMap(l => l.vocabulary || []).map((vocab, i) => (
                  <div key={i} className="bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm text-sm font-black text-gray-700 hover:border-yellow-400 hover:bg-yellow-50 transition-all cursor-default animate-in fade-in zoom-in duration-300">
                    {vocab}
                  </div>
                ))}
                {completedLessons.length === 0 && (
                  <p className="text-gray-400 italic font-bold">No vocabulary collected yet. Start learning to see them here!</p>
                )}
              </div>
            </section>
          </div>
        );
      
      case AppView.CHAT:
        return (
          <div className="h-full max-w-3xl mx-auto py-2 flex flex-col animate-in fade-in duration-300">
            <h2 className="text-3xl font-black text-gray-800 mb-6 font-outfit">AI Conversation</h2>
            <div className="flex-1">
              <ChatInterface language={selectedLanguage} />
            </div>
          </div>
        );

      case AppView.PROFILE:
        return (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
             <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                   <span className="text-[12rem] select-none">👤</span>
                </div>
                
                <div className="w-28 h-28 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl border-8 border-white shadow-2xl relative z-10 animate-pulse-slow">
                  👤
                </div>
                <h2 className="text-3xl font-black text-gray-800 font-outfit relative z-10">Language Explorer</h2>
                <p className="text-gray-400 font-bold mb-10 relative z-10 uppercase tracking-widest text-xs">Fluent in potential • Since 2024</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <div className="bg-gray-50/50 p-6 rounded-3xl text-left border border-gray-100 transition-transform hover:scale-105">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">XP Points</p>
                    <p className="text-3xl font-black text-gray-800">{xp.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50/50 p-6 rounded-3xl text-left border border-gray-100 transition-transform hover:scale-105">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Coins</p>
                    <p className="text-3xl font-black text-gray-800">{coins.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50/50 p-6 rounded-3xl text-left border border-gray-100 transition-transform hover:scale-105">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Modules</p>
                    <p className="text-3xl font-black text-gray-800">{completedLessonsCount}</p>
                  </div>
                  <div className="bg-gray-50/50 p-6 rounded-3xl text-left border border-gray-100 transition-transform hover:scale-105">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Langs</p>
                    <p className="text-3xl font-black text-gray-800">{studiedLanguages.size}</p>
                  </div>
                </div>

                <div className="text-left">
                  <h4 className="text-xl font-black text-gray-800 mb-8 font-outfit flex items-center gap-2">
                    <span>🏆</span> Achievement Hall
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {badges.map(badge => (
                      <div 
                        key={badge.id} 
                        className={`p-6 rounded-[2rem] flex flex-col items-center text-center transition-all duration-500 border-2 ${
                          badge.unlocked 
                          ? 'bg-white border-yellow-200 shadow-xl scale-100 opacity-100 hover:rotate-3' 
                          : 'bg-gray-100 border-transparent opacity-30 grayscale'
                        }`}
                        title={badge.description}
                      >
                        <span className={`text-5xl mb-3 ${badge.unlocked ? 'animate-bounce-short' : ''}`}>
                          {badge.icon}
                        </span>
                        <span className="text-[11px] font-black text-gray-800 leading-tight uppercase tracking-tight">
                          {badge.name}
                        </span>
                        {!badge.unlocked && (
                          <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-400 w-1/4"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      <Sidebar currentView={currentView} setView={setView} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#fdfcf6] relative pb-24 md:pb-8 pt-6 px-4 sm:px-8">
        {!activeLesson && (
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-yellow-200 transition-all group" onClick={() => setShowLanguageBoard(true)}>
              <span className="text-xl group-hover:scale-125 transition-transform duration-300">{selectedLanguage.flag}</span>
              <span className="font-black text-gray-800 text-sm">{selectedLanguage.name}</span>
              <span className="text-gray-300 ml-1 text-xs">▼</span>
            </div>
          </div>
        )}

        <div className="h-full">
          {renderContent()}
        </div>

        {/* Start Confirmation Modal */}
        {confirmStart && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
            <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl scale-in-center border-t-8 border-yellow-400">
              <div className="text-7xl mb-6 animate-bounce-short drop-shadow-lg">{confirmStart.icon}</div>
              <h3 className="text-2xl font-black text-gray-800 mb-2 font-outfit">Begin Journey?</h3>
              <p className="text-gray-500 mb-10 leading-relaxed font-medium">Study <span className="text-yellow-600 font-black">{confirmStart.title}</span>? Our monkey tutor is ready!</p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    setActiveLesson(confirmStart);
                    setConfirmStart(null);
                  }}
                  className="w-full bg-yellow-400 text-yellow-900 font-black py-5 rounded-[1.5rem] hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-100 text-lg active:scale-95"
                >
                  START NOW! 🚀
                </button>
                <button 
                  onClick={() => setConfirmStart(null)}
                  className="w-full bg-gray-50 text-gray-400 font-black py-4 rounded-[1.5rem] hover:bg-gray-100 hover:text-gray-600 transition-all uppercase tracking-widest text-xs"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Improved Language Selector Modal */}
        {showLanguageBoard && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white rounded-[3.5rem] w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl scale-in-center mx-4 overflow-hidden border-8 border-yellow-400">
                 <div className="p-10 border-b border-gray-100 bg-yellow-50/30">
                    <div className="flex justify-between items-center mb-8">
                       <h2 className="text-4xl font-black text-gray-800 font-outfit tracking-tight">Select Target Language</h2>
                       <button onClick={() => setShowLanguageBoard(false)} className="bg-white w-12 h-12 rounded-2xl shadow-sm text-gray-300 hover:text-red-500 text-2xl flex items-center justify-center transition-all hover:rotate-90">✕</button>
                    </div>
                    <div className="relative group">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-125 transition-transform duration-300">🌐</span>
                       <input 
                        type="text" 
                        placeholder="Search 50+ languages..."
                        className="w-full pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-yellow-400/20 shadow-sm transition-all text-xl font-bold placeholder:text-gray-300"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                       />
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-gray-50/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                       {filteredLanguages.map(lang => (
                          <button
                            key={lang.id}
                            onClick={() => handleLanguageChange(lang)}
                            className={`p-6 rounded-[2.5rem] flex items-center gap-5 border-2 transition-all group relative overflow-hidden ${
                              selectedLanguage.id === lang.id 
                              ? 'border-yellow-400 bg-yellow-50 shadow-lg shadow-yellow-100' 
                              : 'border-white hover:border-yellow-200 hover:bg-white bg-white shadow-sm'
                            }`}
                          >
                             <span className="text-5xl group-hover:scale-125 transition-transform duration-500 drop-shadow-md z-10">{lang.flag}</span>
                             <div className="text-left flex-1 min-w-0 z-10">
                                <p className="font-black text-gray-800 truncate leading-tight text-lg">{lang.name}</p>
                                <p className="text-[10px] text-gray-400 font-black truncate tracking-widest uppercase">{lang.nativeName}</p>
                             </div>
                             {selectedLanguage.id === lang.id && (
                               <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white shadow-sm z-10">
                                  <span className="font-black">✓</span>
                               </div>
                             )}
                             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                          </button>
                       ))}
                       {filteredLanguages.length === 0 && (
                         <div className="col-span-full py-24 text-center">
                            <div className="text-8xl mb-6 animate-bounce-short">🤔</div>
                            <p className="text-gray-400 font-black text-2xl uppercase tracking-tighter">No dialect found!</p>
                            <button onClick={() => setLangSearch('')} className="text-yellow-600 font-black mt-4 hover:underline uppercase tracking-widest text-sm">Clear Filter</button>
                         </div>
                       )}
                    </div>
                 </div>
                 <div className="p-8 bg-white text-center border-t border-gray-100 flex items-center justify-center gap-3">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interactive Lessons • AI Tutors • Community Driven</p>
                 </div>
              </div>
           </div>
        )}

        {/* Lesson Detail Modal */}
        {showLessonDetail && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
              <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl scale-in-center overflow-y-auto max-h-[90vh] custom-scrollbar border-t-[12px] border-yellow-400">
                 <div className="flex justify-between items-start mb-8">
                    <div className={`w-24 h-24 ${showLessonDetail.color} rounded-[2rem] flex items-center justify-center text-6xl shadow-xl relative animate-in zoom-in duration-500`}>
                      {showLessonDetail.icon}
                      {showLessonDetail.needsReview && <span className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-md animate-pulse"></span>}
                    </div>
                    <button onClick={() => setShowLessonDetail(null)} className="text-gray-300 hover:text-red-500 text-3xl transition-colors p-2">✕</button>
                 </div>
                 <h3 className="text-4xl font-black text-gray-800 mb-3 font-outfit tracking-tight leading-tight">{showLessonDetail.title}</h3>
                 <div className="flex gap-3 mb-8">
                    <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">{showLessonDetail.category}</span>
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">{showLessonDetail.difficulty}</span>
                 </div>

                 <div className="mb-10 space-y-6">
                   <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 shadow-inner">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-4 h-1 bg-yellow-400 rounded-full"></span>
                        Key Vocabulary
                      </p>
                      <ul className="space-y-3">
                        {showLessonDetail.vocabulary?.map((v, i) => (
                          <li key={i} className="text-base font-bold text-gray-700 flex items-center gap-3 group">
                            <span className="w-2.5 h-2.5 bg-white border-2 border-yellow-400 rounded-full group-hover:bg-yellow-400 transition-colors"></span> 
                            {v}
                          </li>
                        ))}
                      </ul>
                   </div>
                   {showLessonDetail.grammarNotes && (
                      <div className="p-6 bg-sky-50 rounded-[2rem] border border-sky-100 shadow-sm">
                        <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-3">Grammar Breakdown</p>
                        <p className="text-sm text-sky-700 leading-relaxed italic font-medium">"{showLessonDetail.grammarNotes}"</p>
                      </div>
                   )}
                 </div>

                 <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => {
                        setConfirmStart(showLessonDetail);
                        setShowLessonDetail(null);
                      }}
                      className="w-full bg-yellow-400 text-yellow-900 font-black py-6 rounded-[1.5rem] hover:bg-yellow-500 transition-all shadow-2xl shadow-yellow-200 flex items-center justify-center gap-4 text-xl active:scale-95"
                    >
                      {showLessonDetail.progress > 0 ? 'CONTINUE LEARNING' : 'START MODULE'}
                      <span className="text-2xl">➔</span>
                    </button>
                    {showLessonDetail.progress === 100 && (
                       <p className="text-center text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                          <span className="animate-pulse">✨</span> Mastery Achieved <span className="animate-pulse">✨</span>
                       </p>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* Grammar Pop-up (Refined) */}
        {showGrammarPop && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
             <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl scale-in-center border-t-[10px] border-blue-400">
                <div className="text-center mb-8">
                   <div className="w-20 h-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">📖</div>
                   <h3 className="text-3xl font-black text-gray-800 font-outfit tracking-tight">Grammar Guide</h3>
                   <p className="text-xs text-gray-400 mt-2 uppercase font-black tracking-widest">{showGrammarPop.title}</p>
                </div>
                <div className="bg-blue-50/50 p-8 rounded-[2rem] mb-10 border border-blue-100/50">
                   <p className="text-blue-900 leading-relaxed italic font-bold text-lg">
                     "{showGrammarPop.grammarNotes}"
                   </p>
                </div>
                <button 
                  onClick={() => setShowGrammarPop(null)}
                  className="w-full bg-gray-800 text-white font-black py-5 rounded-[1.25rem] hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm"
                >
                  DISMISS
                </button>
             </div>
          </div>
        )}

        {/* Badge Notifications (Refined) */}
        {newBadgeNotification && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300 px-4">
            <div className="bg-white rounded-[3.5rem] p-12 max-w-sm w-full text-center shadow-[0_30px_60px_-15px_rgba(250,204,21,0.3)] scale-in-center border-4 border-yellow-400 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200"></div>
              <div className="text-9xl mb-8 animate-bounce-short drop-shadow-2xl">
                {newBadgeNotification.icon}
              </div>
              <h3 className="text-3xl font-black text-gray-800 mb-2 font-outfit">Tier Unlocked!</h3>
              <p className="text-xl font-black text-yellow-500 mb-6 uppercase tracking-tight">{newBadgeNotification.name}</p>
              <div className="p-6 bg-gray-50 rounded-[2rem] mb-10 shadow-inner">
                <p className="text-gray-500 font-medium leading-relaxed">{newBadgeNotification.description}</p>
              </div>
              <button 
                onClick={() => setNewBadgeNotification(null)}
                className="w-full bg-gray-800 text-white font-black py-5 rounded-[1.5rem] hover:bg-black transition-all shadow-xl active:scale-95 text-lg"
              >
                PROCEED
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
