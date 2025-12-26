import { Map as MapIcon } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { FENCE_TYPES, type FenceTypeOption } from '@/lib/constants/select-options';

/**
 * FenceTypeSelect Component
 *
 * This component uses static data from constants.
 */
export function FenceTypeSelect(props: FenceTypeSelectProps) {
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: FENCE_TYPES,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (types: FenceTypeOption[]) => {
    return types
      .map((type) => ({
        value: type.id,
        label: type.name,
        data: type,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Tipo de Cerca';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <MapIcon className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<FenceTypeOption, FenceTypeOption>
          id={id}
          placeholder={placeholder || 'Selecione os tipos...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar tipo..."
          noOptionsMessage="Nenhum tipo disponível."
          noResultsMessage="Nenhum tipo encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Tipo de Cerca';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <MapIcon className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<FenceTypeOption, FenceTypeOption>
        id={id}
        placeholder={placeholder || 'Selecione um tipo...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable
        searchPlaceholder="Buscar tipo..."
        noOptionsMessage="Nenhum tipo disponível."
        noResultsMessage="Nenhum tipo encontrado."
        className={className}
      />
    </div>
  );
}

interface FenceTypeSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FenceTypeSelectSingleProps extends FenceTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FenceTypeSelectMultiProps extends FenceTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FenceTypeSelectProps = FenceTypeSelectSingleProps | FenceTypeSelectMultiProps;
