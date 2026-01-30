import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UnitSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ItemContent, ItemGroup } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function DialogEvent({ open, onOpenChange, data, onSave }: EventDialogProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (open) {
      setFormData(
        data || {
          datetime: new Date().toISOString().slice(0, 16),
          status: '',
          speed: '',
          engine: { rpmBB: '', rpmBE: '' },
          stock: {
            oil: { value: '', unit: 'L' },
            water: { value: '', unit: 'L' },
          },
          observation: '',
        },
      );
    }
  }, [data, open]);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (path: string[], value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!current[key]) current[key] = {};
        current[key] = { ...current[key] };
        current = current[key];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{data ? t('edit.event') : t('add.event')}</DialogTitle>
        </DialogHeader>

        <ItemGroup className="gap-4">
          <ItemContent className="flex-row gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t('datetime')}</Label>
              <Input type="datetime-local" value={formData.datetime ? formData.datetime.slice(0, 16) : ''} onChange={(e) => updateField('datetime', e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('status')}</Label>
              <Input value={formData.status || ''} onChange={(e) => updateField('status', e.target.value)} placeholder={t('status')} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t('type')}</Label>
              <Select value="MDO" disabled>
                <SelectTrigger>
                  <SelectValue placeholder="MDO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MDO">MDO</SelectItem>
                </SelectContent>
              </Select>
            </div>{' '}
          </ItemContent>

          <ItemContent className="flex-row gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t('machine.supplies.consumption.oil')}</Label>
              <Input
                type="number"
                value={formData.stock?.oil?.value || ''}
                onChange={(e) => updateNestedField(['stock', 'oil', 'value'], e.target.value)}
                placeholder={t('machine.supplies.consumption.oil')}
              />
            </div>

            <UnitSelect value={formData.stock?.oil?.unit} onChange={(val) => updateNestedField(['stock', 'oil', 'unit'], val)} />

            <div className="flex flex-col gap-2">
              <Label>{t('machine.supplies.consumption.potable.water')}</Label>
              <Input
                type="number"
                value={formData.stock?.water?.value || ''}
                onChange={(e) => updateNestedField(['stock', 'water', 'value'], e.target.value)}
                placeholder={t('machine.supplies.consumption.potable.water')}
              />
            </div>
            <UnitSelect value={formData.stock?.water?.unit} onChange={(val) => updateNestedField(['stock', 'water', 'unit'], val)} />
          </ItemContent>

          <ItemContent className="flex-row gap-4">
            <div className="flex flex-col gap-2">
              <Label>
                {t('speed')} ({t('kn')})
              </Label>
              <Input type="number" value={formData.speed || ''} onChange={(e) => updateField('speed', e.target.value)} placeholder={t('speed')} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>{t('engine.rpm.bb')}</Label>
              <Input type="number" value={formData.engine?.rpmBB || ''} onChange={(e) => updateNestedField(['engine', 'rpmBB'], e.target.value)} placeholder="0" />
            </div>

            <div className="flex flex-col gap-2">
              <Label>{t('engine.rpm.be')}</Label>
              <Input type="number" value={formData.engine?.rpmBE || ''} onChange={(e) => updateNestedField(['engine', 'rpmBE'], e.target.value)} placeholder="0" />
            </div>
          </ItemContent>

          <div className="flex flex-col gap-2">
            <Label>{t('observation')}</Label>
            <Textarea value={formData.observation || ''} onChange={(e) => updateField('observation', e.target.value)} placeholder={t('observation')} className="min-h-[100px]" />
          </div>
        </ItemGroup>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button type="button" onClick={handleSave}>
            <Save className="mr-2 size-4" />
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: any;
  onSave: (data: any) => void;
}
