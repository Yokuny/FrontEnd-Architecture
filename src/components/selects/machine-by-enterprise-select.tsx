import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type Machine, mapMachinesToOptions, useMachinesByEnterpriseSelect } from '@/hooks/use-machines-api';

export function MachineByEnterpriseSelect(props: MachineByEnterpriseSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useMachinesByEnterpriseSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhuma máquina disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<Machine, Machine>
        label={label || 'Máquina por Empresa (Múltiplo)'}
        placeholder={placeholder || 'Selecione as máquinas...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapMachinesToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar máquina..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhuma máquina encontrada."
        className={className}
      />
    );
  }

  return (
    <DataSelect<Machine, Machine>
      label={label || 'Máquina por Empresa (Único)'}
      placeholder={placeholder || 'Selecione uma máquina...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapMachinesToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar máquina..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhuma máquina encontrada."
      className={className}
    />
  );
}

interface MachineByEnterpriseSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface MachineByEnterpriseSelectSingleProps extends MachineByEnterpriseSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MachineByEnterpriseSelectMultiProps extends MachineByEnterpriseSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MachineByEnterpriseSelectProps = MachineByEnterpriseSelectSingleProps | MachineByEnterpriseSelectMultiProps;
