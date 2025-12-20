import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { SAFETY_AREAS, type SafetyAreaOption } from '@/lib/constants/select-options';

/**
 * SafetySelect Component
 *
 * This component provides options for safety areas (Invaded, Warn 1, Warn 2).
 * It follows the single/multi mode pattern and uses static data centralizing in constants.
 */
export function SafetySelect(props: SafetySelectProps) {
  const { mode, disabled = false, className, label, placeholder } = props;

  // Simulated query object
  const query = {
    data: SAFETY_AREAS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: SafetyAreaOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    return (
      <DataMultiSelect<SafetyAreaOption, SafetyAreaOption>
        label={label || 'Área de Segurança (Múltiplo)'}
        placeholder={placeholder || 'Selecione as áreas...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        // biome-ignore lint/suspicious/noExplicitAny: static query mapping
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar área..."
        className={className}
      />
    );
  }

  return (
    <DataSelect<SafetyAreaOption, SafetyAreaOption>
      label={label || 'Área de Segurança (Único)'}
      placeholder={placeholder || 'Selecione uma área...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      // biome-ignore lint/suspicious/noExplicitAny: static query mapping
      query={query as any}
      mapToOptions={mapToOptions}
      disabled={disabled}
      clearable
      searchPlaceholder="Buscar área..."
      className={className}
    />
  );
}

interface SafetySelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface SafetySelectSingleProps extends SafetySelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface SafetySelectMultiProps extends SafetySelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type SafetySelectProps = SafetySelectSingleProps | SafetySelectMultiProps;
