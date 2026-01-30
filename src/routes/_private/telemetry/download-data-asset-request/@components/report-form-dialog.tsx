import { subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { SensorByMachineSelect } from '@/components/selects/sensor-by-machine-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INTERVAL_OPTIONS } from '../@consts/download-request.consts';
import type { DownloadQueueRequest } from '../@interface/download-request.types';
import { getTimezoneOffset } from '../@utils/download-request.utils';

function formatDateTimeLocal(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ReportFormDialog({ open, onOpenChange, idEnterprise, onSubmit, isLoading }: ReportFormDialogProps) {
  const { t } = useTranslation();

  const [idMachine, setIdMachine] = useState<string | undefined>();
  const [sensorIds, setSensorIds] = useState<string[]>([]);
  const [sensorLabels, setSensorLabels] = useState<string[]>([]);
  const [dateStart, setDateStart] = useState(formatDateTimeLocal(subDays(new Date(), 8)));
  const [dateEnd, setDateEnd] = useState(formatDateTimeLocal(subDays(new Date(), 1)));
  const [interval, setInterval] = useState<string>('300000');

  const [showStatusNavigation, setShowStatusNavigation] = useState(false);
  const [showFenceName, setShowFenceName] = useState(false);
  const [showPlatformName, setShowPlatformName] = useState(false);
  const [justHasValue, setJustHasValue] = useState(false);
  const [coordinates, setCoordinates] = useState(false);

  const hasGpsSensor = useMemo(() => sensorLabels.some((label) => label.toLowerCase().includes('gps')), [sensorLabels]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idMachine) {
      toast.error(t('select.machines'));
      return;
    }

    if (!sensorIds.length) {
      toast.error(t('machine.sensors.placeholder'));
      return;
    }

    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    if (startDate >= endDate) {
      toast.error(t('date.end.is.before.date.start'));
      return;
    }

    const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 60) {
      toast.error(t('interval.more.60.days'));
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const request: DownloadQueueRequest = {
      idEnterprise: idEnterprise || '',
      idMachines: [idMachine],
      idSensors: sensorIds,
      dateStart: startDate,
      dateEnd: endDate,
      interval: interval === 'null' ? null : Number(interval),
      timezone: getTimezoneOffset(),
      dataShow: {
        isShowStatusNavigation: showStatusNavigation,
        isShowStatusOperation: false,
        isShowFence: showFenceName,
        isShowPlatform: showPlatformName,
        isJustHasValue: justHasValue,
        isShowCoordinatesInDegrees: coordinates,
      },
      file: null,
      createdBy: user?.name || '',
    };

    onSubmit(request);
  };

  const handleMachineChange = (value: string | undefined) => {
    setIdMachine(value);
    setSensorIds([]);
    setSensorLabels([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('generate.report')}</DialogTitle>
        </DialogHeader>

        <form id="report-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <MachineByEnterpriseSelect mode="single" value={idMachine} onChange={handleMachineChange} idEnterprise={idEnterprise} label={`${t('select.machines')} *`} />

            <SensorByMachineSelect multi values={sensorIds} onChangeMulti={setSensorIds} idMachine={idMachine} label={`${t('machine.sensors.placeholder')} *`} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{t('date.start')} *</Label>
              <Input type="datetime-local" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>{t('date.end')} *</Label>
              <Input type="datetime-local" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>{t('range')} *</Label>
              <Select value={interval} onValueChange={setInterval}>
                <SelectTrigger>
                  <SelectValue placeholder={t('range')} />
                </SelectTrigger>
                <SelectContent>
                  {INTERVAL_OPTIONS.map((opt) => (
                    <SelectItem key={String(opt.value)} value={String(opt.value)}>
                      {'labelKey' in opt ? t(opt.labelKey) : opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="showStatusNavigation" checked={showStatusNavigation} onCheckedChange={(v) => setShowStatusNavigation(!!v)} />
              <Label htmlFor="showStatusNavigation" className="cursor-pointer text-muted-foreground text-sm">
                {t('include.navigation.status')}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="showFenceName" checked={showFenceName} onCheckedChange={(v) => setShowFenceName(!!v)} />
              <Label htmlFor="showFenceName" className="cursor-pointer text-muted-foreground text-sm">
                {t('include.fence.name')}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="showPlatformName" checked={showPlatformName} onCheckedChange={(v) => setShowPlatformName(!!v)} />
              <Label htmlFor="showPlatformName" className="cursor-pointer text-muted-foreground text-sm">
                {t('include.plataform.name')}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="justHasValue" checked={justHasValue} onCheckedChange={(v) => setJustHasValue(!!v)} />
              <Label htmlFor="justHasValue" className="cursor-pointer text-muted-foreground text-sm">
                {t('just.has.value')}
              </Label>
            </div>

            {hasGpsSensor && (
              <div className="flex items-center space-x-2">
                <Checkbox id="coordinates" checked={coordinates} onCheckedChange={(v) => setCoordinates(!!v)} />
                <Label htmlFor="coordinates" className="cursor-pointer text-muted-foreground text-sm">
                  {t('coordinates.in.degrees')}
                </Label>
              </div>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button type="submit" form="report-form" disabled={isLoading}>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ReportFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idEnterprise?: string;
  onSubmit: (data: DownloadQueueRequest) => void;
  isLoading?: boolean;
}
