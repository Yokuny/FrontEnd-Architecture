import { Zap } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type ConsumptionMachine, mapConsumptionMachinesToOptions, useConsumptionMachinesSelect } from '@/hooks/use-consumption-machines-api';

export function ConsumptionMachineSelect(props: ConsumptionMachineSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useConsumptionMachinesSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhuma máquina de consumo disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Máquina de Consumo';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Zap className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<ConsumptionMachine>
          id={id}
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
      </div>
    );
  }

  const displayLabel = label || 'Máquina de Consumo';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Zap className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<ConsumptionMachine>
        id={id}
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
    </div>
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
