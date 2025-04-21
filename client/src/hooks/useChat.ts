import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendMessage, fetchMessages } from "@/lib/openai";
import { playSound } from "@/lib/sounds";
import type { Message } from "@shared/schema";
import { useUser } from "./useUser.tsx"; // Use the correct import path
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useChat() {
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("API connection failed. Retrying...");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  // Fetch all messages
  const { data: serverMessages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: !!user,
  });
  
  // Update local messages when server messages change
  useEffect(() => {
    if (serverMessages) {
      setLocalMessages(serverMessages);
      
      // Play sound if we received a new AI message
      if (serverMessages.length > lastMessageCount && serverMessages.length > 0) {
        const lastMessage = serverMessages[serverMessages.length - 1];
        if (lastMessage.role === 'assistant') {
          playSound('receive');
        }
        setLastMessageCount(serverMessages.length);
      }
    }
  }, [serverMessages, lastMessageCount]);

  // Combine server messages with local pending messages
  const messages = localMessages;

  // Send message mutation
  const { mutate, isPending: loading } = useMutation({
    mutationFn: async ({ content, username }: { content: string; username: string }) => {
      return sendMessage(content, username);
    },
    onSuccess: (data) => {
      // Invalidate the messages query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (err: Error) => {
      console.error("Failed to send message:", err);
      setErrorMessage(err.message || "Failed to communicate with CYON AI. Please try again.");
      setError(true);
      toast({
        variant: "destructive",
        title: "Communication Error",
        description: "Failed to reach CYON AI. Please try again.",
      });
    },
  });

  const handleSendMessage = (content: string, username: string) => {
    // Add the message locally immediately
    const tempUserMessage: Message = {
      id: Date.now(), // Temporary ID
      content,
      role: "user",
      username,
      timestamp: new Date(),
    };
    
    // Play send sound
    playSound('send');
    
    // Update local state to include the new message
    setLocalMessages(prev => [...prev, tempUserMessage]);
    
    // Send to server
    mutate({ content, username });
  };

  const clearError = () => {
    setError(false);
  };

  return {
    messages,
    loading,
    error,
    errorMessage,
    sendMessage: handleSendMessage,
    clearError,
  };
}
