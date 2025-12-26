import { Cpu } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Machine, mapMachinesToOptions, useMachinesByEnterpriseSelect } from '@/hooks/use-machines-api';

export function MachineByEnterpriseSelect(props: MachineByEnterpriseSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useMachinesByEnterpriseSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhuma máquina disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Máquina por Empresa';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Machine, Machine>
          id={id}
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
      </div>
    );
  }

  const displayLabel = label || 'Máquina por Empresa';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Machine, Machine>
        id={id}
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
    </div>
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
