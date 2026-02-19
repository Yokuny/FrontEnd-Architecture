import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { MentionCategory, MentionDataItem, MentionStep } from '../@hooks/use-mention-input';

interface MentionDropdownProps {
  step: MentionStep;
  categories: MentionCategory[];
  items: MentionDataItem[];
  isLoading: boolean;
  selectedCategory: MentionCategory | null;
  onSelectCategory: (category: MentionCategory) => void;
  onSelectItem: (item: MentionDataItem) => void;
  onClose: () => void;
}

export function MentionDropdown({ step, categories, items, isLoading, selectedCategory, onSelectCategory, onSelectItem, onClose }: MentionDropdownProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const currentList = step === 'category' ? categories : items;

  // Reset index when step or list changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional re-run on step/list change
  useEffect(() => {
    setActiveIndex(0);
  }, [step, currentList.length]);

  // Scroll active item into view
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional re-run on activeIndex change
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step === 'idle') return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % currentList.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + currentList.length) % currentList.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (step === 'category' && categories[activeIndex]) {
          onSelectCategory(categories[activeIndex]);
        } else if (step === 'item' && items[activeIndex]) {
          onSelectItem(items[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [step, activeIndex, categories, items, currentList.length, onSelectCategory, onSelectItem, onClose]);

  if (step === 'idle') return null;

  return (
    <div className="absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden rounded-lg border bg-popover shadow-md">
      {step === 'category' && (
        <div className="p-1">
          <div className="px-2 py-1.5 font-medium text-muted-foreground text-xs">Referenciar dados</div>
          <div ref={listRef} className="max-h-48 overflow-y-auto">
            {categories.length === 0 ? (
              <div className="px-2 py-3 text-center text-muted-foreground text-sm">Nenhuma categoria encontrada</div>
            ) : (
              categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.type}
                    type="button"
                    data-active={i === activeIndex}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                      i === activeIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
                    )}
                    onClick={() => onSelectCategory(cat)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{cat.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {step === 'item' && (
        <div className="p-1">
          <div className="flex items-center gap-1.5 px-2 py-1.5 font-medium text-muted-foreground text-xs">
            {selectedCategory &&
              (() => {
                const Icon = selectedCategory.icon;
                return <Icon className="size-3" />;
              })()}
            <span>{selectedCategory?.label}</span>
          </div>
          <div ref={listRef} className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center px-2 py-3">
                <Spinner className="size-4" />
              </div>
            ) : items.length === 0 ? (
              <div className="px-2 py-3 text-center text-muted-foreground text-sm">Nenhum item encontrado</div>
            ) : (
              items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  data-active={i === activeIndex}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                    i === activeIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50',
                  )}
                  onClick={() => onSelectItem(item)}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <span className="truncate">{item.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
