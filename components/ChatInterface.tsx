
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language } from '../types';
import { startAIChat } from '../services/geminiService';

interface ChatInterfaceProps {
  language: Language;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Sawadee! Ready to practice ${language.name}?`, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatInstance = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      chatInstance.current = await startAIChat(language.name);
    };
    initChat();
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatInstance.current) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatInstance.current.sendMessage({ message: input });
      const botMessage: ChatMessage = { 
        role: 'model', 
        text: response.text, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-yellow-400 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-inner">
          🐒
        </div>
        <div>
          <h3 className="font-bold text-yellow-900 leading-tight text-sm">Lingo Monkey</h3>
          <p className="text-[8px] font-black text-yellow-700 uppercase tracking-widest">Tutor • Online</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-amber-50/10">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-yellow-500 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              <p className="text-sm font-medium leading-relaxed">{m.text}</p>
              <p className={`text-[8px] mt-1 font-bold ${m.role === 'user' ? 'text-yellow-100' : 'text-gray-400'}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm flex gap-1">
              <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex gap-2 bg-gray-50 rounded-xl p-1.5 items-center focus-within:ring-2 focus-within:ring-yellow-400 transition-all border border-gray-100">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none px-2 py-1.5 text-sm text-gray-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-yellow-400 text-yellow-900 p-2 rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
