import { List } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapParamsToOptions, type Param, useParamsSelect } from '@/hooks/use-params-api';

/**
 * ParamsSelect Component
 *
 * Fetches and displays global parameters.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function ParamsSelect(props: ParamsSelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useParamsSelect();

  if (mode === 'multi') {
    const displayLabel = label || 'Parâmetros';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <List className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Param, Param>
          id={id}
          placeholder={placeholder || 'Selecione os parâmetros...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapParamsToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar parâmetro..."
          noOptionsMessage="Nenhum parâmetro disponível."
          noResultsMessage="Nenhum parâmetro encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Parâmetro';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <List className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Param, Param>
        id={id}
        placeholder={placeholder || 'Selecione um parâmetro...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapParamsToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar parâmetro..."
        noOptionsMessage="Nenhum parâmetro disponível."
        noResultsMessage="Nenhum parâmetro encontrado."
        className={className}
      />
    </div>
  );
}

interface ParamsSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface ParamsSelectSingleProps extends ParamsSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ParamsSelectMultiProps extends ParamsSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ParamsSelectProps = ParamsSelectSingleProps | ParamsSelectMultiProps;
