import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import WelcomeModal from "../components/WelcomeModal";
import ChatContainer from "../components/ChatContainer";
import ChatInput from "../components/ChatInput";
import ErrorNotification from "../components/ErrorNotification";
import UserProfile from "../components/UserProfile";
import { useUser } from "../hooks/useUser.tsx";
import { useChat } from "../hooks/useChat";

export default function Home() {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const { 
    messages, 
    loading, 
    error, 
    errorMessage, 
    sendMessage, 
    clearError
  } = useChat();

  const handleSetUsername = (username: string) => {
    setUser(username);
    toast({
      title: "Connection Established",
      description: `Welcome, ${username}! You are now connected to NEXUSAI.`,
    });
  };

  const handleSendMessage = (content: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please enter your username first to establish connection.",
      });
      return;
    }
    
    sendMessage(content, user);
  };

  return (
    <div className="font-rajdhani flex flex-col h-screen">
      <WelcomeModal 
        isOpen={!user} 
        onSubmitUsername={handleSetUsername} 
      />

      <header className="bg-cyber-surface border-b border-cyber-primary/30 py-4 px-6 shadow-lg relative z-10">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary/50 flex items-center justify-center overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-cyber-background flex items-center justify-center text-xl font-bold text-cyber-primary">
                  N
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-cyber-surface"></div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">
              <span className="text-cyber-primary">NEXUS</span><span className="text-cyber-secondary">AI</span>
            </h1>
          </div>
          
          {user && <UserProfile username={user} />}
        </div>
      </header>

      <ChatContainer messages={messages} loading={loading} />
      
      <ChatInput onSubmit={handleSendMessage} loading={loading} />
      
      <ErrorNotification 
        message={errorMessage} 
        visible={error} 
        onDismiss={clearError} 
      />
    </div>
  );
}
