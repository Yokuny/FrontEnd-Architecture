import { DataSelect } from '@/components/ui/data-select';
import { OS_OPTIONS, type OsOption } from '@/lib/constants/select-options';

/**
 * OsOptionSelect Component
 *
 * This component provides options for 'Sim', 'Não', and 'N/A',
 * typically used in Service Order (Ordem de Serviço - OS) forms.
 */
export function OsOptionSelect(props: OsOptionSelectProps) {
  const { disabled = false, className, label, placeholder } = props;

  // Simulated query object
  const query = {
    data: OS_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: OsOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  return (
    <DataSelect<OsOption, OsOption>
      label={label || 'Opção'}
      placeholder={placeholder || 'Selecione...'}
      value={props.value}
      onChange={props.onChange}
      // biome-ignore lint/suspicious/noExplicitAny: static query mapping
      query={query as any}
      mapToOptions={mapToOptions}
      disabled={disabled}
      clearable={false}
      searchPlaceholder="Buscar opção..."
      className={className}
    />
  );
}

interface OsOptionSelectProps {
  value?: string;
  onChange: (value: string | number | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}
