'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cjk } from '@streamdown/cjk';
import { code } from '@streamdown/code';
import { math } from '@streamdown/math';
import { mermaid } from '@streamdown/mermaid';
import { useNavigate } from '@tanstack/react-router';
import { ArrowDown, ArrowUp, AtSign, Brain, ChevronDown, ExternalLink, FileDigit, Navigation, Paperclip, Square, X } from 'lucide-react';
import { type ComponentProps, createContext, type HTMLAttributes, memo, type ReactNode, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Streamdown } from 'streamdown';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Shimmer } from '@/components/ui/shimmer';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*                               Message Pattern                              */
/* -------------------------------------------------------------------------- */

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div className={cn('group flex w-full max-w-[95%] flex-col gap-2', from === 'user' ? 'is-user ml-auto justify-end' : 'is-assistant', className)} {...props} />
);

export const MessageContent = ({ children, className, ...props }: MessageContentProps) => (
  <div
    className={cn(
      'is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm',
      'group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground',
      'group-[.is-assistant]:text-foreground',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const MessageResponse = memo(
  ({ className, isAnimating, ...props }: MessageResponseProps) => (
    <Streamdown
      plugins={{ code, mermaid, math, cjk }}
      isAnimating={isAnimating}
      animated
      className={cn('size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0', className)}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.isAnimating === nextProps.isAnimating,
);

MessageResponse.displayName = 'MessageResponse';

/* -------------------------------------------------------------------------- */
/*                               Input Components                             */
/* -------------------------------------------------------------------------- */

export function ChatInputArea({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('cursor-text rounded-3xl border border-input bg-background p-2', className)} {...props}>
      {children}
    </div>
  );
}

export function ChatInput({ input, onInputChange, isLoading, onSubmit, onKeyDown, mentionDropdown, onTriggerMention, disableFileUpload, textareaRef }: ChatInputProps) {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (input.trim() || files.length > 0) {
      onSubmit();
      setFiles([]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = '';
    }
  };

  const defaultKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isDisabled = !input.trim() && files.length === 0 && !isLoading;

  return (
    <ChatInputArea className="relative w-full">
      {mentionDropdown}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {files.map((file, index) => (
            <div key={`${file.name}${index}`} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2" onClick={(e) => e.stopPropagation()}>
              <FileDigit className="size-4" />
              <span className="max-w-32 truncate">{file.name}</span>
              <button onClick={() => handleRemoveFile(index)} className="rounded-full p-1 hover:bg-secondary" type="button">
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ChatInputTextarea
        ref={textareaRef}
        placeholder={`${t('search.placeholder')}...`}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown ?? defaultKeyDown}
      />

      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          {!disableFileUpload && (
            <ChatInputAction tooltip={t('attach.files')}>
              <label htmlFor="file-upload" className="flex size-8 items-center justify-center rounded-full hover:bg-accent">
                <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" ref={uploadInputRef} />
                <Paperclip className="size-5 text-primary" />
              </label>
            </ChatInputAction>
          )}
          {onTriggerMention && (
            <ChatInputAction tooltip={t('mention')}>
              <button type="button" onClick={onTriggerMention} className="flex size-8 items-center justify-center rounded-full hover:bg-accent">
                <AtSign className="size-5 text-primary" />
              </button>
            </ChatInputAction>
          )}
        </div>

        <ChatInputAction tooltip={isLoading ? t('stop') : t('send')}>
          <Button className="h-8 rounded-full" onClick={handleSubmit} disabled={isDisabled} type="button">
            {isLoading ? <Square className="size-3 fill-current" /> : <ArrowUp className="size-4" />}
          </Button>
        </ChatInputAction>
      </div>
    </ChatInputArea>
  );
}

export function ChatInputTextarea({ ref, value, onChange, ...props }: React.ComponentProps<typeof Textarea>) {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? internalRef;

  useLayoutEffect(() => {
    const el = resolvedRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
    }
  }, [resolvedRef]);

  return (
    <Textarea
      ref={resolvedRef}
      value={value}
      onChange={onChange}
      className={cn('min-h-11 w-full resize-none border-none bg-transparent text-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0')}
      rows={1}
      {...props}
    />
  );
}

export function ChatInputAction({ tooltip, children, side = 'top' }: { tooltip: React.ReactNode; children: React.ReactNode; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ChatSuggestions({ result, onNavigate }: ChatSuggestionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!result) return null;

  const handleNavigate = () => {
    navigate({ to: result.path, search: result.params } as any);
    if (onNavigate) onNavigate();
  };

  return (
    <Item className="border-muted bg-secondary py-0.5">
      <ItemContent className="gap-0">
        <div className="flex items-stretch gap-1">
          <Navigation className="size-3 text-muted-foreground" />
          <ItemDescription className="text-xs">{t('ai.navigation_suggestion')}</ItemDescription>
        </div>
        <ItemTitle>{result.route.semantic_text.split('.')[0]}</ItemTitle>
      </ItemContent>
      <Button onClick={handleNavigate}>
        <ExternalLink className="size-3" />
      </Button>
    </Item>
  );
}

export function ChatTyping({ children, className, ...props }: React.ComponentProps<typeof MessageContent>) {
  const { t } = useTranslation();
  return (
    <MessageContent className={cn('w-fit', className)} {...props}>
      <Shimmer className="font-medium text-sm">{typeof children === 'string' ? children : t('ai.thinking')}</Shimmer>
    </MessageContent>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Reasoning Patterns                            */
/* -------------------------------------------------------------------------- */

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export const Reasoning = memo(({ className, isStreaming = false, open, defaultOpen = true, onOpenChange, duration: durationProp, onClose, children, ...props }: ReasoningProps) => {
  const [isOpen, setIsOpen] = useControllableState({
    prop: open,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [duration, setDuration] = useControllableState({
    prop: durationProp,
    defaultProp: undefined,
  });

  const [hasAutoClosed, setHasAutoClosed] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Track duration when streaming starts and ends
  useEffect(() => {
    if (isStreaming) {
      if (startTime === null) {
        setStartTime(Date.now());
      }
    } else if (startTime !== null) {
      setDuration(Math.ceil((Date.now() - startTime) / MS_IN_S));
      setStartTime(null);
    }
  }, [isStreaming, startTime, setDuration]);

  // Auto-open when streaming starts, auto-close when streaming ends (once only)
  useEffect(() => {
    if (defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setHasAutoClosed(true);
      }, AUTO_CLOSE_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosed]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };

  return (
    <ReasoningContext.Provider value={{ isStreaming, isOpen, setIsOpen, duration, onClose }}>
      <Collapsible className={cn('not-prose', className)} onOpenChange={handleOpenChange} open={isOpen} {...props}>
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
});

export const ReasoningTrigger = memo(({ className, children, icon: Icon = Brain, getThinkingMessage, showChevron = true, ...props }: ReasoningTriggerProps) => {
  const { isStreaming, isOpen, duration } = useReasoning();
  const { t } = useTranslation();

  const defaultGetThinkingMessage = (isStreaming: boolean, duration?: number) => {
    if (isStreaming || duration === 0) {
      return <Shimmer duration={1}>{t('ai.thinking')}</Shimmer>;
    }
    if (duration === undefined) {
      return <p>{t('ai.thought_summary')}</p>;
    }
    return <p>{t('ai.thought_duration', { duration })}</p>;
  };

  const renderThinkingMessage = getThinkingMessage ?? defaultGetThinkingMessage;

  return (
    <CollapsibleTrigger
      className={cn(
        'group flex w-full cursor-pointer items-center justify-between gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2">
        {Icon && <Icon className={cn('size-3 shrink-0')} />}
        <div className="min-w-0 flex-1">{children ?? renderThinkingMessage(isStreaming, duration)}</div>
      </div>
      {showChevron && <ChevronDown className={cn('size-4 shrink-0 transition-transform duration-200', isOpen ? 'rotate-180' : 'rotate-0')} aria-hidden="true" />}
    </CollapsibleTrigger>
  );
});

export const ReasoningClose = memo(({ className, children, onClick, tooltip, ...props }: ReasoningCloseProps) => {
  const { onClose } = useReasoning();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.(e);
    onClose?.();
  };

  const button = (
    <Button variant="ghost" size="icon-sm" className={cn('shrink-0', className)} onClick={handleClick} type="button" {...props}>
      {children ?? <X className="size-4" />}
      <span className="sr-only">{tooltip || 'Close'}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="top">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
});

export const ReasoningContent = memo(({ className, children, ...props }: ReasoningContentProps) => {
  const { isStreaming } = useReasoning();
  return (
    <CollapsibleContent
      className={cn(
        'mt-4 text-sm',
        'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-muted-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
        className,
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Streamdown plugins={{ code, mermaid, math, cjk }} isAnimating={isStreaming} animated>
          {children}
        </Streamdown>
      ) : (
        children
      )}
    </CollapsibleContent>
  );
});

Reasoning.displayName = 'Reasoning';
ReasoningTrigger.displayName = 'ReasoningTrigger';
ReasoningClose.displayName = 'ReasoningClose';
ReasoningContent.displayName = 'ReasoningContent';

/* -------------------------------------------------------------------------- */
/*                            Conversation Pattern                            */
/* -------------------------------------------------------------------------- */

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom className={cn('relative flex-1 overflow-y-hidden', className)} initial="smooth" resize="smooth" role="log" {...props} />
);

export const ConversationContent = ({ className, ...props }: ConversationContentProps) => <StickToBottom.Content className={cn('flex flex-col gap-4 p-4', className)} {...props} />;

export const ConversationEmptyState = ({ className, title, description, icon, children, ...props }: ConversationEmptyStateProps) => (
  <div className={cn('flex size-full flex-col items-center justify-center gap-3 p-8 text-center', className)} {...props}>
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          {title && <h3 className="font-medium text-sm">{title}</h3>}
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
      </>
    )}
  </div>
);

export const ConversationScrollButton = ({ className, ...props }: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (isAtBottom) return null;

  return (
    <Button
      className={cn('absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full', className)}
      onClick={handleScrollToBottom}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <ArrowDown className="size-4" />
    </Button>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Interfaces                                    */
/* -------------------------------------------------------------------------- */

type MessageRole = 'user' | 'assistant' | 'system';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: MessageRole;
};

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

export interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  mentionDropdown?: React.ReactNode;
  onTriggerMention?: () => void;
  disableFileUpload?: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export interface ChatSuggestionProps {
  result: {
    path: string;
    params: Record<string, string>;
    route: {
      semantic_text: string;
    };
  } | null;
  onNavigate?: () => void;
}

interface ReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number | undefined;
  onClose?: () => void;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error('Reasoning components must be used within Reasoning');
  }
  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  onClose?: () => void;
};

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
  showChevron?: boolean;
  icon?: React.ElementType | null;
};

export type ReasoningCloseProps = ComponentProps<typeof Button> & {
  tooltip?: string;
};

export type ReasoningContentProps = ComponentProps<typeof CollapsibleContent>;

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export type ConversationContentProps = ComponentProps<typeof StickToBottom.Content>;

export type ConversationEmptyStateProps = ComponentProps<'div'> & {
  title?: string;
  description?: string;
  icon?: ReactNode;
};

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;
