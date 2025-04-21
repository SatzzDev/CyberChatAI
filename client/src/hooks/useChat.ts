import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendMessage, fetchMessages } from "@/lib/openai";
import type { Message } from "@shared/schema";
import { useUser } from "./useUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useChat() {
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("API connection failed. Retrying...");

  // Fetch all messages
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    enabled: !!user,
  });

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
      setErrorMessage(err.message || "Failed to communicate with NEXUSAI. Please try again.");
      setError(true);
      toast({
        variant: "destructive",
        title: "Communication Error",
        description: "Failed to reach NEXUSAI. Please try again.",
      });
    },
  });

  const handleSendMessage = (content: string, username: string) => {
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
