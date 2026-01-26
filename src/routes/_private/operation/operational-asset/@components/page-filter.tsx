import { CalendarIcon, Eye, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { DATE_FORMATS, OPERATIONAL_ASSET_VIEW } from '../@consts/operational-asset.constants';
import type { OperationalAssetSearch } from '../@interface/operational-asset.types';

export function OperationalAssetFilter({ idEnterprise, filter, onFilterChange, isLoading }: FilterProps) {
  const { t } = useTranslation();

  const [localFilter, setLocalFilter] = useState<OperationalAssetSearch>(filter);

  const dateStart = localFilter.dateStart ? new Date(localFilter.dateStart) : undefined;
  const dateEnd = localFilter.dateEnd ? new Date(localFilter.dateEnd) : undefined;

  const handleSearch = () => {
    onFilterChange(localFilter);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          {t('date.start')}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !dateStart && 'text-muted-foreground')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateStart ? formatDate(dateStart, DATE_FORMATS.DISPLAY) : <span>{t('date.start')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateStart}
              onSelect={(date) => setLocalFilter({ ...localFilter, dateStart: date ? formatDate(date, DATE_FORMATS.ISO) : undefined })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          {t('date.end')}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !dateEnd && 'text-muted-foreground')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateEnd ? formatDate(dateEnd, DATE_FORMATS.DISPLAY) : <span>{t('date.end')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateEnd}
              onSelect={(date) => setLocalFilter({ ...localFilter, dateEnd: date ? formatDate(date, DATE_FORMATS.ISO) : undefined })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <MachineByEnterpriseSelect
        mode="single"
        idEnterprise={idEnterprise}
        value={localFilter.idMachine}
        onChange={(val) => setLocalFilter({ ...localFilter, idMachine: val || undefined })}
        placeholder={t('select.asset')}
      />

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Eye className="size-4" />
          {t('view.analytics')}
        </Label>
        <Select value={localFilter.view} onValueChange={(val) => setLocalFilter({ ...localFilter, view: val as any })}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={OPERATIONAL_ASSET_VIEW.OPERATIONAL}>{t('operational')}</SelectItem>
            <SelectItem value={OPERATIONAL_ASSET_VIEW.FINANCIAL}>{t('financial')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto flex items-end">
        <Button className="w-full" disabled={isLoading} onClick={handleSearch}>
          <Search className="mr-2 size-4" />
          {t('search')}
        </Button>
      </div>
    </div>
  );
}

interface FilterProps {
  idEnterprise: string;
  filter: OperationalAssetSearch;
  onFilterChange: (filter: OperationalAssetSearch) => void;
  isLoading?: boolean;
}
