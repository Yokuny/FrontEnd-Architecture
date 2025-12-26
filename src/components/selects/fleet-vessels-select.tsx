import { Anchor } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type FleetMachines, type FleetVesselItem, mapFleetVesselsToOptionsFlat, useFleetVesselsSelect } from '@/hooks/use-fleet-vessels-api';

/**
 * FleetVesselsSelect Component
 *
 * Note: The original legacy component supported grouped display and "Select All" per group.
 * The current DataMultiSelect/DataSelect base components use a flattened display.
 * Options are flattened to maintain compatibility with the new architecture pattern.
 */
export function FleetVesselsSelect(props: FleetVesselsSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useFleetVesselsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhuma embarcação disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Embarcações';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Anchor className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<FleetMachines, FleetVesselItem>
          id={id}
          placeholder={placeholder || 'Selecione as embarcações...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapFleetVesselsToOptionsFlat}
          disabled={disabled}
          searchPlaceholder="Buscar embarcação..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhuma embarcação encontrada."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Embarcação';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Anchor className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<FleetMachines, FleetVesselItem>
        id={id}
        placeholder={placeholder || 'Selecione uma embarcação...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapFleetVesselsToOptionsFlat}
        disabled={disabled}
        clearable
        searchPlaceholder="Buscar embarcação..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhuma embarcação encontrada."
        className={className}
      />
    </div>
  );
}

interface FleetVesselsSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FleetVesselsSelectSingleProps extends FleetVesselsSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FleetVesselsSelectMultiProps extends FleetVesselsSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FleetVesselsSelectProps = FleetVesselsSelectSingleProps | FleetVesselsSelectMultiProps;
