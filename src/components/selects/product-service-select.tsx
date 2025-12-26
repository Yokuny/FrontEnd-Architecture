import { Package } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Machine, mapMachinesToOptionsSimple, useMachinesByEnterpriseSelect } from '@/hooks/use-machines-api';

/**
 * ProductServiceSelect Component
 *
 * This component fetches and displays machines (labeled as Products/Services in this context)
 * filtered by enterprise. It follows the single/multi mode pattern.
 * Uses /machine/enterprise?idEnterprise=${idEnterprise} endpoint.
 */
export function ProductServiceSelect(props: ProductServiceSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useMachinesByEnterpriseSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum produto/serviço disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Produto/Serviço';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Machine, Machine>
          id={id}
          placeholder={placeholder || 'Selecione...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapMachinesToOptionsSimple}
          disabled={disabled}
          searchPlaceholder="Buscar..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Produto/Serviço';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Machine, Machine>
        id={id}
        placeholder={placeholder || 'Selecione...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapMachinesToOptionsSimple}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum encontrado."
        className={className}
      />
    </div>
  );
}

interface ProductServiceSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface ProductServiceSelectSingleProps extends ProductServiceSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ProductServiceSelectMultiProps extends ProductServiceSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ProductServiceSelectProps = ProductServiceSelectSingleProps | ProductServiceSelectMultiProps;
