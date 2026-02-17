import { ArrowDownNarrowWide } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CursorClickIcon } from '@/components/sidebar/cursor-click-icon';
import { EnterpriseSwitcher } from '@/components/sidebar/switch-enterprise';
import { ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  ChatInput,
  ChatSuggestions,
  ChatTyping,
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  Message,
  MessageContent,
  MessageResponse,
  Reasoning,
  ReasoningClose,
  ReasoningContent,
  ReasoningTrigger,
} from '../ui/chat';
import { Shimmer } from '../ui/shimmer';
import { Skeleton } from '../ui/skeleton';
import { UI_CONSTANTS } from './@const';
import { useAIPromptForm } from './@hooks/use-ai-prompt-form';
import { useAIPromptStore } from './@hooks/use-ai-prompt-store';
import type { AIPromptSheetProps } from './@interface/ai-prompt.interface';

export function AIPromptSheet({ open, onOpenChange }: AIPromptSheetProps) {
  const { t } = useTranslation();

  const isProcessing = useAIPromptStore((state) => state.isProcessing);
  const { form, onSubmit, handleBackendSearch, messages, setMessages } = useAIPromptForm();

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

        <Conversation className="flex-1">
          {messages.length === 0 ? (
            <ConversationEmptyState>
              <ItemDescription className="text-xl">{t('can.i.help.you')}</ItemDescription>
            </ConversationEmptyState>
          ) : (
            <ConversationContent>
              {(() => {
                const lastBackendIndex = messages.reduce((acc, msg, idx) => (!msg.reply && msg.showBackendOption ? idx : acc), -1);

                return messages.map((msg, i) => {
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

                      {isAI && msg.showBackendOption && i === lastBackendIndex && (
                        <div className="flex w-full justify-end">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              const userQuestion = messages[i - 1]?.message || '';
                              handleBackendSearch(userQuestion, i);
                            }}
                          >
                            <Shimmer duration={3}>{t('ai.ask')}</Shimmer>
                            <CursorClickIcon size={20} className="shrink-0 text-muted-foreground" />
                          </Button>
                        </div>
                      )}
                    </ItemContent>
                  );
                });
              })()}

              {isProcessing && (
                <Message from="assistant">
                  <ChatTyping>{t('ai.thinking')}</ChatTyping>
                </Message>
              )}
            </ConversationContent>
          )}
          <ConversationScrollButton />
        </Conversation>

        <SheetFooter>
          <ChatInput input={form.watch('question') || ''} onInputChange={(val: string) => form.setValue('question', val)} isLoading={isProcessing} onSubmit={onSubmit} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
