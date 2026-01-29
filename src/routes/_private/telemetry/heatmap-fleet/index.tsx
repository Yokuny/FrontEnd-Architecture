import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus, Zap, ZapOff } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ItemGroup, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { HeatmapTable, StatusTracker } from './@components/heatmap-table';
import { KPI } from './@components/KPI';
import { getAvailableEquipments } from './@consts/equipment.consts';
import { useHeatmapFleet } from './@hooks/use-heatmap-fleet';
import { calculateHeatmapStats } from './@utils/heatmap.utils';

export const Route = createFileRoute('/_private/telemetry/heatmap-fleet/')({
  component: HeatmapFleetPage,
});

function HeatmapFleetPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useHeatmapFleet(idEnterprise);

  // TODO: Implement permission check
  const hasPermissionAdd = true;

  const availableEquipments = useMemo(() => {
    if (!data) return [];
    return getAvailableEquipments(data);
  }, [data]);

  const stats = useMemo(() => {
    if (!data) return { onlineAssets: 0, offlineAssets: 0, itemsOk: 0, itemsInProgress: 0, itemsInAlert: 0 };
    return calculateHeatmapStats(data);
  }, [data]);

  return (
    <Card>
      <CardHeader title={t('heatmap')}>
        {hasPermissionAdd && (
          <Button onClick={() => navigate({ to: '/telemetry/heatmap-fleet/add' })}>
            <Plus className="mr-2 size-4" />
            {t('view.heatmap.add')}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !data || data.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <>
            <KPI stats={stats} />
            <HeatmapTable data={data} availableEquipments={availableEquipments} hasPermissionAdd={hasPermissionAdd} />
          </>
        )}
      </CardContent>

      {!isLoading && data && data.length > 0 && (
        <CardFooter className="flex flex-col items-start gap-4">
          <ItemTitle className="text-muted-foreground text-xs uppercase">{t('legend')}</ItemTitle>

          <div className="flex flex-wrap gap-6">
            <ItemGroup className="flex-col gap-3">
              <div className="flex items-center gap-2">
                <Zap className="size-3.5 text-emerald-500" />
                <ItemTitle className="font-bold text-muted-foreground text-xs uppercase tracking-tight">{t('active.mode')}</ItemTitle>
              </div>
              <div className="flex flex-wrap gap-4">
                <StatusTracker showLegend items={[{ status: 'success', tooltip: 'OK' }]} />
                <StatusTracker showLegend items={[{ status: 'warning', tooltip: t('items.in.progress') }]} />
                <StatusTracker showLegend items={[{ status: 'danger', tooltip: t('items.in.alert') }]} />
                <StatusTracker showLegend items={[{ status: 'basic', tooltip: t('no.connected.hours', { hours: '24' }) }]} />
              </div>
            </ItemGroup>

            <ItemGroup className="flex-col gap-3">
              <div className="flex items-center gap-2">
                <ZapOff className="size-3.5 text-slate-400" />
                <ItemTitle className="font-bold text-muted-foreground text-xs uppercase tracking-tight">{t('power.off')}</ItemTitle>
              </div>
              <div className="flex flex-wrap gap-4">
                <StatusTracker showLegend items={[{ status: 'success', tooltip: 'OK', onlyBorder: true }]} />
                <StatusTracker showLegend items={[{ status: 'warning', tooltip: t('items.in.progress'), onlyBorder: true }]} />
                <StatusTracker showLegend items={[{ status: 'danger', tooltip: t('items.in.alert'), onlyBorder: true }]} />
                <StatusTracker showLegend items={[{ status: 'basic', tooltip: t('no.connected.hours', { hours: '24' }), onlyBorder: true }]} />
              </div>
            </ItemGroup>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
