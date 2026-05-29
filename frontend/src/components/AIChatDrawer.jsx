import React, { useState, useEffect, useRef } from 'react';

const AIChatDrawer = ({ isOpen, onClose, tripId, destination }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Greetings! I am your RouteMind AI assistant. I have mapped out your expedition to ${destination}. How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const suggestionChips = [
    `What is the weather like in ${destination}?`,
    `Suggest 3 signature dishes to try`,
    `Recommend top photo spots`,
    `Suggest a relaxed packing tip`
  ];

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      
      // Structure historical messages for context
      const history = messages.slice(1).map(m => ({
        sender: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const response = await fetch(`http://localhost:5001/api/trips/${tripId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          history
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.reply,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: "I apologize, I encountered a communication error with the neural network. Please check your GEMINI_API_KEY environment variable.",
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I apologize, I was unable to connect to the server. Please ensure the backend is running.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Panel */}
        <div className="w-screen max-w-md bg-surface border-l border-slate-200 shadow-xl flex flex-col h-full transform transition-all duration-300">
          
          {/* Header */}
          <div className="p-5 bg-secondary text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded bg-primary flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-md">auto_awesome</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-secondary"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide uppercase text-primary leading-none">Neural Assistant</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Voyage Intelligence</p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50"
          >
            {messages.map((msg, index) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={index}
                  className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-fade-in`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                    
                    {/* Avatar */}
                    {isAi ? (
                      <div className="w-7 h-7 shrink-0 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      </div>
                    ) : (
                      <div className="w-7 h-7 shrink-0 rounded bg-secondary flex items-center justify-center text-white shadow-sm font-bold text-[10px] uppercase">
                        ME
                      </div>
                    )}

                    {/* Bubble */}
                    <div className="space-y-1">
                      <div className={`p-3.5 rounded-lg text-xs leading-relaxed font-normal shadow-sm border ${
                        isAi 
                        ? 'bg-surface text-secondary border-slate-200/60 rounded-tl-none' 
                        : 'bg-primary text-white border-primary rounded-tr-none'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <p className={`text-[8px] font-bold text-slate-400 uppercase tracking-widest px-1 ${
                        isAi ? 'text-left' : 'text-right'
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-7 h-7 shrink-0 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-sm animate-spin">
                    <span className="material-symbols-outlined text-sm">sync</span>
                  </div>
                  <div className="bg-surface border border-slate-200/60 p-3 rounded-lg rounded-tl-none shadow-sm flex items-center gap-1.5 h-8 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-5 py-3 bg-surface border-t border-slate-100 space-y-2">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Neural Recommendations</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-primary/5 border border-slate-200 hover:border-primary/20 rounded-full text-[10px] font-bold text-slate-600 hover:text-primary transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-5 bg-surface border-t border-slate-100 flex gap-3 items-center">
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask for recommendations, weather..."
              className="pro-input"
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={isTyping || !inputValue.trim()}
              className="btn-primary w-10 h-10 p-0 shrink-0 flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIChatDrawer;
