import { Clock, Hash, Link2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { useMachinesApi } from '@/hooks/use-machines-api';

interface IncludeVesselModalProps {
  isOpen: boolean;
  onClose: () => void;
  idEnterprise: string;
}

export function IncludeVesselModal({ isOpen, onClose, idEnterprise }: IncludeVesselModalProps) {
  const { t } = useTranslation();
  const { includeMachine } = useMachinesApi();
  const [data, setData] = useState({
    type: 'IMO',
    value: '',
    interval: 600000, // Default 10 min
    showInFleet: false,
    processStatus: false,
    processTravel: false,
  });

  const handleSave = async () => {
    if (!data.value) {
      toast.warning(t('value.placeholder'));
      return;
    }

    try {
      await includeMachine.mutateAsync({
        ...data,
        idEnterprise,
      });
      toast.success(t('save.success'));
      onClose();
    } catch {
      toast.error(t('error.save'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('add.machine')}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Link2 className="size-4" />
              IMO/MMSI *
            </Label>
            <Select value={data.type} onValueChange={(val) => setData({ ...data, type: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IMO">IMO</SelectItem>
                <SelectItem value="MMSI">MMSI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Hash className="size-4" />
              {data.type} *
            </Label>
            <Input value={data.value} onChange={(e) => setData({ ...data, value: e.target.value })} placeholder={data.type} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="size-4" />
              {t('interval')} *
            </Label>
            <Select value={data.interval.toString()} onValueChange={(val) => setData({ ...data, interval: Number.parseInt(val, 10) })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60000">1 min</SelectItem>
                <SelectItem value="120000">2 min</SelectItem>
                <SelectItem value="300000">5 min</SelectItem>
                <SelectItem value="600000">10 min</SelectItem>
                <SelectItem value="900000">15 min</SelectItem>
                <SelectItem value="1800000">30 min</SelectItem>
                <SelectItem value="3600000">60 min</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 md:col-span-2 pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t('show.in.fleet')}</Label>
              <Switch checked={data.showInFleet} onCheckedChange={(checked) => setData({ ...data, showInFleet: checked })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t('process.status')}</Label>
              <Switch checked={data.processStatus} onCheckedChange={(checked) => setData({ ...data, processStatus: checked })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{t('process.travel')}</Label>
              <Switch checked={data.processTravel} onCheckedChange={(checked) => setData({ ...data, processTravel: checked })} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={includeMachine.isPending}>
            {includeMachine.isPending && <Spinner className="mr-2 size-4" />}
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
