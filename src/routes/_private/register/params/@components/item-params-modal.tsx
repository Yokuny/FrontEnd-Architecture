import { Check } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ParamOption } from '../@interface/param';

interface ItemParamsModalProps {
  show: boolean;
  handleClose: () => void;
  dataInitial?: Partial<ParamOption>;
  onSave: (data: ParamOption) => void;
}

export default function ItemParamsModal({ show, handleClose, dataInitial, onSave }: ItemParamsModalProps) {
  const { t } = useTranslation();
  const [data, setData] = React.useState<Partial<ParamOption>>(dataInitial || {});

  React.useEffect(() => {
    if (show) {
      setData(dataInitial || {});
    } else {
      setData({});
    }
  }, [show, dataInitial]);

  const onChange = (field: keyof ParamOption, value: string) => {
    setData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!data?.label || !data?.value) {
      toast.warning(t('fill.required.fields'));
      return;
    }

    onSave(data as ParamOption);
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('options')}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="value">{t('value')} *</Label>
            <Input id="value" value={data?.value || ''} onChange={(e) => onChange('value', e.target.value)} maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">{t('label')} *</Label>
            <Input id="label" value={data?.label || ''} onChange={(e) => onChange('label', e.target.value)} maxLength={200} />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={!data?.label || !data?.value} onClick={handleSave} className="gap-2">
            <Check className="size-4" />
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
