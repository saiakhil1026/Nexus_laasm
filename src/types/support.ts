export interface MemoryItem {
  id: string;
  ticketId: string;
  date: string;
  category: 'network' | 'hardware' | 'billing' | 'configuration' | 'iot';
  summary: string;
  issueReported: string;
  rootCause?: string;
  attemptedFixes: string[];
  successfulFix: string;
  outcome: 'resolved' | 'unresolved' | 'escalated';
  sentiment: 'frustrated' | 'neutral' | 'satisfied' | 'relieved';
  technicalContext: {
    device?: string;
    firmware?: string;
    errorCodes?: string[];
    telemetryNotes?: string;
  };
  recurrenceCount: number;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  createdAt: string;
  status: 'closed' | 'open' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  stage: 1 | 2 | 3; // Step 1: Baseline, Step 2: Recall, Step 3: Chronic Escalation
  summary: string;
  suggestedPrompt: string;
  expectedAgentBehavior: string;
  whyJudgesCare: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  accountAge: string;
  device: string;
  firmware: string;
  ipSubnet: string;
  location: string;
  memories: MemoryItem[];
  tickets: Ticket[];
  currentTicketStage: 1 | 2 | 3;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  text: string;
  timestamp: string;
  recalledMemoryIds?: string[];
  escalationNotice?: {
    ticketNumber: string;
    tier: string;
    actionTaken: string;
    compensation?: string;
  };
  isRecallHighlight?: boolean;
}

export interface RecalledMemoryContext {
  recalledMemories: {
    memory: MemoryItem;
    similarityScore: number;
    matchReason: string;
  }[];
  recurrenceCount: number;
  isChronic: boolean;
  recommendedAction: 'standard_triage' | 'suggest_prior_fix' | 'proactive_escalate';
  reasoningSteps: string[];
  genericBotComparisonText: string;
}
