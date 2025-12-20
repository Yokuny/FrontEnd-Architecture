import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type MaintenancePlan, mapMaintenancePlansToOptions, useMaintenancePlansSelect } from '@/hooks/use-maintenance-plans-api';

export function MaintenancePlanSelect(props: MaintenancePlanSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useMaintenancePlansSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum plano de manutenção disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<MaintenancePlan, MaintenancePlan>
        label={label || 'Plano de Manutenção (Múltiplo)'}
        placeholder={placeholder || 'Selecione os planos...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapMaintenancePlansToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar plano..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum plano de manutenção encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<MaintenancePlan, MaintenancePlan>
      label={label || 'Plano de Manutenção (Único)'}
      placeholder={placeholder || 'Selecione um plano...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapMaintenancePlansToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar plano..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhum plano de manutenção encontrado."
      className={className}
    />
  );
}

interface MaintenancePlanSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface MaintenancePlanSelectSingleProps extends MaintenancePlanSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MaintenancePlanSelectMultiProps extends MaintenancePlanSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MaintenancePlanSelectProps = MaintenancePlanSelectSingleProps | MaintenancePlanSelectMultiProps;
