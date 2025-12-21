import { useEffect } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type Machine, mapMachinesToOptions, useMachinesSelect } from '@/hooks/use-machines-api';

export function MachineSelect(props: MachineSelectProps) {
  const { mode, filterQuery = '', oneSelected = false, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useMachinesSelect(filterQuery);
  const { data } = query;

  // Auto-select single option when oneSelected is true
  useEffect(() => {
    if (oneSelected && data && data.length === 1 && mode === 'single' && !props.value) {
      const options = mapMachinesToOptions(data);
      props.onChange(options[0].value);
    }
  }, [data, oneSelected, mode, props]);

  const hasOneData = oneSelected && data && data.length === 1;
  const isDisabled = disabled || hasOneData;

  if (mode === 'multi') {
    return (
      <DataMultiSelect<Machine, Machine>
        label={label || 'Máquina'}
        placeholder={placeholder || 'Selecione as máquinas...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapMachinesToOptions}
        disabled={isDisabled}
        searchPlaceholder="Buscar máquina..."
        noOptionsMessage="Nenhuma máquina disponível."
        noResultsMessage="Nenhuma máquina encontrada."
        className={className}
      />
    );
  }

  return (
    <DataSelect<Machine, Machine>
      label={label || 'Máquina'}
      placeholder={placeholder || 'Selecione uma máquina...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapMachinesToOptions}
      disabled={isDisabled}
      clearable={clearable && !hasOneData}
      searchPlaceholder="Buscar máquina..."
      noOptionsMessage="Nenhuma máquina disponível."
      noResultsMessage="Nenhuma máquina encontrada."
      className={className}
    />
  );
}

interface MachineSelectBaseProps {
  filterQuery?: string;
  oneSelected?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface MachineSelectSingleProps extends MachineSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MachineSelectMultiProps extends MachineSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MachineSelectProps = MachineSelectSingleProps | MachineSelectMultiProps;
