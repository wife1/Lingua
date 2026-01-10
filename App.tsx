
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Language, Lesson, Badge, DailyGoal } from './types';
import { LANGUAGES, INITIAL_LESSON_DATA, MOCK_QUIZ_GREETINGS, MOCK_GOALS } from './constants';
import Sidebar from './components/Sidebar';
import LessonCard from './components/LessonCard';
import ChatInterface from './components/ChatInterface';
import Quiz from './components/Quiz';
import VocabPractice from './components/VocabPractice';

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
  const [activeVocabLesson, setActiveVocabLesson] = useState<Lesson | null>(null);
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

  const [allLanguageLessons, setAllLanguageLessons] = useState<Record<string, Lesson[]>>({
    [LANGUAGES[0].id]: INITIAL_LESSON_DATA()
  });

  const lessons = useMemo(() => {
    return allLanguageLessons[selectedLanguage.id] || INITIAL_LESSON_DATA();
  }, [allLanguageLessons, selectedLanguage.id]);

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

    const updatedLessons = lessons.map(l => {
      if (l.id === activeLesson?.id) {
        const newProgress = Math.max(l.progress, Math.round((score / total) * 100));
        return { ...l, progress: newProgress, needsReview: score < total, lastScore: score };
      }
      return l;
    });

    setAllLanguageLessons(prev => ({ ...prev, [selectedLanguage.id]: updatedLessons }));
    setDailyGoals(prev => prev.map(g => {
      if (g.id === 'g1') return { ...g, current: Math.min(g.target, g.current + 1), completed: g.current + 1 >= g.target };
      if (g.id === 'g3') return { ...g, current: Math.min(g.target, g.current + earnedXp), completed: g.current + earnedXp >= g.target };
      return g;
    }));
  };

  const handleRating = (lessonId: string, rating: number) => {
    const updatedLessons = lessons.map(l => l.id === lessonId ? { ...l, rating } : l);
    setAllLanguageLessons(prev => ({ ...prev, [selectedLanguage.id]: updatedLessons }));
  };

  const handleVocabComplete = (earnedXp: number) => {
    setXp(prev => prev + earnedXp);
    setActiveVocabLesson(null);
  };

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setStudiedLanguages(prev => new Set([...prev, lang.id]));
    if (!allLanguageLessons[lang.id]) {
      setAllLanguageLessons(prev => ({ ...prev, [lang.id]: INITIAL_LESSON_DATA() }));
    }
    setShowLanguageBoard(false);
  };

  const renderContent = () => {
    if (activeLesson) {
      return (
        <div className="h-full max-w-2xl mx-auto py-4">
          <Quiz 
            lesson={activeLesson}
            languageName={selectedLanguage.name}
            questions={MOCK_QUIZ_GREETINGS} 
            onComplete={(score) => handleLessonComplete(score, MOCK_QUIZ_GREETINGS.length)}
            onClose={() => { setActiveLesson(null); setLastReward(null); }} 
            reward={lastReward}
          />
        </div>
      );
    }

    if (activeVocabLesson) {
      return (
        <div className="h-full max-w-xl mx-auto py-8">
           <VocabPractice 
             lesson={activeVocabLesson}
             onClose={() => setActiveVocabLesson(null)}
             onComplete={handleVocabComplete}
           />
        </div>
      );
    }

    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all group" onClick={() => setShowLanguageBoard(true)}>
                <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition-transform">
                  {selectedLanguage.flag}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800 font-outfit">Learning {selectedLanguage.name}</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Change language</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                  <span className="text-[10px] font-black text-orange-400 uppercase">Streak</span>
                  <span className="text-lg font-black text-orange-600">🔥 {streak}</span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-black text-blue-400 uppercase">Coins</span>
                  <span className="text-lg font-black text-blue-600">💎 {coins}</span>
                </div>
              </div>
            </div>

            {/* Daily Goals Row */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyGoals.map(goal => (
                <div key={goal.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${goal.completed ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                    {goal.completed ? '✅' : goal.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-black uppercase ${goal.completed ? 'text-green-600' : 'text-gray-700'}`}>{goal.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${goal.completed ? 'bg-green-500' : 'bg-yellow-400'}`}
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          />
                       </div>
                       <span className="text-[9px] font-black text-gray-400">{goal.current}/{goal.target}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Courses Section */}
            <section>
              <div className="flex flex-col space-y-4 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-2xl font-black text-gray-800 font-outfit tracking-tight">Modules</h3>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Find a topic..."
                      className="pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-full text-sm font-medium outline-none focus:ring-4 focus:ring-yellow-400/10 transition-all w-full sm:w-72 shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center bg-white border border-gray-100 p-1 rounded-full shadow-sm">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
                      <button 
                        key={d}
                        onClick={() => setDifficultyFilter(d === 'All' ? null : d)}
                        className={`px-4 py-1.5 text-[10px] font-black rounded-full transition-all uppercase tracking-wider ${
                          (d === 'All' && !difficultyFilter) || difficultyFilter === d 
                          ? 'bg-gray-800 text-white shadow-md' 
                          : 'text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {d.substring(0, 3)}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar max-w-full">
                    <button 
                      onClick={() => setCategoryFilter(null)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                        !categoryFilter ? 'bg-yellow-400 text-yellow-900 border-yellow-400 shadow-sm' : 'bg-white text-gray-500 border-gray-100'
                      }`}
                    >
                      All
                    </button>
                    {categories.slice(0, 12).map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border whitespace-nowrap ${
                          categoryFilter === cat ? 'bg-yellow-400 text-yellow-900 border-yellow-400 shadow-sm' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map(lesson => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    onClick={() => setShowLessonDetail(lesson)} 
                    onShowGrammar={() => setShowGrammarPop(lesson)}
                    onPracticeVocab={() => setActiveVocabLesson(lesson)}
                    onRate={handleRating}
                  />
                ))}
              </div>
            </section>
          </div>
        );

      case AppView.REVIEW:
        const reviewRequired = lessons.filter(l => l.needsReview);
        const grammarLessons = lessons.filter(l => l.grammarNotes);
        
        return (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
            <h2 className="text-3xl font-black text-gray-800 font-outfit tracking-tight">Review Hub</h2>
            
            {reviewRequired.length > 0 && (
              <section>
                <h3 className="text-xl font-black text-red-500 mb-6 font-outfit flex items-center gap-3">
                  <span className="w-2.5 h-8 bg-red-500 rounded-full"></span>
                  Ready for Review
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviewRequired.map(l => (
                    <div key={l.id} className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between group hover:border-red-400 transition-all hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${l.color} rounded-xl flex items-center justify-center text-3xl shadow-sm`}>{l.icon}</div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 leading-tight truncate">{l.title}</p>
                          <p className="text-[9px] text-red-400 uppercase font-black tracking-widest mt-1">Reviewing Now</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setConfirmStart(l)}
                        className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-red-600 transition-all shadow-md active:scale-95 uppercase"
                      >
                        Retry
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-800 font-outfit flex items-center gap-3">
                  <span className="w-2.5 h-8 bg-blue-500 rounded-full"></span>
                  Grammar Bank
                </h3>
                <span className="text-[10px] font-black text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">{grammarLessons.length} Modules Available</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {grammarLessons.map(l => {
                  const isLocked = l.progress === 0;
                  return (
                    <div 
                      key={l.id} 
                      className={`bg-white p-6 rounded-2xl border transition-all group relative ${
                        isLocked ? 'border-gray-100 opacity-60 grayscale-[0.5]' : 'border-blue-100 shadow-sm hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${isLocked ? 'bg-gray-200' : l.color} rounded-lg flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110`}>
                            {isLocked ? '🔒' : l.icon}
                          </div>
                          <h4 className={`font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{l.title}</h4>
                        </div>
                        {isLocked ? (
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Locked</span>
                        ) : (
                          <span className="text-[9px] font-black text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-md">Unlocked</span>
                        )}
                      </div>
                      <div className={`p-4 rounded-xl border relative ${isLocked ? 'bg-gray-50 border-gray-100 overflow-hidden' : 'bg-blue-50/50 border-blue-100/50'}`}>
                        {isLocked && (
                          <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-[2px] flex items-center justify-center z-10 p-4">
                             <p className="text-[10px] font-black text-gray-400 uppercase text-center leading-tight">Complete the module to unlock the full breakdown</p>
                          </div>
                        )}
                        <p className={`text-sm italic leading-relaxed ${isLocked ? 'blur-sm select-none' : 'text-gray-600 font-medium'}`}>
                          "{l.grammarNotes}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        );
      case AppView.CHAT:
        return (
          <div className="h-full max-w-3xl mx-auto py-2 flex flex-col animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-800 mb-6 font-outfit tracking-tight">AI Conversation</h2>
            <div className="flex-1 min-h-0">
              <ChatInterface language={selectedLanguage} />
            </div>
          </div>
        );
      case AppView.PROFILE:
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
             <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl border-4 border-white shadow-xl relative z-10">
                  👤
                </div>
                <h2 className="text-2xl font-black text-gray-800 font-outfit relative z-10 tracking-tight">Explorer</h2>
                <p className="text-gray-400 font-bold mb-10 relative z-10 uppercase tracking-[0.2em] text-[10px]">Linguist • 2024</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
                  {[
                    { label: 'XP', val: xp.toLocaleString() },
                    { label: 'Wallet', val: coins.toLocaleString() },
                    { label: 'Courses', val: completedLessonsCount },
                    { label: 'Langs', val: studiedLanguages.size }
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50/50 p-6 rounded-2xl text-left border border-gray-100 transition-all hover:bg-white hover:shadow-lg">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-gray-800 tracking-tight">{stat.val}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-[#fdfcf6]">
      <Sidebar currentView={currentView} setView={setView} />
      <main className="flex-1 overflow-y-auto custom-scrollbar relative pb-24 md:pb-12 pt-10 px-6 sm:px-12">
        {!activeLesson && !activeVocabLesson && (
          <div className="flex justify-end mb-8">
            <button 
              className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-md hover:shadow-lg hover:border-yellow-200 transition-all group active:scale-95" 
              onClick={() => setShowLanguageBoard(true)}
            >
              <div className="text-xl transition-transform duration-300">{selectedLanguage.flag}</div>
              <div className="text-left">
                <span className="block font-black text-gray-800 text-xs tracking-tight">{selectedLanguage.name}</span>
              </div>
            </button>
          </div>
        )}

        <div className="h-full">
          {renderContent()}
        </div>

        {/* Start Confirmation Modal */}
        {confirmStart && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-300 px-6">
            <div className="bg-white rounded-3xl p-10 max-sm w-full text-center shadow-2xl scale-in-center border-t-[10px] border-yellow-400 relative">
              <div className="text-7xl mb-6 animate-bounce-short">{confirmStart.icon}</div>
              <h3 className="text-2xl font-black text-gray-800 mb-2 font-outfit tracking-tight">Ready?</h3>
              <p className="text-gray-500 mb-8 leading-relaxed font-bold tracking-tight px-4 text-sm">
                Study <span className="text-yellow-600 font-black italic">"{confirmStart.title}"</span>?
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setActiveLesson(confirmStart); setConfirmStart(null); }}
                  className="w-full bg-yellow-400 text-yellow-900 font-black py-4 rounded-2xl hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-100 text-lg active:scale-95"
                >
                  START NOW 🚀
                </button>
                <button 
                  onClick={() => setConfirmStart(null)}
                  className="w-full bg-gray-50 text-gray-400 font-black py-3 rounded-2xl hover:bg-gray-100 hover:text-gray-600 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Language Selector Modal */}
        {showLanguageBoard && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-500">
              <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl scale-in-center mx-4 overflow-hidden border-[8px] border-yellow-400">
                 <div className="p-8 border-b border-gray-100 bg-yellow-50/20">
                    <div className="flex justify-between items-center mb-6">
                       <h2 className="text-3xl font-black text-gray-800 font-outfit tracking-tight">Choose Your Mission</h2>
                       <button onClick={() => setShowLanguageBoard(false)} className="bg-white w-10 h-10 rounded-xl shadow-lg text-gray-300 hover:text-red-500 text-xl flex items-center justify-center transition-all">✕</button>
                    </div>
                    <div className="relative group">
                       <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform">🌍</span>
                       <input 
                        type="text" 
                        placeholder="Search languages..."
                        className="w-full pl-14 pr-8 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-400/10 shadow-sm transition-all text-lg font-bold placeholder:text-gray-200"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                       />
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                       {filteredLanguages.map(lang => (
                          <button
                            key={lang.id}
                            onClick={() => handleLanguageChange(lang)}
                            className={`p-6 rounded-2xl flex items-center gap-5 border-2 transition-all group relative overflow-hidden ${
                              selectedLanguage.id === lang.id ? 'border-yellow-400 bg-yellow-50 shadow-md' : 'border-white hover:border-yellow-200 hover:bg-white bg-white shadow-sm'
                            }`}
                          >
                             <span className="text-4xl group-hover:scale-110 transition-transform duration-500 z-10">{lang.flag}</span>
                             <div className="text-left flex-1 min-w-0 z-10">
                                <p className="font-black text-gray-800 truncate leading-tight text-lg tracking-tight">{lang.name}</p>
                                <p className="text-[10px] text-gray-400 font-black truncate tracking-widest uppercase mt-0.5">{lang.nativeName}</p>
                             </div>
                             {selectedLanguage.id === lang.id && (
                               <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white z-10">
                                  <span className="font-black text-sm">✓</span>
                               </div>
                             )}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Lesson Detail Modal */}
        {showLessonDetail && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300 px-6">
              <div className="bg-white rounded-3xl p-10 max-w-xl w-full shadow-2xl scale-in-center overflow-y-auto max-h-[85vh] custom-scrollbar border-t-[12px] border-yellow-400 relative">
                 <div className="flex justify-between items-start mb-8">
                    <div className={`w-24 h-24 ${showLessonDetail.color} rounded-2xl flex items-center justify-center text-6xl shadow-xl`}>
                      {showLessonDetail.icon}
                    </div>
                    <button onClick={() => setShowLessonDetail(null)} className="text-gray-200 hover:text-red-500 text-3xl transition-all p-2">✕</button>
                 </div>
                 <h3 className="text-3xl font-black text-gray-800 mb-3 font-outfit tracking-tight leading-tight">{showLessonDetail.title}</h3>
                 <div className="flex gap-4 mb-8">
                    <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-widest">{showLessonDetail.category}</span>
                    <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest">{showLessonDetail.difficulty}</span>
                 </div>
                 <div className="mb-10 space-y-6">
                   <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Course Vocabulary</p>
                      <ul className="grid grid-cols-2 gap-3">
                        {showLessonDetail.vocabulary?.map((v, i) => (
                          <li key={i} className="text-base font-bold text-gray-700 flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span> 
                            {v}
                          </li>
                        ))}
                      </ul>
                   </div>
                   {showLessonDetail.grammarNotes && (
                      <div className="p-6 bg-blue-50/80 rounded-2xl border border-blue-100 shadow-sm">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Grammar Breakdown</p>
                        <p className="text-lg text-blue-900 leading-tight italic font-bold">"{showLessonDetail.grammarNotes}"</p>
                      </div>
                   )}
                 </div>
                 <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => { setActiveLesson(showLessonDetail); setShowLessonDetail(null); }}
                      className="w-full bg-yellow-400 text-yellow-900 font-black py-5 rounded-2xl hover:bg-yellow-500 transition-all shadow-xl text-xl active:scale-95 group"
                    >
                      {showLessonDetail.progress > 0 ? 'CONTINUE LEARNING' : 'START MODULE'}
                    </button>
                    <button 
                      onClick={() => { setActiveVocabLesson(showLessonDetail); setShowLessonDetail(null); }}
                      className="w-full bg-orange-50 text-orange-600 font-black py-4 rounded-2xl border-2 border-orange-100 hover:bg-orange-100 transition-all text-sm active:scale-95"
                    >
                      PRACTICE VOCABULARY 🗂️
                    </button>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
