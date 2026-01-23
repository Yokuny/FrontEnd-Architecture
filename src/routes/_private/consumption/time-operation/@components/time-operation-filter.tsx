import { format } from 'date-fns';
import { BrushCleaning, CalendarIcon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { TimeOperationSearchParams } from '../@interface/time-operation.types';

interface TimeOperationFilterProps {
  idEnterprise?: string;
  filters: TimeOperationSearchParams;
  onFilterChange: (filters: TimeOperationSearchParams) => void;
  isLoading?: boolean;
}

// const DATE_FORMAT_ISO = "yyyy-MM-dd'T'HH:mm:ssXXX";
const DATE_FORMAT_DISPLAY = 'dd MM yyyy';

export function TimeOperationFilter({ idEnterprise, filters, onFilterChange, isLoading }: TimeOperationFilterProps) {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<TimeOperationSearchParams>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const dateMin = localFilters.dateMin ? new Date(localFilters.dateMin) : undefined;
  const dateMax = localFilters.dateMax ? new Date(localFilters.dateMax) : undefined;

  const handleSearch = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const clearedFilters: TimeOperationSearchParams = {
      machines: undefined,
      dateMin: undefined,
      dateMax: undefined,
      isShowDisabled: false,
      unit: 'm³',
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <Item variant="outline" className="mb-6 flex-row items-end gap-4 overflow-x-auto bg-secondary">
      <ItemContent className="flex-none">
        <Label className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          {t('date.start')}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateMin ? format(dateMin, DATE_FORMAT_DISPLAY) : <span>{t('date.start')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateMin}
              onSelect={(date) =>
                setLocalFilters({
                  ...localFilters,
                  dateMin: date ? `${format(date, 'yyyy-MM-dd')}T00:00:00${format(new Date(), 'XXX')}` : undefined,
                })
              }
              initialFocus
              captionLayout="dropdown-years"
              startMonth={new Date(2010, 0)}
              endMonth={new Date()}
            />
          </PopoverContent>
        </Popover>
      </ItemContent>

      <ItemContent className="flex-none">
        <Label className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          {t('date.end')}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateMax ? format(dateMax, DATE_FORMAT_DISPLAY) : <span>{t('date.end')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateMax}
              onSelect={(date) =>
                setLocalFilters({
                  ...localFilters,
                  dateMax: date ? `${format(date, 'yyyy-MM-dd')}T23:59:59${format(new Date(), 'XXX')}` : undefined,
                })
              }
              initialFocus
              captionLayout="dropdown-years"
              startMonth={new Date(2010, 0)}
              endMonth={new Date()}
            />
          </PopoverContent>
        </Popover>
      </ItemContent>

      <ItemContent className="min-w-[240px]">
        <MachineByEnterpriseSelect
          mode="multi"
          label={t('vessels')}
          idEnterprise={idEnterprise}
          value={localFilters.machines?.split(',').filter(Boolean)}
          onChange={(val) => setLocalFilters({ ...localFilters, machines: val?.join(',') || undefined })}
          placeholder={t('vessels')}
        />
      </ItemContent>

      <ItemContent className="min-w-[100px]">
        <Label>{t('unit')}</Label>
        <Select value={localFilters.unit} onValueChange={(val) => setLocalFilters({ ...localFilters, unit: val })}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder={t('unit')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m³">m³</SelectItem>
            <SelectItem value="L">L</SelectItem>
          </SelectContent>
        </Select>
      </ItemContent>

      <div className="flex items-center space-x-2 pb-3">
        <Checkbox id="show-disabled" checked={localFilters.isShowDisabled} onCheckedChange={(checked) => setLocalFilters({ ...localFilters, isShowDisabled: !!checked })} />
        <Label htmlFor="show-disabled" className="cursor-pointer font-medium text-sm leading-none">
          {t('show.disabled')}
        </Label>
      </div>

      <div className="ml-auto flex shrink-0 gap-2 pb-1">
        <Button className="text-amber-700 hover:text-amber-800" disabled={isLoading} onClick={handleClear}>
          <BrushCleaning className="size-4" />
        </Button>
        <Button variant="outline" className="gap-2 bg-background" disabled={isLoading} onClick={handleSearch}>
          <Search className="size-4" />
          {t('filter')}
        </Button>
      </div>
    </Item>
  );
}
