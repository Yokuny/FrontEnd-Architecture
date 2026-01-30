import { CalendarIcon, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';

export function RVEFilter({ idEnterprise, initialValues, onSearch, isLoading }: Omit<RVEFilterProps, 'onClear'>) {
  const { t } = useTranslation();

  const [dateMin, setDateMin] = useState<Date | undefined>(initialValues.initialDate);
  const [dateMax, setDateMax] = useState<Date | undefined>(initialValues.finalDate);
  const [selectedMachines, setSelectedMachines] = useState<string[]>(initialValues.machines || []);

  useEffect(() => {
    setDateMin(initialValues.initialDate);
    setDateMax(initialValues.finalDate);
    setSelectedMachines(initialValues.machines || []);
  }, [initialValues]);

  const handleSearch = () => {
    onSearch({
      machines: selectedMachines,
      initialDate: dateMin,
      finalDate: dateMax,
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border bg-secondary p-4">
      <MachineByEnterpriseSelect
        idEnterprise={idEnterprise}
        mode="multi"
        value={selectedMachines}
        onChange={(vals) => setSelectedMachines(vals)}
        placeholder={t('vessels.select.placeholder')}
      />

      <div className="flex flex-col gap-1.5">
        <Label>{t('date.start')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateMin ? formatDate(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateMin} onSelect={setDateMin} initialFocus captionLayout="dropdown-years" startMonth={new Date(2010, 0)} endMonth={new Date()} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>{t('date.end')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateMax ? formatDate(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateMax} onSelect={setDateMax} initialFocus captionLayout="dropdown-years" startMonth={new Date(2010, 0)} endMonth={new Date()} />
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="outline" className="ml-auto gap-2 bg-background" onClick={handleSearch} disabled={isLoading}>
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        {t('filter')}
      </Button>
    </div>
  );
}

interface RVEFilterProps {
  idEnterprise: string;
  initialValues: {
    machines?: string[];
    initialDate?: Date;
    finalDate?: Date;
  };
  onSearch: (values: { machines?: string[]; initialDate?: Date; finalDate?: Date }) => void;
  onClear: () => void;
  isLoading?: boolean;
}
