import { AlertTriangle, BarChart, Info, XCircle } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { LEVEL_OPTIONS, type LevelOption } from '@/lib/constants/select-options';

/**
 * LevelSelect Component
 *
 * This component uses static data for notification levels (Critical, Warning, Info).
 * It simulates a TanStack Query result and follows the single/multi mode pattern.
 */
export function LevelSelect(props: LevelSelectProps) {
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: LEVEL_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: LevelOption[]) => {
    return options.map((opt) => {
      let Icon = Info;
      if (opt.id === 'critical') Icon = XCircle;
      if (opt.id === 'warning') Icon = AlertTriangle;

      return {
        value: opt.id,
        label: (
          <div className="flex items-center gap-2">
            <Icon className="size-4" style={{ color: opt.color }} />
            <span>{opt.name}</span>
          </div>
        ) as unknown as string, // Cast to string because DataSelect expects string in label for standard usage,
        // but React will render the JSX if passed.
        data: opt,
      };
    });
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Nível';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <BarChart className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<LevelOption, LevelOption>
          id={id}
          placeholder={placeholder || 'Selecione os níveis...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar nível..."
          noOptionsMessage="Nenhum nível disponível."
          noResultsMessage="Nenhum nível encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Nível';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <BarChart className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<LevelOption, LevelOption>
        id={id}
        placeholder={placeholder || 'Selecione um nível...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable
        searchPlaceholder="Buscar nível..."
        noOptionsMessage="Nenhum nível disponível."
        noResultsMessage="Nenhum nível encontrado."
        className={className}
      />
    </div>
  );
}

interface LevelSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface LevelSelectSingleProps extends LevelSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface LevelSelectMultiProps extends LevelSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type LevelSelectProps = LevelSelectSingleProps | LevelSelectMultiProps;
