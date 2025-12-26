import { Eye } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { VIEW_OPTIONS, type ViewOption } from '@/lib/constants/select-options';

/**
 * ViewSelect Component
 *
 * Provides selection for system views (Operational, Financial).
 * Uses static data from central constants and supports single/multi modes.
 */
export function ViewSelect(props: ViewSelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = false } = props;
  const id = useId();

  // Simulated query object for static data
  const query = {
    data: VIEW_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: ViewOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Visualizações';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Eye className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<ViewOption, ViewOption>
          id={id}
          placeholder={placeholder || 'Selecione as visualizações...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar visualização..."
          noOptionsMessage="Nenhuma visualização disponível."
          noResultsMessage="Nenhuma visualização encontrada."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Visualização';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Eye className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<ViewOption, ViewOption>
        id={id}
        placeholder={placeholder || 'Selecione uma visualização...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar visualização..."
        noOptionsMessage="Nenhuma visualização disponível."
        noResultsMessage="Nenhuma visualização encontrada."
        className={className}
      />
    </div>
  );
}

interface ViewSelectBaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
}

interface ViewSelectSingleProps extends ViewSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ViewSelectMultiProps extends ViewSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ViewSelectProps = ViewSelectSingleProps | ViewSelectMultiProps;
