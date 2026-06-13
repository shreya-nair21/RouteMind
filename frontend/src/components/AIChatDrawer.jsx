import React, { useState, useEffect, useRef } from 'react';

const AIChatDrawer = ({ isOpen, onClose, tripId, destination }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        sender: 'ai',
        text: destination 
          ? `Greetings! I am your RouteMind AI assistant. I have mapped out your expedition to ${destination}. How can I assist you today?`
          : `Greetings! I am your RouteMind AI assistant. How can I assist you with your travel planning today?`,
        timestamp: new Date()
      }
    ]);
  }, [tripId, destination]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const suggestionChips = destination ? [
    `What is the weather like in ${destination}?`,
    `Suggest 3 signature dishes to try`,
    `Recommend top photo spots`,
    `Suggest a relaxed packing tip`
  ] : [
    "Recommend 3 trending travel destinations",
    "How should I plan a 5-day itinerary?",
    "What are essential international travel documents?",
    "Give me some general packing tips"
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

      const url = tripId 
        ? `http://localhost:5001/api/trips/${tripId}/chat` 
        : `http://localhost:5001/api/chat`;

      const response = await fetch(url, {
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
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Panel */}
        <div className="w-screen max-w-md liquid-glass border-l border-white/10 shadow-lg flex flex-col h-full transform transition-all duration-300 text-white">
          
          {/* Header */}
          <div className="p-5 flex justify-between items-center bg-black border-b border-white/10 relative overflow-hidden text-left">
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white shadow-sm border border-white/10">
                  <span className="material-symbols-outlined text-md">auto_awesome</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-black"></span>
              </div>
              <div>
                <h3 className="text-sm font-normal tracking-wide text-white leading-none font-sans">Neural Assistant</h3>
                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest mt-1">Voyage Intelligence</p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-450 hover:text-white transition-all relative z-10 border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-5 bg-surface-dark"
          >
            {messages.map((msg, index) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={index}
                  className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                    
                    {/* Avatar */}
                    {isAi ? (
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-sm">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      </div>
                    ) : (
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-[10px] uppercase">
                        ME
                      </div>
                    )}

                    {/* Bubble */}
                    <div className="space-y-1 text-left">
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-normal shadow-sm border ${
                        isAi 
                        ? 'bg-white/10 text-white border-white/10 rounded-tl-sm' 
                        : 'bg-white text-black border-transparent rounded-tr-sm'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <p className={`text-[8px] font-semibold text-gray-500 uppercase tracking-widest px-1 ${
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
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-sm">
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  </div>
                  <div className="bg-zinc-900 border border-white/5 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-8 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-5 py-3 bg-black border-t border-white/10 space-y-2 text-left">
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Neural Recommendations</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="shrink-0 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-full text-[10px] font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-5 bg-black border-t border-white/10 flex gap-3 items-center">
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask for recommendations, weather..."
              className="pro-input bg-black border border-white/10 text-white placeholder:text-gray-500 focus:border-white transition-colors"
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={isTyping || !inputValue.trim()}
              className="w-10 h-10 p-0 shrink-0 flex items-center justify-center disabled:opacity-50 rounded-xl bg-white text-black hover:bg-gray-150 transition-colors border-none cursor-pointer"
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
