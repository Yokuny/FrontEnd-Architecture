import type { z } from 'zod';
import type { RouteSemantic } from './ai-engine.interface';
import type { aiPromptSchema } from './ai-prompt.schema';

export type AIPromptData = z.infer<typeof aiPromptSchema>;

export interface ChatMessageType {
  message: string;
  date: string;
  reply: boolean;
  type: 'text';
  sender: string;
  avatar?: string;
  showBackendOption?: boolean;
  data?: any;
}

export interface ChatMessageExtended extends ChatMessageType {
  assistantResults?: NavigationResult[];
  isAccordionLoading?: boolean;
  showBackendOption?: boolean;
}

export interface AISearchRequest {
  prompt: string;
  context: {
    currentPath: string;
  };
}

export interface AISearchResponse {
  success: boolean;
  interpretation?: string;
  data?: any[];
  error?: string;
  query?: any;
  metadata?: any;
}

export interface NavigationResult {
  route: RouteSemantic;
  path: string;
  params: Record<string, string>;
  fullUrl: string;
  confidence: number;
}

export interface PromptInputBasicProps {
  input: string;
  onInputChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export interface AIPromptSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface AssistantPanelProps {
  result: NavigationResult | null;
  onNavigate?: () => void;
}
