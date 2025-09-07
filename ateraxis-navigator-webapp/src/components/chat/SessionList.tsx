'use client';

import { ChatSession } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionListProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export function SessionList({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession
}: SessionListProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffMs = now.getTime() - sessionDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return sessionDate.toLocaleDateString();
  };

  return (
    <div 
      className="w-80 flex flex-col h-full"
      data-testid="session-list"
    >
      <div className="p-4">
        <Button 
          onClick={onNewSession}
          className="w-full gap-2 justify-start rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border-0 font-medium transition-all hover:shadow-md"
          variant="ghost"
        >
          <Plus className="h-5 w-5" />
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-3 pb-3 space-y-2">
          {sessions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No previous conversations
            </div>
          )}
          
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={cn(
                'w-full text-left p-3 rounded-xl hover:bg-muted/50 transition-all group',
                currentSessionId === session.id && 'bg-muted/70 shadow-sm'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-lg bg-primary/10">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {session.title || 'New conversation'}
                  </div>
                  <div className="text-xs text-muted-foreground/70 truncate mt-0.5">
                    {formatDate(session.createdAt)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}