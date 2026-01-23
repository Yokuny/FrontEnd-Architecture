import { ClipboardCheck } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type MaintenancePlanByMachine, mapMaintenancePlanByMachineToOptions, useMaintenancePlanByMachineSelect } from '@/hooks/use-maintenance-plans-by-machine-api';

export function MaintenancePlanByMachineSelect(props: MaintenancePlanByMachineSelectProps) {
  const { mode, idMachine, filterItems, filtered = [], disabled = false, className, label, placeholder, clearable = false } = props;
  const id = useId();
  const { t } = useTranslation();

  const query = useMaintenancePlanByMachineSelect(idMachine, filterItems);

  // Client-side filtering as in the original component
  const filteredQuery = {
    ...query,
    data: query.data?.filter((x) => !filtered.includes(x.id)) || [],
  } as typeof query;

  const noOptionsMessage = !idMachine ? t('select.machine.first') : t('not.found');

  if (mode === 'multi') {
    const displayLabel = label || t('maintenance.plan');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <ClipboardCheck className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<MaintenancePlanByMachine, MaintenancePlanByMachine>
          id={id}
          placeholder={placeholder || t('maintenance.plans.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={filteredQuery}
          mapToOptions={mapMaintenancePlanByMachineToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('maintenance.plan');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ClipboardCheck className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<MaintenancePlanByMachine, MaintenancePlanByMachine>
        id={id}
        placeholder={placeholder || t('maintenance.plan.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={filteredQuery}
        mapToOptions={mapMaintenancePlanByMachineToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface MaintenancePlanByMachineSelectBaseProps {
  idMachine?: string;
  /** IDs to filter on the server side (notIdMaintenancePlan) */
  filterItems?: string[];
  /** IDs to filter on the client side */
  filtered?: string[];
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface MaintenancePlanByMachineSelectSingleProps extends MaintenancePlanByMachineSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MaintenancePlanByMachineSelectMultiProps extends MaintenancePlanByMachineSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MaintenancePlanByMachineSelectProps = MaintenancePlanByMachineSelectSingleProps | MaintenancePlanByMachineSelectMultiProps;
