
import React, { useState, useMemo, useRef } from 'react';
import { Lesson, Language } from '../types';
import LessonCard from './LessonCard';

interface LearnDashboardProps {
  language: Language;
  lessons: Lesson[];
  onUpdateLessons: (newLessons: Lesson[]) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onPracticeVocab: (lesson: Lesson) => void;
  onRate: (id: string, rating: number) => void;
}

const LearnDashboard: React.FC<LearnDashboardProps> = ({ 
  language, 
  lessons, 
  onUpdateLessons, 
  onSelectLesson, 
  onPracticeVocab, 
  onRate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    const dataStr = JSON.stringify(lessons, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${language.id}_curriculum.json`);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          onUpdateLessons(importedData);
          alert('Curriculum updated successfully!');
        }
      } catch (err) {
        alert('Failed to parse JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-gray-800 font-outfit tracking-tight">Modules</h3>
              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm border border-yellow-200/50">
                {lessons.length} Topics
              </span>
            </div>
            <button 
              onClick={() => setShowHelpModal(true)}
              className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-black hover:bg-yellow-400 hover:text-yellow-900 transition-all"
            >
              ?
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            <button onClick={handleImportClick} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
              📥 Import JSON
            </button>
            <button onClick={handleExport} className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-md">
              📤 Export JSON
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative group w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
            <input 
              type="text" 
              placeholder="Find a topic..."
              className="pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-full text-sm font-medium outline-none focus:ring-4 focus:ring-yellow-400/10 transition-all w-full shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          </div>
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
          {categories.map(cat => (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map(lesson => (
          <LessonCard 
            key={lesson.id} 
            lesson={lesson} 
            onClick={() => onSelectLesson(lesson)} 
            onShowGrammar={() => onSelectLesson(lesson)}
            onPracticeVocab={() => onPracticeVocab(lesson)}
            onRate={onRate}
          />
        ))}
        {filteredLessons.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400 font-bold">No modules found for these filters.</p>
          </div>
        )}
      </div>

      {showHelpModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-6">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl scale-in-center overflow-hidden border-[6px] border-yellow-400">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-yellow-50/20">
              <h3 className="text-2xl font-black text-gray-800 font-outfit">Curriculum Data Schema</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-300 hover:text-red-500 text-2xl transition-all">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              <section>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Lesson JSON Format</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto border-2 border-gray-800 shadow-inner leading-relaxed">
{`[
  {
    "id": "l0",
    "title": "Greetings & Basics",
    "category": "Essential",
    "difficulty": "Beginner",
    "icon": "👋",
    "color": "bg-yellow-400",
    "grammarNotes": "Polite particles vary by gender and context.",
    "vocabulary": ["Hello", "Good Morning", "Thank you"]
  },
  ...
]`}
                </pre>
              </section>
              <section>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Live Example Data</h4>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-800 font-mono whitespace-pre-wrap">
                    {JSON.stringify(lessons.slice(0, 1), null, 2)}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnDashboard;
