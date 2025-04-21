import { useRef, useEffect, useState } from "react";
import { Message } from "@shared/schema";
import { useUser } from "../hooks/useUser.tsx";
import { useToast } from "@/hooks/use-toast";

interface ChatContainerProps {
  messages: Message[];
  loading: boolean;
}

export default function ChatContainer({ messages, loading }: ChatContainerProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Get user initials
  const getInitials = (username: string) => {
    if (!username) return '';
    const parts = username.split(/[^a-zA-Z0-9]/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  // Format timestamp
  const formatTime = (timestamp: Date | string) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  // Copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Code Copied",
          description: "Code has been copied to clipboard",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Failed to copy code to clipboard",
        });
      }
    );
  };

  // Process message content to detect code blocks
  const processMessageContent = (content: string) => {
    // Split by code blocks (marked by triple backticks)
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract the code and language (if specified)
        let code = part.slice(3, -3);
        let language = '';
        
        // Check if language is specified in the first line
        const firstLineBreak = code.indexOf('\n');
        if (firstLineBreak > 0) {
          language = code.slice(0, firstLineBreak).trim();
          // Only remove first line if it appears to be a language specifier
          if (language && !language.includes(' ')) {
            code = code.slice(firstLineBreak + 1);
          } else {
            language = '';
          }
        }
        
        return (
          <div key={index} className="my-3 relative">
            <div className="bg-gray-800 rounded-md overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 bg-gray-900 border-b border-gray-700">
                <span className="text-xs text-gray-300">{language || 'code'}</span>
                <button 
                  onClick={() => copyToClipboard(code)}
                  className="text-xs text-cyber-primary hover:text-white bg-gray-800 hover:bg-gray-700 py-1 px-2 rounded transition-colors duration-150"
                >
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </div>
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-gray-300">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        );
      } else {
        // Regular text
        return <p key={index} className="text-cyber-text whitespace-pre-line">{part}</p>;
      }
    });
  };

  return (
    <main ref={chatContainerRef} className="flex-1 overflow-y-auto hide-scrollbar p-4 md:p-6 bg-cyber-background relative">
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="circuit-bg w-full h-full"></div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-6 py-4 relative">
        {/* System Welcome Message */}
        <div className="bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10 border border-cyber-primary/20 rounded-md p-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary/50 flex-shrink-0 flex items-center justify-center text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-cyber-primary text-sm font-bold">SYSTEM</p>
                </div>
                <span className="text-cyber-dark-text text-xs font-mono">
                  <time dateTime={new Date().toISOString()}>{formatTime(new Date())}</time>
                </span>
              </div>
              <div className="mt-1">
                <p className="text-cyber-text">
                  Welcome to CYON<span className="text-cyber-secondary">AI</span>, your personal AI assistant. I'm here to help you with information, tasks, and conversation. What would you like to discuss today?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message List */}
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`rounded-md ${
              message.role === 'user' 
                ? 'bg-cyber-user-msg border-l-4 border-cyber-primary/50 p-4 ml-6 mr-0 md:ml-12' 
                : 'bg-cyber-ai-msg border-l-4 border-cyber-secondary/50 p-4 ml-0 mr-6 md:mr-12'
            }`}
          >
            <div className="flex gap-3">
              {message.role === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-cyber-surface border border-cyber-primary/50 flex-shrink-0 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20 flex items-center justify-center text-xs font-bold text-cyber-text uppercase">
                    {getInitials(message.username)}
                  </div>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary flex-shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${message.role === 'user' ? 'text-cyber-text' : 'text-cyber-secondary'} text-sm font-bold`}>
                      {message.role === 'user' 
                        ? message.username 
                        : <span>CYON<span className="text-cyber-primary">AI</span></span>}
                    </p>
                  </div>
                  <span className="text-cyber-dark-text text-xs font-mono">
                    <time dateTime={new Date(message.timestamp).toISOString()}>
                      {formatTime(message.timestamp)}
                    </time>
                  </span>
                </div>
                <div className="mt-1">
                  {message.role === 'assistant' 
                    ? processMessageContent(message.content)
                    : <p className="text-cyber-text whitespace-pre-line">{message.content}</p>
                  }
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="rounded-md bg-cyber-ai-msg border-l-4 border-cyber-secondary/50 p-4 ml-0 mr-6 md:mr-12">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary flex-shrink-0 flex items-center justify-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="scanner"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-cyber-secondary text-sm font-bold">CYON<span className="text-cyber-primary">AI</span></p>
                  </div>
                  <span className="text-cyber-dark-text text-xs font-mono">
                    <time dateTime={new Date().toISOString()}>{formatTime(new Date())}</time>
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyber-secondary animate-typing delay-0"></div>
                    <div className="w-2 h-2 rounded-full bg-cyber-secondary animate-typing delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-cyber-secondary animate-typing delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
