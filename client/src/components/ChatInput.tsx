import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSubmit, loading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const maxLength = 1000;

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSubmit(message);
      setMessage("");
    }
  };

  const getCharCountClass = () => {
    const length = message.length;
    if (length > 950) return "text-red-500";
    if (length > 800) return "text-yellow-500";
    return "text-cyber-dark-text";
  };

  return (
    <footer className="bg-cyber-surface border-t border-cyber-primary/30 p-4 relative z-10">
      <div className="max-w-4xl mx-auto relative">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input 
              ref={inputRef}
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
              disabled={loading}
              className="w-full bg-cyber-background border-2 border-cyber-primary/40 text-cyber-text py-3 px-4 rounded-sm focus:outline-none focus:border-cyber-primary focus:animate-pulse-glow transition-all duration-300 pr-10"
              placeholder="Enter your message..." />
            
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-cyber-primary/0 via-cyber-primary/40 to-cyber-primary/0"></div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !message.trim()}
            className="cyber-button bg-cyber-background min-w-[50px] h-[50px] border-2 border-cyber-primary text-cyber-primary hover:text-cyber-text rounded-sm uppercase tracking-widest font-bold transition-all duration-300 hover:bg-cyber-primary/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
        
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="font-mono text-xs text-cyber-dark-text">SYSTEM::<span className="text-green-500">CONNECTED</span></span>
          <span className={`font-mono text-xs ${getCharCountClass()}`}>{message.length}/{maxLength}</span>
        </div>
      </div>
    </footer>
  );
}
