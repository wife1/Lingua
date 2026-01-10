
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppView, Language, Lesson, Badge, DailyGoal, GrammarItem } from './types';
import { LANGUAGES, MOCK_QUIZ_GREETINGS, MOCK_GOALS, getGrammarDataForLang, getLessonsForLang } from './constants';
import Sidebar from './components/Sidebar';
import Quiz from './components/Quiz';
import VocabPractice from './components/VocabPractice';
import GrammarBank from './components/GrammarBank';
import LearnDashboard from './components/LearnDashboard';
import LanguageSelector from './components/LanguageSelector';
import ChatInterface from './components/ChatInterface';
import ProfileView from './components/ProfileView';

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
  const [showLanguageBoard, setShowLanguageBoard] = useState(false);
  
  const [streak, setStreak] = useState(12);
  const [coins, setCoins] = useState(2450);
  const [xp, setXp] = useState(12450);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(1);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [studiedLanguages, setStudiedLanguages] = useState<Set<string>>(new Set([LANGUAGES[0].id]));
  const [lastReward, setLastReward] = useState<{ coins: number, xp: number } | null>(null);
  const [confirmStart, setConfirmStart] = useState<Lesson | null>(null);
  
  // UI States
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Global Lists State
  const [allLanguages, setAllLanguages] = useState<Language[]>(LANGUAGES);
  
  // Curriculum State
  const [allLanguageLessons, setAllLanguageLessons] = useState<Record<string, Lesson[]>>({
    [LANGUAGES[0].id]: getLessonsForLang(LANGUAGES[0].id)
  });

  // Grammar State
  const [customGrammarData, setCustomGrammarData] = useState<Record<string, GrammarItem[]>>({});

  const lessons = useMemo(() => {
    return allLanguageLessons[selectedLanguage.id] || getLessonsForLang(selectedLanguage.id);
  }, [allLanguageLessons, selectedLanguage.id]);

  const grammarBankItems = useMemo(() => {
    return customGrammarData[selectedLanguage.id] || getGrammarDataForLang(selectedLanguage.id);
  }, [selectedLanguage.id, customGrammarData]);

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(MOCK_GOALS);

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
        case 'perfect': isUnlocked = lessons.some(l => l.progress === 100); break;
      }
      if (isUnlocked) {
        changed = true;
        return { ...badge, unlocked: true };
      }
      return badge;
    });
    if (changed) setBadges(updatedBadges);
  }, [coins, streak, completedLessonsCount, studiedLanguages, badges, lessons]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 400);
  };

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (view: AppView) => {
    // CRITICAL: Clear all potential blocking states when navigating via sidebar
    setActiveLesson(null);
    setActiveVocabLesson(null);
    setShowLessonDetail(null);
    setShowLanguageBoard(false);
    setConfirmStart(null);
    
    setView(view);
    // Smooth auto-scroll to top
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLessonComplete = (score: number, total: number) => {
    const isPerfect = score === total;
    const earnedCoins = Math.round((score / total) * 50) + 10;
    const earnedXp = Math.round((score / total) * 100) + 20;
    
    setCoins(prev => prev + earnedCoins);
    setXp(prev => prev + earnedXp);
    setCompletedLessonsCount(prev => prev + 1);
    setLastReward({ coins: earnedCoins, xp: earnedXp });

    if (isPerfect && activeLesson) {
      const badgeId = `lesson-${selectedLanguage.id}-${activeLesson.id}`;
      if (!badges.find(b => b.id === badgeId)) {
        const newBadge: Badge = {
          id: badgeId,
          name: `${activeLesson.title} Mastery`,
          description: `Achieved 100% in the ${activeLesson.title} module for ${selectedLanguage.name}.`,
          icon: activeLesson.icon,
          unlocked: true,
          requirement: 'manual'
        };
        setBadges(prev => [...prev, newBadge]);
      }
    }

    const updatedLessons = lessons.map(l => {
      if (l.id === activeLesson?.id) {
        const newProgress = Math.max(l.progress, Math.round((score / total) * 100));
        return { ...l, progress: newProgress, needsReview: score < total, lastScore: score };
      }
      return l;
    });

    setAllLanguageLessons(prev => ({ ...prev, [selectedLanguage.id]: updatedLessons }));
  };

  const handleRating = (lessonId: string, rating: number) => {
    const updatedLessons = lessons.map(l => l.id === lessonId ? { ...l, rating } : l);
    setAllLanguageLessons(prev => ({ ...prev, [selectedLanguage.id]: updatedLessons }));
  };

  const handleVocabComplete = (earnedXp: number) => {
    setXp(prev => prev + earnedXp);
    setActiveVocabLesson(null);
  };

  const handleUpdateGrammarItems = (newItems: GrammarItem[]) => {
    setCustomGrammarData(prev => ({ ...prev, [selectedLanguage.id]: newItems }));
  };

  const handleUpdateLessons = (newLessons: Lesson[]) => {
    setAllLanguageLessons(prev => ({ ...prev, [selectedLanguage.id]: newLessons }));
  };

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setStudiedLanguages(prev => new Set([...prev, lang.id]));
    if (!allLanguageLessons[lang.id]) {
      setAllLanguageLessons(prev => ({ ...prev, [lang.id]: getLessonsForLang(lang.id) }));
    }
    setShowLanguageBoard(false);
  };

  const renderContent = () => {
    // Priority full-screen modes
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

    // View router
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all group" onClick={() => setShowLanguageBoard(true)}>
                <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center text-3xl shadow-md group-hover:scale-105 transition-transform">
                  {selectedLanguage.flag}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800 font-outfit">Learning {selectedLanguage.name}</h2>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{lessons.length} Modules Available</p>
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
                            style={{ width: `${((goal.current || 0) / goal.target) * 100}%` }}
                          />
                       </div>
                       <span className="text-[9px] font-black text-gray-400">{goal.current}/{goal.target}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <LearnDashboard 
              language={selectedLanguage}
              lessons={lessons}
              onUpdateLessons={handleUpdateLessons}
              onSelectLesson={setShowLessonDetail}
              onPracticeVocab={setActiveVocabLesson}
              onRate={handleRating}
            />
          </div>
        );

      case AppView.REVIEW:
        const reviewRequired = lessons.filter(l => l.needsReview);
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

            <GrammarBank 
              language={selectedLanguage}
              items={grammarBankItems}
              onUpdateItems={handleUpdateGrammarItems}
            />
          </div>
        );
      case AppView.CHAT:
        return (
          <div className="h-full max-w-3xl mx-auto py-2 flex flex-col animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-gray-800 mb-6 font-outfit tracking-tight">AI Conversation</h2>
            <div className="flex-1 min-h-0">
              <ChatInterface 
                language={selectedLanguage} 
                onOpenLanguageSelector={() => setShowLanguageBoard(true)} 
              />
            </div>
          </div>
        );
      case AppView.PROFILE:
        return (
          <ProfileView 
            xp={xp}
            coins={coins}
            completedLessonsCount={completedLessonsCount}
            studiedLanguagesCount={studiedLanguages.size}
            badges={badges}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-[#fdfcf6]">
      <Sidebar currentView={currentView} setView={handleViewChange} />
      <main 
        ref={mainRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar relative pb-24 md:pb-12 pt-10 px-6 sm:px-12 scroll-smooth"
      >
        <div className="h-full">
          {renderContent()}
        </div>

        <button
          onClick={scrollToTop}
          className={`fixed bottom-24 right-8 z-[60] w-12 h-12 bg-gray-900 text-yellow-400 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:bg-black hover:scale-110 active:scale-90 border-2 border-gray-800 ${
            showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          title="Scroll to Top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" />
          </svg>
        </button>

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

        {showLanguageBoard && (
           <LanguageSelector 
             selectedLanguage={selectedLanguage}
             languages={allLanguages}
             onSelectLanguage={handleLanguageChange}
             onUpdateLanguages={setAllLanguages}
             onClose={() => setShowLanguageBoard(false)}
           />
        )}

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
