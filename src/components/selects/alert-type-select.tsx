import { Bell } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { Label } from '@/components/ui/label';
import { mapAlertTypesToOptions, useAlertTypesSelect } from '@/hooks/use-alert-types-api';

interface AlertTypeSelectProps {
  label?: string;
  placeholder?: string;
  values?: string[];
  onChangeMulti: (values: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export function AlertTypeSelect({ label, placeholder = 'Selecione os tipos de alerta...', values, onChangeMulti, disabled = false, className }: AlertTypeSelectProps) {
  const id = useId();
  const query = useAlertTypesSelect();

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Bell className="size-4" />
          {label}
        </Label>
      )}
      <DataMultiSelect
        id={id}
        placeholder={placeholder}
        value={values}
        onChange={(newValues) => onChangeMulti(newValues as string[])}
        query={query}
        mapToOptions={mapAlertTypesToOptions}
        disabled={disabled}
        className={className}
        searchPlaceholder="Buscar tipo de alerta..."
        noOptionsMessage="Nenhum tipo de alerta disponível."
        noResultsMessage="Nenhum tipo encontrado."
      />
    </div>
  );
}
