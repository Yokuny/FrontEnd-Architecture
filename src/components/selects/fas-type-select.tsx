import { Info } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { FAS_REGULARIZATION_TYPES, FAS_TYPES, type FasTypeOption } from '@/lib/constants/select-options';

/**
 * FasTypeSelect Component
 *
 * This component uses static data from constants.
 * It simulates a TanStack Query result to maintain compatibility with DataSelect/DataMultiSelect.
 */
export function FasTypeSelect(props: FasTypeSelectProps) {
  const { mode, noRegularization = true, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Local data processing
  const options = [...FAS_TYPES];
  if (!noRegularization) {
    options.unshift(FAS_REGULARIZATION_TYPES[0]); // Regularizacao
    options.push(FAS_REGULARIZATION_TYPES[1]); // Docagem - Regularizacao
  }

  // Simulated query object
  const query = {
    data: options,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (types: FasTypeOption[]) => {
    return types.map((type) => ({
      value: type.id,
      label: type.name,
      data: type,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Tipo de FAS';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<FasTypeOption, FasTypeOption>
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

  const displayLabel = label || 'Tipo de FAS';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<FasTypeOption, FasTypeOption>
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

interface FasTypeSelectBaseProps {
  noRegularization?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FasTypeSelectSingleProps extends FasTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FasTypeSelectMultiProps extends FasTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FasTypeSelectProps = FasTypeSelectSingleProps | FasTypeSelectMultiProps;
