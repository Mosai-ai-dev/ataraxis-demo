import { Message, Action } from '@/types/chat';
import mockData from '@/mocks/messages.json';
import benefitsSession from '@/mocks/benefitsSession.json';
import payrollSession from '@/mocks/payrollSession.json';

// Generate unique IDs
let messageIdCounter = 0;
const generateId = () => `msg-${Date.now()}-${++messageIdCounter}`;

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get random item from array
const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Simulate typing effect
export const simulateTyping = async (
  text: string, 
  onUpdate: (partial: string) => void,
  speed: number = 30
) => {
  let partial = '';
  for (const char of text) {
    partial += char;
    onUpdate(partial);
    await delay(speed);
  }
};

// Get mock AI response
export const getMockAIResponse = async (userMessage: string): Promise<Message> => {
  // Simulate thinking time (0.5-2 seconds)
  await delay(500 + Math.random() * 1500);
  
  const responseText = getRandomItem(mockData.aiResponses);
  
  // 30% chance to include an action suggestion
  const includeAction = Math.random() < 0.3;
  const actions: Action[] = includeAction ? [{
    id: generateId(),
    ...getRandomItem(mockData.actionSuggestions)
  } as Action] : [];
  
  return {
    id: generateId(),
    sessionId: 'current',
    type: includeAction ? 'action' : 'ai',
    content: responseText,
    timestamp: new Date(),
    actions
  };
};

// Get sample sessions for sidebar
export const getSampleSessions = () => {
  const sessions = [
    {
      id: 'benefits-inquiry-001',
      title: 'Employee Benefits - Sarah Johnson',
      createdAt: '2024-01-15T09:30:00Z'
    },
    {
      id: 'payroll-discrepancy-002',
      title: 'Payroll Discrepancy - Alex Rivera',
      createdAt: '2024-01-15T14:15:00Z'
    }
  ];
  
  return sessions.map(session => ({
    ...session,
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.createdAt),
    messages: []
  }));
};

// Process action approval/rejection
export const processAction = async (action: Action, approved: boolean) => {
  await delay(1000); // Simulate API call
  
  if (approved) {
    return {
      success: true,
      message: `Action "${action.description}" has been executed successfully.`
    };
  } else {
    return {
      success: true,
      message: `Action "${action.description}" has been cancelled.`
    };
  }
};

// Get messages for a specific session
export const getSessionMessages = async (sessionId: string): Promise<Message[]> => {
  await delay(300); // Simulate API call
  
  if (sessionId === 'benefits-inquiry-001') {
    return benefitsSession.session.messages.map(msg => ({
      ...msg,
      type: msg.type as "user" | "ai" | "action" | "system",
      timestamp: new Date(msg.timestamp)
    })) as Message[];
  }
  
  if (sessionId === 'payroll-discrepancy-002') {
    return payrollSession.session.messages.map(msg => ({
      ...msg,
      type: msg.type as "user" | "ai" | "action" | "system",
      timestamp: new Date(msg.timestamp),
      slaStatus: msg.slaStatus // Include SLA status if present
    })) as Message[];
  }
  
  // Return empty array for other sessions for now
  return [];
};