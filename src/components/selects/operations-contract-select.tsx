import { FileClock } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapOperationsByAssetToOptions, type OperationByAsset, useOperationsByAssetSelect } from '@/hooks/use-contract-assets-api';

/**
 * OperationsContractSelect Component
 *
 * This component fetches operations associated with a specific machine and enterprise.
 * It follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function OperationsContractSelect(props: OperationsContractSelectProps) {
  const { mode, idEnterprise, idMachine, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useOperationsByAssetSelect(idEnterprise, idMachine);

  const noOptionsMessage = !idEnterprise || !idMachine ? 'Selecione a empresa e a máquina primeiro.' : 'Nenhuma operação disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Operação';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <FileClock className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<OperationByAsset, OperationByAsset>
          id={id}
          placeholder={placeholder || 'Selecione as operações...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapOperationsByAssetToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar operação..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhuma operação encontrada."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Operação';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <FileClock className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<OperationByAsset, OperationByAsset>
        id={id}
        placeholder={placeholder || 'Selecione uma operação...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapOperationsByAssetToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar operação..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhuma operação encontrada."
        className={className}
      />
    </div>
  );
}

interface OperationsContractSelectBaseProps {
  idEnterprise?: string;
  idMachine?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface OperationsContractSelectSingleProps extends OperationsContractSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface OperationsContractSelectMultiProps extends OperationsContractSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type OperationsContractSelectProps = OperationsContractSelectSingleProps | OperationsContractSelectMultiProps;
