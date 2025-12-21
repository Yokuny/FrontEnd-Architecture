import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type Form, mapFormsToOptions, useFormsSelect } from '@/hooks/use-forms-api';

export function FormSelect(props: FormSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const query = useFormsSelect(idEnterprise);

  if (mode === 'multi') {
    return (
      <DataMultiSelect<Form, Form>
        label={label || 'Formulário'}
        placeholder={placeholder || 'Selecione os formulários...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapFormsToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar formulário..."
        noOptionsMessage="Nenhum formulário disponível."
        noResultsMessage="Nenhum formulário encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<Form, Form>
      label={label || 'Formulário'}
      placeholder={placeholder || 'Selecione um formulário...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapFormsToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar formulário..."
      noOptionsMessage="Nenhum formulário disponível."
      noResultsMessage="Nenhum formulário encontrado."
      className={className}
    />
  );
}

interface FormSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface FormSelectSingleProps extends FormSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FormSelectMultiProps extends FormSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FormSelectProps = FormSelectSingleProps | FormSelectMultiProps;
