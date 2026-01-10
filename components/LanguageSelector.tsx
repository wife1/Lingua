
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl scale-in-center mx-4 overflow-hidden border-[8px] border-yellow-400">
        <div className="p-8 border-b border-gray-100 bg-yellow-50/20">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-gray-800 font-outfit tracking-tight">Choose Your Mission</h2>
              <button 
                onClick={() => setShowHelpModal(true)}
                className="w-6 h-6 bg-white shadow-sm text-gray-400 rounded-full flex items-center justify-center text-xs font-black hover:bg-yellow-400 hover:text-yellow-900 transition-all"
              >
                ?
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
              <button onClick={handleImportClick} className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                📥 Import
              </button>
              <button onClick={handleExport} className="px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-sm">
                📤 Export
              </button>
              <button onClick={onClose} className="bg-white w-10 h-10 rounded-xl shadow-lg text-gray-300 hover:text-red-500 text-xl flex items-center justify-center transition-all">✕</button>
            </div>
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
                onClick={() => onSelectLanguage(lang)}
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

      {showHelpModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-6">
          <div className="bg-white rounded-3xl w-full max-w-xl h-auto flex flex-col shadow-2xl scale-in-center overflow-hidden border-[6px] border-yellow-400">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-yellow-50/20">
              <h3 className="text-2xl font-black text-gray-800 font-outfit">Language JSON Schema</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-300 hover:text-red-500 text-2xl transition-all">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Format</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto border-2 border-gray-800 leading-relaxed font-mono">
{`[
  {
    "id": "th",
    "name": "Thai",
    "nativeName": "ภาษาไทย",
    "flag": "🇹🇭"
  },
  {
    "id": "es",
    "name": "Spanish",
    "nativeName": "Español",
    "flag": "🇪🇸"
  }
]`}
              </pre>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-800 font-medium">
                  Add custom languages by providing a unique <strong>id</strong>, the common <strong>name</strong>, the <strong>nativeName</strong>, and an emoji <strong>flag</strong>.
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
