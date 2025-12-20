import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapCmmsEquipmentToOptions, useCmmsEquipmentSelect } from '@/hooks/use-cmms-equipment-api';

/**
 * CmmsEquipmentSelect Component
 *
 * Fetches and displays CMMS equipment for a given enterprise ID.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function CmmsEquipmentSelect(props: CmmsEquipmentSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useCmmsEquipmentSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum equipamento encontrado.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<string, string>
        label={label || 'Equipamentos CMMS (Múltiplo)'}
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
    );
  }

  return (
    <DataSelect<string, string>
      label={label || 'Equipamento CMMS (Único)'}
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
