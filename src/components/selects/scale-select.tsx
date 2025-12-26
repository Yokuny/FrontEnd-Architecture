import { Ruler } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapScalesToOptions, type Scale, useScalesSelect } from '@/hooks/use-scales-api';

/**
 * ScaleSelect Component
 *
 * This component fetches and displays a list of scales.
 * It follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function ScaleSelect(props: ScaleSelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useScalesSelect();

  if (mode === 'multi') {
    const displayLabel = label || 'Escala';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Ruler className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Scale, Scale>
          id={id}
          placeholder={placeholder || 'Selecione as escalas...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapScalesToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar escala..."
          noOptionsMessage="Nenhuma escala disponível."
          noResultsMessage="Nenhuma escala encontrada."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Escala';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Ruler className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Scale, Scale>
        id={id}
        placeholder={placeholder || 'Selecione uma escala...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapScalesToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar escala..."
        noOptionsMessage="Nenhuma escala disponível."
        noResultsMessage="Nenhuma escala encontrada."
        className={className}
      />
    </div>
  );
}

interface ScaleSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface ScaleSelectSingleProps extends ScaleSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ScaleSelectMultiProps extends ScaleSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ScaleSelectProps = ScaleSelectSingleProps | ScaleSelectMultiProps;
