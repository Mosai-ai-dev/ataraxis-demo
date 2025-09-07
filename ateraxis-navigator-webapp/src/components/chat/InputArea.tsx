'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function InputArea({ onSend, isLoading }: InputAreaProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="border-t border-border/20 px-6 py-4 bg-gradient-to-t from-background/80 to-background/60 backdrop-blur-sm"
      data-testid="input-area"
    >
      <div className="max-w-3xl mx-auto">
        <div className="relative flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              disabled={isLoading}
              className="min-h-[56px] max-h-[200px] resize-none rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/30 px-5 py-4 pr-14 shadow-sm transition-all focus:bg-muted/70 focus:shadow-md"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              size="icon"
              className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shadow-md transition-all hover:shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" data-testid="loading-indicator" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-center mt-3 opacity-60">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}