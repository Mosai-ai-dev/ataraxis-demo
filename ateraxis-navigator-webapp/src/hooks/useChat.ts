import { useState, useCallback } from 'react';
import { Message, ChatSession } from '@/types/chat';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const createNewSession = useCallback(() => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New conversation',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    clearMessages();
    
    return newSessionId;
  }, [clearMessages]);

  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    // In a real app, load messages for this session
    clearMessages();
  }, [clearMessages]);

  return {
    messages,
    sessions,
    currentSessionId,
    isLoading,
    setIsLoading,
    addMessage,
    clearMessages,
    createNewSession,
    selectSession,
    setSessions
  };
}