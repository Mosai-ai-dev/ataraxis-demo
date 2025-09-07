'use client';

import { useState } from 'react';
import { Message as MessageType } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  Database, 
  Server, 
  Activity,
  ThumbsDown,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemMessageProps {
  message: MessageType;
  onRelevanceFeedback?: (messageId: string, relevance: 'not_relevant' | 'pruned') => void;
}

export function SystemMessage({ message, onRelevanceFeedback }: SystemMessageProps) {
  const [isCollapsed, setIsCollapsed] = useState(message.systemAction?.isCollapsed ?? true);
  const [relevance, setRelevance] = useState(message.systemAction?.relevance);
  
  const systemAction = message.systemAction;
  if (!systemAction) return null;
  
  const getIcon = () => {
    switch (systemAction.type) {
      case 'data_retrieval':
        return <Database className="h-4 w-4" />;
      case 'system_access':
        return <Server className="h-4 w-4" />;
      case 'action_execution':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };
  
  const handleRelevanceFeedback = (type: 'not_relevant' | 'pruned') => {
    setRelevance(type);
    onRelevanceFeedback?.(message.id, type);
  };
  
  const formatData = (data: any) => {
    if (!data) return null;
    
    return (
      <div className="mt-3 space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="text-sm">
            <span className="font-medium text-muted-foreground">
              {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}:
            </span>{' '}
            {typeof value === 'object' ? (
              <div className="ml-4 mt-1">
                {formatData(value)}
              </div>
            ) : (
              <span className="text-foreground">{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  if (relevance === 'pruned') {
    return (
      <div className="flex items-center gap-2 py-1 px-3 text-xs text-muted-foreground/50">
        <XCircle className="h-3 w-3" />
        <span>System action pruned (not relevant)</span>
      </div>
    );
  }
  
  return (
    <div 
      data-testid={`system-message-${message.id}`}
      className={cn(
        "py-2 transition-opacity",
        relevance === 'not_relevant' && "opacity-50"
      )}
    >
      <Card className="bg-muted/20 border-muted/30 shadow-sm">
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex-1 flex items-start gap-2 text-left hover:bg-muted/30 rounded p-1 -m-1 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 mt-0.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 mt-0.5 text-muted-foreground" />
              )}
              {getIcon()}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{systemAction.action}</span>
                  <Badge variant="outline" className="text-xs">
                    {systemAction.system}
                  </Badge>
                  {relevance === 'not_relevant' && (
                    <Badge variant="secondary" className="text-xs">
                      Not Relevant
                    </Badge>
                  )}
                </div>
                {message.content && (
                  <p className="text-xs text-muted-foreground mt-1">{message.content}</p>
                )}
              </div>
            </button>
            
            {!relevance && (
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => handleRelevanceFeedback('not_relevant')}
                  title="Mark as not relevant"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => handleRelevanceFeedback('pruned')}
                  title="Prune this information"
                >
                  <XCircle className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
            
            {relevance === 'not_relevant' && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setRelevance(undefined)}
                title="Mark as relevant"
              >
                <CheckCircle className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          
          {!isCollapsed && systemAction.data && (
            <div className="mt-3 pt-3 border-t border-border/20">
              {formatData(systemAction.data)}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}