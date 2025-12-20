import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type MaintenancePlanByMachine, mapMaintenancePlanByMachineToOptions, useMaintenancePlanByMachineSelect } from '@/hooks/use-maintenance-plans-by-machine-api';

export function MaintenancePlanByMachineSelect(props: MaintenancePlanByMachineSelectProps) {
  const { mode, idMachine, filterItems, filtered = [], disabled = false, className, label, placeholder, clearable = false } = props;

  const query = useMaintenancePlanByMachineSelect(idMachine, filterItems);

  // Client-side filtering as in the original component
  const filteredQuery = {
    ...query,
    data: query.data?.filter((x) => !filtered.includes(x.id)) || [],
  } as typeof query;

  const noOptionsMessage = !idMachine ? 'Selecione uma máquina primeiro.' : 'Nenhum plano disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<MaintenancePlanByMachine, MaintenancePlanByMachine>
        label={label || 'Plano de Manutenção (Múltiplo)'}
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
    );
  }

  return (
    <DataSelect<MaintenancePlanByMachine, MaintenancePlanByMachine>
      label={label || 'Plano de Manutenção (Único)'}
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
