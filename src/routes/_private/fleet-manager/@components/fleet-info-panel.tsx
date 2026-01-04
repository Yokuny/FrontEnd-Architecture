import { format } from 'date-fns';
import { Anchor, Globe, Info, Ruler, Weight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { calculateCIIReference } from '../@hooks/fleet-utils';
import { useMachineDatasheet } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetInfoPanel() {
  const { t } = useTranslation();
  const { selectedMachineId, setSelectedPanel } = useFleetManagerStore();

  const { data: dsData, isLoading } = useMachineDatasheet(selectedMachineId) as any;

  const onClose = () => setSelectedPanel('details');

  if (!selectedMachineId) return null;

  const ciiRef = dsData?.dataSheet?.typeVesselCIIReference
    ? calculateCIIReference(dsData.dataSheet.typeVesselCIIReference, dsData.dataSheet.deadWeight || 0, dsData.dataSheet.grossTonnage || 0)
    : null;

  return (
    <ItemGroup className="absolute top-4 right-4 bottom-4 w-[500px] z-1001 flex flex-col shadow-2xl border border-primary/10 rounded-xl overflow-hidden bg-background/95 backdrop-blur-sm animate-in slide-in-from-right-4 pointer-events-auto">
      <Item size="sm" className="p-4 border-b border-primary/10 rounded-none bg-muted/30">
        <ItemHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Info className="size-5 text-primary" />
            </div>
            <div>
              <ItemTitle className="text-sm font-bold tracking-tight">{dsData?.name || t('vessel.info')}</ItemTitle>
              <ItemDescription className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{t('technical.datasheet')}</ItemDescription>
            </div>
          </div>
          <ItemActions>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </ItemActions>
        </ItemHeader>
      </Item>

      <ScrollArea className="flex-1 no-scrollbar">
        <div className="p-6 space-y-8">
          {isLoading ? (
            <DefaultLoading />
          ) : (
            <>
              {/* Basic Identification */}
              <section className="space-y-4">
                <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Anchor className="size-3" /> {t('identification')}
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem label={t('name')} value={dsData?.name} />
                  <InfoItem label={t('code')} value={dsData?.code} />
                  <InfoItem label="IMO" value={dsData?.dataSheet?.imo} />
                  <InfoItem label="MMSI" value={dsData?.dataSheet?.mmsi} />
                  <InfoItem label={t('type')} value={dsData?.modelMachine?.description} />
                </div>
              </section>

              <Separator className="opacity-50" />

              {/* Dimensions */}
              <section className="space-y-4">
                <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Ruler className="size-3" /> {t('dimensions')}
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem label={t('length.loa')} value={dsData?.dataSheet?.lengthLoa ? `${dsData.dataSheet.lengthLoa}m` : '-'} />
                  <InfoItem label={t('width.vessel')} value={dsData?.dataSheet?.width ? `${dsData.dataSheet.width}m` : '-'} />
                </div>
              </section>

              <Separator className="opacity-50" />

              {/* Tonnage & Capacity */}
              <section className="space-y-4">
                <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Weight className="size-3" /> {t('capacity')}
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem label="Deadweight" value={dsData?.dataSheet?.deadWeight ? `${dsData.dataSheet.deadWeight} t` : '-'} />
                  <InfoItem label="Gross Tonnage" value={dsData?.dataSheet?.grossTonnage ? `${dsData.dataSheet.grossTonnage} GT` : '-'} />
                  <InfoItem label="CII Reference" value={ciiRef ? ciiRef.toFixed(4) : '-'} />
                </div>
              </section>

              <Separator className="opacity-50" />

              {/* Build & Registration */}
              <section className="space-y-4">
                <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Globe className="size-3" /> {t('registration')}
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem label={t('year.build')} value={dsData?.dataSheet?.yearBuilt} />
                  <InfoItem label={t('flag')} value={dsData?.dataSheet?.flag} />
                  <InfoItem label={t('create.at')} value={dsData?.createAt ? format(new Date(dsData.createAt), 'dd MMM yyyy') : '-'} />
                </div>
              </section>
            </>
          )}
        </div>
      </ScrollArea>
    </ItemGroup>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{label}</p>
      <div className="text-sm font-semibold truncate">{value || '-'}</div>
    </div>
  );
}
