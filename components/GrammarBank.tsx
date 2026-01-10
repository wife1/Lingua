
import React, { useState, useRef, useMemo } from 'react';
import { GrammarItem, Language } from '../types';

interface GrammarBankProps {
  language: Language;
  items: GrammarItem[];
  onUpdateItems: (newItems: GrammarItem[]) => void;
}

const GrammarBank: React.FC<GrammarBankProps> = ({ language, items, onUpdateItems }) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const lowerSearch = searchTerm.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowerSearch) || 
      item.explanation.toLowerCase().includes(lowerSearch)
    );
  }, [items, searchTerm]);

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${language.id}_grammar_bank.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
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
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        if (Array.isArray(importedData)) {
          onUpdateItems(importedData);
          alert('Grammar bank updated successfully!');
        } else {
          alert('Invalid format: Expected an array of grammar items.');
        }
      } catch (error) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h3 className="text-2xl font-black text-gray-800 font-outfit tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-8 bg-blue-500 rounded-full"></span>
                Grammar Bank
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.15em] shadow-sm border border-blue-100">
                  {items.length} CURRICULUM TOPICS
                </span>
                <button 
                  onClick={() => setShowHelpModal(true)}
                  className="w-5 h-5 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-[10px] font-black hover:bg-yellow-400 hover:text-yellow-900 transition-all shadow-sm"
                  title="JSON Data Format Help"
                >
                  ?
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />
            <button 
              onClick={handleImportClick}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
            >
              📥 Import
            </button>
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
            >
              📤 Export Library
            </button>
          </div>
        </div>

        <div className="relative group w-full md:w-96">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
          <input 
            type="text" 
            placeholder="Search 500+ grammar rules..."
            className="pl-9 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-400/10 focus:border-blue-200 transition-all w-full shadow-sm placeholder:text-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-800">{item.title}</h4>
              </div>
              <span className="text-[9px] font-black text-blue-500 uppercase bg-blue-50 px-2 py-0.5 rounded-md">{item.level}</span>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                "{item.explanation}"
              </p>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Examples</p>
                <ul className="space-y-1">
                  {item.examples.map((ex, i) => (
                    <li key={i} className="text-xs font-bold text-gray-700 flex items-center gap-2">
                      <span className="text-yellow-500">•</span> {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-4">📭</span>
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No matching grammar rules</p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="mt-4 text-blue-500 font-bold text-sm hover:underline">Clear search?</button>
            )}
          </div>
        )}
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-6">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl scale-in-center overflow-hidden border-[6px] border-yellow-400">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-yellow-50/20">
              <h3 className="text-2xl font-black text-gray-800 font-outfit">Grammar Data Schema</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-300 hover:text-red-500 text-2xl transition-all">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              <section>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">JSON Array Element Format</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto border-2 border-gray-800 shadow-inner leading-relaxed">
{`[
  {
    "id": "unique-id",
    "title": "Grammar Title",
    "icon": "📝",
    "explanation": "Brief clear rule description.",
    "examples": ["Usage example 1", "Usage example 2"],
    "color": "bg-color-100",
    "level": "Beginner|Intermediate|Advanced"
  },
  ...
]`}
                </pre>
              </section>
              <section>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Live Example Data</h4>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-800 font-mono whitespace-pre-wrap">
                    {JSON.stringify(items.slice(0, 1), null, 2)}
                  </p>
                </div>
              </section>
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <p className="text-xs text-orange-800 font-medium">
                  <strong>Pro Tip:</strong> Export your current bank to see a full valid JSON file you can edit and re-import later!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GrammarBank;
