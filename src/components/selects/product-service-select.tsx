import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
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

  const query = useMachinesByEnterpriseSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum produto/serviço disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<Machine, Machine>
        label={label || 'Produto/Serviço'}
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
    );
  }

  return (
    <DataSelect<Machine, Machine>
      label={label || 'Produto/Serviço'}
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
