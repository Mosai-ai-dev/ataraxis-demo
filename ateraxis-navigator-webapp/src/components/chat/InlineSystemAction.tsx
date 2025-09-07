'use client';

import { useState } from 'react';
import { SystemAction } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight, 
  Database, 
  Server, 
  Activity,
  ThumbsDown,
  XCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineSystemActionProps {
  action: SystemAction;
  onRelevanceFeedback?: (actionId: string, relevance: 'not_relevant' | 'pruned') => void;
}

export function InlineSystemAction({ action, onRelevanceFeedback }: InlineSystemActionProps) {
  const [isCollapsed, setIsCollapsed] = useState(action.isCollapsed ?? true);
  const [relevance, setRelevance] = useState(action.relevance);
  
  const getIcon = () => {
    switch (action.type) {
      case 'data_retrieval':
        return <Database className="h-3 w-3" />;
      case 'system_access':
        return <Server className="h-3 w-3" />;
      case 'action_execution':
        return <Activity className="h-3 w-3" />;
      default:
        return <Loader2 className="h-3 w-3 animate-spin" />;
    }
  };
  
  const handleRelevanceFeedback = (type: 'not_relevant' | 'pruned') => {
    setRelevance(type);
    onRelevanceFeedback?.(action.id, type);
  };
  
  const formatData = (data: any, level = 0): JSX.Element | null => {
    if (!data) return null;
    
    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
      return <span className="text-xs">{String(data)}</span>;
    }
    
    if (Array.isArray(data)) {
      return (
        <div className="space-y-1">
          {data.map((item, index) => (
            <div key={index} className="text-xs">
              • {formatData(item, level + 1)}
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="text-xs">
            <span className="font-medium text-muted-foreground">
              {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}:
            </span>{' '}
            {typeof value === 'object' ? (
              <div className="ml-3 mt-0.5">
                {formatData(value, level + 1)}
              </div>
            ) : (
              <span>{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  if (relevance === 'pruned') {
    return null;
  }
  
  return (
    <div 
      className={cn(
        "my-2 p-2 rounded-lg bg-muted/30 border border-border/20 text-sm transition-all",
        relevance === 'not_relevant' && "opacity-40"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex-1 flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-3 w-3 flex-shrink-0" />
          )}
          {getIcon()}
          <span className="text-xs font-medium text-muted-foreground">
            {action.action}
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {action.system}
          </Badge>
        </button>
        
        {!relevance && (
          <div className="flex gap-0.5">
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={() => handleRelevanceFeedback('not_relevant')}
              title="Mark as not relevant"
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={() => handleRelevanceFeedback('pruned')}
              title="Remove this information"
            >
              <XCircle className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {relevance === 'not_relevant' && (
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={() => setRelevance(undefined)}
            title="Mark as relevant"
          >
            <CheckCircle className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {!isCollapsed && action.data && (
        <div className="mt-2 pt-2 border-t border-border/10 pl-7">
          {formatData(action.data)}
        </div>
      )}
    </div>
  );
}