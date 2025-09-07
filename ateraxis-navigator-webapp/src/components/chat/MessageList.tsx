'use client';

import { useEffect, useRef } from 'react';
import { Message as MessageType } from '@/types/chat';
import { Message } from './Message';
import { SystemMessage } from './SystemMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot } from 'lucide-react';

interface MessageListProps {
  messages: MessageType[];
  onActionApprove?: (action: any) => void;
  onActionReject?: (action: any) => void;
  isTyping?: boolean;
}

export function MessageList({ 
  messages, 
  onActionApprove, 
  onActionReject,
  isTyping 
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <ScrollArea 
      className="flex-1" 
      data-testid="scroll-area"
    >
      <div 
        className="max-w-3xl mx-auto py-8 px-4"
        data-testid="message-list"
      >
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-6">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">Welcome to Navigator</h1>
            <p className="text-lg text-muted-foreground">How can I assist you today?</p>
          </div>
        )}
        
        {messages.map((message) => (
          message.type === 'system' ? (
            <SystemMessage
              key={message.id}
              message={message}
              onRelevanceFeedback={(id, relevance) => {
                console.log(`Message ${id} marked as ${relevance}`);
              }}
            />
          ) : (
            <Message
              key={message.id}
              message={message}
              onActionApprove={onActionApprove}
              onActionReject={onActionReject}
            />
          )
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="bg-gradient-to-r from-muted to-muted/80 rounded-2xl px-5 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-pulse" />
                <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}