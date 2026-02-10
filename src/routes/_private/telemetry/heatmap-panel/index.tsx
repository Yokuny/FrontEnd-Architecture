import { createFileRoute } from '@tanstack/react-router';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { BenchmarkCards } from './@components/benchmark-cards';
import { EquipmentDialog } from './@components/equipment-dialog';
import { HeatmapTable } from './@components/heatmap-table';
import { useHeatmapPanelQuery } from './@hooks/use-heatmap-panel';
import type { TrackerItem } from './@interface/heatmap-panel.types';

export const Route = createFileRoute('/_private/telemetry/heatmap-panel/')({
  component: HeatmapPanelPage,
  staticData: {
    title: 'telemetry.heatmap-panel',
    description:
      'Painel de heatmap consolidado com benchmark de equipamentos. Exibe matriz de status agrupada por subgrupos de equipamentos com totalizadores, permitindo drill-down para visualizar detalhes de equipamentos específicos. Ideal para gestão de frota centralizada.',
    tags: ['heatmap-panel', 'benchmark', 'equipment-groups', 'fleet-overview', 'consolidated-view', 'status-matrix', 'drill-down'],
    examplePrompts: ['Ver painel consolidado de heatmap', 'Analisar benchmark de equipamentos', 'Consultar status agrupados por categoria'],
    relatedRoutes: [
      { path: '/_private/telemetry', relation: 'parent', description: 'Hub de telemetria' },
      { path: '/_private/telemetry/heatmap-fleet', relation: 'sibling', description: 'Heatmap da frota' },
    ],
    entities: ['Machine', 'EquipmentSubgroup', 'HeatmapData'],
    capabilities: [
      'Cards de benchmark com totais',
      'Matriz de status consolidada',
      'Agrupamento por subgrupos de equipamentos',
      'Drill-down em células do heatmap',
      'Modal com detalhes de equipamentos',
      'Último update de dados',
      'Colunas dinâmicas por configuração',
    ],
  },
});

function HeatmapPanelPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [selectedItem, setSelectedItem] = useState<TrackerItem | null>(null);

  const { data, isLoading } = useHeatmapPanelQuery(idEnterprise);

  const handleTrackerItemClick = (item: TrackerItem) => {
    if (item.data?.equipments?.length) {
      setSelectedItem(item);
    }
  };

  const handleDialogClose = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <Card>
        <CardHeader title={t('telemetry.heatmap.panel')}>
          {data?.lastUpdate && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="size-4" />
              <span>
                {t('last.date.acronym')}: {formatDate(new Date(data.lastUpdate), 'dd MMM, HH:mm')}
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {isLoading ? (
            <DefaultLoading />
          ) : !data?.columns?.length || !data?.data?.length ? (
            <DefaultEmptyData />
          ) : (
            <>
              <BenchmarkCards totals={data.total} />
              <HeatmapTable columns={data.columns} rows={data.data} onTrackerItemClick={handleTrackerItemClick} />
            </>
          )}
        </CardContent>
      </Card>

      <EquipmentDialog open={!!selectedItem} onOpenChange={handleDialogClose} machine={selectedItem?.machine} subgroup={selectedItem?.data} />
    </>
  );
}
