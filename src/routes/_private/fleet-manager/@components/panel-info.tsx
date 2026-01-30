import { Anchor, Calendar, Flag, Globe, Ruler, Ship, Weight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/formatDate';
import { calculateCIIReference } from '../@hooks/fleet-utils';
import { useMachineDatasheet } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { DetailGridItem } from './helpers/detail-items';

export function FleetInfoPanel() {
  const { t } = useTranslation();
  const { selectedMachineId } = useFleetManagerStore();

  const { data: dsData, isLoading } = useMachineDatasheet(selectedMachineId) as any;

  if (!selectedMachineId) return null;

  if (isLoading) {
    return (
      <ItemGroup className="p-4">
        <DefaultLoading />
      </ItemGroup>
    );
  }

  if (!dsData) {
    return (
      <ItemGroup className="flex-1 p-4">
        <div className="flex min-h-96 flex-1 flex-col items-center justify-center">
          <DefaultEmptyData />
        </div>
      </ItemGroup>
    );
  }

  const ciiRef = dsData?.dataSheet?.typeVesselCIIReference
    ? calculateCIIReference(dsData.dataSheet.typeVesselCIIReference, dsData.dataSheet.deadWeight || 0, dsData.dataSheet.grossTonnage || 0)
    : null;

  return (
    <ItemGroup className="flex h-full flex-col gap-4 p-4">
      <div className="flex-1 space-y-6 overflow-auto">
        {/* Basic Identification */}
        <div className="space-y-3">
          <ItemHeader className="gap-2 font-bold text-primary uppercase tracking-wider">
            <Anchor className="size-3" />
            <ItemTitle className="font-mono text-[11px]">{t('identification')}</ItemTitle>
          </ItemHeader>
          <div className="grid grid-cols-3 gap-x-2 gap-y-4 rounded-md border border-accent bg-accent/50 p-2">
            <DetailGridItem label={t('name')} value={dsData?.name || '-'} icon={Ship} />
            <DetailGridItem label={t('code')} value={dsData?.code || '-'} />
            <DetailGridItem label="IMO" value={dsData?.dataSheet?.imo || '-'} />
            <DetailGridItem label="MMSI" value={dsData?.dataSheet?.mmsi || '-'} />
            <DetailGridItem label={t('type')} value={dsData?.modelMachine?.description || '-'} />
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-3">
          <ItemHeader className="gap-2 font-bold text-primary uppercase tracking-wider">
            <Ruler className="size-3" />
            <ItemTitle className="font-mono text-[11px]">{t('dimensions')}</ItemTitle>
          </ItemHeader>
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 rounded-md border border-accent bg-accent/50 p-2">
            <DetailGridItem label={t('length.loa')} value={dsData?.dataSheet?.lengthLoa ? `${dsData.dataSheet.lengthLoa}m` : '-'} />
            <DetailGridItem label={t('width.vessel')} value={dsData?.dataSheet?.width ? `${dsData.dataSheet.width}m` : '-'} />
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-3">
          <ItemHeader className="gap-2 font-bold text-primary uppercase tracking-wider">
            <Weight className="size-3" />
            <ItemTitle className="font-mono text-[11px]">{t('capacity')}</ItemTitle>
          </ItemHeader>
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 rounded-md border border-accent bg-accent/50 p-2">
            <DetailGridItem label="Deadweight" value={dsData?.dataSheet?.deadWeight ? `${dsData.dataSheet.deadWeight} t` : '-'} />
            <DetailGridItem label="Gross Tonnage" value={dsData?.dataSheet?.grossTonnage ? `${dsData.dataSheet.grossTonnage} GT` : '-'} />
            <DetailGridItem label="CII Reference" value={ciiRef ? ciiRef.toFixed(4) : '-'} />
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Registration */}
        <div className="space-y-3">
          <ItemHeader className="gap-2 font-bold text-primary uppercase tracking-wider">
            <Globe className="size-3" />
            <ItemTitle className="font-mono text-[11px]">{t('registration')}</ItemTitle>
          </ItemHeader>
          <div className="grid grid-cols-3 gap-x-2 gap-y-4 rounded-md border border-accent bg-accent/50 p-2">
            <DetailGridItem label={t('year.build')} value={dsData?.dataSheet?.yearBuilt || '-'} icon={Calendar} />
            <DetailGridItem label={t('flag')} value={dsData?.dataSheet?.flag || '-'} icon={Flag} />
            <DetailGridItem label={t('create.at')} value={dsData?.createAt ? formatDate(dsData.createAt, 'dd MMM yyyy') : '-'} />
          </div>
        </div>
      </div>
    </ItemGroup>
  );
}
