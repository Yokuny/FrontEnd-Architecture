import { UserCog } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type MachineManager, mapMachineManagersToOptions, useMachineManagersSelect } from '@/hooks/use-machine-managers-api';

export function MachineManagerSelect(props: MachineManagerSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = false } = props;
  const id = useId();

  const query = useMachineManagersSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum gestor encontrado.';

  if (mode === 'multi') {
    const displayLabel = label || 'Gestor';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<MachineManager, MachineManager>
          id={id}
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
      </div>
    );
  }

  const displayLabel = label || 'Gestor';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <UserCog className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<MachineManager, MachineManager>
        id={id}
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
    </div>
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
