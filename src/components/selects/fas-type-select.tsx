import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { FAS_REGULARIZATION_TYPES, FAS_TYPES, type FasTypeOption } from '@/lib/constants/select-options';

/**
 * FasTypeSelect Component
 *
 * This component uses static data from constants.
 * It simulates a TanStack Query result to maintain compatibility with DataSelect/DataMultiSelect.
 */
export function FasTypeSelect(props: FasTypeSelectProps) {
  const { mode, noRegularization = true, disabled = false, className, label, placeholder } = props;

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
    return (
      <DataMultiSelect<FasTypeOption, FasTypeOption>
        label={label || 'Tipo de FAS (Múltiplo)'}
        placeholder={placeholder || 'Selecione os tipos...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        // biome-ignore lint/suspicious/noExplicitAny: static query mapping
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar tipo..."
        noOptionsMessage="Nenhum tipo disponível."
        noResultsMessage="Nenhum tipo encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<FasTypeOption, FasTypeOption>
      label={label || 'Tipo de FAS (Único)'}
      placeholder={placeholder || 'Selecione um tipo...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      // biome-ignore lint/suspicious/noExplicitAny: static query mapping
      query={query as any}
      mapToOptions={mapToOptions}
      disabled={disabled}
      clearable
      searchPlaceholder="Buscar tipo..."
      noOptionsMessage="Nenhum tipo disponível."
      noResultsMessage="Nenhum tipo encontrado."
      className={className}
    />
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
