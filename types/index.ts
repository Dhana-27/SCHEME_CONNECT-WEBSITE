export interface Scheme {
  id: string;
  title: string;
  category: string;
  amount: string;
  eligibility: string[];
  description: string;
  deadline: string;
  status: 'active' | 'upcoming' | 'closed';
  featured: boolean;
  applicants: number;
  successRate: number;
  targetAudience: string;
  documents: string[];
  processingTime: string;
  contactInfo: string;
}

export interface UserProfile {
  age?: number;
  category?: string;
  income?: string;
  location?: string;
  education?: string;
  businessType?: string;
  interests: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  action?: () => void;
}