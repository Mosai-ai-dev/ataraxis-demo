'use client';

import { useState, useEffect } from 'react';
import { Message, ChatSession } from '@/types/chat';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { SessionList } from './SessionList';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { getMockAIResponse, getSampleSessions, processAction, getSessionMessages } from '@/lib/mockApi';
import { cn } from '@/lib/utils';

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load sample sessions on mount
  useEffect(() => {
    const sampleSessions = getSampleSessions();
    setSessions(sampleSessions);
  }, []);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sessionId: currentSessionId,
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await getMockAIResponse(content);
      setIsTyping(false);
      
      // Add AI response
      setMessages(prev => [...prev, {
        ...aiResponse,
        sessionId: currentSessionId
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionApprove = async (action: any) => {
    const result = await processAction(action, true);
    
    // Add confirmation message
    const confirmMessage: Message = {
      id: `confirm-${Date.now()}`,
      sessionId: currentSessionId,
      type: 'ai',
      content: result.message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmMessage]);
  };

  const handleActionReject = async (action: any) => {
    const result = await processAction(action, false);
    
    // Add confirmation message
    const confirmMessage: Message = {
      id: `confirm-${Date.now()}`,
      sessionId: currentSessionId,
      type: 'ai',
      content: result.message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmMessage]);
  };

  const handleNewSession = () => {
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
    setMessages([]);
  };

  const handleSelectSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    // Load messages for this session
    const sessionMessages = await getSessionMessages(sessionId);
    setMessages(sessionMessages);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-gradient-to-br from-background to-background/95 rounded-2xl shadow-2xl overflow-hidden border border-border/20">
      {/* Sidebar */}
      <div className={cn(
        'transition-all duration-300 bg-muted/30 backdrop-blur-sm border-r border-border/20',
        sidebarOpen ? 'w-80' : 'w-0'
      )}>
        {sidebarOpen && (
          <SessionList
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
          />
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col" data-testid="chat-area">
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-3 bg-background/50 backdrop-blur-sm border-b border-border/20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="toggle-sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Navigator Assistant</h2>
        </div>

        {/* Messages */}
        <MessageList
          messages={messages}
          onActionApprove={handleActionApprove}
          onActionReject={handleActionReject}
          isTyping={isTyping}
        />

        {/* Input */}
        <InputArea
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}