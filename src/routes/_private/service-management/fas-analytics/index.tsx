import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CalendarIcon, RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { FasValueChart } from './@components/fas-value-chart';
import { HeaderTypesChart } from './@components/header-types-chart';
import { OrderStatusChart } from './@components/order-status-chart';
import { OrderValueChart } from './@components/order-value-chart';
import { RealizedOrdersChart } from './@components/realized-orders-chart';
import { CHART_GROUPS, FAS_TYPES, FILTER_DEFAULTS, MONTHS, STATUS_OPTIONS, YEARS } from './@const/fas-analytics.const';
import type { FasAnalyticsSearch } from './@interface/fas-analytics.schema';
import { fasAnalyticsSearchSchema } from './@interface/fas-analytics.schema';

export const Route = createFileRoute('/_private/service-management/fas-analytics/')({
  component: FasAnalyticsPage,
  validateSearch: (search: Record<string, unknown>): FasAnalyticsSearch => fasAnalyticsSearchSchema.parse(search),
});

function FasAnalyticsPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();
  const [refreshKey, setRefreshKey] = useState(0);

  const [filterType, setFilterType] = useState<'range' | 'month'>(search.filterType || FILTER_DEFAULTS.FILTER_TYPE);
  const [dateStart, setDateStart] = useState<Date | undefined>(search.startDate ? new Date(search.startDate) : undefined);
  const [dateEnd, setDateEnd] = useState<Date | undefined>(search.endDate ? new Date(search.endDate) : undefined);
  const [month, setMonth] = useState<string | undefined>(search.month);
  const [year, setYear] = useState<number | undefined>(search.year);
  const [vesselId, setVesselId] = useState<string | undefined>(search.vesselId);
  const [dependantAxis, setDependantAxis] = useState<'month' | 'year' | 'vessel' | 'supplier'>(search.dependantAxis || FILTER_DEFAULTS.DEPENDANT_AXIS);
  const [status, setStatus] = useState<string[]>(search.status || []);
  const [fasType, setFasType] = useState<string[]>(search.fasType || []);
  const [showValueByPayment, setShowValueByPayment] = useState(search.showValueByPayment || FILTER_DEFAULTS.SHOW_VALUE_BY_PAYMENT);

  const selectedChartGroup = CHART_GROUPS.find((g) => g.value === search.chartType) || CHART_GROUPS[0];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        filterType,
        startDate: filterType === 'range' && dateStart ? format(dateStart, 'yyyy-MM-dd') : undefined,
        endDate: filterType === 'range' && dateEnd ? format(dateEnd, 'yyyy-MM-dd') : undefined,
        month: filterType === 'month' ? month : undefined,
        year: filterType === 'month' ? year : undefined,
        vesselId,
        dependantAxis,
        status: status.length > 0 ? status : undefined,
        fasType: fasType.length > 0 ? fasType : undefined,
        showValueByPayment: selectedChartGroup.value === 'order.bms.value.chart' ? showValueByPayment : false,
      }),
    });
  };

  const renderActiveChart = () => {
    switch (selectedChartGroup.value) {
      case 'realized.orders':
        return <RealizedOrdersChart key={refreshKey} search={search} />;
      case 'header.types':
        return <HeaderTypesChart key={refreshKey} search={search} />;
      case 'order.status':
        return <OrderStatusChart key={refreshKey} search={search} />;
      case 'fas.bms.value.chart':
        return <FasValueChart key={refreshKey} search={search} />;
      case 'order.bms.value.chart':
        return <OrderValueChart key={refreshKey} search={search} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader title={t('fas.analytics')}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t('chart.group')}</Label>
            <Select
              value={search.chartType}
              onValueChange={(value) =>
                navigate({
                  search: (prev) => ({ ...prev, chartType: value, dependantAxis: 'month' }),
                })
              }
            >
              <SelectTrigger className="w-64 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_GROUPS.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {t(group.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col">
        {/* Filtros */}
        <Item variant="outline" className="bg-secondary">
          <div className="flex flex-col gap-1.5">
            <Label>{t('filter.by.date')}</Label>
            <Select value={filterType} onValueChange={(value: 'range' | 'month') => setFilterType(value)}>
              <SelectTrigger className="w-48 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="range">{t('serviceDate.range')}</SelectItem>
                <SelectItem value="month">{t('serviceDate.month')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filterType === 'range' && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label>{t('date.start')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateStart && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateStart ? format(dateStart, 'dd MM yyyy') : <span>{t('date.start')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateStart}
                      onSelect={setDateStart}
                      initialFocus
                      captionLayout="dropdown-years"
                      startMonth={new Date(2010, 0)}
                      endMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>{t('date.end')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateEnd && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateEnd ? format(dateEnd, 'dd MM yyyy') : <span>{t('date.end')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateEnd}
                      onSelect={setDateEnd}
                      initialFocus
                      captionLayout="dropdown-years"
                      startMonth={new Date(2010, 0)}
                      endMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          {filterType === 'month' && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label>{t('month')}</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-48 bg-background">
                    <SelectValue placeholder={t('select.year')} />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {t(m)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>{t('year')}</Label>
                <Select value={year?.toString()} onValueChange={(val) => setYear(Number(val))}>
                  <SelectTrigger className="w-32 bg-background">
                    <SelectValue placeholder={t('select.year')} />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <MachineByEnterpriseSelect mode="single" idEnterprise={idEnterprise} value={vesselId} onChange={setVesselId} label={t('filter.by.vessel')} className="w-64" />

          <div className="flex flex-col gap-1.5">
            <Label>{t('fas.chart.dependantAxis')}</Label>
            <Select value={dependantAxis} onValueChange={(val) => setDependantAxis(val as 'month' | 'year' | 'vessel' | 'supplier')}>
              <SelectTrigger className="w-40 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedChartGroup.dependantOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedChartGroup.orderFilter && (
            <div className="flex flex-col gap-1.5">
              <Label>{t('status')}</Label>
              <Select value={status[0]} onValueChange={(val) => setStatus(val ? [val] : [])}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue placeholder={t('select.status')} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t(opt.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label>{t('type')}</Label>
            <Select value={fasType[0]} onValueChange={(val) => setFasType(val ? [val] : [])}>
              <SelectTrigger className="w-40 bg-background">
                <SelectValue placeholder={t('select.type')} />
              </SelectTrigger>
              <SelectContent>
                {FAS_TYPES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedChartGroup.value === 'order.bms.value.chart' && (dependantAxis === 'month' || dependantAxis === 'year') && (
            <div className="flex flex-col gap-1.5">
              <Label>{t('value.by.payment.date')}</Label>
              <Switch checked={showValueByPayment} onCheckedChange={setShowValueByPayment} />
            </div>
          )}

          <Button onClick={handleSearch} className="ml-auto">
            <Search className="mr-2 size-4" />
            {t('search')}
          </Button>
        </Item>

        {renderActiveChart()}
      </CardContent>
    </Card>
  );
}
