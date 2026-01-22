import { format } from 'date-fns';
import { CalendarIcon, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { RVESoundingSearchParams } from '../@interface/rve-sounding.types';

interface RVESoundingFilterProps {
  idEnterprise?: string;
  filters: RVESoundingSearchParams;
  onFilterChange: (filters: RVESoundingSearchParams) => void;
  isLoading?: boolean;
}

const DATE_FORMAT_ISO = 'yyyy-MM-dd';
const DATE_FORMAT_DISPLAY = 'dd MM yyyy';

export function RVESoundingFilter({ idEnterprise, filters, onFilterChange, isLoading }: RVESoundingFilterProps) {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<RVESoundingSearchParams>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const dateStart = localFilters.dateStart ? new Date(localFilters.dateStart) : undefined;
  const dateEnd = localFilters.dateEnd ? new Date(localFilters.dateEnd) : undefined;

  const handleSearch = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      machines: undefined,
      dateStart: undefined,
      dateEnd: undefined,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasFilter = !!(localFilters.machines || localFilters.dateStart || localFilters.dateEnd);

  return (
    <Item variant="outline" className="mb-6 flex-row items-end gap-4 overflow-x-auto bg-secondary">
      <ItemContent className="flex-none">
        <Label className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          {t('date.start')}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !dateStart && 'text-muted-foreground')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateStart ? format(dateStart, DATE_FORMAT_DISPLAY) : <span>{t('date.start')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateStart}
              onSelect={(date) =>
                setLocalFilters({
                  ...localFilters,
                  dateStart: date ? format(date, DATE_FORMAT_ISO) : undefined,
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
            <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !dateEnd && 'text-muted-foreground')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateEnd ? format(dateEnd, DATE_FORMAT_DISPLAY) : <span>{t('date.end')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateEnd}
              onSelect={(date) =>
                setLocalFilters({
                  ...localFilters,
                  dateEnd: date ? format(date, DATE_FORMAT_ISO) : undefined,
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

      <div className="ml-auto flex shrink-0 gap-2">
        {hasFilter && (
          <Button variant="ghost" className="gap-2" disabled={isLoading} onClick={handleClear}>
            <X className="size-4" />
            {t('clear.filter')}
          </Button>
        )}
        <Button variant="outline" className="gap-2 bg-background" disabled={isLoading} onClick={handleSearch}>
          <Search className="size-4" />
          {t('filter')}
        </Button>
      </div>
    </Item>
  );
}
