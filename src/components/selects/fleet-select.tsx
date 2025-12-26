import { Ship } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Fleet, mapFleetsToOptions, useFleetsSelect } from '@/hooks/use-fleets-api';

export function FleetSelect(props: FleetSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useFleetsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhuma frota disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Frota';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Ship className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Fleet>
          id={id}
          placeholder={placeholder || 'Selecione as frotas...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapFleetsToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar frota..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhuma frota encontrada."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Frota';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Ship className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Fleet>
        id={id}
        placeholder={placeholder || 'Selecione uma frota...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapFleetsToOptions}
        disabled={disabled}
        clearable={props.clearable ?? true}
        searchPlaceholder="Buscar frota..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhuma frota encontrada."
        className={className}
      />
    </div>
  );
}

interface FleetSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface FleetSelectSingleProps extends FleetSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FleetSelectMultiProps extends FleetSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FleetSelectProps = FleetSelectSingleProps | FleetSelectMultiProps;
