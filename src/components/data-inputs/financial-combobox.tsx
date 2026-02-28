import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type FinancialComboboxProps = {
  controller: any;
  patient: string;
  disabled?: boolean;
  fetchFinancials: (patient: string) => Promise<{ value: string; label: string }[]>;
};

const FinancialCombobox = ({ controller, patient, disabled, fetchFinancials }: FinancialComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [financial, setFinancial] = useState('');
  const [financials, setFinancials] = useState([{ value: '', label: 'Selecione um registro' }]);

  useEffect(() => {
    const loadFinancials = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFinancials(patient);
        setFinancials(data);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadFinancials();
  }, [patient, fetchFinancials]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role="combobox" variant="outline" aria-expanded={open} disabled={disabled || isLoading}>
          <div className="flex items-center gap-2 truncate">
            <span className="text-foreground/90">{financials.find((item) => item.value === financial)?.label || 'Financeiros'}</span>
          </div>
          <ChevronsUpDown className="size-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Buscar registro..." className="h-9" disabled={isLoading} />
          <CommandEmpty>Registro financeiro não encontrado</CommandEmpty>
          <CommandGroup>
            {financials.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                className="gap-2 text-md"
                onSelect={(currentLabel) => {
                  const selectedItem = financials.find((fin) => fin.label === currentLabel);
                  const selectedValue = selectedItem?.value || '';
                  setFinancial(selectedValue === financial ? '' : selectedValue);
                  controller.onChange(selectedValue === financial ? '' : selectedValue);
                  setOpen(false);
                }}
              >
                <span className="truncate">{item.label}</span>
                <Check className={cn('ml-auto size-3', financial === item.value ? 'opacity-100' : 'opacity-0')} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FinancialCombobox;
