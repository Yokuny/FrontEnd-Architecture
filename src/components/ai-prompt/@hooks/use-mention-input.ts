import type { LucideIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MentionCategory {
  type: string;
  label: string;
  icon: LucideIcon;
}

export interface MentionDataItem {
  id: string;
  label: string;
  data?: any;
}

export interface ResolvedMention {
  trigger: string;
  type: string;
  id: string;
  name: string;
}

export interface SubmitPayload {
  text: string;
  mentions: Omit<ResolvedMention, 'trigger'>[];
}

export type MentionStep = 'idle' | 'category' | 'item';

export interface MentionState {
  step: MentionStep;
  selectedCategory: MentionCategory | null;
  search: string;
  triggerOffset: number;
  triggerChar: string;
}

const TRIGGERS = ['/', '@'];

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseMentionInputOptions {
  categories: MentionCategory[];
  getItems: (categoryType: string, search: string) => { items: MentionDataItem[]; isLoading: boolean };
  onSubmit?: (payload: SubmitPayload) => void;
}

const INITIAL_STATE: MentionState = {
  step: 'idle',
  selectedCategory: null,
  search: '',
  triggerOffset: 0,
  triggerChar: '/',
};

export function useMentionInput({ categories, getItems, onSubmit }: UseMentionInputOptions) {
  const [input, setInput] = useState('');
  const [mentionState, setMentionState] = useState<MentionState>(INITIAL_STATE);
  const [mentions, setMentions] = useState<ResolvedMention[]>([]);
  const cursorRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const closeMention = useCallback(() => {
    setMentionState(INITIAL_STATE);
  }, []);

  // Detect trigger characters in text at cursor position
  const detectTrigger = useCallback(
    (text: string, cursorPos: number) => {
      const textBefore = text.slice(0, cursorPos);

      // Find the last trigger character
      let lastTriggerIdx = -1;
      let lastTriggerChar = '';
      for (const t of TRIGGERS) {
        const idx = textBefore.lastIndexOf(t);
        if (idx > lastTriggerIdx) {
          lastTriggerIdx = idx;
          lastTriggerChar = t;
        }
      }

      if (lastTriggerIdx === -1) {
        if (mentionState.step !== 'idle') closeMention();
        return;
      }

      const afterTrigger = textBefore.slice(lastTriggerIdx + 1);

      // If there's a space after the trigger, check if it's a completed mention
      if (afterTrigger.includes(' ')) {
        // The text between trigger and first space might be a completed mention name
        const mentionName = afterTrigger.split(' ')[0];
        const isCompletedMention = mentions.some((m) => m.name === mentionName);
        if (isCompletedMention || mentionState.step !== 'idle') {
          closeMention();
        }
        return;
      }

      // Check if the text after trigger exactly matches a completed mention
      const isCompletedMention = mentions.some((m) => m.name === afterTrigger && m.trigger === lastTriggerChar);
      if (isCompletedMention) {
        if (mentionState.step !== 'idle') closeMention();
        return;
      }

      // Only open if we're idle — don't re-open on every keystroke for existing triggers
      if (mentionState.step === 'idle') {
        setMentionState({
          step: 'category',
          selectedCategory: null,
          search: afterTrigger,
          triggerOffset: lastTriggerIdx,
          triggerChar: lastTriggerChar,
        });
      } else {
        // Update the search text
        setMentionState((prev) => ({
          ...prev,
          search: afterTrigger,
          triggerOffset: lastTriggerIdx,
          triggerChar: lastTriggerChar,
        }));
      }
    },
    [mentionState.step, mentions, closeMention],
  );

  // Sync mentions: remove any mention whose trigger+name no longer exists in the text
  const syncMentions = useCallback((text: string) => {
    setMentions((prev) =>
      prev.filter((m) => {
        const pattern = `${m.trigger}${m.name}`;
        return text.includes(pattern);
      }),
    );
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
      syncMentions(value);

      // Get cursor position from the textarea ref
      const cursor = textareaRef.current?.selectionStart ?? value.length;
      cursorRef.current = cursor;

      detectTrigger(value, cursor);
    },
    [detectTrigger, syncMentions],
  );

  const handleSubmit = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cleanMentions = mentions.map(({ trigger, ...rest }) => rest);
    onSubmit?.({ text, mentions: cleanMentions });

    setInput('');
    setMentions([]);
    closeMention();
  }, [input, mentions, onSubmit, closeMention]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape' && mentionState.step !== 'idle') {
        closeMention();
        e.preventDefault();
        return;
      }
      // Let the dropdown handle ArrowUp/ArrowDown/Enter when mention is active
      if (mentionState.step !== 'idle' && ['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey && mentionState.step === 'idle') {
        e.preventDefault();
        handleSubmit();
      }
    },
    [mentionState.step, closeMention, handleSubmit],
  );

  const selectCategory = useCallback(
    (category: MentionCategory) => {
      setMentionState((prev) => ({
        ...prev,
        step: 'item',
        selectedCategory: category,
        search: '',
      }));

      // Clear the search text after trigger, keep the trigger char
      const before = input.slice(0, mentionState.triggerOffset + 1);
      const afterTriggerAndSearch = input.slice(mentionState.triggerOffset + 1 + mentionState.search.length);
      const newText = before + afterTriggerAndSearch;
      setInput(newText);

      // Focus and place cursor right after trigger
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) {
          el.focus();
          const pos = mentionState.triggerOffset + 1;
          el.setSelectionRange(pos, pos);
        }
      });
    },
    [input, mentionState.triggerOffset, mentionState.search.length],
  );

  const selectItem = useCallback(
    (item: MentionDataItem) => {
      if (!mentionState.selectedCategory) return;

      const trigger = mentionState.triggerChar;
      const before = input.slice(0, mentionState.triggerOffset);
      const afterTriggerAndSearch = input.slice(mentionState.triggerOffset + 1 + mentionState.search.length);

      // Insert: trigger + item name + space
      const inserted = `${trigger}${item.label} `;
      const newText = before + inserted + afterTriggerAndSearch;

      // Track this mention
      const newMention: ResolvedMention = {
        trigger,
        type: mentionState.selectedCategory.type,
        id: item.id,
        name: item.label,
      };

      setInput(newText);
      setMentions((prev) => [...prev, newMention]);
      closeMention();

      // Focus and place cursor after the inserted mention
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) {
          el.focus();
          const pos = before.length + inserted.length;
          el.setSelectionRange(pos, pos);
        }
      });
    },
    [input, mentionState, closeMention],
  );

  // Trigger mention programmatically (from @ button click)
  const triggerMention = useCallback(() => {
    const el = textareaRef.current;
    const cursor = el?.selectionStart ?? input.length;
    const before = input.slice(0, cursor);
    const after = input.slice(cursor);
    const newText = `${before}/${after}`;

    setInput(newText);

    setMentionState({
      step: 'category',
      selectedCategory: null,
      search: '',
      triggerOffset: cursor,
      triggerChar: '/',
    });

    requestAnimationFrame(() => {
      if (el) {
        el.focus();
        const pos = cursor + 1;
        el.setSelectionRange(pos, pos);
      }
    });
  }, [input]);

  // Derived state
  const filteredCategories = mentionState.step === 'category' ? categories.filter((c) => c.label.toLowerCase().includes(mentionState.search.toLowerCase())) : [];

  const itemsResult =
    mentionState.step === 'item' && mentionState.selectedCategory ? getItems(mentionState.selectedCategory.type, mentionState.search) : { items: [], isLoading: false };

  return {
    input,
    textareaRef,
    mentionState,
    mentions,
    filteredCategories,
    filteredItems: itemsResult.items,
    isItemsLoading: itemsResult.isLoading,
    handleInputChange,
    handleKeyDown,
    handleSubmit,
    selectCategory,
    selectItem,
    closeMention,
    triggerMention,
  };
}
