import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type ConsumptionMachine, mapConsumptionMachinesToOptions, useConsumptionMachinesSelect } from '@/hooks/use-consumption-machines-api';

export function ConsumptionMachineSelect(props: ConsumptionMachineSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const query = useConsumptionMachinesSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhuma máquina de consumo disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<ConsumptionMachine>
        label={label || 'Máquina de Consumo (Múltiplo)'}
        placeholder={placeholder || 'Selecione as máquinas...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapConsumptionMachinesToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar máquina..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhuma máquina encontrada."
        className={className}
      />
    );
  }

  return (
    <DataSelect<ConsumptionMachine>
      label={label || 'Máquina de Consumo (Único)'}
      placeholder={placeholder || 'Selecione uma máquina...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapConsumptionMachinesToOptions}
      disabled={disabled}
      clearable
      searchPlaceholder="Buscar máquina..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhuma máquina encontrada."
      className={className}
    />
  );
}

interface ConsumptionMachineSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface ConsumptionMachineSelectSingleProps extends ConsumptionMachineSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ConsumptionMachineSelectMultiProps extends ConsumptionMachineSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ConsumptionMachineSelectProps = ConsumptionMachineSelectSingleProps | ConsumptionMachineSelectMultiProps;
