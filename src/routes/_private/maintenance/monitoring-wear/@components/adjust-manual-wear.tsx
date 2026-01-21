import { Settings2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api/client';

interface AdjustManualWearProps {
  idMachine: string;
  idPart: string;
  idTypeService: string;
  idWearConfig: string;
  partName: string;
  actionName: string;
  onRefresh: () => void;
}

export function AdjustManualWear({ idMachine, idPart, idTypeService, idWearConfig, partName, actionName, onRefresh }: AdjustManualWearProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [newWear, setNewWear] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [isRestartCounter, setIsRestartCounter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (newWear === '' || newWear < 0) {
      toast.warning(t('wear.required'));
      return;
    }
    if (!reason.trim()) {
      toast.warning(t('reason'));
      return;
    }

    setIsLoading(true);
    try {
      await api.put('/wearstate', {
        idMachine,
        idPart,
        idTypeService,
        idWearConfig,
        reason,
        wear: newWear,
        isRestartCounter,
      });
      toast.success(t('save.success'));
      setIsOpen(false);
      setNewWear('');
      setReason('');
      setIsRestartCounter(false);
      onRefresh();
    } catch {
      // Error handled by api client/toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10">
          <Settings2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-2">
          <DialogTitle>{t('wear.adjust.manual')}</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              {t('action')}: <span className="font-semibold text-foreground">{actionName}</span>
            </p>
            <p>
              {t('part')}: <span className="font-semibold text-foreground">{partName}</span>
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="new-wear">{t('wear.new')}</Label>
            <Input
              id="new-wear"
              type="number"
              min={0}
              value={newWear}
              onChange={(e) => setNewWear(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              placeholder={t('wear.new')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">{t('reason')}</Label>
            <Textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t('reason')} />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="restart-counter" checked={isRestartCounter} onCheckedChange={(checked) => setIsRestartCounter(checked as boolean)} />
            <Label htmlFor="restart-counter" className="font-normal decoration- cursor-pointer underline underline-offset-4 leading-tight">
              {t('sensor.restart.to.zero')}
            </Label>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            {t('cancel')}
          </Button>
          <Button variant="destructive" onClick={handleSave} disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 size-4" />}
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
