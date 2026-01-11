import { format } from 'date-fns';
import { Anchor, Globe, Ruler, Weight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Item, ItemContent, ItemGroup, ItemHeader, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { calculateCIIReference } from '../@hooks/fleet-utils';
import { useMachineDatasheet } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetInfoPanel() {
  const { t } = useTranslation();
  const { selectedMachineId } = useFleetManagerStore();

  const { data: dsData, isLoading } = useMachineDatasheet(selectedMachineId) as any;

  if (!selectedMachineId) return null;

  const ciiRef = dsData?.dataSheet?.typeVesselCIIReference
    ? calculateCIIReference(dsData.dataSheet.typeVesselCIIReference, dsData.dataSheet.deadWeight || 0, dsData.dataSheet.grossTonnage || 0)
    : null;

  return (
    <ItemGroup className="p-6 gap-8">
      {isLoading ? (
        <DefaultLoading />
      ) : (
        <>
          {/* Basic Identification */}
          <Item className="flex-col items-stretch space-y-4">
            <ItemHeader className="text-primary font-bold uppercase tracking-wider gap-2">
              <ItemMedia>
                <Anchor className="size-3" />
              </ItemMedia>
              <ItemTitle className="text-[11px] font-mono">{t('identification')}</ItemTitle>
            </ItemHeader>
            <ItemContent className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoItem label={t('name')} value={dsData?.name} />
              <InfoItem label={t('code')} value={dsData?.code} />
              <InfoItem label="IMO" value={dsData?.dataSheet?.imo} />
              <InfoItem label="MMSI" value={dsData?.dataSheet?.mmsi} />
              <InfoItem label={t('type')} value={dsData?.modelMachine?.description} />
            </ItemContent>
          </Item>

          <Separator />

          {/* Dimensions */}
          <Item className="flex-col items-stretch space-y-4">
            <ItemHeader className="text-primary font-bold uppercase tracking-wider gap-2">
              <ItemMedia>
                <Ruler className="size-3" />
              </ItemMedia>
              <ItemTitle className="text-[11px] font-mono">{t('dimensions')}</ItemTitle>
            </ItemHeader>
            <ItemContent className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoItem label={t('length.loa')} value={dsData?.dataSheet?.lengthLoa ? `${dsData.dataSheet.lengthLoa}m` : '-'} />
              <InfoItem label={t('width.vessel')} value={dsData?.dataSheet?.width ? `${dsData.dataSheet.width}m` : '-'} />
            </ItemContent>
          </Item>

          <Separator />

          {/* Tonnage & Capacity */}
          <Item className="flex-col items-stretch space-y-4">
            <ItemHeader className="text-primary font-bold uppercase tracking-wider gap-2">
              <ItemMedia>
                <Weight className="size-3" />
              </ItemMedia>
              <ItemTitle className="text-[11px] font-mono">{t('capacity')}</ItemTitle>
            </ItemHeader>
            <ItemContent className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoItem label="Deadweight" value={dsData?.dataSheet?.deadWeight ? `${dsData.dataSheet.deadWeight} t` : '-'} />
              <InfoItem label="Gross Tonnage" value={dsData?.dataSheet?.grossTonnage ? `${dsData.dataSheet.grossTonnage} GT` : '-'} />
              <InfoItem label="CII Reference" value={ciiRef ? ciiRef.toFixed(4) : '-'} />
            </ItemContent>
          </Item>

          <Separator />

          {/* Build & Registration */}
          <Item className="flex-col items-stretch space-y-4">
            <ItemHeader className="text-primary font-bold uppercase tracking-wider gap-2">
              <ItemMedia>
                <Globe className="size-3" />
              </ItemMedia>
              <ItemTitle className="text-[11px] font-mono">{t('registration')}</ItemTitle>
            </ItemHeader>
            <ItemContent className="grid grid-cols-2 gap-x-8 gap-y-4">
              <InfoItem label={t('year.build')} value={dsData?.dataSheet?.yearBuilt} />
              <InfoItem label={t('flag')} value={dsData?.dataSheet?.flag} />
              <InfoItem label={t('create.at')} value={dsData?.createAt ? format(new Date(dsData.createAt), 'dd MMM yyyy') : '-'} />
            </ItemContent>
          </Item>
        </>
      )}
    </ItemGroup>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <ItemContent className="space-y-1">
      <ItemTitle className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{label}</ItemTitle>
      <div className="text-sm font-semibold truncate">{value || '-'}</div>
    </ItemContent>
  );
}
