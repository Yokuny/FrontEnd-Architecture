'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SparklesIcon } from '@/components/sidebar/sparkles-icon';
import { ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { NavigationResult } from './ai/navigationAgent';
import { useAIAssistant } from './ai/useAIAssistant';
import { ChatContent, ChatMessage } from './chat';
import { ChatInput } from './chat-input';
import { BYKONZ_AI_NAME } from './prompt.consts';
import type { ChatMessage as ChatMessageType } from './prompt.types';
import { createMessage } from './prompt-utils';
import { Suggestions } from './suggestions';
import { usePromptForm } from './use-prompt-form';

export function AIPromptSheet({ open, onOpenChange }: AIPromptSheetProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<(ChatMessageType & { assistantResults?: NavigationResult[] })[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { ask } = useAIAssistant();

  const handleSend = async (data: { question: string }) => {
    const userMessage = createMessage(data.question, t('you') || 'Você', true);

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Local AISearch for navigation
      const navigationResults = await ask(data.question);

      // AI Explanation/Response
      let responseText = '';

      if (!responseText) {
        if (navigationResults.length > 0) {
          responseText = `Encontrei ${navigationResults.length} rota(s) relacionada(s):`;
        } else {
          responseText =
            'Não encontrei nenhuma página específica no sistema para essa solicitação. Tente descrever o que você precisa fazer (ex: "ver consumo", "gerenciar usuários").';
        }
      }

      const aiMessage = {
        ...createMessage(responseText, BYKONZ_AI_NAME, false),
        assistantResults: navigationResults,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      // biome-ignore lint: debugging
      console.log('Erro no Assistant:', err);
      const errorMessage = {
        ...createMessage('Ocorreu um erro ao processar sua solicitação local. Verifique os logs do console.', BYKONZ_AI_NAME, false),
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
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
                return (
                  <ItemContent key={`${msg.sender}-${i}`} className="gap-2">
                    <ChatMessage className={cn('flex flex-row', isAI ? 'justify-start' : 'justify-end')}>
                      {isAI && <SparklesIcon size={18} className="mr-2 text-muted-foreground" />}
                      <ChatContent className={cn('max-w-[85%]', isAI ? 'bg-muted' : 'bg-muted-foreground text-primary-foreground')}>{msg.message}</ChatContent>
                    </ChatMessage>
                    {isAI && msg.assistantResults && msg.assistantResults.length > 0 && (
                      <ItemGroup className="ml-5 max-w-[80%]">
                        {msg.assistantResults.map((result, idx) => (
                          <Suggestions key={`${result.path}-${idx}`} result={result} onNavigate={handleNavigate} />
                        ))}
                      </ItemGroup>
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
