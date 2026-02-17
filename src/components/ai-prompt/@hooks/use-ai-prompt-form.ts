import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAIApi } from '@/hooks/use-ai-api';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { BYKONZ_AI_NAME, UI_CONSTANTS } from '../@const';
import type { AIPromptData } from '../@interface/ai-prompt.interface';
import { aiPromptSchema } from '../@interface/ai-prompt.schema';
import { createMessage } from '../@utils/ai-prompt.utils';
import { useAIPromptStore } from './use-ai-prompt-store';

export function useAIPromptForm() {
  const { t } = useTranslation();
  const { ask } = useAIAssistant();
  const { search } = useAIApi();
  const { messages, setMessages, setIsProcessing } = useAIPromptStore();

  const form = useForm<AIPromptData>({
    resolver: zodResolver(aiPromptSchema),
    defaultValues: {
      question: '',
    },
  });

  const handleBackendSearch = async (question: string, index: number) => {
    setIsProcessing(true);
    setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, showBackendOption: false } : msg)));

    try {
      const result = await search.mutateAsync({
        prompt: question,
        context: {
          currentPath: window.location.pathname,
        },
      });

      const { success, answer, interpretation, data, error, insights, visualizations, kpis, summary, responseFormat, metadata } = result;

      if (!success) {
        const errorMessage = {
          ...createMessage(error || t('ai.backend_error'), BYKONZ_AI_NAME, false),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const aiMessage = {
        ...createMessage(answer || interpretation || t('ai.backend_success'), BYKONZ_AI_NAME, false),
        data,
        insights,
        visualizations,
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
        showBackendOption: true,
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
    messages,
    setMessages,
  };
}
