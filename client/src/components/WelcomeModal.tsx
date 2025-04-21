import { useState } from "react";
import { useUser } from "../hooks/useUser.tsx";

interface WelcomeModalProps {
  isOpen: boolean;
  onSubmitUsername: (username: string) => void;
}

export default function WelcomeModal({ isOpen, onSubmitUsername }: WelcomeModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (username.trim()) {
      onSubmitUsername(username);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-cyber-background/95 transition-opacity duration-300">
      <div className="relative max-w-md w-full bg-cyber-surface p-8 rounded border border-cyber-primary/50 shadow-lg mx-4">
        <div className="absolute inset-0 overflow-hidden rounded opacity-10">
          <div className="circuit-bg w-full h-full"></div>
        </div>
        
        <div className="text-center relative z-10">
          <h2 className="text-3xl font-bold mb-2 text-cyber-primary tracking-wider">NEXUS<span className="text-cyber-secondary">AI</span></h2>
          <div className="h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-cyber-primary to-transparent mb-6"></div>
          
          <p className="mb-6 text-cyber-text">Enter your identifier to establish connection</p>
          
          <div className="relative mb-8">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full bg-cyber-background border ${error ? 'border-red-500' : 'border-cyber-primary/50'} text-cyber-text py-3 px-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-cyber-primary/50 transition-all duration-300`}
              placeholder="USERNAME" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-cyber-primary/0 via-cyber-primary/70 to-cyber-primary/0"></div>
          </div>
          
          <button 
            onClick={handleSubmit}
            className="cyber-button bg-cyber-background border-2 border-cyber-primary text-cyber-primary hover:text-cyber-text px-8 py-2 rounded-sm uppercase tracking-widest font-bold transition-all duration-300 hover:bg-cyber-primary/20 animate-pulse-glow">
            Initialize Connection
          </button>
        </div>
      </div>
    </div>
  );
}
