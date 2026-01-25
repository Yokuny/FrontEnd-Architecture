import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { BrushCleaning, CalendarIcon, Plus, Search } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Item, ItemGroup } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { KPI } from './@components/KPI';
import { VoyageItem } from './@components/voyage-item';
import { useVoyages } from './@hooks/use-kpis-travel-api';

const voyageSearchSchema = z.object({
  search: z.string().optional(),
  idMachine: z.string().optional(),
  status: z.string().optional(),
  travelType: z.string().optional(),
  dateInit: z.string().optional(),
  dateEnd: z.string().optional(),
});

type VoyageSearch = z.infer<typeof voyageSearchSchema>;

export const Route = createFileRoute('/_private/voyage/kpis-travel/')({
  component: KpisTravelListPage,
  validateSearch: (search: Record<string, unknown>): VoyageSearch => voyageSearchSchema.parse(search),
});

function KpisTravelListPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const [search, setSearch] = useState(searchParams.search || '');
  const [idMachine, setIdMachine] = useState<string | undefined>(searchParams.idMachine);
  const [status, setStatus] = useState<string | undefined>(searchParams.status);
  const [travelType, setTravelType] = useState<string | undefined>(searchParams.travelType);
  const [dateInit, setDateInit] = useState<Date | undefined>(searchParams.dateInit ? new Date(searchParams.dateInit) : undefined);
  const [dateEnd, setDateEnd] = useState<Date | undefined>(searchParams.dateEnd ? new Date(searchParams.dateEnd) : undefined);

  const { data, isLoading } = useVoyages({
    ...searchParams,
    idEnterprise,
  });

  const voyages = Array.isArray(data) ? data : (data as any)?.data || [];
  const kpiData = (data as any)?.analytics || [];
  const hasData = voyages.length > 0;

  const handleSearch = useCallback(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: search || undefined,
        idMachine: idMachine || undefined,
        status: status === 'all' ? undefined : status,
        travelType: travelType === 'all' ? undefined : travelType,
        dateInit: dateInit?.toISOString(),
        dateEnd: dateEnd?.toISOString(),
      }),
    });
  }, [navigate, search, idMachine, status, travelType, dateInit, dateEnd]);

  const handleClear = () => {
    setSearch('');
    setIdMachine(undefined);
    setStatus(undefined);
    setTravelType(undefined);
    setDateInit(undefined);
    setDateEnd(undefined);
    navigate({
      search: (prev: any) => ({
        ...prev,
        search: undefined,
        idMachine: undefined,
        status: undefined,
        travelType: undefined,
        dateInit: undefined,
        dateEnd: undefined,
      }),
    });
  };

  return (
    <Card>
      <CardHeader title={t('voyage.list')}>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate({ to: '/voyage/kpis-travel/add' })}>
            <Plus className="mr-2 size-4" />
            {t('add.travel')}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col">
        {/* Filtros */}
        <Item variant="outline" className="bg-secondary">
          <div className="flex flex-col gap-2">
            <Label>{t('search')}</Label>
            <div className="relative max-w-48">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t('search.placeholder')} className="bg-background pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <MachineByEnterpriseSelect idEnterprise={idEnterprise} mode="single" value={idMachine} onChange={setIdMachine} label={t('machine')} placeholder={t('select.machine')} />

          <div className="flex flex-col gap-2">
            <Label>{t('status')}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder={t('select.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="in_travel">{t('in.travel')}</SelectItem>
                <SelectItem value="finished_travel">{t('finished.travel')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('travel.type')}</Label>
            <Select value={travelType} onValueChange={setTravelType}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder={t('select.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="travel">{t('travel')}</SelectItem>
                <SelectItem value="maneuver">{t('maneuver')}</SelectItem>
                <SelectItem value="manualVoyage">{t('manual.voyage')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start bg-background text-left font-normal', !dateInit && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateInit ? format(dateInit, 'dd MM yyyy') : <span>{t('pick.date')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateInit}
                  onSelect={setDateInit}
                  initialFocus
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('date.end')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('justify-start bg-background text-left font-normal', !dateEnd && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 size-4" />
                  {dateEnd ? format(dateEnd, 'dd MM yyyy') : <span>{t('pick.date')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateEnd} onSelect={setDateEnd} initialFocus captionLayout="dropdown-years" startMonth={new Date(2010, 0)} endMonth={new Date()} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="ml-auto flex justify-end gap-2">
            <Button className="text-amber-700 hover:text-amber-800" variant="outline" onClick={handleClear}>
              <BrushCleaning className="size-4" />
            </Button>
            <Button type="button" onClick={handleSearch} disabled={isLoading}>
              <Search className="mr-2 size-4" />
              {t('search')}
            </Button>
          </div>
        </Item>

        {isLoading && <DefaultLoading />}
        {!isLoading && kpiData.length > 0 && <KPI data={kpiData} />}
        {!isLoading && !hasData && <DefaultEmptyData />}
        {!isLoading && hasData && (
          <ItemGroup>
            {voyages.map((voyage: any, index: number) => (
              <div key={voyage._id || voyage.id || index} className="group relative">
                <div onClick={() => navigate({ to: '/voyage/kpis-travel/add', search: { id: voyage._id || voyage.id } })}>
                  <VoyageItem voyage={voyage} />
                </div>
              </div>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
