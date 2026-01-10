
import React, { useState, useMemo, useRef } from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  languages: Language[];
  onSelectLanguage: (lang: Language) => void;
  onUpdateLanguages: (newLanguages: Language[]) => void;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  languages,
  onSelectLanguage,
  onUpdateLanguages,
  onClose
}) => {
  const [langSearch, setLangSearch] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredLanguages = useMemo(() => {
    return languages.filter(l => 
      l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase())
    );
  }, [langSearch, languages]);

  const handleExport = () => {
    const dataStr = JSON.stringify(languages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `languages_config.json`);
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
          onUpdateLanguages(importedData);
          alert('Language list updated successfully!');
        }
      } catch (err) {
        alert('Failed to parse JSON.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500 p-2 sm:p-4">
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-5xl h-[92vh] sm:h-[90vh] flex flex-col shadow-2xl scale-in-center overflow-hidden border-4 sm:border-[10px] border-yellow-400">
        
        {/* Header Section */}
        <div className="p-4 sm:p-8 pb-4 border-b border-gray-100 bg-gradient-to-b from-yellow-50/40 to-white">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-yellow-200/50">🌍</div>
              <h2 className="text-xl sm:text-3xl font-black text-gray-800 font-outfit tracking-tight">Select Language</h2>
            </div>
            <button 
              onClick={onClose} 
              className="bg-gray-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 text-base sm:text-xl flex items-center justify-center transition-all active:scale-90"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
              <button 
                onClick={handleImportClick} 
                className="flex-1 py-3 bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:border-yellow-200 transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                <span className="text-base sm:text-lg group-hover:scale-125 transition-transform">📥</span>
                Import Config
              </button>
              <button 
                onClick={handleExport} 
                className="flex-1 py-3 bg-gray-900 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                <span className="text-base sm:text-lg group-hover:scale-125 transition-transform">📤</span>
                Export Library
              </button>
              <button 
                onClick={() => setShowHelpModal(true)}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-gray-100 shadow-sm text-gray-400 rounded-xl sm:rounded-2xl flex items-center justify-center text-sm sm:text-lg font-black hover:bg-yellow-400 hover:text-yellow-900 hover:border-yellow-400 transition-all active:scale-95"
              >
                ?
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <span className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-xl sm:text-2xl group-focus-within:scale-110 transition-transform duration-300">🔍</span>
            <input 
              type="text" 
              placeholder="Search 50+ languages..."
              className="w-full pl-12 sm:pl-16 pr-8 py-3.5 sm:py-5 bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl outline-none focus:ring-4 sm:focus:ring-8 focus:ring-yellow-400/10 focus:border-yellow-400 shadow-sm transition-all text-base sm:text-lg font-bold placeholder:text-gray-300"
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
            />
            {langSearch && (
              <button 
                onClick={() => setLangSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 bg-gray-50/20">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {filteredLanguages.map(lang => (
              <button
                key={lang.id}
                onClick={() => onSelectLanguage(lang)}
                className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center gap-2 sm:gap-4 border-[2px] sm:border-[3px] transition-all group relative overflow-hidden ${
                  selectedLanguage.id === lang.id 
                    ? 'border-yellow-400 bg-yellow-50 shadow-xl scale-[1.02]' 
                    : 'border-white hover:border-yellow-200 hover:bg-white bg-white shadow-md hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className="relative">
                  <span className="text-4xl sm:text-6xl block group-hover:scale-110 transition-transform duration-500 z-10 filter drop-shadow-md">
                    {lang.flag}
                  </span>
                  {selectedLanguage.id === lang.id && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center border-2 sm:border-4 border-yellow-50 text-white z-20 shadow-sm">
                      <span className="font-black text-[8px] sm:text-xs">✓</span>
                    </div>
                  )}
                </div>
                
                <div className="text-center w-full z-10">
                  <p className="font-black text-gray-800 truncate leading-tight text-sm sm:text-lg tracking-tight">
                    {lang.name}
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-gray-400 font-black truncate tracking-widest uppercase mt-0.5 sm:mt-1">
                    {lang.nativeName}
                  </p>
                </div>

                <div className={`absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 -mr-4 -mt-4 sm:-mr-8 sm:-mt-8 rounded-full blur-2xl sm:blur-3xl transition-opacity ${
                  selectedLanguage.id === lang.id ? 'bg-yellow-400/20 opacity-100' : 'bg-yellow-200/0 opacity-0 group-hover:bg-yellow-400/10 group-hover:opacity-100'
                }`}></div>
              </button>
            ))}
          </div>
          
          {filteredLanguages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
              <span className="text-4xl sm:text-6xl mb-4 grayscale opacity-30">🔍</span>
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] sm:text-xs">No languages found</p>
              <button 
                onClick={() => setLangSearch('')} 
                className="mt-3 text-yellow-600 font-bold hover:underline text-xs"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
        
        {/* Footer Stats */}
        <div className="px-4 sm:px-8 py-3 sm:py-4 bg-white border-t border-gray-50 flex items-center justify-between text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <div className="flex gap-2 sm:gap-4">
             <span>{languages.length} Languages</span>
             <span className="text-gray-200">|</span>
             <span>50+ Topics</span>
          </div>
          <div className="hidden sm:block">
             Learning: <span className="text-yellow-600">{selectedLanguage.name}</span>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300 px-4 sm:px-6">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] w-full max-w-xl flex flex-col shadow-2xl scale-in-center overflow-hidden border-4 sm:border-[8px] border-yellow-400">
            <div className="p-4 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-yellow-50 to-white">
              <h3 className="text-lg sm:text-2xl font-black text-gray-800 font-outfit">Language Guide</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-300 hover:text-red-500 text-xl sm:text-2xl transition-all">✕</button>
            </div>
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 sm:mb-4">JSON Object Definition</h4>
                <div className="relative group">
                   <pre className="bg-gray-900 text-green-400 p-4 sm:p-6 rounded-[1rem] sm:rounded-[1.5rem] text-[10px] sm:text-xs overflow-x-auto border-2 border-gray-800 leading-relaxed font-mono shadow-inner">
{`[
  {
    "id": "th",
    "name": "Thai",
    "nativeName": "ภาษาไทย",
    "flag": "🇹🇭"
  }
]`}
                  </pre>
                </div>
              </div>
              <div className="bg-blue-50 p-4 sm:p-6 rounded-[1rem] sm:rounded-[1.5rem] border border-blue-100 shadow-sm">
                <p className="text-[10px] sm:text-xs text-blue-800 font-bold leading-relaxed">
                  💡 Use export to get a template, edit the JSON, and re-import to add your own languages.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
