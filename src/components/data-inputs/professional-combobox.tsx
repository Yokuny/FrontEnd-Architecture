import { useState } from 'react';
import Check from '@/components/icons/Check.Icon';
import Down from '@/components/icons/Down.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { t } from '@/lib/helpers/translate.helper';
import { cn } from '@/lib/utils/cn.util';
import { useProfessionalsComboboxQuery } from '@/query/professionals';

type ProfessionalComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const ProfessionalCombobox = ({ value, onChange, disabled }: ProfessionalComboboxProps) => {
  const [open, setOpen] = useState(false);
  const { options, isLoading } = useProfessionalsComboboxQuery();

  const selected = options.find((item) => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role="combobox" variant="outline" aria-expanded={open} disabled={disabled || isLoading}>
          <div className="flex items-center gap-2 truncate">
            {selected && (
              <Avatar className="size-8">
                <AvatarImage src={selected.image} alt="img do profissional" />
                <AvatarFallback className="text-xs">{selected.label.slice(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            <span className="text-foreground/90">{selected?.label || t('professionals')}</span>
          </div>
          <Down className={cn('ml-2 size-3 shrink-0 stroke-2 opacity-50 transition-transform duration-200', open && 'rotate-180')} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[240px] p-0">
        <Command>
          <CommandInput placeholder={t('search.professional')} className="h-9" disabled={isLoading} />
          <CommandEmpty>{t('professional.not.found')}</CommandEmpty>
          <CommandGroup>
            {options.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                className="gap-2 text-md"
                onSelect={(currentLabel) => {
                  const selectedItem = options.find((prof) => prof.label === currentLabel);
                  const selectedValue = selectedItem?.value || '';
                  onChange(selectedValue === value ? '' : selectedValue);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage src={item.image} alt={item.label} />
                    <AvatarFallback className="text-xs">{item.label[0]}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{item.label}</span>
                </div>
                <Check className={cn('ml-auto size-3', value === item.value ? 'opacity-100' : 'opacity-0')} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProfessionalCombobox;
