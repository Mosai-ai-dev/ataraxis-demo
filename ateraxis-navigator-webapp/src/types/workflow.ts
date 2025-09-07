export interface WorkflowStep {
  id: string;
  name: string;
  type: 'system_action' | 'decision' | 'wait' | 'complete';
  status: 'pending' | 'active' | 'completed' | 'failed' | 'waiting';
  timestamp?: Date;
  duration?: string;
  data?: any;
  nextSteps?: string[];
}

export interface WorkflowInstance {
  id: string;
  workflowType: string;
  name: string;
  status: 'active' | 'waiting' | 'completed' | 'failed';
  startedAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  currentStep: string;
  steps: WorkflowStep[];
  trigger: {
    type: 'manual' | 'event' | 'scheduled';
    source?: string;
    data?: any;
  };
  waitingFor?: {
    type: 'text_response' | 'sla_timer' | 'ticket_update' | 'approval' | 'teams_response';
    description: string;
    deadline?: Date;
  };
  context?: {
    employee?: string;
    company?: string;
    ticketId?: string;
    messageId?: string;
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'support' | 'escalation' | 'data' | 'communication';
  triggerType: 'manual' | 'event' | 'both';
  requiredInputs?: string[];
  estimatedDuration?: string;
  icon?: string;
}

export interface WorkflowEvent {
  id: string;
  type: 'podium_text' | 'email_received' | 'voicemail' | 'sla_breach' | 'ticket_update';
  source: string;
  timestamp: Date;
  data: any;
  status: 'pending' | 'assigned' | 'processed';
  suggestedWorkflow?: string;
}