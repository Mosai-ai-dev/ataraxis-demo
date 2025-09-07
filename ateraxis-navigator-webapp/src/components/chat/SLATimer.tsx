'use client';

import { SLAStatus } from '@/types/chat';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SLATimerProps {
  slaStatus: SLAStatus;
}

export function SLATimer({ slaStatus }: SLATimerProps) {
  const getStatusIcon = () => {
    if (slaStatus.status.includes('✅') || slaStatus.status.includes('COMPLETED')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (slaStatus.status.includes('Urgent') || slaStatus.status.includes('Warning')) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    } else if (slaStatus.status.includes('Breach') || slaStatus.status.includes('Failed')) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  const getStatusColor = () => {
    if (slaStatus.status.includes('✅') || slaStatus.status.includes('COMPLETED')) {
      return 'border-green-500/20 bg-green-500/5';
    } else if (slaStatus.status.includes('Urgent') || slaStatus.status.includes('Warning')) {
      return 'border-yellow-500/20 bg-yellow-500/5';
    } else if (slaStatus.status.includes('Breach') || slaStatus.status.includes('Failed')) {
      return 'border-red-500/20 bg-red-500/5';
    }
    return 'border-blue-500/20 bg-blue-500/5';
  };

  const getBadgeVariant = () => {
    if (slaStatus.status.includes('✅') || slaStatus.status.includes('COMPLETED')) {
      return 'default';
    } else if (slaStatus.status.includes('Urgent') || slaStatus.status.includes('Warning')) {
      return 'secondary';
    } else if (slaStatus.status.includes('Breach') || slaStatus.status.includes('Failed')) {
      return 'destructive';
    }
    return 'outline';
  };

  return (
    <Card className={cn(
      "p-3 mt-2 transition-all",
      getStatusColor()
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {getStatusIcon()}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">SLA Timer</span>
              <Badge variant={getBadgeVariant()} className="text-xs">
                {slaStatus.status}
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-0.5">
              {slaStatus.startTime && (
                <div>Started: {slaStatus.startTime}</div>
              )}
              {slaStatus.responseTime && (
                <div>Response Time: {slaStatus.responseTime}</div>
              )}
              {slaStatus.timeElapsed && (
                <div>Time Elapsed: {slaStatus.timeElapsed}</div>
              )}
              {slaStatus.timeRemaining && (
                <div className="font-medium">Time Remaining: {slaStatus.timeRemaining}</div>
              )}
              {slaStatus.totalTime && (
                <div className="font-medium text-foreground">
                  Total Time: {slaStatus.totalTime}
                </div>
              )}
              {slaStatus.slaTarget && (
                <div>SLA Target: {slaStatus.slaTarget}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}