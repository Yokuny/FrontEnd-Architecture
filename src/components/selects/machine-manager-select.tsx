import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type MachineManager, mapMachineManagersToOptions, useMachineManagersSelect } from '@/hooks/use-machine-managers-api';

export function MachineManagerSelect(props: MachineManagerSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = false } = props;

  const query = useMachineManagersSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum gestor encontrado.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<MachineManager, MachineManager>
        label={label || 'Gestor'}
        placeholder={placeholder || 'Selecione os gestores...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapMachineManagersToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar gestor..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum gestor encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<MachineManager, MachineManager>
      label={label || 'Gestor'}
      placeholder={placeholder || 'Selecione um gestor...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapMachineManagersToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar gestor..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhum gestor encontrado."
      className={className}
    />
  );
}

interface MachineManagerSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface MachineManagerSelectSingleProps extends MachineManagerSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MachineManagerSelectMultiProps extends MachineManagerSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MachineManagerSelectProps = MachineManagerSelectSingleProps | MachineManagerSelectMultiProps;
