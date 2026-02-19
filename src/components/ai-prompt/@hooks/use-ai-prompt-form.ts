import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type ChatHistoryMessage, useAIApi } from '@/hooks/use-ai-api';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { BYKONZ_AI_NAME, UI_CONSTANTS } from '../@const';
import type { AIPromptData, ChatMessageExtended } from '../@interface/ai-prompt.interface';
import { aiPromptSchema } from '../@interface/ai-prompt.schema';
import { createMessage } from '../@utils/ai-prompt.utils';
import { useAIPromptStore } from './use-ai-prompt-store';

function mapHistoryToMessages(historyMessages: ChatHistoryMessage[]): ChatMessageExtended[] {
  return historyMessages.map((msg) => {
    const isUser = msg.role === 'user';
    const base = createMessage(msg.content, isUser ? 'You' : BYKONZ_AI_NAME, isUser);

    if (!isUser && msg.metadata) {
      return {
        ...base,
        insights: msg.metadata.insights as ChatMessageExtended['insights'],
        visualizations: msg.metadata.visualizations as ChatMessageExtended['visualizations'],
        kpis: msg.metadata.kpis as ChatMessageExtended['kpis'],
        tableData: msg.metadata.tableData as ChatMessageExtended['tableData'],
        summary: msg.metadata.summary as ChatMessageExtended['summary'],
        responseFormat: msg.metadata.responseFormat as ChatMessageExtended['responseFormat'],
        data: msg.metadata.data as ChatMessageExtended['data'],
      };
    }

    return base;
  });
}

export function useAIPromptForm() {
  const { t } = useTranslation();
  const { ask } = useAIAssistant();
  const { search, history, clearHistory } = useAIApi();
  const { messages, setMessages, setIsProcessing, clearMessages } = useAIPromptStore();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    if (messages.length > 0) {
      hasHydrated.current = true;
      return;
    }
    if (history.data?.success && history.data.messages.length > 0) {
      hasHydrated.current = true;
      const restored = mapHistoryToMessages(history.data.messages);
      setMessages(restored);
    }
  }, [history.data, messages.length, setMessages]);

  const handleClearMessages = () => {
    clearMessages();
    clearHistory.mutate();
  };

  const form = useForm<AIPromptData>({
    resolver: zodResolver(aiPromptSchema),
    defaultValues: {
      question: '',
    },
  });

  const handleBackendSearch = async (question: string, mentions: Record<string, unknown> = {}, index?: number) => {
    setIsProcessing(true);
    if (index !== undefined) {
      setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, showBackendOption: false } : msg)));
    }

    try {
      const result = await search.mutateAsync({
        prompt: question,
        context: {
          currentPath: window.location.pathname,
          ...mentions,
        },
      });

      const { success, answer, interpretation, data, error, insights, visualizations, tableData, kpis, summary, responseFormat, metadata } = result;

      if (!success) {
        const errorMessage = {
          ...createMessage(error ? t(error) : t('ai.backend_error'), BYKONZ_AI_NAME, false),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const answerContent = answer?.startsWith('ai.error.') ? t(answer) : answer;
      const interpretationContent = interpretation?.startsWith('ai.error.') ? t(interpretation) : interpretation;

      const aiMessage = {
        ...createMessage(answerContent || interpretationContent || t('ai.backend_success'), BYKONZ_AI_NAME, false),
        data,
        insights,
        visualizations,
        tableData,
        kpis,
        summary,
        responseFormat,
        metadata,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (_err) {
      const errorMessage = {
        ...createMessage(t('ai.backend_error'), BYKONZ_AI_NAME, false),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = async (data: AIPromptData) => {
    const userMessage = createMessage(data.question, t('you'), true);

    // Remove all previous showBackendOption flags
    setMessages((prev) => [...prev.map((msg) => ({ ...msg, showBackendOption: false })), userMessage]);
    setIsProcessing(true);

    try {
      // Local AISearch for navigation
      const navigationResults = await ask(data.question);

      // AI Explanation/Response
      let responseText = '';

      if (!responseText) {
        if (navigationResults.length > 0) {
          responseText = t('ai.routes_found', { count: navigationResults.length });
        } else {
          responseText = t('ai.no_routes_found');
        }
      }

      const aiMessage = {
        ...createMessage(responseText, BYKONZ_AI_NAME, false),
        assistantResults: navigationResults,
        showBackendOption: false,
        isAccordionLoading: navigationResults.length > 0,
      };

      setMessages((prev) => {
        const next = [...prev, aiMessage];
        if (navigationResults.length > 0) {
          const aiIndex = next.length - 1;
          setTimeout(() => {
            setMessages((current) => current.map((m, idx) => (idx === aiIndex ? { ...m, isAccordionLoading: false } : m)));
          }, UI_CONSTANTS.SIMULATED_ACCORDION_DELAY);
        }
        return next;
      });

      // Automate Backend Search
      const mentionsMap =
        data.mentions?.reduce((acc: Record<string, unknown>, curr) => {
          acc[curr.name] = curr;
          return acc;
        }, {}) || {};

      await handleBackendSearch(data.question, mentionsMap);
    } catch (err) {
      // biome-ignore lint: debugging
      console.log('Erro no Assistant:', err);
      const errorMessage = {
        ...createMessage(t('ai.error_processing'), BYKONZ_AI_NAME, false),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = form.handleSubmit((data) => {
    handleSend(data);
    form.reset();
  });

  return {
    form,
    onSubmit,
    handleBackendSearch,
    handleClearMessages,
    messages,
    setMessages,
  };
}
