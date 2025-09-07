export interface Interaction {
  id: string;
  timestamp: Date;
  duration: string;
  user: {
    name: string;
    role: string;
  };
  employee?: {
    name: string;
    company: string;
  };
  type: 'chat' | 'text' | 'email' | 'voicemail';
  status: 'successful' | 'escalated' | 'failed' | 'partial';
  transcript: TranscriptEntry[];
  decisions: AIDecision[];
  outcome?: string;
}

export interface TranscriptEntry {
  timestamp: Date;
  speaker: 'user' | 'ai' | 'system';
  content: string;
  metadata?: any;
}

export interface AIDecision {
  id: string;
  timestamp: Date;
  type: 'routing' | 'response' | 'action' | 'escalation';
  description: string;
  confidence: number;
  reasoning?: string;
  outcome: 'correct' | 'incorrect' | 'partial' | 'pending_review';
  requiresReview: boolean;
  systemsAccessed?: string[];
  dataUsed?: any;
  feedback?: DecisionFeedback;
}

export interface DecisionFeedback {
  id: string;
  submittedBy: string;
  submittedAt: Date;
  rating: 'correct' | 'incorrect' | 'partial';
  comments?: string;
  suggestedCorrection?: string;
  status: 'pending' | 'acknowledged' | 'implemented';
  impactScore?: number;
}

export interface Metric {
  name: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  changePercent?: number;
  period?: string;
}

export interface LearningItem {
  id: string;
  type: 'pattern' | 'response' | 'workflow' | 'knowledge';
  source: 'interaction' | 'feedback' | 'manual';
  submittedAt: Date;
  submittedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  content: {
    problem: string;
    solution: string;
    category?: string;
    confidence?: number;
  };
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
}