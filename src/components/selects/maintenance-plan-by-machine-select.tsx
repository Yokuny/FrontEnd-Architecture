import { ClipboardCheck } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type MaintenancePlanByMachine, mapMaintenancePlanByMachineToOptions, useMaintenancePlanByMachineSelect } from '@/hooks/use-maintenance-plans-by-machine-api';

export function MaintenancePlanByMachineSelect(props: MaintenancePlanByMachineSelectProps) {
  const { mode, idMachine, filterItems, filtered = [], disabled = false, className, label, placeholder, clearable = false } = props;
  const id = useId();

  const query = useMaintenancePlanByMachineSelect(idMachine, filterItems);

  // Client-side filtering as in the original component
  const filteredQuery = {
    ...query,
    data: query.data?.filter((x) => !filtered.includes(x.id)) || [],
  } as typeof query;

  const noOptionsMessage = !idMachine ? 'Selecione uma máquina primeiro.' : 'Nenhum plano disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Plano de Manutenção';
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
          placeholder={placeholder || 'Selecione os planos...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={filteredQuery}
          mapToOptions={mapMaintenancePlanByMachineToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar plano..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum plano encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Plano de Manutenção';
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
        placeholder={placeholder || 'Selecione um plano...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={filteredQuery}
        mapToOptions={mapMaintenancePlanByMachineToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar plano..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum plano encontrado."
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
