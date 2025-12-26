import { Settings } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapPartsToOptions, usePartsSelect } from '@/hooks/use-parts-api';

interface PartSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  values?: string[];
  onChange?: (value: string | undefined) => void;
  onChangeMulti?: (values: string[]) => void;
  idEnterprise?: string;
  multi?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export function PartSelect({
  label,
  placeholder = 'Selecione uma peça...',
  value,
  values,
  onChange,
  onChangeMulti,
  idEnterprise,
  multi = false,
  disabled = false,
  clearable = true,
  className,
}: PartSelectProps) {
  const id = useId();
  const query = usePartsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhuma peça disponível.';

  if (multi) {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Settings className="size-4" />
            {label}
          </Label>
        )}
        <DataMultiSelect
          id={id}
          placeholder={placeholder}
          value={values}
          onChange={(newValues) => onChangeMulti?.(newValues as string[])}
          query={query}
          mapToOptions={mapPartsToOptions}
          disabled={disabled}
          className={className}
          searchPlaceholder="Buscar peça..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhuma peça encontrada."
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Settings className="size-4" />
          {label}
        </Label>
      )}
      <DataSelect
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(newValue) => onChange?.(newValue as string | undefined)}
        query={query}
        mapToOptions={mapPartsToOptions}
        disabled={disabled}
        clearable={clearable}
        className={className}
        searchPlaceholder="Buscar peça..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhuma peça encontrada."
      />
    </div>
  );
}
