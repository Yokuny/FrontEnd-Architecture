import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type ModelMachine, mapModelMachinesToOptions, useModelMachinesSelect } from '@/hooks/use-model-machines-api';

export function ModelMachineSelect(props: ModelMachineSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useModelMachinesSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum modelo disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<ModelMachine, ModelMachine>
        label={label || 'Modelo de Máquina (Múltiplo)'}
        placeholder={placeholder || 'Selecione os modelos...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapModelMachinesToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar modelo..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum modelo encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<ModelMachine, ModelMachine>
      label={label || 'Modelo de Máquina (Único)'}
      placeholder={placeholder || 'Selecione um modelo...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapModelMachinesToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar modelo..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhum modelo encontrado."
      className={className}
    />
  );
}

interface ModelMachineSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface ModelMachineSelectSingleProps extends ModelMachineSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ModelMachineSelectMultiProps extends ModelMachineSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ModelMachineSelectProps = ModelMachineSelectSingleProps | ModelMachineSelectMultiProps;
