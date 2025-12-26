import { ShieldAlert } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { SAFETY_AREAS, type SafetyAreaOption } from '@/lib/constants/select-options';

/**
 * SafetySelect Component
 *
 * This component provides options for safety areas (Invaded, Warn 1, Warn 2).
 * It follows the single/multi mode pattern and uses static data centralizing in constants.
 */
export function SafetySelect(props: SafetySelectProps) {
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

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
    const displayLabel = label || 'Área de Segurança';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <ShieldAlert className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<SafetyAreaOption, SafetyAreaOption>
          id={id}
          placeholder={placeholder || 'Selecione as áreas...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar área..."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Área de Segurança';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ShieldAlert className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<SafetyAreaOption, SafetyAreaOption>
        id={id}
        placeholder={placeholder || 'Selecione uma área...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable
        searchPlaceholder="Buscar área..."
        className={className}
      />
    </div>
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
