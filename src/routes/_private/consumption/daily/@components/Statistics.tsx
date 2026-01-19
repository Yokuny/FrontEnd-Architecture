import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { AlertTriangle, Calendar, ChevronDown, Clock, Download, Flame, Fuel, Pencil, RulerDimensionLine, Stone, Warehouse } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { downloadCSV, sortByDateDesc } from '../@helpers/consumption-daily.helpers';
import { useConsumptionDailyApi } from '../@hooks/use-consumption-daily-api';
import type { ConsumptionDailyData } from '../@interface/consumption-daily.types';

export function Statistics({ data, machineId, machineName, hasPermissionEditor = false }: StatisticsProps) {
  const { t } = useTranslation();
  const { updateOilMoving } = useConsumptionDailyApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ConsumptionDailyData | null>(null);
  const [newOilReceived, setNewOilReceived] = useState<string>('');
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const expandAll = () => setOpenCategories(data.map((item) => item._id));
  const collapseAll = () => setOpenCategories([]);

  const handleOpenModal = (item: ConsumptionDailyData) => {
    setSelectedItem(item);
    setNewOilReceived('');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedItem || !machineId) return;

    await updateOilMoving.mutateAsync({
      idMachine: machineId,
      newOilReceived: Number(newOilReceived),
      _id: selectedItem._id,
      idEnterprise: selectedItem.idEnterprise,
    });

    setIsModalOpen(false);
    setNewOilReceived('');
  };

  const exportToCSV = () => {
    const csvData = data.map((x) => ({
      vessel: machineName,
      date: format(new Date(x?.pollingEndDateTime || x.date), 'yyyy-MM-dd'),
      hours: x?.hours?.toFixed(2),
      consumptionReal: x?.consumptionReal?.value,
      consumptionUnit: x?.consumptionReal?.unit,
      consumptionRealCo2: (Number(x?.consumptionReal?.co2) / 1000).toFixed(2),
      co2Unit: 'Ton',
      consumptionEstimate: x?.consumption?.value,
      consumptionEstimateUnit: x?.consumption?.unit,
      consumptionEstimateCo2: (Number(x?.consumption?.co2) / 1000).toFixed(2),
      ...x?.engines?.reduce(
        (acc, curr) => {
          acc[curr?.description] = curr?.consumption?.value;
          return acc;
        },
        {} as Record<string, number>,
      ),
    }));

    downloadCSV(csvData, `${machineName}_daily`);
  };

  if (!data.length) return null;

  const sortedData = sortByDateDesc(data);

  return (
    <div className="space-y-3">
      <ItemHeader>
        <ItemTitle>{t('resume.daily')}</ItemTitle>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs text-muted-foreground hover:text-foreground">
              {t('expand.all')}
            </Button>
            <Separator orientation="vertical" className="h-4 self-center" />
            <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs text-muted-foreground hover:text-foreground">
              {t('collapse.all')}
            </Button>
          </div>
          <Button size="sm" onClick={exportToCSV}>
            <Download className="size-4" />
          </Button>
        </div>
      </ItemHeader>

      <div className="space-y-3">
        {sortedData.map((item) => {
          const isConsumptionReal = !!item?.consumptionReal?.value;
          const consumption = isConsumptionReal ? item.consumptionReal : item.consumption;
          const date = item.date;
          const isOpen = openCategories.includes(item._id);

          return (
            <Collapsible key={item._id} open={isOpen} onOpenChange={() => toggleCategory(item._id)}>
              <div className="rounded-lg border bg-card">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full items-center justify-between hover:bg-secondary outline-none focus-visible:ring-2">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-4" />
                      <ItemTitle className="text-base">{format(new Date(date), 'dd MMM yyyy', { locale: pt })}</ItemTitle>
                      <div className="flex items-center gap-2 ml-2">
                        {item.isNeedRegeneration && <AlertTriangle className="size-4 text-amber-500" />}
                        <Badge variant={isConsumptionReal ? 'default' : 'secondary'}>{isConsumptionReal ? 'SON*' : 'FLM*'}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasPermissionEditor && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(item);
                          }}
                        >
                          <Pencil className="size-3" />
                        </Button>
                      )}
                      <ChevronDown className={cn('size-5 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')} />
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ItemGroup>
                    <Item variant="default" size="sm" className="justify-between hover:bg-secondary">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-yellow-800" />
                        <ItemDescription className="font-sans">{t('hour.unity')}</ItemDescription>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <ItemTitle className="font-mono">{item.hours?.toFixed(2)}</ItemTitle>
                        <ItemDescription className="text-xs">HR</ItemDescription>
                      </div>
                    </Item>
                    <ItemSeparator />

                    <Item variant="default" size="sm" className="justify-between hover:bg-secondary">
                      <div className="flex items-center gap-2">
                        <Flame className={`size-4 ${isConsumptionReal ? 'text-amber-700' : 'text-red-500'}`} />
                        <ItemDescription className="font-sans">{t(isConsumptionReal ? 'real.consumption' : 'estimated.consumption')}</ItemDescription>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <ItemTitle className="font-mono">{consumption?.value?.toFixed(2)}</ItemTitle>
                        <ItemDescription className="text-xs">{consumption?.unit}</ItemDescription>
                      </div>
                    </Item>
                    <ItemSeparator />

                    <Item variant="default" size="sm" className="justify-between hover:bg-secondary">
                      <div className="flex items-center gap-2">
                        <Stone className="size-4 text-stone-600" />
                        <ItemDescription className="font-sans">{`CO₂ ${t(isConsumptionReal ? 'polling' : 'flowmeter').toLowerCase()}`}</ItemDescription>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <ItemTitle className="font-mono">{(Number(consumption?.co2) / 1000).toFixed(2)}</ItemTitle>
                        <ItemDescription className="text-xs">Ton</ItemDescription>
                      </div>
                    </Item>

                    {!!item?.distance && (
                      <>
                        <ItemSeparator />
                        <Item variant="default" size="sm" className="justify-between hover:bg-secondary">
                          <div className="flex items-center gap-2">
                            <RulerDimensionLine className="size-4 text-cyan-600" />
                            <ItemDescription className="font-sans">{t('distance')}</ItemDescription>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <ItemTitle className="font-mono">{item.distance.toFixed(2)}</ItemTitle>
                            <ItemDescription className="text-xs">nm</ItemDescription>
                          </div>
                        </Item>
                      </>
                    )}

                    {!!item?.oil?.stock && (
                      <>
                        <ItemSeparator />
                        <Item variant="default" size="sm" className="justify-between hover:bg-secondary">
                          <div className="flex items-center gap-2">
                            <Warehouse className="size-4 text-amber-700" />
                            <ItemDescription className="font-sans">{t('stock')}</ItemDescription>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <ItemTitle className="font-mono">{item.oil.stock.toFixed(3)}</ItemTitle>
                            <ItemDescription className="text-xs">{item.oil.unit}</ItemDescription>
                          </div>
                        </Item>
                      </>
                    )}

                    {!!(item?.oil?.received && item.oil.received > 0) && (
                      <>
                        <ItemSeparator />
                        <Item variant="default" size="sm" className="justify-between hover:bg-secondary">
                          <div className="flex items-center gap-2">
                            <Fuel className="size-4 text-pink-800" />
                            <ItemDescription className="font-sans">{t('fueling')}</ItemDescription>
                            <p className="text-[10px] text-muted-foreground uppercase">MDO</p>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <ItemTitle className="font-mono">{item.oil.received.toFixed(3)}</ItemTitle>
                            <ItemDescription className="text-xs">{item.oil.unit}</ItemDescription>
                          </div>
                        </Item>
                      </>
                    )}
                  </ItemGroup>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      {/* Modal de Edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('consumption.movement.adjustment')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <ItemTitle className="text-muted-foreground">{t('date')}</ItemTitle>
              <ItemContent className="flex-row items-center gap-2">
                <Calendar className="size-4" />
                <ItemDescription className="text-lg">{selectedItem?.date ? format(new Date(selectedItem.date), 'dd MMM yyyy', { locale: pt }) : '-'}</ItemDescription>
              </ItemContent>
            </div>

            <div>
              <ItemTitle className="text-muted-foreground">{t('moving')}</ItemTitle>
              <ItemContent className="flex-row justify-between items-end">
                <div>
                  <Label className="flex items-stretch gap-2">
                    <Fuel className="size-4" />
                    {t('machine.supplies.consumption.received')}
                  </Label>
                  <ItemDescription className="text-lg">
                    {selectedItem?.oil?.received ? selectedItem.oil.received.toFixed(2) : 'N/A'}
                    {selectedItem?.oil?.unit && <span className="ml-1 text-sm">{selectedItem.oil.unit}</span>}
                  </ItemDescription>
                </div>

                <div className="max-w-40 w-full flex flex-col gap-1">
                  <Label htmlFor="newOil" className="flex items-stretch gap-2">
                    <Pencil className="size-4" />
                    {t('new')} {selectedItem?.oil?.unit && `(${selectedItem.oil.unit})`}
                  </Label>
                  <Input
                    id="newOil"
                    type="number"
                    step="0.001"
                    value={newOilReceived}
                    onChange={(e) => setNewOilReceived(e.target.value)}
                    placeholder={`${t('new')} ${selectedItem?.oil?.unit || ''}`}
                    className="max-w-40 w-full"
                  />
                </div>
              </ItemContent>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={updateOilMoving.isPending || !newOilReceived}>
              {updateOilMoving.isPending ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface StatisticsProps {
  data: ConsumptionDailyData[];
  machineId?: string;
  machineName?: string;
  hasPermissionEditor?: boolean;
}
