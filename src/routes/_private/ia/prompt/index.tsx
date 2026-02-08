import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ItemDescription, ItemGroup } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SparklesIcon } from '../../../../components/sidebar/sparkles-icon';
import { ChatContent, ChatMessage } from './@components/chat';
import { ChatInput } from './@components/chat-input';
import { Suggestions } from './@components/suggestions';
import { BYKONZ_AI_NAME } from './@consts/prompt.consts';
// import { useAIPrompt } from './@hooks/use-prompt-api';
import { usePromptForm } from './@hooks/use-prompt-form';
import type { ChatMessage as ChatMessageType } from './@interface/prompt.types';
import type { NavigationResult } from './@utils/ai/navigationAgent';
import { useAIAssistant } from './@utils/ai/useAIAssistant';
import { createMessage } from './@utils/prompt-utils';

export const Route = createFileRoute('/_private/ia/prompt/')({
  component: AIPromptPage,
});

function ChatMessageItem({ msg, assistantResults }: ChatMessageProps) {
  const isAI = !msg.reply;

  return (
    <div className="flex flex-col gap-2">
      <ChatMessage className={cn('flex flex-row', isAI ? 'justify-start' : 'justify-end')}>
        {isAI && <SparklesIcon size={18} className="mr-2 text-muted-foreground" />}
        <ChatContent className={cn('max-w-[85%]', isAI ? 'bg-muted' : 'bg-muted-foreground text-primary-foreground')}>{msg.message}</ChatContent>
      </ChatMessage>
      {isAI && assistantResults && assistantResults.length > 0 && (
        <ItemGroup className="ml-5 max-w-[80%]">
          {assistantResults.map((result, idx) => (
            <Suggestions key={`${result.path}-${idx}`} result={result} />
          ))}
        </ItemGroup>
      )}
    </div>
  );
}

function AIPromptPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<(ChatMessageType & { assistantResults?: NavigationResult[] })[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // const promptMutation = useAIPrompt();
  // const { ask, explain } = useAIAssistant();
  const { ask } = useAIAssistant();

  const handleSend = async (data: { question: string }) => {
    const userMessage = createMessage(data.question, t('you') || 'Você', true);

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // 1. Backend response ignored as requested
      // const response = await promptMutation.mutateAsync({ question: data.question });

      // 2. Local AISearch for navigation
      const navigationResults = await ask(data.question);

      // 3. AI Explanation/Response (Powerful AI)
      // let responseText = await explain(data.question);
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

  return (
    <Card>
      <CardHeader />
      <CardContent>
        <ScrollArea className="h-[61.5vh]" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="w-full text-center text-xl">
              <ItemDescription>{t('can.i.help.you')}</ItemDescription>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4 pr-6">
              {messages.map((msg, i) => (
                <ChatMessageItem key={`${msg.sender}-${i}`} msg={msg} assistantResults={msg.assistantResults} />
              ))}

              {isProcessing && (
                <ChatMessage className="animate-pulse">
                  <ChatContent className="flex items-center justify-center border bg-accent">
                    <SparklesIcon size={20} className="text-primary" />
                  </ChatContent>
                </ChatMessage>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <ChatInput input={form.watch('question') || ''} onInputChange={(val: string) => form.setValue('question', val)} isLoading={isProcessing} onSubmit={onSubmit} />
      </CardFooter>
    </Card>
  );
}

interface ChatMessageProps {
  msg: ChatMessageType;
  assistantResults?: NavigationResult[];
}
