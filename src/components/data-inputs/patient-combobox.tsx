import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type PatientComboboxProps = {
  controller: any;
  disabled?: boolean;
  fetchPatients: () => Promise<{ value: string; label: string; image: string }[]>;
};

const PatientCombobox = ({ controller, disabled, fetchPatients }: PatientComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState('');
  const [patients, setPatients] = useState([{ value: '', label: 'Selecione o paciente...', image: '' }]);

  useEffect(() => {
    const loadPatients = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPatients();
        setPatients(data);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPatients();
  }, [fetchPatients]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button role="combobox" variant="outline" aria-expanded={open} disabled={disabled || isLoading}>
          <div className="flex items-center gap-2 truncate">
            {patient && (
              <Avatar className="size-8">
                <AvatarImage src={patients.find((item) => item.value === patient)?.image} alt="img do paciente" />
                <AvatarFallback className="text-xs">{patients.find((item) => item.value === patient)?.label.slice(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            <span className="text-foreground/90">{patients.find((item) => item.value === patient)?.label || 'Pacientes'}</span>
          </div>
          <ChevronsUpDown className="size-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Buscar paciente..." className="h-9" disabled={isLoading} />
          <CommandEmpty>Paciente não encontrado</CommandEmpty>
          <CommandGroup>
            {patients.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                className="gap-2 text-md"
                onSelect={(currentLabel) => {
                  const selectedItem = patients.find((pat) => pat.label === currentLabel);
                  const selectedValue = selectedItem?.value || '';
                  setPatient(selectedValue === patient ? '' : selectedValue);
                  controller.onChange(selectedValue === patient ? '' : selectedValue);
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
                <Check className={cn('ml-auto size-3', patient === item.value ? 'opacity-100' : 'opacity-0')} />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PatientCombobox;
