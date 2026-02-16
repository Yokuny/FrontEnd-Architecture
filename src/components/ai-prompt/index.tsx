'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SparklesIcon } from '@/components/sidebar/sparkles-icon';
import { EnterpriseSwitcher } from '@/components/sidebar/switch-enterprise';
import { Button } from '@/components/ui/button';
import { ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAIApi } from '@/hooks/use-ai-api';
import { useAIAssistant } from '@/hooks/use-ai-assistant';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Skeleton } from '../ui/skeleton';
import type { NavigationResult } from './ai/navigationAgent';
import { ChatContent, ChatMessage } from './chat';
import { ChatInput } from './chat-input';
import { Suggestions } from './chat-suggestions';
import { BYKONZ_AI_NAME } from './prompt.consts';
import type { ChatMessageType } from './prompt.types';
import { createMessage } from './prompt-utils';
import { usePromptForm } from './use-prompt-form';

export function AIPromptSheet({ open, onOpenChange }: AIPromptSheetProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<(ChatMessageType & { assistantResults?: NavigationResult[]; isAccordionLoading?: boolean })[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { ask } = useAIAssistant();
  const { search } = useAIApi();

  const handleBackendSearch = async (question: string, index: number) => {
    setIsProcessing(true);
    // Remove o botão após o clique
    setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, showBackendOption: false } : msg)));

    try {
      const result = await search.mutateAsync({
        prompt: question,
        context: {
          currentPath: window.location.pathname,
        },
      });

      const { success, interpretation, error } = result;

      if (!success) {
        const errorMessage = {
          ...createMessage(error || t('ai.backend_error'), BYKONZ_AI_NAME, false),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const aiMessage = {
        ...createMessage(interpretation || t('ai.backend_success'), BYKONZ_AI_NAME, false),
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

  const handleSend = async (data: { question: string }) => {
    const userMessage = createMessage(data.question, t('you'), true);

    setMessages((prev) => [...prev, userMessage]);
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
          }, 800);
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

  const { form, onSubmit } = usePromptForm(handleSend);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll needs to trigger on new messages
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isProcessing]);

  const handleNavigate = () => {
    onOpenChange(false);
  };

  const handleClearResults = (index: number) => {
    setMessages((prev) => prev.map((msg, idx) => (idx === index ? { ...msg, assistantResults: [] } : msg)));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader className="flex flex-row items-center">
          <div className="rounded-md border">
            <EnterpriseSwitcher />
          </div>
          <SheetTitle>{t('ai.assistant')}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] px-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="w-full text-center text-xl">
              <ItemDescription>{t('can.i.help.you')}</ItemDescription>
            </div>
          ) : (
            <ItemContent>
              {messages.map((msg, i) => {
                const isAI = !msg.reply;
                const hasResults = isAI && msg.assistantResults && msg.assistantResults.length > 0;

                return (
                  <ItemContent key={`${msg.sender}-${i}`} className="gap-4">
                    {hasResults ? (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="suggestions" className="border-none">
                          <AccordionTrigger className="px-0 py-2 hover:no-underline">
                            <div className="flex w-full items-end justify-between gap-2">
                              <p className="wrap-break-word whitespace-normal font-sans text-foreground text-sm">{msg.message}</p>
                              <Button variant="ghost" size="sm" className="size-5" onClick={() => handleClearResults(i)}>
                                <X className="size-3" />
                              </Button>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            {msg.isAccordionLoading ? (
                              <Skeleton className="h-12 w-full" />
                            ) : (
                              <ItemGroup>
                                {msg.assistantResults?.map((result, idx) => (
                                  <Suggestions key={`${result.path}-${idx}`} result={result} onNavigate={handleNavigate} />
                                ))}
                              </ItemGroup>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <ChatMessage className={cn('flex flex-row', isAI ? 'justify-start' : 'justify-end')}>
                        {isAI ? (
                          <div className="flex max-w-[85%] items-end gap-2">
                            <p className="wrap-break-word whitespace-normal font-sans text-foreground text-sm">{msg.message}</p>
                          </div>
                        ) : (
                          <ChatContent className="max-w-[85%] bg-muted text-foreground">{msg.message}</ChatContent>
                        )}
                      </ChatMessage>
                    )}

                    {isAI && msg.showBackendOption && (
                      <div className="mt-2 flex justify-start pl-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-primary text-xs hover:bg-primary/10 hover:text-primary"
                          onClick={() => {
                            const userQuestion = messages[i - 1]?.message || '';
                            handleBackendSearch(userQuestion, i);
                          }}
                          disabled={isProcessing}
                        >
                          <Search size={12} />
                          {t('ai.ask_backend')}
                        </Button>
                      </div>
                    )}
                  </ItemContent>
                );
              })}

              {isProcessing && (
                <ChatMessage className="animate-pulse">
                  <ChatContent className="flex items-center justify-center border bg-accent">
                    <SparklesIcon size={20} className="text-primary" />
                  </ChatContent>
                </ChatMessage>
              )}
            </ItemContent>
          )}
        </ScrollArea>

        <SheetFooter>
          <ChatInput input={form.watch('question') || ''} onInputChange={(val: string) => form.setValue('question', val)} isLoading={isProcessing} onSubmit={onSubmit} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface AIPromptSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
