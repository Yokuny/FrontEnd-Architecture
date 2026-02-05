import { Activity, BarChart3, Clock, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { CURRENCY_CONFIG, OPERATIONAL_ASSET_STATUS } from '../@consts/operational-asset.constants';
import type { StatusDataItem } from '../@services/operational-asset.service';

export function KPI({ data, totalLoss, totalRevenue, viewFinancial }: MiniDashboardsProps) {
  const { t } = useTranslation();

  const totalHours = data.reduce((acc, curr) => acc + curr.totalHours, 0);
  const operationalHours = data.filter((d) => d.status === OPERATIONAL_ASSET_STATUS.OPERACAO).reduce((acc, curr) => acc + curr.totalHours, 0);
  const downtimeHours = data
    .filter((d) => d.status === OPERATIONAL_ASSET_STATUS.DOWNTIME || d.status === OPERATIONAL_ASSET_STATUS.DOWNTIME_PARCIAL)
    .reduce((acc, curr) => acc + curr.totalHours, 0);

  const operabilityRate = totalHours > 0 ? (operationalHours * 100) / totalHours : 0;
  const avgDailyOperational = data.length > 0 ? operationalHours / (totalHours / 24) : 0;

  const currencyFormatter = new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
    style: 'currency',
    currency: CURRENCY_CONFIG.CODE,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Item className="flex-col rounded-none border-0 bg-background">
          <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
            <Clock className="size-5" />
            <ItemDescription className="font-medium">{t('time.operational')}</ItemDescription>
          </ItemContent>
          <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{operationalHours.toFixed(1)}h</ItemTitle>
        </Item>

        <Item className="flex-col rounded-none border-0 bg-background">
          <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
            <TriangleAlert className="size-5" />
            <ItemDescription className="font-medium">{t('time.inoperability')}</ItemDescription>
          </ItemContent>
          <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{downtimeHours.toFixed(1)}h</ItemTitle>
        </Item>

        <Item className="flex-col rounded-none border-0 bg-background">
          <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
            <Activity className="size-5" />
            <ItemDescription className="font-medium">{t('operating.rate')}</ItemDescription>
          </ItemContent>
          <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{operabilityRate.toFixed(1)}%</ItemTitle>
        </Item>

        <Item className="flex-col rounded-none border-0 bg-background">
          <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
            <BarChart3 className="size-5" />
            <ItemDescription className="font-medium">{t('avg.daily.operational')}</ItemDescription>
          </ItemContent>
          <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{avgDailyOperational.toFixed(1)}h</ItemTitle>
        </Item>
      </div>
      {viewFinancial && (
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
          <Item className="flex-col rounded-none border-0 bg-background">
            <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
              <TrendingUp className="size-5 text-emerald-600" />
              <ItemDescription className="font-medium">{t('revenue')}</ItemDescription>
            </ItemContent>
            <ItemTitle className="ml-6 font-bold text-emerald-600 text-xl tracking-tight">{currencyFormatter.format(totalRevenue)}</ItemTitle>
          </Item>
          <Item className="flex-col rounded-none border-0 bg-background">
            <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
              <TrendingDown className="size-5 text-rose-600" />
              <ItemDescription className="font-medium">{t('loss')}</ItemDescription>
            </ItemContent>
            <ItemTitle className="ml-6 font-bold text-rose-600 text-xl tracking-tight">{currencyFormatter.format(totalLoss)}</ItemTitle>
          </Item>
        </div>
      )}
    </div>
  );
}

interface MiniDashboardsProps {
  data: StatusDataItem[];
  totalLoss: number;
  totalRevenue: number;
  viewFinancial: boolean;
}
