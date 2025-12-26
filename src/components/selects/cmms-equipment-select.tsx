import { Wrench } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapCmmsEquipmentToOptions, useCmmsEquipmentSelect } from '@/hooks/use-cmms-equipment-api';

/**
 * CmmsEquipmentSelect Component
 *
 * Fetches and displays CMMS equipment for a given enterprise ID.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function CmmsEquipmentSelect(props: CmmsEquipmentSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const query = useCmmsEquipmentSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum equipamento encontrado.';
  const displayLabel = label || (mode === 'multi' ? 'Equipamentos CMMS' : 'Equipamento CMMS');

  if (mode === 'multi') {
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<string, string>
          id={id}
          placeholder={placeholder || 'Selecione...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapCmmsEquipmentToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar equipamento..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum equipamento encontrado."
          className={className}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<string, string>
        id={id}
        placeholder={placeholder || 'Selecione...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapCmmsEquipmentToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar equipamento..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum equipamento encontrado."
        className={className}
      />
    </div>
  );
}

interface CmmsEquipmentSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface CmmsEquipmentSelectSingleProps extends CmmsEquipmentSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface CmmsEquipmentSelectMultiProps extends CmmsEquipmentSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type CmmsEquipmentSelectProps = CmmsEquipmentSelectSingleProps | CmmsEquipmentSelectMultiProps;
