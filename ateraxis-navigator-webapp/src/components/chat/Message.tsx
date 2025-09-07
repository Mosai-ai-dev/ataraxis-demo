'use client';

import { Message as MessageType } from '@/types/chat';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, User, Bot } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { InlineSystemAction } from './InlineSystemAction';
import { SLATimer } from './SLATimer';

interface MessageProps {
  message: MessageType;
  onActionApprove?: (action: any) => void;
  onActionReject?: (action: any) => void;
}

export function Message({ message, onActionApprove, onActionReject }: MessageProps) {
  const [actionStates, setActionStates] = useState<Record<string, 'approved' | 'rejected'>>({});
  
  const isUser = message.type === 'user';
  const isAI = message.type === 'ai' || message.type === 'action';
  
  const handleApprove = (action: any) => {
    setActionStates(prev => ({ ...prev, [action.id]: 'approved' }));
    onActionApprove?.(action);
  };
  
  const handleReject = (action: any) => {
    setActionStates(prev => ({ ...prev, [action.id]: 'rejected' }));
    onActionReject?.(action);
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div
      data-testid={`message-${message.id}`}
      className={cn(
        'flex gap-3 py-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {isAI && (
        <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
            <Bot className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1 space-y-3">
        <div className={cn(
          "rounded-2xl px-5 py-3.5 shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground ml-auto max-w-[85%]" 
            : "bg-muted/50 backdrop-blur-sm"
        )}>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* Inline System Actions */}
          {message.systemActions && message.systemActions.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.systemActions.map((action) => (
                <InlineSystemAction
                  key={action.id}
                  action={action}
                  onRelevanceFeedback={(id, relevance) => {
                    console.log(`Action ${id} marked as ${relevance}`);
                  }}
                />
              ))}
            </div>
          )}
          
          {/* SLA Timer */}
          {message.slaStatus && (
            <SLATimer slaStatus={message.slaStatus} />
          )}
        </div>
        
        {/* Action Cards */}
        {message.actions && message.actions.length > 0 && (
          <div className="space-y-2">
            {message.actions.map((action) => {
              const status = actionStates[action.id];
              
              return (
                <Card key={action.id} className="p-4 shadow-md border-border/30 bg-background/50 backdrop-blur-sm rounded-xl">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {action.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">
                            {action.description}
                          </span>
                        </div>
                        {action.preview && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {action.preview}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {!status && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(action)}
                          className="gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(action)}
                          className="gap-1"
                        >
                          <X className="h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {status && (
                      <Badge
                        variant={status === 'approved' ? 'default' : 'secondary'}
                        className="w-fit"
                      >
                        {status === 'approved' ? 'Approved' : 'Rejected'}
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        
      </div>
      
      {isUser && (
        <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-secondary/40 to-secondary/20 border border-secondary/30">
            <User className="h-5 w-5 text-secondary-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}