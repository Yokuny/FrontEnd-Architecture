import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type Enterprise, mapEnterprisesToOptions, useEnterprisesSelect } from '@/hooks/use-enterprises-api';

export function EnterpriseSelect(props: EnterpriseSelectProps) {
  const { mode, oneBlocked = false, disabled = false, className, label, placeholder } = props;
  const query = useEnterprisesSelect();

  if (mode === 'multi') {
    return (
      <DataMultiSelect<Enterprise>
        label={label || 'Empresa (Múltiplo)'}
        placeholder={placeholder || 'Selecione as empresas...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapEnterprisesToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar empresa..."
        noOptionsMessage="Nenhuma empresa disponível."
        noResultsMessage="Nenhuma empresa encontrada."
        className={className}
      />
    );
  }

  return (
    <DataSelect<Enterprise>
      label={label || 'Empresa (Único)'}
      placeholder={placeholder || 'Selecione uma empresa...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapEnterprisesToOptions}
      oneBlocked={oneBlocked}
      disabled={disabled}
      clearable={false}
      searchPlaceholder="Buscar empresa..."
      noOptionsMessage="Nenhuma empresa disponível."
      noResultsMessage="Nenhuma empresa encontrada."
      className={className}
    />
  );
}

interface EnterpriseSelectBaseProps {
  oneBlocked?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface EnterpriseSelectSingleProps extends EnterpriseSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface EnterpriseSelectMultiProps extends EnterpriseSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type EnterpriseSelectProps = EnterpriseSelectSingleProps | EnterpriseSelectMultiProps;
