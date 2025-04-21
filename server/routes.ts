import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: 'https://beta.sree.shop/v1',
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Check if OpenAI API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set. AI responses will not work.");
  }

  // Get chat history
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message to AI and get response
  app.post("/api/chat", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      // Save user message
      const savedMessage = await storage.createMessage({
        ...messageData,
        role: "user",
      });

      // Call OpenAI API
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      const completion = await openai.chat.completions.create({
        model: 'Provider-5/deepseek-r1-distill-qwen-32b',
        messages: [
          {
            role: "system",
            content: "You are NEXUSAI, a helpful assistant with a cyber theme. Keep responses concise and focused."
          },
          {
            role: "user",
            content: messageData.content
          }
        ],
      });

      const aiResponse = completion.choices[0].message.content || "I'm unable to process that request at the moment.";
      
      // Save AI response
      const aiMessage = await storage.createMessage({
        content: aiResponse,
        role: "assistant",
        username: messageData.username,
      });

      res.json({
        userMessage: savedMessage,
        aiMessage: aiMessage
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      let errorMessage = "Failed to process chat message";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(500).json({ message: errorMessage });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
