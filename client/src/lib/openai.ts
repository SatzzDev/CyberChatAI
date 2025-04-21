import { apiRequest } from "./queryClient";
import type { Message } from "@shared/schema";

export interface ChatResponse {
  userMessage: Message;
  aiMessage: Message;
}

export async function sendMessage(content: string, username: string): Promise<ChatResponse> {
  const response = await apiRequest("POST", "/api/chat", {
    content,
    role: "user",
    username,
  });
  
  return response.json();
}

export async function fetchMessages(): Promise<Message[]> {
  const response = await fetch("/api/messages", {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText}`);
  }
  
  return response.json();
}
