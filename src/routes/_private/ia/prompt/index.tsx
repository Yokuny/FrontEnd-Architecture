import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ItemDescription } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatContent, ChatMessage } from './@components/chat';
import { PromptInputBasic } from './@components/prompt-input-basic';
import { SparklesIcon } from './@components/sparkles-icon';
import { useAIPrompt } from './@hooks/use-prompt-api';
import { usePromptForm } from './@hooks/use-prompt-form';
import type { ChatMessage as ChatMessageType } from './@interface/prompt.types';

export const Route = createFileRoute('/_private/ia/prompt/')({
  component: AIPromptPage,
});

function ChatMessageItem({ msg }: ChatMessageProps) {
  const isAI = !msg.reply;

  return (
    <ChatMessage className={cn('flex flex-row', isAI ? 'justify-start' : 'justify-end')}>
      {isAI && <SparklesIcon size={18} className="text-muted-foreground mr-2" />}
      <ChatContent className={cn('max-w-[85%]', isAI ? 'bg-muted' : 'bg-muted-foreground text-primary-foreground')}>{msg.message}</ChatContent>
    </ChatMessage>
  );
}

function AIPromptPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const promptMutation = useAIPrompt();

  const handleSend = async (data: { question: string }) => {
    const userMessage: ChatMessageType = {
      message: data.question,
      date: new Date().toLocaleTimeString(),
      reply: true,
      type: 'text',
      sender: t('you') || 'Você',
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await promptMutation.mutateAsync({ question: data.question });
      const aiMessage: ChatMessageType = {
        message: response.text || '',
        date: new Date().toLocaleTimeString(),
        reply: false,
        type: 'text',
        sender: 'Bykonz IA',
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      // Error is handled by mutation state or can add a toast
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
  }, [messages, promptMutation.isPending]);

  return (
    <Card>
      <CardHeader title="Bykonz IA" />
      <CardContent>
        <ScrollArea className="h-[61.5vh]" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="w-full text-xl text-center">
              <ItemDescription>{t('can.i.help.you')}</ItemDescription>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2 pr-6">
              {messages.map((msg, i) => (
                <ChatMessageItem key={`${msg.sender}-${i}`} msg={msg} />
              ))}

              {promptMutation.isPending && (
                <ChatMessage className="animate-pulse">
                  <ChatContent className="bg-accent flex items-center justify-center border">
                    <SparklesIcon size={20} className="text-primary" />
                  </ChatContent>
                </ChatMessage>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <PromptInputBasic
          input={form.watch('question') || ''}
          onInputChange={(val: string) => form.setValue('question', val)}
          isLoading={promptMutation.isPending}
          onSubmit={onSubmit}
        />
      </CardFooter>
    </Card>
  );
}

interface ChatMessageProps {
  msg: ChatMessageType;
}
