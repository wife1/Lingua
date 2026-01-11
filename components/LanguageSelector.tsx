
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
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-6xl h-[92vh] sm:h-[90vh] flex flex-col shadow-2xl scale-in-center overflow-hidden border-4 sm:border-[10px] border-yellow-400">
        
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-b from-yellow-50/40 to-white">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-yellow-200/50">🌍</div>
              <h2 className="text-lg sm:text-2xl font-black text-gray-800 font-outfit tracking-tight">Select Language</h2>
            </div>
            <button 
              onClick={onClose} 
              className="bg-gray-100 w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 text-base flex items-center justify-center transition-all active:scale-90"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors">🔍</span>
              <input 
                type="text" 
                placeholder="Search languages..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 shadow-sm transition-all text-sm font-bold placeholder:text-gray-300"
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
              />
              {langSearch && (
                <button 
                  onClick={() => setLangSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center text-[10px]"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
              <button 
                onClick={handleImportClick} 
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:border-yellow-200 transition-all shadow-sm flex items-center gap-2"
              >
                <span>📥</span> Import
              </button>
              <button 
                onClick={handleExport} 
                className="px-3 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md flex items-center gap-2"
              >
                <span>📤</span> Export
              </button>
            </div>
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-gray-50/20">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
            {filteredLanguages.map(lang => (
              <button
                key={lang.id}
                onClick={() => onSelectLanguage(lang)}
                className={`p-2 sm:p-3 rounded-xl flex flex-col items-center gap-1 border transition-all group relative overflow-hidden ${
                  selectedLanguage.id === lang.id 
                    ? 'border-yellow-400 bg-yellow-50 shadow-md ring-2 ring-yellow-400/20' 
                    : 'border-gray-100 hover:border-yellow-200 hover:bg-white bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div className="relative mb-1">
                  <span className="text-2xl sm:text-3xl block group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">
                    {lang.flag}
                  </span>
                  {selectedLanguage.id === lang.id && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white text-white z-20 shadow-sm">
                      <span className="font-black text-[8px]">✓</span>
                    </div>
                  )}
                </div>
                
                <div className="text-center w-full z-10 overflow-hidden">
                  <p className="font-bold text-gray-800 truncate leading-tight text-xs sm:text-sm tracking-tight w-full">
                    {lang.name}
                  </p>
                  <p className="text-[8px] text-gray-400 font-bold truncate tracking-wide uppercase mt-0.5 w-full">
                    {lang.nativeName}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          {filteredLanguages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
              <span className="text-4xl mb-3 grayscale opacity-30">🔍</span>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No languages found</p>
              <button 
                onClick={() => setLangSearch('')} 
                className="mt-2 text-yellow-600 font-bold hover:underline text-xs"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
        
        {/* Footer Stats */}
        <div className="px-4 py-2 bg-white border-t border-gray-50 flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
          <div className="flex gap-3">
             <span>{languages.length} Languages</span>
          </div>
          <div>
             Current: <span className="text-yellow-600">{selectedLanguage.name}</span>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl scale-in-center overflow-hidden border-4 border-yellow-400">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-yellow-50/50">
              <h3 className="text-lg font-black text-gray-800 font-outfit">Language Guide</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-300 hover:text-red-500 text-xl transition-all">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600">
                You can import/export custom language lists using JSON format.
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-[10px] overflow-x-auto border-2 border-gray-800 font-mono shadow-inner">
{`[
  {
    "id": "code",
    "name": "English Name",
    "nativeName": "Native Name",
    "flag": "🇺🇳"
  }
]`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
