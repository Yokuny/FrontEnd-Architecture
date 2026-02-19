import type { z } from 'zod';
import type { RouteSemantic } from './ai-engine.interface';
import type { aiPromptSchema } from './ai-prompt.schema';

import type { IInsight, IInterpretedResponse, ITableData, IVisualization } from './ai-search.interface';

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
  // Campos para resposta rica da IA
  insights?: IInsight[];
  visualizations?: IVisualization[];
  tableData?: ITableData;
  kpis?: IInterpretedResponse['kpis'];
  summary?: IInterpretedResponse['summary'];
  responseFormat?: IInterpretedResponse['responseFormat'];
  metadata?: IInterpretedResponse['metadata'];
}

export interface AISearchRequest {
  prompt: string;
  context: {
    currentPath: string;
    mentions?: Record<string, unknown>;
  };
}

export interface AISearchResponse extends Partial<IInterpretedResponse> {
  success: boolean;
  error?: string;
  interpretation?: string; // Mantido para compatibilidade, mas o novo padrão usa 'answer'
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
