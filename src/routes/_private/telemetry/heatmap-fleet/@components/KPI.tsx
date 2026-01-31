import { AlertTriangle, Check, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Item, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { HeatmapStats } from '../@interface/heatmap.types';
import { StatusTracker } from './heatmap-table';

export function KPI({ stats }: KpiCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-5">
      {/* Online Assets */}
      <Item className="items-center gap-4 rounded-none border-0 bg-background p-4">
        <StatusTracker items={[{ status: 'success' }]} />
        <div className="flex flex-col">
          <ItemDescription className="font-medium text-[10px] uppercase tracking-wider">{t('assets.online')}</ItemDescription>
          <ItemTitle className="font-bold text-2xl text-emerald-600 tracking-tight">{stats.onlineAssets}</ItemTitle>
        </div>
      </Item>

      {/* Offline Assets */}
      <Item className="items-center gap-4 rounded-none border-0 bg-background p-4">
        <StatusTracker items={[{ status: 'basic' }]} />
        <div className="flex flex-col">
          <ItemDescription className="font-medium text-[10px] uppercase tracking-wider">{t('assets.offline')}</ItemDescription>
          <ItemTitle className="font-bold text-2xl text-slate-500 tracking-tight">{stats.offlineAssets}</ItemTitle>
        </div>
      </Item>

      {/* Items OK */}
      <Item className="items-center gap-4 rounded-none border-0 bg-background p-4">
        <Check className="size-5 stroke-3 text-emerald-500" />
        <div className="flex flex-col">
          <ItemDescription className="font-medium text-[10px] uppercase tracking-wider">{t('items.ok')}</ItemDescription>
          <ItemTitle className="font-bold text-2xl text-emerald-500 tracking-tight">{stats.itemsOk}</ItemTitle>
        </div>
      </Item>

      {/* In Progress */}
      <Item className="items-center gap-4 rounded-none border-0 bg-background p-4">
        <Ship className="size-5 text-amber-500" />
        <div className="flex flex-col">
          <ItemDescription className="font-medium text-[10px] uppercase tracking-wider">{t('items.in.progress')}</ItemDescription>
          <ItemTitle className="font-bold text-2xl text-amber-500 tracking-tight">{stats.itemsInProgress}</ItemTitle>
        </div>
      </Item>

      {/* In Alert */}
      <Item className="items-center gap-4 rounded-none border-0 bg-background p-4">
        <AlertTriangle className="size-5 text-rose-500" />
        <div className="flex flex-col">
          <ItemDescription className="font-medium text-[10px] uppercase tracking-wider">{t('items.in.alert')}</ItemDescription>
          <ItemTitle className="font-bold text-2xl text-rose-500 tracking-tight">{stats.itemsInAlert}</ItemTitle>
        </div>
      </Item>
    </div>
  );
}

interface KpiCardsProps {
  stats: HeatmapStats;
}
