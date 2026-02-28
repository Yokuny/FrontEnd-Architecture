import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type ProfessionalComboboxProps = {
  controller: any;
  disabled?: boolean;
  fetchProfessionals: () => Promise<{ value: string; label: string; image: string }[]>;
};

const ProfessionalCombobox = ({ controller, disabled, fetchProfessionals }: ProfessionalComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [professional, setProfessional] = useState('');
  const [professionals, setProfessionals] = useState([{ value: '', label: 'Selecione o profissional...', image: '' }]);

  useEffect(() => {
    const loadProfessionals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProfessionals();
        setProfessionals(data);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfessionals();
  }, [fetchProfessionals]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role="combobox" variant="outline" aria-expanded={open} disabled={disabled || isLoading}>
          <div className="flex items-center gap-2 truncate">
            {professional && (
              <Avatar className="size-8">
                <AvatarImage src={professionals.find((item) => item.value === professional)?.image} alt="img do profissional" />
                <AvatarFallback className="text-xs">{professionals.find((item) => item.value === professional)?.label.slice(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            <span className="text-foreground/90">{professionals.find((item) => item.value === professional)?.label || 'Profissionais'}</span>
          </div>
          <ChevronsUpDown className="size-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Buscar profissional..." className="h-9" disabled={isLoading} />
          <CommandEmpty>Profissional não encontrado</CommandEmpty>
          <CommandGroup>
            {professionals.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                className="gap-2 text-md"
                onSelect={(currentLabel) => {
                  const selectedItem = professionals.find((prof) => prof.label === currentLabel);
                  const selectedValue = selectedItem?.value || '';
                  setProfessional(selectedValue === professional ? '' : selectedValue);
                  controller.onChange(selectedValue === professional ? '' : selectedValue);
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
                <Check className={cn('ml-auto size-3', professional === item.value ? 'opacity-100' : 'opacity-0')} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProfessionalCombobox;
