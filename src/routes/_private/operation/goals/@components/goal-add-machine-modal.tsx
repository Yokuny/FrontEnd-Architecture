import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useMachinesByEnterpriseSelect } from '@/hooks/use-machines-api';
import type { GoalFormData } from '../@interface/goals.schema';

export function GoalAddMachineModal() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const { watch, setValue } = useFormContext<GoalFormData>();
  const [open, setOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string | undefined>(undefined);
  const [isFleet, setIsFleet] = useState(false);

  // Fetch machines to find the name of the selected one
  const { data: machines = [] } = useMachinesByEnterpriseSelect(idEnterprise || '');
  const rows = watch('rows') || [];

  const handleAdd = () => {
    if (!isFleet && !selectedMachineId) return;

    const exists = rows.find((r) => (isFleet ? r.isFleet : r.idMachine === selectedMachineId));

    if (exists) return;

    const machineName = isFleet ? undefined : machines.find((m: any) => m.id === selectedMachineId)?.name;

    const newRow = {
      idMachine: isFleet ? null : selectedMachineId || null,
      machineName: machineName,
      isFleet,
      months: Array(13)
        .fill(null)
        .map((_, i) => ({
          date: i === 12 ? null : new Date(new Date().getUTCFullYear(), i, 1).toISOString(),
          value: 0,
        })),
    };

    setValue('rows', [...rows, newRow]);
    setOpen(false);
    setSelectedMachineId(undefined);
    setIsFleet(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 size-4" />
          {t('add')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('goal')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>{t('machine')}</Label>
            <MachineByEnterpriseSelect mode="single" idEnterprise={idEnterprise || ''} value={selectedMachineId} onChange={(val) => setSelectedMachineId(val)} disabled={isFleet} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isFleet" checked={isFleet} onCheckedChange={(checked) => setIsFleet(checked === true)} disabled={!!selectedMachineId} />
            <label htmlFor="isFleet" className="cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('fleet')}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAdd}>{t('add')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
