import { Settings2 } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapMaintenanceTypesToOptions, useMaintenanceTypesSelect } from '@/hooks/use-maintenance-types-api';

export function MaintenanceTypeSelect(props: MaintenanceTypeSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useMaintenanceTypesSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum tipo de manutenção disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Tipo de Manutenção';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Settings2 className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<string, string>
          id={id}
          placeholder={placeholder || 'Selecione os tipos...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapMaintenanceTypesToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar tipo..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum tipo encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Tipo de Manutenção';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Settings2 className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<string, string>
        id={id}
        placeholder={placeholder || 'Selecione um tipo...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapMaintenanceTypesToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar tipo..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum tipo encontrado."
        className={className}
      />
    </div>
  );
}

interface MaintenanceTypeSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface MaintenanceTypeSelectSingleProps extends MaintenanceTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MaintenanceTypeSelectMultiProps extends MaintenanceTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MaintenanceTypeSelectProps = MaintenanceTypeSelectSingleProps | MaintenanceTypeSelectMultiProps;
