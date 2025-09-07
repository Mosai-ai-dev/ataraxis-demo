export interface KnowledgeItem {
  id: string;
  type: 'finding' | 'workflow_suggestion';
  title: string;
  description: string;
  submittedBy: 'ai_agent';
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}