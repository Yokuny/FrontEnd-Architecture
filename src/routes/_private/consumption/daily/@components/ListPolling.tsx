import { Calendar, ChevronDown, Clock, Download, Loader2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { downloadCSV, sortByDateDesc, updateDateTime } from '../@helpers/consumption-daily.helpers';
import { useConsumptionDailyApi } from '../@hooks/use-consumption-daily-api';
import type { ConsumptionDailyData } from '../@interface/consumption-daily.types';

export function ListPolling({ data, machineId, machineName, hasPermissionEditor = false }: ListPollingProps) {
  const { t } = useTranslation();
  const { updatePolling } = useConsumptionDailyApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ConsumptionDailyData | null>(null);
  const [selectedTimeStart, setSelectedTimeStart] = useState<string>('');
  const [selectedTimeEnd, setSelectedTimeEnd] = useState<string>('');
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const items = data?.filter((x) => x?.pollingEnd?.length) || [];

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const expandAll = () => setOpenCategories(items.map((item) => item._id));
  const collapseAll = () => setOpenCategories([]);

  const handleOpenModal = (item: ConsumptionDailyData) => {
    setSelectedItem(item);
    setSelectedTimeStart('');
    setSelectedTimeEnd('');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedItem || !machineId) return;

    let updatedStartTime: string | undefined;
    let updatedEndTime: string | undefined;

    if (selectedTimeStart && selectedItem.pollingStartDateTime) {
      updatedStartTime = updateDateTime(selectedItem.pollingStartDateTime, selectedTimeStart);
    }
    if (selectedTimeEnd && selectedItem.pollingEndDateTime) {
      updatedEndTime = updateDateTime(selectedItem.pollingEndDateTime, selectedTimeEnd);
    }

    const timezoneOffset = formatDate(new Date(), 'XXX'); // Ex: +00:00

    await updatePolling.mutateAsync({
      idMachine: machineId,
      newStartDate: updatedStartTime,
      newEndDate: updatedEndTime,
      _id: selectedItem._id,
      idEnterprise: selectedItem.idEnterprise,
      timezone: timezoneOffset,
    });

    setIsModalOpen(false);
    setSelectedTimeStart('');
    setSelectedTimeEnd('');
  };

  const exportToCSV = () => {
    const csvData = items.map((x) => ({
      vessel: machineName,
      date: x?.pollingEndDateTime ? formatDate(x.pollingEndDateTime, 'yyyy-MM-dd') : '',
      time: x?.pollingEndDateTime ? formatDate(x.pollingEndDateTime, 'HH:mm') : '',
      timezone: x?.pollingEndDateTime ? formatDate(x.pollingEndDateTime, 'XXX') : '',
      ...x?.pollingEnd?.reduce(
        (acc, curr) => {
          acc[curr?.description] = curr?.value?.toFixed(curr?.unit?.toLowerCase() === 'hr' ? 2 : 3);
          acc[`${curr?.description}_unit`] = curr?.unit;
          return acc;
        },
        {} as Record<string, string | undefined>,
      ),
    }));

    downloadCSV(csvData, `${machineName}_polling`);
  };

  if (!items.length) return null;

  const sortedItems = sortByDateDesc(items);

  return (
    <div className="space-y-3">
      <ItemHeader>
        <ItemTitle>{t('polling')}</ItemTitle>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={expandAll} className="text-muted-foreground text-xs hover:text-foreground">
              {t('expand.all')}
            </Button>
            <Separator orientation="vertical" className="h-4 self-center" />
            <Button variant="ghost" size="sm" onClick={collapseAll} className="text-muted-foreground text-xs hover:text-foreground">
              {t('collapse.all')}
            </Button>
          </div>
          <Button size="sm" onClick={exportToCSV}>
            <Download className="size-4" />
          </Button>
        </div>
      </ItemHeader>

      <div className="space-y-3">
        {sortedItems.map((item) => {
          const isOpen = openCategories.includes(item._id);

          return (
            <Collapsible key={item._id} open={isOpen} onOpenChange={() => toggleCategory(item._id)}>
              <div className="rounded-lg border bg-card">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full items-center justify-between outline-none hover:bg-secondary focus-visible:ring-2">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-4" />
                      <ItemTitle className="text-base">{item?.pollingEndDateTime ? formatDate(item.pollingEndDateTime, 'dd MMM HH:mm') : '-'}</ItemTitle>
                      {item?.status === 'processing' && <Loader2 className="ml-2 size-4 animate-spin text-muted-foreground" />}
                    </div>
                    <div className="flex items-center gap-2">
                      {hasPermissionEditor && item?.status === 'processed' && (
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
                    {item?.status === 'processing' && (
                      <Item variant="default" size="sm" className="border-transparent bg-transparent">
                        <ItemDescription>{t('processing')}...</ItemDescription>
                      </Item>
                    )}
                    {item?.pollingEnd?.map((polling, i) => (
                      <div key={`${item._id}-${i}`}>
                        <Item variant="default" size="sm" className="justify-between hover:bg-secondary">
                          <ItemDescription className="font-sans">{polling?.description}</ItemDescription>
                          <div className="flex items-baseline gap-1">
                            <ItemTitle className="font-mono">{polling?.value?.toFixed(polling?.unit?.toLowerCase() === 'hr' ? 2 : 3)}</ItemTitle>
                            <ItemDescription className="text-xs">{polling?.unit}</ItemDescription>
                          </div>
                        </Item>
                        {i < (item.pollingEnd?.length || 0) - 1 && <ItemSeparator />}
                      </div>
                    ))}
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
            <DialogTitle>{t('polling')}</DialogTitle>
          </DialogHeader>

          {/* Início */}
          <div>
            <ItemTitle className="text-muted-foreground">{t('start')}</ItemTitle>
            <ItemContent className="flex-row items-end justify-between">
              <div className="flex gap-4">
                <div>
                  <Label className="flex items-stretch gap-2">
                    <Calendar className="size-4" />
                    {t('date')}
                  </Label>
                  <ItemDescription className="text-lg">{selectedItem?.pollingStartDateTime ? formatDate(selectedItem.pollingStartDateTime, 'dd MMM yyyy') : '-'}</ItemDescription>
                </div>
                <div>
                  <Label className="flex items-stretch gap-2">
                    <Clock className="size-4" />
                    {t('hour.unity')}
                  </Label>
                  <ItemDescription className="text-lg">{selectedItem?.pollingStartDateTime ? formatDate(selectedItem.pollingStartDateTime, 'HH:mm') : '-'}</ItemDescription>
                </div>
              </div>
              <div className="flex w-full max-w-30 flex-col gap-1">
                <Label htmlFor="startTime" className="flex items-stretch gap-2">
                  <Clock className="size-4" />
                  {t('new')}
                </Label>
                <Input className="w-full max-w-24" id="startTime" type="time" value={selectedTimeStart} onChange={(e) => setSelectedTimeStart(e.target.value)} />
              </div>
            </ItemContent>
          </div>

          {/* Fim */}
          <div className="mt-4">
            <ItemTitle className="text-muted-foreground">{t('end')}</ItemTitle>
            <ItemContent className="flex-row items-end justify-between">
              <div className="flex gap-4">
                <div>
                  <Label className="flex items-stretch gap-2">
                    <Calendar className="size-4" />
                    {t('date')}
                  </Label>
                  <ItemDescription className="text-lg">{selectedItem?.pollingEndDateTime ? formatDate(selectedItem.pollingEndDateTime, 'dd MMM yyyy') : '-'}</ItemDescription>
                </div>
                <div>
                  <Label className="flex items-stretch gap-2">
                    <Clock className="size-4" />
                    {t('hour.unity')}
                  </Label>
                  <ItemDescription className="text-lg">{selectedItem?.pollingEndDateTime ? formatDate(selectedItem.pollingEndDateTime, 'HH:mm') : '-'}</ItemDescription>
                </div>
              </div>
              <div className="flex w-full max-w-30 flex-col gap-1">
                <Label htmlFor="endTime" className="flex items-stretch gap-2">
                  <Clock className="size-4" />
                  {t('new')}
                </Label>
                <Input className="w-full max-w-24" id="endTime" type="time" value={selectedTimeEnd} onChange={(e) => setSelectedTimeEnd(e.target.value)} />
              </div>
            </ItemContent>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={updatePolling.isPending || (!selectedTimeEnd && !selectedTimeStart)}>
              {updatePolling.isPending ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ListPollingProps {
  data: ConsumptionDailyData[];
  machineId?: string;
  machineName?: string;
  hasPermissionEditor?: boolean;
}
