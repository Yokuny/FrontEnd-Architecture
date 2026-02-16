import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SparklesIcon } from '@/components/sidebar/sparkles-icon';
import { EnterpriseSwitcher } from '@/components/sidebar/switch-enterprise';
import { Button } from '@/components/ui/button';
import { ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ChatContent, ChatMessage } from '../ui/chat';
import { Skeleton } from '../ui/skeleton';
import { UI_CONSTANTS } from './@const';
import { useAIPromptForm } from './@hooks/use-ai-prompt-form';
import { useAIPromptStore } from './@hooks/use-ai-prompt-store';
import type { AIPromptSheetProps } from './@interface/ai-prompt.interface';
import { ChatInput } from './chat-input';
import { Suggestions } from './chat-suggestions';

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

        <ScrollArea className={cn('px-4', `h-[calc(100vh-${UI_CONSTANTS.SCROLL_AREA_OFFSET}px)]`)} ref={scrollRef}>
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
                              <Skeleton className={cn('w-full', UI_CONSTANTS.SKELETON_HEIGHT)} />
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
                      <div className="flex w-full flex-col gap-2">
                        <ChatMessage className={cn('flex flex-row', isAI ? 'justify-start' : 'justify-end')}>
                          {isAI ? (
                            <div className="flex max-w-[85%] items-end gap-2">
                              <p className="wrap-break-word whitespace-normal font-sans text-foreground text-sm">{msg.message}</p>
                            </div>
                          ) : (
                            <ChatContent className="max-w-[85%] bg-muted text-foreground">{msg.message}</ChatContent>
                          )}
                        </ChatMessage>
                        {isAI && msg.data && (
                          <div className="pl-6">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="data" className="border-none">
                                <AccordionTrigger className="justify-start py-1 text-muted-foreground text-xs hover:no-underline">{t('ai.view_data')}</AccordionTrigger>
                                <AccordionContent>
                                  <div className="max-h-60 overflow-auto rounded-md bg-muted p-2">
                                    <pre className="text-xs">{JSON.stringify(msg.data, null, 2)}</pre>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        )}
                      </div>
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
                          <Search size={UI_CONSTANTS.BACKEND_SEARCH_ICON_SIZE} />
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
                    <SparklesIcon size={UI_CONSTANTS.CHAT_APP_ICON_SIZE} className="text-primary" />
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
