import { Anchor } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapPortsToOptions, type Port, usePortsSelect } from '@/hooks/use-ports-api';

/**
 * PortSelect Component
 *
 * This component fetches and displays a list of ports from the geofence API.
 * It follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function PortSelect(props: PortSelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = usePortsSelect();

  if (mode === 'multi') {
    const displayLabel = label || 'Porto';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Anchor className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Port, Port>
          id={id}
          placeholder={placeholder || 'Selecione os portos...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapPortsToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar porto..."
          noOptionsMessage="Nenhum porto disponível."
          noResultsMessage="Nenhum porto encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Porto';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Anchor className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Port, Port>
        id={id}
        placeholder={placeholder || 'Selecione um porto...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapPortsToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar porto..."
        noOptionsMessage="Nenhum porto disponível."
        noResultsMessage="Nenhum porto encontrado."
        className={className}
      />
    </div>
  );
}

interface PortSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface PortSelectSingleProps extends PortSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface PortSelectMultiProps extends PortSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type PortSelectProps = PortSelectSingleProps | PortSelectMultiProps;
