import { ArrowDownNarrowWide } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EnterpriseSwitcher } from '@/components/sidebar/switch-enterprise';
import { ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  ChatInput,
  ChatSuggestions,
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
import { RotatingText } from '../ui/rotating-text';
import { Skeleton } from '../ui/skeleton';
import { AIInsights } from './@components/ai-insights';
import { AIKpiCards } from './@components/ai-kpi-cards';
import { AITable } from './@components/ai-table';
import { AIVisualizationList } from './@components/ai-visualization';
import { MentionDropdown } from './@components/mention-dropdown';
import { useAIPromptForm } from './@hooks/use-ai-prompt-form';
import { useAIPromptStore } from './@hooks/use-ai-prompt-store';
import { useMentionData } from './@hooks/use-mention-data';
import { useMentionInput } from './@hooks/use-mention-input';
import type { AIPromptSheetProps } from './@interface/ai-prompt.interface';

export function AIPromptSheet({ open, onOpenChange }: AIPromptSheetProps) {
  const { t } = useTranslation();

  const isProcessing = useAIPromptStore((state) => state.isProcessing);
  const { form, onSubmit, messages, setMessages } = useAIPromptForm();

  const { categories, getItems } = useMentionData();
  const mention = useMentionInput({
    categories,
    getItems,
    onSubmit: (payload) => {
      form.setValue('question', payload.text);
      form.setValue('mentions', payload.mentions);
      onSubmit();
      form.setValue('question', '');
      form.setValue('mentions', []);
    },
  });

  const handleNavigate = () => {
    onOpenChange(false);
  };

  const handleClearResults = (index: number) => {
    setMessages((prev) => prev.map((msg, idx) => (idx === index ? { ...msg, assistantResults: [] } : msg)));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={'w-full sm:max-w-2xl'}>
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
                              <Skeleton className={'h-12 w-full'} />
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
                          {isAI && msg.kpis && msg.kpis.length > 0 && <AIKpiCards kpis={msg.kpis} />}
                          {isAI && msg.insights && msg.insights.length > 0 && <AIInsights insights={msg.insights} />}
                          {isAI && msg.visualizations && msg.visualizations.length > 0 && <AIVisualizationList visualizations={msg.visualizations} />}
                          {isAI && msg.tableData && msg.tableData.columns.length > 0 && <AITable tableData={msg.tableData} />}
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
                    </ItemContent>
                  );
                });
              })()}

              {isProcessing && (
                <Message from="assistant">
                  <Reasoning className="text-xs">
                    <RotatingText text={[t('ai.thinking'), t('ai.processing_request'), t('ai.analyzing_data'), t('ai.searching'), t('ai.almost_ready')]} duration={2000} />
                  </Reasoning>
                </Message>
              )}
            </ConversationContent>
          )}
          <ConversationScrollButton />
        </Conversation>

        <SheetFooter>
          <ChatInput
            input={mention.input}
            onInputChange={mention.handleInputChange}
            isLoading={isProcessing}
            onSubmit={mention.handleSubmit}
            onKeyDown={mention.handleKeyDown}
            textareaRef={mention.textareaRef}
            disableFileUpload
            onTriggerMention={mention.triggerMention}
            mentionDropdown={
              <MentionDropdown
                step={mention.mentionState.step}
                categories={mention.filteredCategories}
                items={mention.filteredItems}
                isLoading={mention.isItemsLoading}
                selectedCategory={mention.mentionState.selectedCategory}
                onSelectCategory={mention.selectCategory}
                onSelectItem={mention.selectItem}
                onClose={mention.closeMention}
              />
            }
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
