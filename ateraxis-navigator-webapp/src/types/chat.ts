export interface Message {
  id: string;
  sessionId: string;
  type: 'user' | 'ai' | 'action' | 'system';
  content: string;
  timestamp: Date;
  actions?: Action[];
  systemAction?: SystemAction;
  systemActions?: SystemAction[]; // Multiple system actions within a message
  slaStatus?: SLAStatus; // SLA tracking information
  status?: 'pending' | 'completed' | 'failed';
}

export interface SLAStatus {
  startTime: string;
  currentTime?: string;
  responseTime?: string;
  timeElapsed?: string;
  timeRemaining?: string;
  totalTime?: string;
  slaTarget?: string;
  status: string;
}

export interface Action {
  id: string;
  type: 'podium' | 'email' | 'teams' | 'workflow' | 'jira' | 'lookup';
  description: string;
  preview?: string;
  requiresApproval: boolean;
}

export interface SystemAction {
  id: string;
  type: 'data_retrieval' | 'system_access' | 'action_execution';
  system: string;
  action: string;
  data?: any;
  isCollapsed?: boolean;
  relevance?: 'relevant' | 'not_relevant' | 'pruned';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}