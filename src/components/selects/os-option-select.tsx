import { ClipboardList } from 'lucide-react';
import { useId } from 'react';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { OS_OPTIONS, type OsOption } from '@/lib/constants/select-options';

/**
 * OsOptionSelect Component
 *
 * This component provides options for 'Sim', 'Não', and 'N/A',
 * typically used in Service Order (Ordem de Serviço - OS) forms.
 */
export function OsOptionSelect(props: OsOptionSelectProps) {
  const { disabled = false, className, label, placeholder } = props;
  const id = useId();

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

  const displayLabel = label || 'Opção';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ClipboardList className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<OsOption, OsOption>
        id={id}
        placeholder={placeholder || 'Selecione...'}
        value={props.value}
        onChange={props.onChange}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={false}
        searchPlaceholder="Buscar opção..."
        className={className}
      />
    </div>
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
