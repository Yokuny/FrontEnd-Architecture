import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { SensorByMachineSelect } from '@/components/selects/sensor-by-machine-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { MARKER_TYPE_OPTIONS } from '../@consts/diagram.consts';
import type { DiagramMarker } from '../@interface/diagram-details.types';

interface MarkerEditorProps {
  marker: DiagramMarker;
  onSave: (marker: DiagramMarker) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  children: React.ReactNode;
}

export function MarkerEditor({ marker, onSave, onRemove, onClose, children }: MarkerEditorProps) {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const [data, setData] = useState<DiagramMarker>(marker);
  const [open, setOpen] = useState(true);

  const handleChange = <K extends keyof DiagramMarker>(key: K, value: DiagramMarker[K]) => {
    if (key === 'equipment' && !data.description) {
      setData((prev) => ({ ...prev, description: value as string, [key]: value }));
    } else {
      setData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = () => {
    onSave(data);
    setOpen(false);
    onClose();
  };

  const handleRemove = () => {
    onRemove(data.id);
    setOpen(false);
    onClose();
  };

  return (
    <Popover open={open} onOpenChange={(o) => !o && onClose()}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <Label>{t('description')}</Label>
            <Input value={data.description || ''} onChange={(e) => handleChange('description', e.target.value)} placeholder={t('description')} />
          </div>

          <div className="space-y-1">
            <Label>{t('machine')}</Label>
            <MachineByEnterpriseSelect mode="single" value={data.machine || ''} onChange={(val) => handleChange('machine', val)} idEnterprise={idEnterprise} label="" />
          </div>

          <div className="space-y-1">
            <Label>{t('type')}</Label>
            <Select value={data.type} onValueChange={(val) => handleChange('type', val as DiagramMarker['type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARKER_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {'labelKey' in opt ? t(opt.labelKey) : opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.type !== 'maintenance' && (
            <div className="space-y-1">
              <Label>{t('sensor')}</Label>
              <SensorByMachineSelect idMachine={data.machine || ''} value={data.sensor || ''} onChange={(val) => handleChange('sensor', val || undefined)} />
            </div>
          )}

          {data.type === 'label' && (
            <div className="space-y-1">
              <Label>{t('unit')}</Label>
              <Input value={data.unit || ''} onChange={(e) => handleChange('unit', e.target.value)} placeholder={t('unit')} />
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="destructive" size="sm" onClick={handleRemove}>
              {t('delete')}
            </Button>
            <Button size="sm" onClick={handleSave}>
              {t('save')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
