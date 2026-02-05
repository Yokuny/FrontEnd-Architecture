import { BrushCleaning, Search, X, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSensorsByAssets } from '@/hooks/use-sensors-by-assets-api';
import { cn } from '@/lib/utils';
import { SENSORS_NOT_ALLOWED } from '../@consts/datalogger.consts';

interface SensorSelectDialogProps {
  idMachine?: string;
  selectedSensors: string[];
  onSensorsChange: (sensors: string[]) => void;
  disabled?: boolean;
}

export function SensorSelectDialog({ idMachine, selectedSensors, onSensorsChange, disabled = false }: SensorSelectDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [localSelection, setLocalSelection] = useState<string[]>(selectedSensors);

  const { data: sensors, isLoading } = useSensorsByAssets(idMachine ? [idMachine] : undefined);

  // Filter sensors: remove string/date types and not allowed sensors
  const filteredSensors = useMemo(() => {
    if (!sensors) return [];
    return sensors
      .filter((s) => s.type !== 'string' && s.type !== 'date' && !SENSORS_NOT_ALLOWED.includes(s.sensorId?.toLowerCase()))
      .sort((a, b) => a.sensor.localeCompare(b.sensor));
  }, [sensors]);

  // Apply search filter and sort (selected first)
  const displaySensors = useMemo(() => {
    let list = filteredSensors;

    if (search) {
      const searchLower = search.toLowerCase();
      list = list.filter((s) => s.sensor.toLowerCase().includes(searchLower) || s.sensorId.toLowerCase().includes(searchLower));
    }

    // Sort: selected first, then alphabetically
    return list.sort((a, b) => {
      const aSelected = localSelection.includes(a.sensorId);
      const bSelected = localSelection.includes(b.sensorId);
      if (aSelected !== bSelected) return aSelected ? -1 : 1;
      return a.sensor.localeCompare(b.sensor);
    });
  }, [filteredSensors, search, localSelection]);

  const handleToggle = (sensorId: string) => {
    setLocalSelection((prev) => (prev.includes(sensorId) ? prev.filter((id) => id !== sensorId) : [...prev, sensorId]));
  };

  const handleClearAll = () => {
    setLocalSelection([]);
  };

  const handleSave = () => {
    onSensorsChange(localSelection);
    setOpen(false);
    setSearch('');
  };

  const handleClose = () => {
    setLocalSelection(selectedSensors);
    setSearch('');
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSelection(selectedSensors);
    }
    setOpen(isOpen);
  };

  return (
    <ItemContent className="min-w-36">
      <Label className="flex items-center gap-2">
        <Zap className="size-4" />
        {t('sensors')}
      </Label>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-background font-normal" disabled={disabled || !idMachine}>
            <span className="truncate">
              {selectedSensors.length > 0 ? `${selectedSensors.length} ${t(selectedSensors.length > 1 ? 'selecteds' : 'selected')}` : t('select.sensors')}
            </span>
            <Zap className="size-4 opacity-50" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('select.sensors')}</DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>

          {/* Sensors List */}
          <ScrollArea className="h-72 rounded-md border">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : displaySensors.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">{t('not.found')}</div>
            ) : (
              <div className="p-2">
                {displaySensors.map((sensor) => {
                  const isChecked = localSelection.includes(sensor.sensorId);
                  return (
                    <button
                      type="button"
                      key={sensor.sensorId}
                      onClick={() => handleToggle(sensor.sensorId)}
                      className={cn('flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent', isChecked && 'bg-accent/50')}
                    >
                      <Checkbox checked={isChecked} />
                      <span className="font-medium text-sm">{sensor.sensor}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button onClick={handleClose}>
              <X className="size-4" />
              {t('cancel')}
            </Button>
            <div className="flex gap-2">
              {localSelection.length > 0 && (
                <Button onClick={handleClearAll}>
                  <BrushCleaning />
                </Button>
              )}
              <Button onClick={handleSave}>{t('save')}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ItemContent>
  );
}
