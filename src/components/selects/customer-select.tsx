import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type Customer, mapCustomersToOptions, useCustomersSelect } from '@/hooks/use-customers-api';

export function CustomerSelect(props: CustomerSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const query = useCustomersSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhum cliente disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<Customer>
        label={label || 'Cliente'}
        placeholder={placeholder || 'Selecione os clientes...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapCustomersToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar cliente..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum cliente encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<Customer>
      label={label || 'Cliente'}
      placeholder={placeholder || 'Selecione um cliente...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapCustomersToOptions}
      disabled={disabled}
      clearable={props.clearable ?? false}
      searchPlaceholder="Buscar cliente..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhum cliente encontrado."
      className={className}
    />
  );
}

interface CustomerSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface CustomerSelectSingleProps extends CustomerSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
  clearable?: boolean;
}

interface CustomerSelectMultiProps extends CustomerSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type CustomerSelectProps = CustomerSelectSingleProps | CustomerSelectMultiProps;
