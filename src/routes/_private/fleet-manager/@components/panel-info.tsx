import { format } from 'date-fns';
import { Anchor, Calendar, Flag, Globe, Ruler, Ship, Weight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
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
      <ItemGroup className="p-4 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center min-h-96">
          <DefaultEmptyData />
        </div>
      </ItemGroup>
    );
  }

  const ciiRef = dsData?.dataSheet?.typeVesselCIIReference
    ? calculateCIIReference(dsData.dataSheet.typeVesselCIIReference, dsData.dataSheet.deadWeight || 0, dsData.dataSheet.grossTonnage || 0)
    : null;

  return (
    <ItemGroup className="p-4 flex flex-col h-full gap-4">
      <div className="flex-1 overflow-auto space-y-6">
        {/* Basic Identification */}
        <div className="space-y-3">
          <ItemHeader className="text-primary font-bold uppercase tracking-wider gap-2">
            <Anchor className="size-3" />
            <ItemTitle className="text-[11px] font-mono">{t('identification')}</ItemTitle>
          </ItemHeader>
          <div className="grid grid-cols-3 gap-y-4 gap-x-2 p-2 bg-accent/50 rounded-md border-accent border">
            <DetailGridItem label={t('name')} value={dsData?.name || '-'} icon={Ship} />
            <DetailGridItem label={t('code')} value={dsData?.code || '-'} />
            <DetailGridItem label="IMO" value={dsData?.dataSheet?.imo || '-'} />
            <DetailGridItem label="MMSI" value={dsData?.dataSheet?.mmsi || '-'} />
            <DetailGridItem label={t('type')} value={dsData?.modelMachine?.description || '-'} />
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-3">
          <ItemHeader className="text-primary font-bold uppercase tracking-wider gap-2">
            <Ruler className="size-3" />
            <ItemTitle className="text-[11px] font-mono">{t('dimensions')}</ItemTitle>
          </ItemHeader>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 p-2 bg-accent/50 rounded-md border-accent border">
            <DetailGridItem label={t('length.loa')} value={dsData?.dataSheet?.lengthLoa ? `${dsData.dataSheet.lengthLoa}m` : '-'} />
            <DetailGridItem label={t('width.vessel')} value={dsData?.dataSheet?.width ? `${dsData.dataSheet.width}m` : '-'} />
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-3">
          <ItemHeader className="text-primary font-bold uppercase tracking-wider gap-2">
            <Weight className="size-3" />
            <ItemTitle className="text-[11px] font-mono">{t('capacity')}</ItemTitle>
          </ItemHeader>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 p-2 bg-accent/50 rounded-md border-accent border">
            <DetailGridItem label="Deadweight" value={dsData?.dataSheet?.deadWeight ? `${dsData.dataSheet.deadWeight} t` : '-'} />
            <DetailGridItem label="Gross Tonnage" value={dsData?.dataSheet?.grossTonnage ? `${dsData.dataSheet.grossTonnage} GT` : '-'} />
            <DetailGridItem label="CII Reference" value={ciiRef ? ciiRef.toFixed(4) : '-'} />
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Registration */}
        <div className="space-y-3">
          <ItemHeader className="text-primary font-bold uppercase tracking-wider gap-2">
            <Globe className="size-3" />
            <ItemTitle className="text-[11px] font-mono">{t('registration')}</ItemTitle>
          </ItemHeader>
          <div className="grid grid-cols-3 gap-y-4 gap-x-2 p-2 bg-accent/50 rounded-md border-accent border">
            <DetailGridItem label={t('year.build')} value={dsData?.dataSheet?.yearBuilt || '-'} icon={Calendar} />
            <DetailGridItem label={t('flag')} value={dsData?.dataSheet?.flag || '-'} icon={Flag} />
            <DetailGridItem label={t('create.at')} value={dsData?.createAt ? format(new Date(dsData.createAt), 'dd MMM yyyy') : '-'} />
          </div>
        </div>
      </div>
    </ItemGroup>
  );
}
