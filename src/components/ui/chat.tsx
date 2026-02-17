'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cjk } from '@streamdown/cjk';
import { code } from '@streamdown/code';
import { math } from '@streamdown/math';
import { mermaid } from '@streamdown/mermaid';
import { useNavigate } from '@tanstack/react-router';
import type { FileUIPart, UIMessage } from 'ai';
import { ArrowUp, Brain, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, FileDigit, Navigation, Paperclip, Square, X } from 'lucide-react';
import { type ComponentProps, createContext, type HTMLAttributes, memo, type ReactElement, type ReactNode, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Streamdown } from 'streamdown';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
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

export const MessageActions = ({ className, children, ...props }: MessageActionsProps) => (
  <div className={cn('flex items-center gap-1', className)} {...props}>
    {children}
  </div>
);

export const MessageAction = ({ tooltip, children, label, variant = 'ghost', size = 'icon-sm', ...props }: MessageActionProps) => {
  const button = (
    <Button size={size} type="button" variant={variant} {...props}>
      {children}
      <span className="sr-only">{label || tooltip}</span>
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
};

const MessageBranchContext = createContext<MessageBranchContextType | null>(null);

const useMessageBranch = () => {
  const context = useContext(MessageBranchContext);
  if (!context) {
    throw new Error('MessageBranch components must be used within MessageBranch');
  }
  return context;
};

export const MessageBranch = ({ defaultBranch = 0, onBranchChange, className, ...props }: MessageBranchProps) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState<ReactElement[]>([]);

  const handleBranchChange = (newBranch: number) => {
    setCurrentBranch(newBranch);
    onBranchChange?.(newBranch);
  };

  const goToPrevious = () => {
    const newBranch = currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
    handleBranchChange(newBranch);
  };

  const goToNext = () => {
    const newBranch = currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
    handleBranchChange(newBranch);
  };

  const contextValue: MessageBranchContextType = {
    currentBranch,
    totalBranches: branches.length,
    goToPrevious,
    goToNext,
    branches,
    setBranches,
  };

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <div className={cn('grid w-full gap-2 [&>div]:pb-0', className)} {...props} />
    </MessageBranchContext.Provider>
  );
};

export const MessageBranchContent = ({ children, ...props }: MessageBranchContentProps) => {
  const { currentBranch, setBranches, branches } = useMessageBranch();
  const childrenArray = Array.isArray(children) ? children : [children];

  // biome-ignore lint/correctness/useExhaustiveDependencies: updates on count change
  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [childrenArray, branches, setBranches]);

  return childrenArray.map((branch, index) => (
    <div className={cn('grid gap-2 overflow-hidden [&>div]:pb-0', index === currentBranch ? 'block' : 'hidden')} key={branch.key} {...props}>
      {branch}
    </div>
  ));
};

export const MessageBranchSelector = ({ className, from, ...props }: MessageBranchSelectorProps) => {
  const { totalBranches } = useMessageBranch();

  if (totalBranches <= 1) {
    return null;
  }

  return <ButtonGroup className={cn('[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md', className)} orientation="horizontal" {...props} />;
};

export const MessageBranchPrevious = ({ children, ...props }: MessageBranchPreviousProps) => {
  const { goToPrevious, totalBranches } = useMessageBranch();

  return (
    <Button aria-label="Previous branch" disabled={totalBranches <= 1} onClick={goToPrevious} size="icon-sm" type="button" variant="ghost" {...props}>
      {children ?? <ChevronLeft size={14} />}
    </Button>
  );
};

export const MessageBranchNext = ({ children, className, ...props }: MessageBranchNextProps) => {
  const { goToNext, totalBranches } = useMessageBranch();

  return (
    <Button aria-label="Next branch" disabled={totalBranches <= 1} onClick={goToNext} size="icon-sm" type="button" variant="ghost" {...props}>
      {children ?? <ChevronRight size={14} />}
    </Button>
  );
};

export const MessageBranchPage = ({ className, ...props }: MessageBranchPageProps) => {
  const { currentBranch, totalBranches } = useMessageBranch();

  return (
    <ButtonGroupText className={cn('border-none bg-transparent text-muted-foreground shadow-none', className)} {...props}>
      {currentBranch + 1} of {totalBranches}
    </ButtonGroupText>
  );
};

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

