import { useState } from 'react';
import Check from '@/components/icons/Check.Icon';
import Down from '@/components/icons/Down.Icon';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { t } from '@/lib/helpers/translate.helper';
import { cn } from '@/lib/utils/cn.util';
import { useFinancialsComboboxQuery } from '@/query/financials';

type FinancialComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  patient: string;
  disabled?: boolean;
};

const FinancialCombobox = ({ value, onChange, patient, disabled }: FinancialComboboxProps) => {
  const [open, setOpen] = useState(false);
  const { options, isLoading } = useFinancialsComboboxQuery(patient);

  const selected = options.find((item) => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role="combobox" variant="basic" aria-expanded={open} disabled={disabled || isLoading}>
          <div className="flex items-center gap-2 truncate">
            <span className="text-foreground/90">{selected?.label || t('financials')}</span>
          </div>
          <Down className={cn('ml-2 size-3 shrink-0 stroke-2 opacity-50 transition-transform duration-200', open && 'rotate-180')} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[240px] p-0">
        <Command>
          <CommandInput placeholder={t('search.record')} className="h-9" disabled={isLoading} />
          <CommandEmpty>{t('financial.record.not.found')}</CommandEmpty>
          <CommandGroup>
            {options.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                className="gap-2 text-md"
                onSelect={(currentLabel) => {
                  const selectedItem = options.find((fin) => fin.label === currentLabel);
                  const selectedValue = selectedItem?.value || '';
                  onChange(selectedValue === value ? '' : selectedValue);
                  setOpen(false);
                }}
              >
                <span className="truncate">{item.label}</span>
                <Check className={cn('ml-auto size-3', value === item.value ? 'opacity-100' : 'opacity-0')} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FinancialCombobox;
