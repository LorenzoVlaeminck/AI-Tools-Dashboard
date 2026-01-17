import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Loader2 } from 'lucide-react';
import { generateRecommendation } from '../services/geminiService';
import { ChatMessage, Tool } from '../types';

interface AiConciergeProps {
  tools?: Tool[];
}

export const AiConcierge: React.FC<AiConciergeProps> = ({ tools }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm your AI Content Assistant. Looking for a tool recommendation or an affiliate deal? Ask me!", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateRecommendation(userMsg.text, tools);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200); // Matches CSS animation duration
  };

  const toggleOpen = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  // Helper to render bold text and preserve newlines
  const renderText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => (
      <React.Fragment key={lineIdx}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIdx} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
        {lineIdx < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end pointer-events-none p-4 md:p-6 w-full md:w-auto">
      
      {/* Chat Window */}
      {isOpen && (
        <div className={`pointer-events-auto bg-card border border-white/10 w-full md:w-96 h-[60vh] md:h-[500px] rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden origin-bottom-right ${isClosing ? 'animate-slide-out-scale' : 'animate-slide-in-scale'}`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <h3 className="font-semibold leading-none">AI Concierge</h3>
                <span className="text-[10px] opacity-80 font-medium">Powered by Gemini</span>
              </div>
            </div>
            <button onClick={handleClose} className="hover:bg-white/20 p-1 rounded transition-colors" aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50 custom-scrollbar" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-gray-800 text-gray-200 rounded-bl-none border border-white/5'
                  }`}
                >
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 border border-white/5">
                  <Loader2 size={16} className="animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-card border-t border-white/5 shrink-0">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2 bg-gray-900/50 rounded-full px-4 py-2 border border-white/10 focus-within:border-primary/50 transition-colors"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for a recommendation..."
                className="bg-transparent border-none outline-none text-sm text-white flex-1 placeholder-gray-500 min-w-0"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="text-primary hover:text-white disabled:opacity-50 transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={toggleOpen}
        className="pointer-events-auto bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
      </button>
    </div>
  );
};