export function MessageAttachment({ data, className, onRemove, ...props }: MessageAttachmentProps) {
  const filename = data.filename || '';
  const mediaType = data.mediaType?.startsWith('image/') && data.url ? 'image' : 'file';
  const isImage = mediaType === 'image';
  const attachmentLabel = filename || (isImage ? 'Image' : 'Attachment');

  return (
    <div className={cn('group relative size-24 overflow-hidden rounded-lg', className)} {...props}>
      {isImage ? (
        <>
          <img alt={filename || 'attachment'} className="size-full object-cover" height={100} src={data.url} width={100} />
          {onRemove && (
            <Button
              aria-label="Remove attachment"
              className="absolute top-2 right-2 size-6 rounded-full bg-background/80 p-0 opacity-0 backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100 [&>svg]:size-3"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              type="button"
              variant="ghost"
            >
              <X />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </>
      ) : (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex size-full shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Paperclip className="size-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{attachmentLabel}</p>
            </TooltipContent>
          </Tooltip>
          {onRemove && (
            <Button
              aria-label="Remove attachment"
              className="size-6 shrink-0 rounded-full p-0 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 [&>svg]:size-3"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              type="button"
              variant="ghost"
            >
              <X />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export function MessageAttachments({ children, className, ...props }: MessageAttachmentsProps) {
  if (!children) {
    return null;
  }

  return (
    <div className={cn('ml-auto flex w-fit flex-wrap items-start gap-2', className)} {...props}>
      {children}
    </div>
  );
}

export const MessageToolbar = ({ className, children, ...props }: MessageToolbarProps) => (
  <div className={cn('mt-4 flex w-full items-center justify-between gap-4', className)} {...props}>
    {children}
  </div>
);

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

export function ChatInput({ input, onInputChange, isLoading, onSubmit }: ChatInputProps) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <ChatInputArea className="w-full">
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

      <ChatInputTextarea placeholder={`${t('search.placeholder')}...`} value={input} onChange={(e) => onInputChange(e.target.value)} onKeyDown={handleKeyDown} />

      <div className="flex items-center justify-between gap-2 pt-2">
        <ChatInputAction tooltip={t('attach.files')}>
          <label htmlFor="file-upload" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl hover:bg-secondary-foreground/10">
            <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" ref={uploadInputRef} />
            <Paperclip className="size-5 text-primary" />
          </label>
        </ChatInputAction>

        <ChatInputAction tooltip={isLoading ? t('stop') : t('send')}>
          <Button className="size-8 rounded-xl" onClick={handleSubmit} disabled={!input.trim() && files.length === 0 && !isLoading} type="button">
            {isLoading ? <Square className="size-3 fill-current" /> : <ArrowUp className="size-4" />}
          </Button>
        </ChatInputAction>
      </div>
    </ChatInputArea>
  );
}

export function ChatInputTextarea({ value, onChange, ...props }: React.ComponentProps<typeof Textarea>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
    }
  }, []);

  return (
    <Textarea
      ref={textareaRef}
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
      // Add a small delay before closing to allow user to see the content
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
/*                              Interfaces.                                   */
/* -------------------------------------------------------------------------- */

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
};

export type MessageActionsProps = ComponentProps<'div'>;

export type MessageActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

interface MessageBranchContextType {
  currentBranch: number;
  totalBranches: number;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: ReactElement[];
  setBranches: (branches: ReactElement[]) => void;
}

export type MessageBranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};
export type MessageBranchContentProps = HTMLAttributes<HTMLDivElement>;

export type MessageBranchSelectorProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
};

export type MessageBranchPreviousProps = ComponentProps<typeof Button>;

export type MessageBranchNextProps = ComponentProps<typeof Button>;

export type MessageBranchPageProps = HTMLAttributes<HTMLSpanElement>;

export type MessageResponseProps = ComponentProps<typeof Streamdown>;

export type MessageAttachmentProps = HTMLAttributes<HTMLDivElement> & {
  data: FileUIPart;
  className?: string;
  onRemove?: () => void;
};

export type MessageAttachmentsProps = ComponentProps<'div'>;

export type MessageToolbarProps = ComponentProps<'div'>;

export interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
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
