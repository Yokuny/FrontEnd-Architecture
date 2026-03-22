import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Check from '@/components/icons/Check.Icon';
import Down from '@/components/icons/Down.Icon';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { t } from '@/lib/helpers/translate';
import { cn } from '@/lib/utils';

const OdontogramCombobox = ({ controller, patient, disabled, fetchOdontograms }: OdontogramComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [odontogram, setOdontogram] = useState('');
  const [odontograms, setOdontograms] = useState([{ value: '', label: t('select.odontogram') }]);

  useEffect(() => {
    const loadOdontograms = async () => {
      setIsLoading(true);
      try {
        const data = await fetchOdontograms(patient);
        setOdontograms(data);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadOdontograms();
  }, [patient, fetchOdontograms]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role="combobox" variant="outline" aria-expanded={open} disabled={disabled || isLoading}>
          <div className="flex items-center gap-2 truncate">
            <span className="text-foreground/90">{odontograms.find((item) => item.value === odontogram)?.label || t('odontograms')}</span>
          </div>
          <Down className={cn('ml-2 size-3 shrink-0 stroke-2 opacity-50 transition-transform duration-200', open && 'rotate-180')} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[240px] p-0">
        <Command>
          <CommandInput placeholder={t('search.odontogram')} className="h-9" disabled={isLoading} />
          <CommandEmpty>{t('odontogram.not.found')}</CommandEmpty>
          <CommandGroup>
            {odontograms.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                className="gap-2 text-md"
                onSelect={(currentLabel) => {
                  const selectedItem = odontograms.find((odon) => odon.label === currentLabel);
                  const selectedValue = selectedItem?.value || '';
                  setOdontogram(selectedValue === odontogram ? '' : selectedValue);
                  controller.onChange(selectedValue === odontogram ? '' : selectedValue);
                  setOpen(false);
                }}
              >
                <span className="truncate">{item.label}</span>
                <Check className={cn('ml-auto size-3', odontogram === item.value ? 'opacity-100' : 'opacity-0')} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default OdontogramCombobox;

type OdontogramComboboxProps = {
  controller: any;
  patient: string;
  disabled: boolean;
  fetchOdontograms: (patient: string) => Promise<{ value: string; label: string }[]>;
};
