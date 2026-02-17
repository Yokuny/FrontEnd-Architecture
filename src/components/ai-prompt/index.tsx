import { ArrowDownNarrowWide, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EnterpriseSwitcher } from '@/components/sidebar/switch-enterprise';
import { ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  ChatInput,
  ChatSuggestions,
  ChatTyping,
  Message,
  MessageContent,
  MessageResponse,
  MessageToolbar,
  Reasoning,
  ReasoningClose,
  ReasoningContent,
  ReasoningTrigger,
} from '../ui/chat';
import { Skeleton } from '../ui/skeleton';
import { UI_CONSTANTS } from './@const';
import { useAIPromptForm } from './@hooks/use-ai-prompt-form';
import { useAIPromptStore } from './@hooks/use-ai-prompt-store';
import type { AIPromptSheetProps } from './@interface/ai-prompt.interface';

export function AIPromptSheet({ open, onOpenChange }: AIPromptSheetProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isProcessing = useAIPromptStore((state) => state.isProcessing);
  const { form, onSubmit, handleBackendSearch, messages, setMessages } = useAIPromptForm();

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
      <SheetContent side="right" className={cn('w-full', UI_CONSTANTS.SHEET_SIDE_WIDTH)}>
        <SheetHeader className="flex flex-row items-center">
          <div className="rounded-md border">
            <EnterpriseSwitcher />
          </div>
          <SheetTitle>{t('ai.assistant')}</SheetTitle>
        </SheetHeader>

        <div className="h-full min-h-0 w-full flex-1">
          <ScrollArea className="h-full w-full px-4" ref={scrollRef}>
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
                    <ItemContent key={`${msg.sender}-${i}`}>
                      {hasResults ? (
                        <Reasoning defaultOpen onClose={() => handleClearResults(i)}>
                          <div className="flex w-full items-center justify-between">
                            <ReasoningTrigger className="py-1 text-xs">
                              <p className="wrap-break-word min-w-0 flex-1 whitespace-normal text-left font-sans text-foreground">{msg.message}</p>
                            </ReasoningTrigger>
                            <ReasoningClose tooltip={t('clear')} />
                          </div>
                          <ReasoningContent className="max-w-xl">
                            {msg.isAccordionLoading ? (
                              <Skeleton className={cn('w-full', UI_CONSTANTS.SKELETON_HEIGHT)} />
                            ) : (
                              <ItemGroup>
                                {msg.assistantResults?.map((result, idx) => (
                                  <ChatSuggestions key={`${result.path}-${idx}`} result={result} onNavigate={handleNavigate} />
                                ))}
                              </ItemGroup>
                            )}
                          </ReasoningContent>
                        </Reasoning>
                      ) : (
                        <div className="mb-2 flex w-full flex-col gap-2">
                          <Message from={isAI ? 'assistant' : 'user'}>
                            {!msg.assistantResults && (
                              <MessageContent className={!isAI ? 'bg-muted text-foreground' : ''}>
                                {isAI ? <MessageResponse isAnimating={isProcessing && i === messages.length - 1}>{msg.message}</MessageResponse> : msg.message}
                              </MessageContent>
                            )}
                          </Message>
                          {isAI && msg.data && (
                            <Reasoning>
                              <ReasoningTrigger className="py-1 text-xs" icon={ArrowDownNarrowWide}>
                                <p>{t('ai.view_data')}</p>
                              </ReasoningTrigger>
                              <ReasoningContent className="max-w-xl">{`\`\`\`json\n${JSON.stringify(msg.data, null, 2)}\n\`\`\``}</ReasoningContent>
                            </Reasoning>
                          )}
                        </div>
                      )}

                      {isAI && msg.showBackendOption && (
                        <MessageToolbar
                          className="mt-2"
                          onClick={() => {
                            const userQuestion = messages[i - 1]?.message || '';
                            handleBackendSearch(userQuestion, i);
                          }}
                        >
                          <Search className="size-4" />
                          {t('ai.ask_backend')}
                        </MessageToolbar>
                      )}
                    </ItemContent>
                  );
                })}

                {isProcessing && (
                  <Message from="assistant">
                    <ChatTyping className="border bg-accent">{t('ai.thinking')}</ChatTyping>
                  </Message>
                )}
              </ItemContent>
            )}
          </ScrollArea>
        </div>

        <SheetFooter>
          <ChatInput input={form.watch('question') || ''} onInputChange={(val: string) => form.setValue('question', val)} isLoading={isProcessing} onSubmit={onSubmit} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
