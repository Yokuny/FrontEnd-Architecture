import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ItemTitle } from '@/components/ui/item';
import { HeatmapTable } from '../../heatmap-fleet/@components/heatmap-table';
import { getAvailableEquipments } from '../../heatmap-fleet/@consts/equipment.consts';
import { useHeatmapFleet } from '../../heatmap-fleet/@hooks/use-heatmap-fleet';
import { StatusCard } from './status-card';

interface MachinePanelProps {
  idMachine: string;
  name?: string;
  idEnterprise?: string;
}

export function MachinePanel({ idMachine, name, idEnterprise }: MachinePanelProps) {
  const { t } = useTranslation();

  const { data: heatmapData, isLoading: loadingHeatmap } = useHeatmapFleet(idEnterprise);

  const machineHeatmap = useMemo(() => {
    if (!heatmapData) return [];
    return heatmapData.filter((item) => item.id === idMachine);
  }, [heatmapData, idMachine]);

  const availableEquipments = useMemo(() => {
    if (!machineHeatmap.length) return [];
    return getAvailableEquipments(machineHeatmap);
  }, [machineHeatmap]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title={name || t('panel')}>
          <StatusCard idMachine={idMachine} />
        </CardHeader>

        <CardContent>
          {loadingHeatmap ? (
            <DefaultLoading />
          ) : machineHeatmap.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-lg border">
              <HeatmapTable data={machineHeatmap} availableEquipments={availableEquipments} hasPermissionAdd={false} />
            </div>
          ) : null}

          {/* Dashboard Section */}
          <div className="mt-8 flex flex-col gap-4">
            <ItemTitle className="font-bold text-lg">{t('dashboard')}</ItemTitle>
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed bg-secondary/50">
              <span className="text-muted-foreground">{t('dashboard.migration.in.progress')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
