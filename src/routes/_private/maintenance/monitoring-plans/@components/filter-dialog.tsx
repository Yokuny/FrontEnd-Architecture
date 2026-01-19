import { BrushCleaning, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineManagerSelect, MachineSelect, MaintenancePlanSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { MonitoringFilter } from '../@interface/monitoring-plan.schema';

interface FilterDialogProps {
  idEnterprise: string;
  filter: MonitoringFilter;
  onFilterChange: (filter: MonitoringFilter) => void;
}

export function FilterDialog({ idEnterprise, filter, onFilterChange }: FilterDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState<MonitoringFilter>(filter);

  const handleApply = () => {
    onFilterChange(localFilter);
    setOpen(false);
  };

  const handleClear = () => {
    const clearedFilter: MonitoringFilter = {};
    setLocalFilter(clearedFilter);
    onFilterChange(clearedFilter);
    setOpen(false);
  };

  const hasActiveFilters = !!(filter.idMachine?.length || filter.idMaintenancePlan?.length || filter.managers?.length || filter.status);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={hasActiveFilters ? 'default' : 'outline'}>
          <Filter className="size-4" />
          {t('filter')}
          {hasActiveFilters && <span className="ml-1 size-2 rounded-full bg-green-500" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('filter')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status */}
          <div className="space-y-3">
            <Label>{t('status')}</Label>
            <RadioGroup value={localFilter.status || ''} onValueChange={(value) => setLocalFilter({ ...localFilter, status: value as 'late' | 'next' | undefined })}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="late" id="late" />
                  <Label htmlFor="late" className="cursor-pointer font-normal">
                    {t('late')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="next" id="next" />
                  <Label htmlFor="next" className="cursor-pointer font-normal">
                    {t('next')}
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Máquinas */}
          <div className="space-y-2">
            <MachineSelect
              mode="multi"
              idEnterprise={idEnterprise}
              label={t('vessel')}
              value={localFilter.idMachine || []}
              onChange={(values) => setLocalFilter({ ...localFilter, idMachine: values })}
            />
          </div>

          {/* Planos de Manutenção */}
          <div className="space-y-2">
            <MaintenancePlanSelect
              mode="multi"
              idEnterprise={idEnterprise}
              label={t('maintenance.plan')}
              value={localFilter.idMaintenancePlan || []}
              onChange={(values) => setLocalFilter({ ...localFilter, idMaintenancePlan: values })}
            />
          </div>

          {/* Gestores/Responsáveis */}
          <div className="space-y-2">
            <MachineManagerSelect
              mode="multi"
              idEnterprise={idEnterprise}
              label={t('management.person')}
              value={localFilter.managers || []}
              onChange={(values) => setLocalFilter({ ...localFilter, managers: values })}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button onClick={handleClear} className="text-amber-700 hover:text-amber-800">
            <BrushCleaning className="size-4" />
          </Button>
          <Button onClick={handleApply}>{t('filter')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
