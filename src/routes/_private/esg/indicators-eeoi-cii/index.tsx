import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CalendarIcon, List, ListChecks, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useEEOICIIIndicators } from '@/hooks/use-esg-api';
import { cn } from '@/lib/utils';
import { DownloadCSV } from './@components/DownloadCSV';
import { IndicatorsTable } from './@components/IndicatorsTable';
import { IndicatorsTableDetails } from './@components/IndicatorsTableDetails';

export const Route = createFileRoute('/_private/esg/indicators-eeoi-cii/')({
  component: IndicatorsEEOICIIPage,
});

function IndicatorsEEOICIIPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [dateMin, setDateMin] = useState<Date | undefined>();
  const [dateMax, setDateMax] = useState<Date | undefined>();
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isShowDetails, setIsShowDetails] = useState(false);

  const filters: IndicatorsFilters = {
    idEnterprise,
    dateTimeStart: dateMin ? format(dateMin, 'yyyy-MM-dd') : undefined,
    dateTimeEnd: dateMax ? format(dateMax, 'yyyy-MM-dd') : undefined,
    'idMachine[]': selectedMachines,
    search: search || undefined,
  };

  const { data, isLoading } = useEEOICIIIndicators(filters, isShowDetails);

  return (
    <Card>
      <CardHeader title={t('menu.eeoi.cii')}>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsShowDetails(!isShowDetails)} className="gap-2">
            {isShowDetails ? <ListChecks className="size-4" /> : <List className="size-4" />}
            {isShowDetails ? t('voyage.complete') : t('voyage.integration')}
          </Button>

          <DownloadCSV data={data || []} isShowDetails={isShowDetails} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-secondary">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-input">{t('search.placeholder')}</Label>
            <Input id="search-input" placeholder={t('search.placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 bg-background" />
          </div>

          <MachineByEnterpriseSelect idEnterprise={idEnterprise} value={selectedMachines} onChange={(val: any) => setSelectedMachines(val)} mode="multi" />

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('justify-start text-left font-normal w-40 bg-background', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMin ? format(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" captionLayout="dropdown-years" selected={dateMin} onSelect={(date) => setDateMin(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.end')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('justify-start text-left font-normal w-40 bg-background', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMax ? format(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" captionLayout="dropdown-years" selected={dateMax} onSelect={(date) => setDateMax(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="outline" className="gap-2 bg-background ml-auto">
            <Search className="size-4" />
            {t('search')}
          </Button>
        </div>

        <div className="overflow-auto">
          {isLoading && <DefaultLoading />}
          {!isLoading && isShowDetails && <IndicatorsTableDetails data={data || []} />}
          {!isLoading && !isShowDetails && <IndicatorsTable data={data || []} />}
        </div>
      </CardContent>
    </Card>
  );
}

export interface IndicatorsFilters {
  idEnterprise: string;
  dateTimeStart?: string;
  dateTimeEnd?: string;
  'idMachine[]'?: string[];
  search?: string;
}
