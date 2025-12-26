import { Cpu } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type ModelMachine, mapModelMachinesToOptions, useModelMachinesSelect } from '@/hooks/use-model-machines-api';

export function ModelMachineSelect(props: ModelMachineSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useModelMachinesSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum modelo disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Modelo de Máquina';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Cpu className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<ModelMachine, ModelMachine>
          id={id}
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
      </div>
    );
  }

  const displayLabel = label || 'Modelo de Máquina';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Cpu className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<ModelMachine, ModelMachine>
        id={id}
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
    </div>
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
